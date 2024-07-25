import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WitnessInfoPage } from './witness-info.page';

describe('WitnessInfoPage', () => {
  let component: WitnessInfoPage;
  let fixture: ComponentFixture<WitnessInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WitnessInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WitnessInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
