import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValueFormComponent } from './value-form.component';

describe('ValueFormComponent', () => {
  let component: ValueFormComponent;
  let fixture: ComponentFixture<ValueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValueFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ValueFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
