import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AboService} from './abo.service';
import { ModalPopoverPage } from './modal-popover.page';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { User } from '../model/user';
import { Boot } from '../model/boot';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public aboSearch: string;
  public chosenYear: number;
  public columns: any;
  public filteredData: any;
  public rows: any;
  public columnsWithSearch : string[] = [];
  public eiland: string;
  public modalDataResponse: any;
  public userName;
  public isExpanded: boolean = false;
  public admin: boolean = false;
  public userForm: FormGroup;
  public boatForm: FormGroup;
  public actionUser: boolean = false;
  public actionBoat: boolean = false;
  public abo: boolean = false;
  public user: User;
  public boat: Boot;
  public createBoat: boolean = false;
  public changeUserBoat: boolean = false;
  public createUser: boolean = false;
  public changeBoatUser: boolean = false;
  public showUserForm: boolean = false;
  public showBoatForm: boolean = false;
  public showUserList: boolean = false;
  public showBoatList: boolean = false;
  public boatList: Boot[];
  public userList: User[];
  
  constructor(
    private aboService: AboService,
    private storage: Storage,
    private modalCtrl: ModalController) {}

  
  ngOnInit(): void {
    this.storage.get("userName").then((result) => {
      this.userName = result;
      this.eiland = this.userName === 'Edwin' || this.userName === 'Erica'  ? 'de Biezen' : 'Knarland';
      if (this.userName.toLowerCase().includes('erica')) {
        this.admin = true;
      }
      });
    this.chosenYear = new Date().getFullYear();
  
    this.columns = [
      { name: 'naam', header: 'Naam', sortable: true },
      { name: 'telefoon', header: 'Telefoon', sortable: false },
      { name: 'boot', header: 'Boot', sortable: true },
      { name: 'type', header: 'Type boot', sortable: true }
    ];
    this.aboService.getAllSubscriptions(this.chosenYear).subscribe(results => {
      this.rows = results;
      this.filteredData = this.rows;
      this.columnsWithSearch = ["naam","boot","type"];
    });

    this.user = new User();
    this.user.voorletters = "EWG";
    this.boat = new Boot();

    this.setUserBoatForm();
  } 

  async initModal(abonnementsHouder) {
    const modal = await this.modalCtrl.create({
      component: ModalPopoverPage,
      componentProps: {
        'title': 'Registreer',
        'subTitle': 'Registreer bezoek abonnementshouder',
        'abonnementsHouder': abonnementsHouder,
        'eiland' : this.eiland
      }
    });
    modal.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data === 'resetAboSearch') {
        this.aboSearch = '';
        this.rows = this.filteredData;
      }
    });
  
    return await modal.present();
  }

  onActivate(event) {
    if(event.type == 'click') {
      this.initModal(event.row);      
    }
  }

  refreshData() {
    this.aboService.getAllSubscriptions(this.chosenYear).subscribe(results => {
      this.rows = results;
      this.filteredData = this.rows;
     });
  }

  // filters results
  filterDatatable(event){
    // get the value of the key pressed and make it lowercase
    let filter = event.target.value.toLowerCase();

    // assign filtered matches to the active datatable
    this.rows = this.filteredData.filter(item => {
      // iterate through each row's column data
      for (let i = 0; i < this.columnsWithSearch.length; i++){
        var colValue = item[this.columnsWithSearch[i]] ;

        // if no filter OR colvalue is NOT null AND contains the given filter
        if (!filter || (!!colValue && colValue.toString().toLowerCase().indexOf(filter) !== -1)) {
          // found match, return true to add to result set
          return true;
        }
      }
    });
    // TODO - whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
  }

  setUserBoatForm() {
    this.userForm = new FormGroup({
      voorletters: new FormControl(this.user.voorletters),
      tussenvoegsel: new FormControl(this.user.tussenvoegsel),
      naam: new FormControl(this.user.naam),
      telefoon: new FormControl(this.user.telefoon),
      email: new FormControl(this.user.email),
      thuishaven: new FormControl(this.user.thuishaven),
      opmmerking: new FormControl(this.user.opmerking)
    });
    this.boatForm = new FormGroup({
      naamBoot: new FormControl(this.boat.naamBoot),
      lengteBoot: new FormControl(this.boat.lengteBoot),
      typeBoot: new FormControl(this.boat.typeBoot)
    });
  }

  addUser() {
    this.showUserForm = true;
    this.showBoatForm = false;
    this.showBoatList = false;
    this.showUserList = false;
  }

  updateUser() {
    this.showUserForm = false;
    this.showBoatForm = false;
    this.showBoatList = false;
    this.aboService.getAllUsers().subscribe(results => {
      this.userList = results;
      this.showUserList = true;
    });
    // TODO
    // get all users with een option list
    // on click on one => this.showUserForm and hide the list;
  }

  addUserSubscription() {
    this.showUserForm = false;
    this.showBoatForm = false;
    this.showBoatList = false;
    this.showUserList = false;
    // TODO
  }

  addBoat() {
    this.showBoatForm = true;
    this.showUserForm = false;
    this.showBoatList = false;
    this.showUserList = false;
   
  }

  updateBoat() {
    this.showUserForm = false;
    this.showBoatForm = false;
    this.showUserList = false;
    this.aboService.getAllBoats().subscribe(results => {
      this.boatList = results;
      this.showBoatList = true;
    });
    // TODO
    // get all boats with een option list
    // on click on one => this.showBoatForm and hide the list;
  }

  addAdmin() {
    // TODO
    // get all users with een option list
    // on click on one => this.showUserForm and hide the list;
    // and add admin = yes
  }



}
