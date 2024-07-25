import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AccidentScenePage } from './accident-scene.page';

describe('AccidentScenePage', () => {
  let component: AccidentScenePage;
  let fixture: ComponentFixture<AccidentScenePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccidentScenePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AccidentScenePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
