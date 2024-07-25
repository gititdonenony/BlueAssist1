import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PotholeRoadScenePhotosPage } from './pothole-road-scene-photos.page';

describe('PotholeRoadScenePhotosPage', () => {
  let component: PotholeRoadScenePhotosPage;
  let fixture: ComponentFixture<PotholeRoadScenePhotosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PotholeRoadScenePhotosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PotholeRoadScenePhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
