import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmergencyContactsSelectedStatePage } from './emergency-contacts-selected-state.page';

describe('EmergencyContactsSelectedStatePage', () => {
  let component: EmergencyContactsSelectedStatePage;
  let fixture: ComponentFixture<EmergencyContactsSelectedStatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmergencyContactsSelectedStatePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmergencyContactsSelectedStatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
