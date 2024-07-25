import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RoadConditionsPage } from './road-conditions.page';

describe('RoadConditionsPage', () => {
  let component: RoadConditionsPage;
  let fixture: ComponentFixture<RoadConditionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoadConditionsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RoadConditionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
