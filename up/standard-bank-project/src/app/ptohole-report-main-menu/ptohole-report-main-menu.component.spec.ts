import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PtoholeReportMainMenuComponent } from './ptohole-report-main-menu.component';

describe('PtoholeReportMainMenuComponent', () => {
  let component: PtoholeReportMainMenuComponent;
  let fixture: ComponentFixture<PtoholeReportMainMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PtoholeReportMainMenuComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PtoholeReportMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
