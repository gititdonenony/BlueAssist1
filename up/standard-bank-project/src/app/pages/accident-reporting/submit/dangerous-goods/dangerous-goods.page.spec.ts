import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DangerousGoodsPage } from './dangerous-goods.page';

describe('DangerousGoodsPage', () => {
  let component: DangerousGoodsPage;
  let fixture: ComponentFixture<DangerousGoodsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DangerousGoodsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DangerousGoodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
