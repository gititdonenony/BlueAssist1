import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditEmergencyContactTwoPage } from './edit-emergency-contact-two.page';

describe('EditEmergencyContactTwoPage', () => {
  let component: EditEmergencyContactTwoPage;
  let fixture: ComponentFixture<EditEmergencyContactTwoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditEmergencyContactTwoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditEmergencyContactTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
