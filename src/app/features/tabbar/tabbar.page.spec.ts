import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TabbarPage } from './tabbar.page';

describe('TabbarPage', () => {
  let component: TabbarPage;
  let fixture: ComponentFixture<TabbarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TabbarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
