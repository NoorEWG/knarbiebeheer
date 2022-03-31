import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab0Page } from './tab0.page';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatExpansionModule } from '@angular/material/expansion';
import { Tab0PageRoutingModule } from './tab0-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatExpansionModule,
    RouterModule.forChild([{ path: '', component: Tab0Page }]),
    Tab0PageRoutingModule,
    NgxDatatableModule
  ],
  declarations: [Tab0Page]
})
export class Tab0PageModule {}
