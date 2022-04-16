import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboService } from './tab1/abo.service';
import { BotterService } from './tab2/botter.service';
import { OverzichtService } from './tab3/overzicht.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { IonicStorageModule } from '@ionic/storage-angular';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IonicSelectableModule } from 'ionic-selectable';
import { VisitorService } from './tab0/visitor.service';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule, 
    NgxDatatableModule,
    IonicStorageModule.forRoot(),
    IonicSelectableModule
  ],
  providers: [AboService,
    BotterService, 
    OverzichtService, 
    VisitorService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
