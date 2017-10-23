import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { GameComponent } from './components/game/game.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'game',
    component: GameComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { enableTracing: false }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}