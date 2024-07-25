import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YourInfoPage } from './your-info.page';

describe('YourInfoPage', () => {
  let component: YourInfoPage;
  let fixture: ComponentFixture<YourInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YourInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
