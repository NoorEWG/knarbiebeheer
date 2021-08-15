import { Component } from '@angular/core';
import { OverzichtService } from './overzicht.service';
import { ToastController} from '@ionic/angular';
import { RevenuBootDatum } from '../model/revenu-boot-datum';
import * as moment from 'moment';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public chosenYear: number;
  public columns: any;
  public rows: any;
  public visits: any;
  public totalMeters: number = 0;
  public totaalAbonnementenOpbrengst: number = 0;
  public fictieveOpbrengstBiezen: number = 0;
  public fictieveOpbrengstKnarland: number = 0;
  public fictieveOpbrengstLeydam: number = 0;
  public filteredData: any;
  public columnsWithSearch : string[] = [];
  public message: string;
  public revenuPerBootPerDatum: RevenuBootDatum[];
  public visitColumns: any;
  public filteredVisits: any;
  public dateSearch: any;
  public allRows: any;
  public allVisits: any;

  constructor(private overzichtService: OverzichtService,
    private toastCtrl: ToastController,) {}

  ngOnInit(): void {
    this.chosenYear = new Date().getFullYear();
    this.dateSearch = new Date().toISOString().split('T')[0];
    this.columns = [
      { name: 'bootNaam', sortable: true },
      { name: 'lengteBoot', sortable: true },
      { name: 'abonnement', sortable: true },
      { name: 'fictieveOpbrengst', sortable: true }
    ];

    this.visitColumns = [
      { name: 'datum', sortable: true },
      { name: 'naamBoot', sortable: true },
      { name: 'deBiezen', sortable: true },
      { name: 'knarland', sortable: true }
    ];
    this.overzichtService.getAllSubscriptionsPerBoat(this.chosenYear).subscribe(results => {
      this.allRows = results.aboPerBoat;
      this.rows = this.allRows;
      this.revenuPerBootPerDatum = results.revenuPerBoatPerDate;
      this.rows.forEach(row => {
        results.revenuPerBoat.forEach(rev => {
          if (rev.boatId === row.id) {
            row.fictieveOpbrengst = rev.revenuPerBoat;
          }
        })
      });
      this.rows.forEach(row => {
        if (row.fictieveOpbrengst === undefined || row.fictieveOpbrengst === null || row.fictieveOpbrengst < 1) {
          row.fictieveOpbrengst = 0;
        }
      });
      
      this.filteredData = this.rows;
      this.columnsWithSearch = ["bootNaam"];
      this.totalMeters = results.totalAbo[0].totalMeters;
      this.totaalAbonnementenOpbrengst = results.totalAbo[0].totalPrice;
      results.revenuPerIsland.forEach(island => {
        if (island.island === 'de Biezen') {
          this.fictieveOpbrengstBiezen = island.revenuPerIsland;
        }
        else if (island.island === 'Knarland') {
          this.fictieveOpbrengstKnarland = island.revenuPerIsland;
        } else {
          this.fictieveOpbrengstLeydam = island.revenuPerIsland;
        }
      });
    });
    
    this.overzichtService.getAllSubscriptionsPerDay(this.chosenYear).subscribe(results => {
      this.allVisits = results;
      this.visits = this.allVisits;
      this.filterDatatable(this.dateSearch, 'datum');
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
      let perBoat = this.revenuPerBootPerDatum.filter(r => r.boatId === event.row.id);
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
    console.log("in change date, value: " + value);
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
    if (tabel === 'bootNaam') {
      this.rows = this.allRows.filter(item => {
        var colValue = item[tabel];
        if (colValue && colValue.toLowerCase().includes(filter)) {
          return true;
        }
      });
    }
    if (tabel === 'datum') {
      let splitString = filter.split("-");
      const year = splitString[0];
      const month = splitString[1];
      const day = splitString[2];
      const correctDate = day + "-" + month + "-" + year;
      this.visits = this.allVisits.filter(item => {
        var colValue = item[tabel];
        if (colValue && colValue === correctDate) {
          return true;
        }
      });
    }
    
  }
}
