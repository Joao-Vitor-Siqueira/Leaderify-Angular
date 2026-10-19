import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardViewComponent } from './leaderboard-view.component';

describe('LeaderboardViewComponent', () => {
  let component: LeaderboardViewComponent;
  let fixture: ComponentFixture<LeaderboardViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaderboardViewComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaderboardViewComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
