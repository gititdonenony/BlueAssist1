import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourVehicleDamagesPage } from './your-vehicle-damages.page';

describe('YourVehicleDamagesPage', () => {
  let component: YourVehicleDamagesPage;
  let fixture: ComponentFixture<YourVehicleDamagesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourVehicleDamagesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourVehicleDamagesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
