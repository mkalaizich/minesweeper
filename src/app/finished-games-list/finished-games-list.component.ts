import { Component } from '@angular/core';
import { SettingsService } from '../settings.service';
import { Game } from '../game.model';

@Component({
  selector: 'app-finished-games-list',
  templateUrl: './finished-games-list.component.html',
  styleUrls: ['./finished-games-list.component.scss'],
})
export class FinishedGamesListComponent {
  gamesList: Game[] = [];
  constructor(private settingsService: SettingsService) {
    this.gamesList = this.settingsService.getRecordedGames();
  }
}
