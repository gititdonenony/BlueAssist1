import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtherVehicleDamagesPage } from './other-vehicle-damages.page';

describe('OtherVehicleDamagesPage', () => {
  let component: OtherVehicleDamagesPage;
  let fixture: ComponentFixture<OtherVehicleDamagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherVehicleDamagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherVehicleDamagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
