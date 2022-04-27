import { IslandVisitor } from './../model/island-visitor';
import { VisitorService } from './visitor.service';
import { Component } from '@angular/core';
import { ToastController} from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
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
  public persons = 0;
  public boats = 0;
  public tents = 0;
  public wood = 0;
  public totaal = 0;
  public cash = 0;
  public bank = 0;

  constructor(
    private toastCtrl: ToastController, 
    private storage: Storage,
    private visitorService: VisitorService) {}

  ngOnInit(): void {
    this.bezoeker = new IslandVisitor();
    this.chosenDate = new Date().toISOString().split('T')[0];
    this.dateSearch = new Date().toISOString().split('T')[0];
    this.chosenYear = new Date().getFullYear();
    this.setBezoekerForm();

    this.storage.get("userName").then((result) => {
      this.userName = result;
      this.island = this.userName === 'Edwin' || this.userName === 'Erica'  ? 'de Biezen' : 'Knarland';
      this.resetBezoekersForm();
    });

    this.visitorService.getVisits(this.chosenYear).subscribe((result) => {
      this.allRows = result;
      this.filterVisitsOnDate(this.dateSearch, "datum");
    });

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
      let visitor = this.rows.filter(r => r.id === event.row.id)[0];
      this.chosenDate = visitor.datum; 
      this.bezoeker = visitor;
      this.setBezoekerForm();
      this.showBezoekForm = true;    
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

  filterDatatable(event, column){
    let filter;
    if (event.target !== undefined && event.target !== null) {     
      filter = event.target.value.toLowerCase();
    } else {
      filter = event;
    }
    if (column === 'datum') {
      this.filterVisitsOnDate(filter, column);
    }    
  }

  filterVisitsOnDate(filter, column) {
    this.rows = this.allRows.filter(item => {
      var colValue = item[column];
      if (colValue && colValue === filter) {
        return true;
      }
    });
    var persons = 0;
    var boats = 0;
    var tents = 0;
    var wood = 0;
    var totaal = 0;
    var cash = 0;
    var bank = 0;
    this.rows.forEach(e => {
      var p = (isNaN(e.persons) ? 0 :  parseFloat(e.persons));
      persons = persons + p;
      var b =  (isNaN(e.boatPrice)  ? 0 : parseFloat(e.boatPrice));   
      boats = boats + b;
      var t = (isNaN(e.tents) ? 0 : parseFloat(e.tents));
      tents = tents + t;
      var w = (isNaN(e.wood) ? 0 : parseFloat(e.wood)); 
      wood = wood + w
      totaal = totaal + p + b + t + w;
      if (e.cashPayment == 1) {
        cash = cash + p + b + t + w; 
      } else {
        bank = bank + p + b + t + w;
      }              
    });
    this.persons = Math.round(persons * 100) / 100;
    this.boats = Math.round(boats * 100) / 100;
    this.tents = Math.round(tents * 100) / 100;
    this.wood = Math.round(wood * 100) / 100;
    this.totaal = Math.round(totaal * 100) / 100;
    this.bank = Math.round(bank * 100) / 100;
    this.cash = Math.round(cash * 100) / 100;
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
    this.bezoeker.persons = null;
    this.bezoeker.lengthBoat = null;
    this.bezoeker.wood = null;
    this.bezoeker.tents = null;   
    this.bezoeker.cashPayment = true;
    this.bezoeker.remarks = null;
    this.bezoeker.nameBoat = null;
    this.setBezoekerForm();
  }
}
