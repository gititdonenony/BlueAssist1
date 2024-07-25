import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FmailyMembersTwoPage } from './fmaily-members-two.page';

describe('FmailyMembersTwoPage', () => {
  let component: FmailyMembersTwoPage;
  let fixture: ComponentFixture<FmailyMembersTwoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FmailyMembersTwoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FmailyMembersTwoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
