import { Component } from '@angular/core';
import { ToastController} from '@ionic/angular';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { BbqOvernachtingDatum } from '../model/bbq-overnachting-datum';
import * as moment from 'moment';

@Component({
  selector: 'app-tab0',
  templateUrl: 'tab0.page.html',
  styleUrls: ['tab0.page.scss']
})
export class Tab0Page {

  public chosenYear: number;
  public showBezoekForm: boolean;
  public bezoekersForm: FormGroup;
  public columns: any;
  public rows: any;
  public filteredData: any;
  public columnsWithSearch : string[] = [];
  public message: string;
  public bbqOvernachtingenPerDatum: BbqOvernachtingDatum[];
  public dateSearch: any;
  public allRows: any;
  public bezoeker: BbqOvernachtingDatum;

  constructor(
    private toastCtrl: ToastController,) {}

  ngOnInit(): void {
    this.bezoeker = new BbqOvernachtingDatum();
    this.setBezoekerForm();
    this.chosenYear = new Date().getFullYear();
    this.dateSearch = new Date().toISOString().split('T')[0];
    this.showBezoekForm = true;
    this.rows = [];
    this.allRows = [];
    this.columns = [
      { name: 'persons', sortable: true },
      { name: 'lengthBoat', sortable: true },
      { name: 'tents', sortable: true },
      { name: 'island', sortable: true },
      { name: 'datum', sortable: true },
    ];
  }

  setBezoekerForm() {
    this.bezoekersForm = new FormGroup({
      datum: new FormControl(this.bezoeker.datum),
      persons: new FormControl(this.bezoeker.persons),
      lengthBoat: new FormControl(this.bezoeker.lengthBoat),
      tents: new FormControl(this.bezoeker.tents),
      island: new FormControl(this.bezoeker.island)
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
      let perBoat = this.bbqOvernachtingenPerDatum.filter(r => r.id === event.row.id);
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
}
