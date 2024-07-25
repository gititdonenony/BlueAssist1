import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PotholeVehicleDamagePhotosPage } from './pothole-vehicle-damage-photos.page';

describe('PotholeVehicleDamagePhotosPage', () => {
  let component: PotholeVehicleDamagePhotosPage;
  let fixture: ComponentFixture<PotholeVehicleDamagePhotosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PotholeVehicleDamagePhotosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PotholeVehicleDamagePhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
