import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SubmitAndEmailPage } from './submit-and-email.page';

describe('SubmitAndEmailPage', () => {
  let component: SubmitAndEmailPage;
  let fixture: ComponentFixture<SubmitAndEmailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitAndEmailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SubmitAndEmailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
