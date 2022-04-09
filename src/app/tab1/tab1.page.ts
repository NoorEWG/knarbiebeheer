import { Component } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { AboService} from './abo.service';
import { ModalPopoverPage } from './modal-popover.page';
import { Storage } from '@ionic/storage';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { User } from '../model/user';
import { Boot } from '../model/boot';
import { BootType } from '../model/boot-type';
import { UserBoot } from '../model/user-boot';


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
  public user: User = new User();
  public boat: Boot = new Boot();
  public createBoat: boolean = false;
  public changeUserBoat: boolean = false;
  public createUser: boolean = false;
  public changeBoatUser: boolean = false;
  public showUserForm: boolean = false;
  public showBoatForm: boolean = false;
  public showUserList: boolean = false;
  public showBoatList: boolean = false;
  public showAbo: boolean = false;
  public boatList: Boot[];
  public userList: User[];
  public boatTypeList: BootType[];
  public message: string = "";
  public userBoat: UserBoot;
  
  constructor(
    private aboService: AboService,
    private toastCtrl: ToastController,
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

    this.aboService.getAllBoatTypes().subscribe(results => {
      this.boatTypeList = results;
    });
    this.userBoat = new UserBoot();
    this.userBoat.user = this.user;
    this.userBoat.boat = this.boat;
    this.userBoat.year = this.chosenYear;
    this.setUserBoatSaveUpdate(false, false, false, false, false, false);
    this.setUserBoatForm();
    this.setUserBoat();
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
      id: new FormControl(this.user.id),
      voorletters: new FormControl(this.user.voorletters),
      tussenvoegsel: new FormControl(this.user.tussenvoegsel),
      naam: new FormControl(this.user.naam),
      telefoon: new FormControl(this.user.telefoon),
      email: new FormControl(this.user.email),
      thuishaven: new FormControl(this.user.thuishaven),
      opmerking: new FormControl(this.user.opmerking),
      bootId: new FormControl(this.user.bootId),
    });
    this.boatForm = new FormGroup({
      id: new FormControl(this.boat.id),
      naamBoot: new FormControl(this.boat.naamBoot),
      lengteBoot: new FormControl(this.boat.lengteBoot),
      typeBoot: new FormControl(this.boat.typeBoot)
    });
  }

  setUserBoatSaveUpdate(saveAbo: boolean, saveUser: boolean, saveBoat: boolean, updateAbo: boolean, updateUser: boolean, updateBoat: boolean) {
    this.userBoat.saveAbo = saveAbo;
    this.userBoat.saveUser = saveUser;
    this.userBoat.saveBoat = saveBoat;
    this.userBoat.updateAbo = updateAbo;
    this.userBoat.updateUser = updateUser;
    this.userBoat.updateBoat = updateBoat;
  }

  setUserBoat() {
    this.userBoat.user = this.userForm.value;
    this.userBoat.boat = this.boatForm.value;
  }

  addUser() {
    this.boat = new Boot();
    this.user = new User();
    this.setUserBoatForm();
    this.setUserBoatSaveUpdate(false,true,false,false,false,false);
    this.showUserForm = true;
    this.showUserList = false;
    this.showBoatForm = false;
    this.showBoatList = false;
    this.showAbo = true;
  }

  getUser(event) {
    this.user = event.value;
    this.setUserBoatSaveUpdate(false,false,false,false,true,false);
    this.aboService.getBoatByUserId(this.user.bootId).subscribe(results => {
      this.boat = results;
      this.setUserBoatForm();
      this.showUserForm = true;
      this.showUserList = true;
      this.showBoatForm = true;
      this.showBoatList = false;
      this.showAbo = true;
    });
  }

  updateUser() {
    this.showUserForm = false;
    this.showBoatForm = false;
    this.showBoatList = false;
    this.showAbo = true;
    this.aboService.getAllUsers().subscribe(results => {
      this.userList = results;
      this.showUserList = true;
    });
  }

  setAbo(event) {
    if (event.returnValue) {
      this.abo = true;
    } else {
      this.abo = false;
    }
  }

  addUserSubscription() {
    this.showUserForm = false;
    this.showBoatForm = false;
    this.showBoatList = false;
    this.showUserList = false;
    this.showAbo = true;
  }

  addBoat() {
    this.boat = new Boot();
    this.user = new User();
    this.setUserBoatForm();
    this.setUserBoatSaveUpdate(false,false,true,false,false,false);
    this.showUserForm = false;
    this.showBoatForm = true;
    this.showBoatList = false;
    this.showUserList = false;
    this.showAbo = false; 
  }

  getBoat(event) {
    event.value.typeBoot =  this.boatTypeList.filter(v => v.id = event.value.id)[0];
    this.boat = event.value;
    this.user = new User();
    this.setUserBoatForm();
    this.setUserBoatSaveUpdate(false,false,false,false,false,true);
    this.showUserForm = true;
    this.showUserList = true;
    this.showBoatForm = true;
    this.showBoatList = true;
    this.showAbo = false;
   }

  updateBoat() {
    this.showUserForm = false;
    this.showBoatForm = false;
    this.showUserList = false;
    this.showAbo = false;
    this.aboService.getAllBoats().subscribe(results => {
      this.boatList = results;
      this.showBoatList = true;
    });
  }

  openBoatForm(event) {
    if (event.returnValue) {
      this.showBoatForm = true;
    } else {
      this.boat = null;
      this.showBoatForm = false;
    }
  }

  openBoatSelect(event) {
    if (event.returnValue) {
      this.aboService.getAllBoats().subscribe(results => {
        this.boatList = results;
        this.boat = new Boot();
        this.showBoatList = true;
        this.showBoatForm = false;
        this.showUserForm = true;
      });
    } else {
      this.showBoatList = false;
    }
  }

  addAdmin() {
    // TODO
    // get all users with een option list
    // on click on one => this.showUserForm and hide the list;
    // and add admin = yes
  }

  cancel() {
    this.user = new User();
    this.boat = new Boot();
    this.setUserBoatForm();
    this.setUserBoatSaveUpdate(false,false,false,false,false,false);
    this.showUserForm = false;
    this.showUserList = false;
    this.showBoatForm = false;
    this.showBoatList = false;
    this.showAbo = false;
  }

  save() {
    this.setUserBoat();
    this.userBoat.saveAbo = this.abo;
    if (this.userBoat.boat.id >= 1) {
      this.userBoat.updateBoat = true;
      this.userBoat.saveBoat = false;
    } else {
      this.userBoat.updateBoat = false;
      this.userBoat.saveBoat = true;
    }
    
    if (this.userBoat.user.id >= 1) {
      this.userBoat.updateUser = true;
      this.userBoat.saveUser = false;
    } else {
      this.userBoat.updateUser = false;
      this.userBoat.saveUser = true;
    }

    this.aboService.save(this.userBoat).subscribe(result => {
      this.user = new User();
      this.boat = new Boot();
      this.setUserBoatForm();
      this.showUserForm = false;
      this.showUserList = false;
      this.showBoatForm = false;
      this.showBoatList = false;
      this.message = result.message;
      this.presentToast();
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


}
