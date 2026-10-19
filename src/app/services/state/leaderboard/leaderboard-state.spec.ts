import { TestBed } from '@angular/core/testing';

import { LeaderboardState } from './leaderboard-state';

describe('LeaderboardState', () => {
  let service: LeaderboardState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaderboardState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
