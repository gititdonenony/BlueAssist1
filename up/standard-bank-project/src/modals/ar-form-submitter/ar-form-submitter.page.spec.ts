import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ArFormSubmitterPage } from './ar-form-submitter.page';

describe('ArFormSubmitterPage', () => {
  let component: ArFormSubmitterPage;
  let fixture: ComponentFixture<ArFormSubmitterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArFormSubmitterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ArFormSubmitterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
