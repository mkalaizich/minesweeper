import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { FinishedGamesListComponent } from './finished-games-list/finished-games-list.component';

const routes: Routes = [
  { path: 'game-setup', component: GameSetupComponent },
  { path: 'game-board', component: GameBoardComponent },
  { path: 'finished-games', component: FinishedGamesListComponent },
  { path: '', redirectTo: '/game-setup', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
