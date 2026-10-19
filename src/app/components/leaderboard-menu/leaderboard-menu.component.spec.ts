import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardMenuComponent } from './leaderboard-menu.component';

describe('LeaderboardMenuComponent', () => {
  let component: LeaderboardMenuComponent;
  let fixture: ComponentFixture<LeaderboardMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardMenuComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
