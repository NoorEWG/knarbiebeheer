import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
import { PersonenVerwachtWerkelijk } from '../model/personen-verwacht-werkelijk';
import { BotterService } from './botter.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public chosenYear:  number;
  public columns: any;
  public botterList: any;
  public rows: any;
  public allRows: any;
  public wijzigen: boolean = false;
  public actie: string;
  public botterVisit: FormGroup;
  public werkelijkePersonenPerJaar: number = 0;
  public verwachtePersonenPerJaar: number = 0;
  public werkelijkePersonenPerMaand: number = 0;
  public verwachtePersonenPerMaand: number = 0;
  public personenPerMaand: PersonenVerwachtWerkelijk[];
  public maanden: any;
  public selectedMonth: any;
  public columnsWithSearch: any;

  constructor(private botterService: BotterService) {}

  ngOnInit(): void {
    this.updateAction();
    this.chosenYear = new Date().getFullYear();
    let vandaag = new Date().toISOString().split('T')[0];
    this.botterVisit = new FormGroup({
      botters: new FormControl([], Validators.required),
      eiland: new FormControl('Knarland', Validators.required),
      verwachtePersonen: new FormControl(0, Validators.required),
      werkelijkePersonen: new FormControl(0, Validators.required),
      datum: new FormControl(vandaag, Validators.required)
    });

    this.selectedMonth = { label: '', value: null};

    this.columnsWithSearch = ["maand"];

    this.maanden = [
      { label : 'selecteer een maand', value: null},
      // { label : 'jan', value: '1'},
      // { label : 'feb', value: '2'},
      // { label : 'mrt', value: '3'},
      { label : 'apr', value: '4'},
      { label : 'mei', value: '5'},
      { label : 'jun', value: '6'},
      { label : 'jul', value: '7'},
      { label : 'aug', value: '8'},
      { label : 'sep', value: '9'},
      { label : 'okt', value: '10'},
      // { label : 'nov', value: '11'},
      // { label : 'dec', value: '12'}
    ];
    this.columns = [
      { name: 'naamBoot', sortable: true },
      { name: 'datum', sortable: true },
      { name: 'verwachtePersonen', sortable: true },
      { name: 'werkelijkePersonen', sortable: true }
    ];
    this.botterService.getBotterList(this.chosenYear).subscribe(results => {
      this.botterList = results; 
    });  

    this.botterService.getBotterVisits(this.chosenYear).subscribe(results => {
      this.allRows = results.botterData;
      this.rows = this.allRows;
      this.werkelijkePersonenPerJaar = results.personenBottersPerJaar[0].werkelijkePersonenPerJaar;
      this.verwachtePersonenPerJaar = results.personenBottersPerJaar[0].verwachtePersonenPerJaar;
      this.personenPerMaand = results.personenBottersPerMaand;
    });  
  }  

  refreshData() {
    // TODO
  }

  save() {
    console.log(JSON.stringify(this.botterVisit.value));
    this.botterService.addBotterVisit(this.botterVisit.value).subscribe(results => {
      console.log(results);
      alert(results);
    });  
  }

  update() {
    this.botterService.updateBotterVisit(this.botterVisit.value).subscribe(results => {
      console.log(results);
      // TODO make a toast mesasge
    });  
  }

  updateAction() {
    if (this.wijzigen) {
      this.actie = "Wijzigen";
    } else {
      this.actie = "Invoeren";
    }
  }

   // TODO make a filter service for all tabs !
   filterDatatable(){
    let filter = this.selectedMonth.value;
    this.rows = this.allRows.filter(item => {
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]] ;
        if (!filter || (colValue && colValue === filter)) {
          return true;
        }
      }
    });
    if (filter) {
      let maandWaarden = null;
      this.personenPerMaand.forEach(item => {
        if (item.maand === this.selectedMonth.value) {
          maandWaarden = item;
        }
      });
      this.verwachtePersonenPerMaand = maandWaarden == null  ? 0 : maandWaarden.verwachtePersonenPerMaand;
      this.werkelijkePersonenPerMaand = maandWaarden == null ? 0 : maandWaarden.werkelijkePersonenPerMaand;
    } else {
      this.verwachtePersonenPerMaand = 0;
      this.werkelijkePersonenPerMaand = 0;
    }
  }
}
