import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { GameSetupComponent } from './game-setup/game-setup.component';
import { FinishedGamesListComponent } from './finished-games-list/finished-games-list.component';
import { NavigationComponent } from './layout/navigation/navigation.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CellComponent } from './game-board/cell/cell.component';
import { FormattedSecondsPipe } from './formatted-seconds.pipe';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    GameSetupComponent,
    FinishedGamesListComponent,
    NavigationComponent,
    CellComponent,
    FormattedSecondsPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    MatButtonToggleModule,
    MatIconModule,
    ReactiveFormsModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
