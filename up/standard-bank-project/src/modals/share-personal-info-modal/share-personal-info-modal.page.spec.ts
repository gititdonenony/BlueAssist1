import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SharePersonalInfoModalPage } from './share-personal-info-modal.page';

describe('SharePersonalInfoModalPage', () => {
  let component: SharePersonalInfoModalPage;
  let fixture: ComponentFixture<SharePersonalInfoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharePersonalInfoModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SharePersonalInfoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
