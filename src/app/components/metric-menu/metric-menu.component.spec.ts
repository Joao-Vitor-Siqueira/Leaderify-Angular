import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricMenuComponent } from './metric-menu.component';

describe('MetricMenuComponent', () => {
  let component: MetricMenuComponent;
  let fixture: ComponentFixture<MetricMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MetricMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
