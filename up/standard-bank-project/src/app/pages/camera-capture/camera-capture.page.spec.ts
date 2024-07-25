import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CameraCapturePage } from './camera-capture.page';

describe('CameraCapturePage', () => {
  let component: CameraCapturePage;
  let fixture: ComponentFixture<CameraCapturePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CameraCapturePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CameraCapturePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
