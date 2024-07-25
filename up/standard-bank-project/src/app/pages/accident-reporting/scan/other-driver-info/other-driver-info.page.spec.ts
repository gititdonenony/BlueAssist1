import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OtherDriverInfoPage } from './other-driver-info.page';

describe('OtherDriverInfoPage', () => {
  let component: OtherDriverInfoPage;
  let fixture: ComponentFixture<OtherDriverInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherDriverInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OtherDriverInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
