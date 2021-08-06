import { Component, OnInit, Input } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular';
import { Abonnement } from '../model/abonnement';
import { AboService } from './abo.service';


@Component({
  selector: 'app-modal-popover',
  templateUrl: './modal-popover.page.html',
  styleUrls: ['./modal-popover.page.scss'],
})

export class ModalPopoverPage implements OnInit {

  @Input() title: string;
  @Input() subTitle: string;
  @Input() abonnementsHouder: Abonnement;
  @Input() eiland: string;
  public noEilandInfoAvailable: boolean;
  public naam: string;
  public message: string;
  public chosenDate: string;

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private aboService: AboService
  ) { }

  ngOnInit() {
    this.chosenDate = new Date().toISOString().split('T')[0];
    console.log(this.chosenDate);
    this.noEilandInfoAvailable = true;
    if (this.abonnementsHouder.tussenvoegsel === '') {
        this.naam = this.abonnementsHouder.voorletters + " " + this.abonnementsHouder.naam;
    } else {
        this.naam = this.abonnementsHouder.voorletters + " " + this.abonnementsHouder.tussenvoegsel + " " + this.abonnementsHouder.naam;
    }
    if (this.eiland === null || this.eiland === '') {
        this.noEilandInfoAvailable = true;
    }
    else {
        this.noEilandInfoAvailable = false;
    }
  }


  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: this.message,
      duration: 3500,
      position: 'middle',  
    });
    console.log(toast);
    toast.present();
    this.close();
  }

  async close() {
    const closeModal: string = "Modal Closed";
    await this.modalCtrl.dismiss(closeModal);
  }

  async save() {
    if (this.noEilandInfoAvailable) {
        this.message = 'Graag eerst een eiland kiezen';
        this.presentToast();
    }
    else {
        this.message = null;
    
        let eilandBezoek = {
            'aboId': this.abonnementsHouder.id, 
            'bootId': this.abonnementsHouder.bootId,
            'boot': this.abonnementsHouder.boot,
            'eiland': this.eiland,
            'chosenDate': this.chosenDate
        }

        this.aboService.saveVisit(eilandBezoek).subscribe(result => {
            let resultMessage = result;
            this.message = resultMessage.message;
            this.presentToast();
        });

    }  
  }

  public parseDate(dateString: string) {
    if (dateString) {
        this.chosenDate = new Date(dateString).toISOString().split('T')[0];
    }
  }

  
   /*Get current time */
   getCurrentDate() {
    const date = new Date();
	return this.dateFormat(date, "YYYY-MM-DD");
  }
    /**
     * Convert date object to date string
     * @param date The date object that needs to be formatted
     * @param sFormat output format, the default is yyyy-MM-dd year: y, month: M, day: d, hour: h, minute: m, second: s
     * @example  dateFormat(new Date())                               "2017-02-28"
     * @example  dateFormat(new Date(),'yyyy-MM-dd')                  "2017-02-28"
     * @example dateFormat(new Date(),'yyyy-MM-dd HH:mm:ss') "2017-02-28 13:24:00" ps:HH:24 hour clock
     * @example dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss') "2017-02-28 01:24:00" ps:hh:12 hour clock
     * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
     * @example  dateFormat(new Date(),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
     * @example  dateFormat(new Date('2017-02-28 13:24:00'),'yyyy-MM-ddTHH:mm:ss+08:00')   "2017-02-28T13:24:00+08:00"
     * @returns {string}
     */

  
  dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
    let time = {
      Year: 0,
      TYear: '0',
      Month: 0,
      TMonth: '0',
      Day: 0,
      TDay: '0',
      Hour: 0,
      THour: '0',
      hour: 0,
      Thour: '0',
      Minute: 0,
      TMinute: '0',
      Second: 0,
      TSecond: '0',
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();
 
    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond))
  }
 

}