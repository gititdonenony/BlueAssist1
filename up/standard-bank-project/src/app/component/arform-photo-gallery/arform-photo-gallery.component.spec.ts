import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ARformPhotoGalleryComponent } from './arform-photo-gallery.component';

describe('ARformPhotoGalleryComponent', () => {
  let component: ARformPhotoGalleryComponent;
  let fixture: ComponentFixture<ARformPhotoGalleryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ARformPhotoGalleryComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ARformPhotoGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
