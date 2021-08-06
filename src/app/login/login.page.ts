import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public navigationExtras: NavigationExtras;
  public userName: string;
  public email = '';
  public password = '';
  public message = '';
  public user: FormGroup;

  constructor(private navCtrl: NavController,
      private toastCtrl: ToastController,
      private storage: Storage){}

  async ngOnInit() {
    this.user = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
   });
   await this.storage.create();
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: this.message,
      duration: 3000,
      position: 'middle',  
    });
    console.log(toast);
    toast.present();
  }

  login() {
    // TODO check if user is authorized with real backend - for now only email check
    if (this.user.value.email === 'edwin.cosmopolite@gmail.com') {
      this.userName = 'Edwin';
    } else if (this.user.value.email === 'erica.de.graaf.borkent@gmail.com') { 
      this.userName = 'Erica';
    } else if (this.user.value.email === 'gerrithoutzager@gmail.com') {
      this.userName = 'Gerrit';
    } 

    const authorized = ['Edwin', 'Erica', 'Gerrit'];
    if (authorized.includes(this.userName)) {
      this.storage.set('userName', this.userName);
      this.navCtrl.navigateRoot(['tabs'], this.navigationExtras);
    }
    else {
      this.message = "U bent geen ge-authoriseerde gebruiker van deze app."
      this.presentToast();
    }
  }
}
