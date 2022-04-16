import { VisitorService } from './visitor.service';
import { Component } from '@angular/core';
import { ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { IslandVisitor } from '../model/island-visitor';
import * as moment from 'moment';

@Component({
  selector: 'app-tab0',
  templateUrl: 'tab0.page.html',
  styleUrls: ['tab0.page.scss']
})
export class Tab0Page {

  public chosenYear: number;
  public userName: string;
  public island: string;
  public showBezoekForm: boolean;
  public bezoekersForm: FormGroup;
  public columns: any;
  public rows: any;
  public filteredData: any;
  public columnsWithSearch : string[] = [];
  public message: string;
  public islandVisitorsPerDate: IslandVisitor[];
  public dateSearch: any;
  public allRows: any;
  public bezoeker: IslandVisitor;
  public chosenDate;

  constructor(
    private toastCtrl: ToastController, 
    private storage: Storage,
    private visitorService: VisitorService) {}

  ngOnInit(): void {
    this.bezoeker = new IslandVisitor();
    this.chosenDate = new Date().toISOString().split('T')[0];  
    this.chosenYear = new Date().getFullYear();
    this.setBezoekerForm();

    this.storage.get("userName").then((result) => {
      this.userName = result;
      this.island = this.userName === 'Edwin' || this.userName === 'Erica'  ? 'de Biezen' : 'Knarland';
      this.resetBezoekersForm();
    });

    this.visitorService.getVisits(this.chosenYear).subscribe((result) => {
      this.rows = result;
    });

    
    this.dateSearch = new Date().toISOString().split('T')[0];
    this.showBezoekForm = true;
    this.rows = [];
    this.allRows = [];
    this.columns = [
      { name: 'visitorsPrice', sortable: false },
      { name: 'boatPrice', sortable: false },
      { name: 'tentPrice', sortable: false },
      { name: 'woodPrice', sortable: false },
      { name: 'totalPrice', sortable: false },
      { name: 'island', sortable: true },
      { name: 'nameBoat', sortable: true },
    ];
  }

  setBezoekerForm() {
    this.bezoekersForm = new FormGroup({
      datum: new FormControl(this.bezoeker.datum),
      persons: new FormControl(this.bezoeker.persons),
      lengthBoat: new FormControl(this.bezoeker.lengthBoat),
      wood: new FormControl(this.bezoeker.wood),
      tents: new FormControl(this.bezoeker.tents),
      cashPayment: new FormControl(this.bezoeker.cashPayment),
      island: new FormControl(this.bezoeker.island),
      nameBoat: new FormControl(this.bezoeker.nameBoat),
      remarks: new FormControl(this.bezoeker.remarks)
    });
  }  

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: this.message,
      duration: 3500,
      position: 'middle',  
    });
    toast.present();  
  }

  onActivate(event) {
    if(event.type == 'click') {
      let perBoat = this.islandVisitorsPerDate.filter(r => r.id === event.row.id);
      let message = event.row.bootNaam + ': ';
      let data = [];
      if (perBoat !== null && perBoat.length > 0) {
        perBoat.forEach(row => {
          data.push(row.datum);
        });
        message = message +  data.join(', ');
      } else {
        message = message +  'Geen bezoek geregistreerd</div>';
      }
      this.message = message;
      this.presentToast();     
    }
  }

  changeDate(value, add) {
    let oldDate = moment(this.dateSearch);
    let newDate;
    if ( add === true) {
      newDate = oldDate.add(value, 'days');
    } else {
      newDate = oldDate.subtract(value, 'days');
    }
    this.dateSearch = newDate.format("yyyy-MM-DD");
    this.filterDatatable(this.dateSearch, 'datum');
  }

  filterDatatable(event, tabel){
    let filter;
    if (event.target !== undefined && event.target !== null) {     
      filter = event.target.value.toLowerCase();
    } else {
      filter = event;
    }
    if (tabel === 'datum') {
      let splitString = filter.split("-");
      const year = splitString[0];
      const month = splitString[1];
      const day = splitString[2];
      const correctDate = day + "-" + month + "-" + year;
      this.rows = this.allRows.filter(item => {
        var colValue = item[tabel];
        if (colValue && colValue === correctDate) {
          return true;
        }
      });
    }    
  }

  public parseDate(dateString: string) {
    if (dateString) {
        this.chosenDate = new Date(dateString).toISOString().split('T')[0];
    }
  }

  public save() {
    this.visitorService.saveVisit(this.bezoekersForm.value).subscribe(result => {
      this.message = result.message;
      this.presentToast();
      if (result.errorCode === 0) {
        this.resetBezoekersForm();
      }
     });
  }

  public cancel() {
    this.resetBezoekersForm();
  }

  public resetBezoekersForm() {
    this.chosenDate = new Date().toISOString().split('T')[0];  
    this.bezoeker.island = this.island;
    this.bezoeker.datum = this.chosenDate;
    this.bezoeker.persons = 0;
    this.bezoeker.lengthBoat = 0;
    this.bezoeker.wood = 0;
    this.bezoeker.tents = 0;   
    this.bezoeker.cashPayment = true;
    this.bezoeker.remarks = null;
    this.bezoeker.nameBoat = null;
    this.setBezoekerForm();
  }
}
