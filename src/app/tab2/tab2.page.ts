import { Component } from '@angular/core';
import { Validators, FormGroup, FormControl, FormArray } from '@angular/forms';
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
  public wijzigen: boolean = false;
  public actie: string;
  public botterVisit: FormGroup;

  constructor(private botterService: BotterService) {}

  ngOnInit(): void {
    this.updateAction();
    let vandaag = new Date().toISOString().split('T')[0];
    this.botterVisit = new FormGroup({
      botters: new FormControl([], Validators.required),
      eiland: new FormControl('Knarland', Validators.required),
      verwachtePersonen: new FormControl(0, Validators.required),
      werkelijkePersonen: new FormControl(0, Validators.required),
      datum: new FormControl(vandaag, Validators.required)
    });
    this.chosenYear = new Date().getFullYear();
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
      this.rows = results;
    });  
  }  

  save() {
    this.botterService.addBotterVisit(this.botterVisit.value).subscribe(results => {
      console.log(results);
      // TODO make a toast mesasge
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

}
