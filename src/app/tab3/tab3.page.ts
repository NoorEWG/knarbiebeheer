import { Component } from '@angular/core';
import { OverzichtService } from './overzicht.service';
import { RevenuIsland } from '../model/revenu-island';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  public chosenYear: number;
  public columns: any;
  public rows: any;
  public totalMeters: number = 0;
  public totaalAbonnementenOpbrengst: number = 0;
  public fictieveOpbrengstBiezen: number = 0;
  public fictieveOpbrengstKnarland: number = 0;
  public fictieveOpbrengstLeydam: number = 0

  constructor(private overzichtService: OverzichtService) {}

  ngOnInit(): void {
    this.chosenYear = new Date().getFullYear();
    this.columns = [
      { name: 'bootNaam', header: 'Naam boot', sortable: true },
      { name: 'lengteBoot', header: 'Lengte boot',  sortable: false },
      { name: 'abonnement', header: 'Abonnement', sortable: false },
      { name: 'fictieveObrengst', header: 'Fictieve opbrengst', sortable: false}
    ];
    this.overzichtService.getAllSubscriptionsPerBoat(this.chosenYear).subscribe(results => {
      this.rows = results.aboPerBoat;
      this.rows.forEach(row => {
        results.revenuPerBoat.forEach(rev => {
          if (rev.boatId === row.id) {
            row.fictieveObrengst = rev.revenuPerBoat;
          }
        })
      });
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
   
  }
}
