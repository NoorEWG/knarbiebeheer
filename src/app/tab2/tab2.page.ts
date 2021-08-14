import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { ToastController } from '@ionic/angular';

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
  public message: string;
  public vandaag: string;
  public isExpanded: boolean = false;
  public selectedBotterBezoekId = null;

  constructor(private botterService: BotterService, private toastCtrl: ToastController) {}

  ngOnInit(): void {
    this.updateAction();
    this.chosenYear = new Date().getFullYear();
    this.vandaag = new Date().toISOString().split('T')[0];
    this.setBotterForm([], 0, 0, 'Knarland', this.vandaag, false);
    this.selectedMonth = { label: '', value: null};
    this.columnsWithSearch = ["maand"];
    this.maanden = [
      { label : 'selecteer een maand', value: null},
      { label : 'apr', value: '4'},
      { label : 'mei', value: '5'},
      { label : 'jun', value: '6'},
      { label : 'jul', value: '7'},
      { label : 'aug', value: '8'},
      { label : 'sep', value: '9'},
      { label : 'okt', value: '10'}
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
    this.getBotterVisits();  
  }  

  getBotterVisits() {
    this.botterService.getBotterVisits(this.chosenYear).subscribe(results => {
      this.allRows = results.botterData;
      this.rows = this.allRows;
      this.werkelijkePersonenPerJaar = results.personenBottersPerJaar[0].werkelijkePersonenPerJaar;
      this.verwachtePersonenPerJaar = results.personenBottersPerJaar[0].verwachtePersonenPerJaar;
      this.personenPerMaand = results.personenBottersPerMaand;
    });  
  }

  setBotterForm(botters, verwacht, werkelijk, eiland, datum, isDisabled) {
    this.botterVisit = new FormGroup({
      botters: new FormControl({ value: botters, disabled: isDisabled}, Validators.required),
      eiland: new FormControl({value: eiland, disabled: isDisabled}, Validators.required),
      verwachtePersonen: new FormControl({value: verwacht, disabled: isDisabled}, Validators.required),
      werkelijkePersonen: new FormControl(werkelijk, Validators.required),
      datum: new FormControl({value: datum, disabled: isDisabled}, Validators.required)
    });
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: this.message,
      duration: 3500,
      position: 'middle',  
    });
    toast.present();
    this.togglePanel();
  }

  togglePanel() {
    if (this.isExpanded) {
      this.isExpanded = false;
    } else {
      this.isExpanded = true;
    }
  }

  refreshData() {
    this.getBotterVisits();
  }

  save() {
    if (this.botterVisit.value.botters.length < 1) {
      this.message = "Er zijn geen botters gekozen.";
      this.presentToast();
    } else if (this.botterVisit.value.verwachtePersonen < 1) {
      this.message = "Het verwachte aantal personen moet groter dan 0 zijn.";
      this.presentToast();
    } else {
      this.botterService.addBotterVisit(this.botterVisit.value).subscribe(result => {
        this.message = result.message;
        if (result.errorCode === 0) {
          this.getBotterVisits();
          this.setBotterForm([], 0, 0, 'Knarland', this.vandaag, false);
        }
        this.presentToast();
      });  
    }
  }

  update() {
    let botterValue = this.botterVisit.value;
    botterValue.botterBezoekId = this.selectedBotterBezoekId;
    this.botterService.updateBotterVisit(botterValue).subscribe(result => {
      this.message = result.message;
        if (result.errorCode === 0) {
          this.getBotterVisits();
          // this.setBotterForm([], 0, 0, 'Knarland', this.vandaag, false);
        }
        this.presentToast();
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

  onActivate(event) {
    if(event.type == 'click') {
      this.actie = "Wijzigen";
      let botters = [];
      let check = event.row.naamBoot.split(",");
      this.botterList.forEach(b => {
        check.forEach(c => {
          if (c === b.naamBoot) {
            botters.push(b); 
          }
        });
      });
      let splitString = event.row.datum.split("-");
      const year = splitString[2];
      const month = splitString[1];
      const day = splitString[0];
      const correctDate = year + "-" + month + "-" + day;
      this.setBotterForm(botters, event.row.verwachtePersonen, event.row.verwachtePersonen, event.row.eiland, correctDate, true);
      this.selectedBotterBezoekId = event.row.botterBezoekId;
      this.togglePanel();
    }  
  }
}
