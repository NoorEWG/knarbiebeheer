import { Component } from '@angular/core';
import { OverzichtService } from './overzicht.service';
import { ToastController} from '@ionic/angular';
import { RevenuBootDatum } from '../model/revenu-boot-datum';

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

  constructor(private overzichtService: OverzichtService,
    private toastCtrl: ToastController,) {}

  ngOnInit(): void {
    this.chosenYear = new Date().getFullYear();
    this.columns = [
      { name: 'bootNaam', header: 'Naam boot', sortable: true },
      { name: 'lengteBoot', sortable: true },
      { name: 'abonnement', sortable: true },
      { name: 'fictieveOpbrengst', sortable: true }
    ];
    this.overzichtService.getAllSubscriptionsPerBoat(this.chosenYear).subscribe(results => {
      this.rows = results.aboPerBoat;
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
      this.visits = results;
      console.log(JSON.stringify(this.visits));
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


  filterDatatable(event){   
    let filter = event.target.value.toLowerCase();
    this.rows = this.filteredData.filter(item => {
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]] ;
        if (!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          return true;
        }
      }
    });
    
  }
}
