import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PackageoptionerrorpageComponent } from './packageoptionerrorpage.component';

describe('PackageoptionerrorpageComponent', () => {
  let component: PackageoptionerrorpageComponent;
  let fixture: ComponentFixture<PackageoptionerrorpageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageoptionerrorpageComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PackageoptionerrorpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
