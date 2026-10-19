import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLeaderboardComponent } from './create-leaderboard.component';

describe('CreateLeaderboardComponent', () => {
  let component: CreateLeaderboardComponent;
  let fixture: ComponentFixture<CreateLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateLeaderboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateLeaderboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
