import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArFormHistoryDetailsPage } from './ar-form-history-details.page';

describe('ArFormHistoryDetailsPage', () => {
  let component: ArFormHistoryDetailsPage;
  let fixture: ComponentFixture<ArFormHistoryDetailsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArFormHistoryDetailsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArFormHistoryDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
