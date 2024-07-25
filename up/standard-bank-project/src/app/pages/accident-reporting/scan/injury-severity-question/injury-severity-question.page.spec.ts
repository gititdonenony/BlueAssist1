import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InjurySeverityQuestionPage } from './injury-severity-question.page';

describe('InjurySeverityQuestionPage', () => {
  let component: InjurySeverityQuestionPage;
  let fixture: ComponentFixture<InjurySeverityQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InjurySeverityQuestionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InjurySeverityQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
