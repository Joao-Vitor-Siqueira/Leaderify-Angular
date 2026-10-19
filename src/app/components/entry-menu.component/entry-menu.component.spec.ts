import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryMenuComponent } from './entry-menu.component';

describe('EntryMenuComponent', () => {
  let component: EntryMenuComponent;
  let fixture: ComponentFixture<EntryMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntryMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EntryMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
