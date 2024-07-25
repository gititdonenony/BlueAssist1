import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LinkArNumberModalPage } from './link-ar-number-modal.page';

describe('LinkArNumberModalPage', () => {
  let component: LinkArNumberModalPage;
  let fixture: ComponentFixture<LinkArNumberModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkArNumberModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LinkArNumberModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
