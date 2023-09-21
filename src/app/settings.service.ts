import { Injectable } from '@angular/core';
import { Game } from './game.model';

type GameSettings = {
  difficulty: number,
  width: number,
  height: number,
  mines: number,
}

@Injectable({
  providedIn: 'root'
})

export class SettingsService {
  private localStorageKey = 'settings';
  private gameSettings: GameSettings = {
    difficulty: 1,
    width: 9,
    height: 9,
    mines: 10
  };
  constructor() { 
    const savedSettings = localStorage.getItem(this.localStorageKey);

    if(savedSettings) {
      this.gameSettings = JSON.parse(savedSettings)
    }
  }

  getGameSettings(): GameSettings {
    return this.gameSettings;
  }

  setGameSettings(settings: GameSettings) {
    this.gameSettings = settings;
    localStorage.setItem(this.localStorageKey, JSON.stringify(settings));
  }

  recordGame(game: Game) {
    const prevGames = localStorage.getItem('games');
    let gamesArray = [];

    if(prevGames) {
      gamesArray = JSON.parse(prevGames);
    }

    gamesArray.push(game)
    
    const sortedGames = gamesArray.sort((a: Game,b: Game) => {
      if (a.difficulty !== b.difficulty) {
        return a.difficulty - b.difficulty;
      }
      return a.time - b.time;
    });
    
    localStorage.setItem('games', JSON.stringify(sortedGames));
  }

  getRecordedGames(): Game[] {
    const prevGames = localStorage.getItem('games');

    return prevGames ? JSON.parse(prevGames) : [];
  }
}
