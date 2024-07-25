import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClaimSubmissionSuccessPage } from './claim-submission-success.page';

describe('ClaimSubmissionSuccessPage', () => {
  let component: ClaimSubmissionSuccessPage;
  let fixture: ComponentFixture<ClaimSubmissionSuccessPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSubmissionSuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClaimSubmissionSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
