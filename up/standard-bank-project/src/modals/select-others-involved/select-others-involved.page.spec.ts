import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectOthersInvolvedPage } from './select-others-involved.page';

describe('SelectOthersInvolvedPage', () => {
  let component: SelectOthersInvolvedPage;
  let fixture: ComponentFixture<SelectOthersInvolvedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOthersInvolvedPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectOthersInvolvedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
