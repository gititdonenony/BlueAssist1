import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GenericPopupPage } from './generic-popup.page';

describe('GenericPopupPage', () => {
  let component: GenericPopupPage;
  let fixture: ComponentFixture<GenericPopupPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericPopupPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GenericPopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
