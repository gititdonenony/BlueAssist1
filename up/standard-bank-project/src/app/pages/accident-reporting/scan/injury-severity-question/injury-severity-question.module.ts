import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InjurySeverityQuestionPageRoutingModule } from './injury-severity-question-routing.module';

import { InjurySeverityQuestionPage } from './injury-severity-question.page';

import { ComponentsModule } from 'src/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InjurySeverityQuestionPageRoutingModule,
    ComponentsModule
  ],
  declarations: [InjurySeverityQuestionPage]
})
export class InjurySeverityQuestionPageModule {}
