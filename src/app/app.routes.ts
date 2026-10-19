import { Routes } from '@angular/router';
import { LoginComponent } from './components/pages/login/login.component';
import { MainLayout } from './components/main-layout/main-layout.component';
import { HomeComponent } from './components/pages/home/home.component';
import { authGuard } from './services/auth/auth.guard';
import { LeaderboardsComponent } from './components/pages/leaderboards/leaderboards.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { CreateLeaderboardComponent } from './components/pages/create-leaderboard/create-leaderboard.component';
import { LeaderboardComponent } from './components/pages/leaderboard/leaderboard.component';
import { LeaderboardViewComponent } from './components/leaderboard-view/leaderboard-view.component';
import { MetricMenuComponent } from './components/metric-menu/metric-menu.component';
import { EntryMenuComponent } from './components/entry-menu.component/entry-menu.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    canActivateChild: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      { path: 'home',
        component: HomeComponent,
      },
      {
        path: 'leaderboards',
        component: LeaderboardsComponent
      },
      {path: 'leaderboards/:id',
        component: LeaderboardComponent,
        children: [
          {
            path: 'views',
            component: LeaderboardViewComponent
          },
          {
            path: 'metrics',
            component: MetricMenuComponent
          },
          {
            path: 'entries',
            component: EntryMenuComponent
          }
        ]
      },
      {
        path: 'leaderboards/create',
        component: CreateLeaderboardComponent
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "register",
    component: RegisterComponent
  }
];
