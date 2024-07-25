import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourVehicleInfoPage } from './your-vehicle-info.page';

describe('YourVehicleInfoPage', () => {
  let component: YourVehicleInfoPage;
  let fixture: ComponentFixture<YourVehicleInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourVehicleInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourVehicleInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
