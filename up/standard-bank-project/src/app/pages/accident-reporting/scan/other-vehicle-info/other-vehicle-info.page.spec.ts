import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtherVehicleInfoPage } from './other-vehicle-info.page';

describe('OtherVehicleInfoPage', () => {
  let component: OtherVehicleInfoPage;
  let fixture: ComponentFixture<OtherVehicleInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherVehicleInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherVehicleInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
