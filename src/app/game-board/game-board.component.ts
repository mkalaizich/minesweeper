import { Component, OnInit } from '@angular/core';
import { Cell } from './Cell.model';
import { SettingsService } from '../settings.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss'],
})
export class GameBoardComponent implements OnInit {
  width = 0;
  height = 0;
  mines = 0;
  difficulty = 0;
  flags = 0;
  table: Cell[][] = [];
  savedTable:
    | { table: Cell[][]; time: number; flags: number; difficulty: number }
    | undefined;
  gameOver = false;
  win = false;
  time = 0;
  timer: any;
  startDate: Date | undefined;
  finishDate: Date | undefined;

  constructor(private settingsService: SettingsService) {
    const { width, height, mines, difficulty } =
      this.settingsService.getGameSettings();
    this.mines = mines;
    this.width = width;
    this.height = height;
    this.difficulty = difficulty;
  }

  ngOnInit() {
    this.newGame();
    const savedGame = localStorage.getItem('savedGame');
    if (savedGame) {
      this.savedTable = JSON.parse(savedGame);
    }
  }

  newGame() {
    this.gameOver = false;
    this.win = false;
    this.stopTimer();
    this.time = 0;
    this.flags = 0;
    this.startDate = new Date();
    for (let row = 0; row < this.height; row++) {
      this.table[row] = [];
      for (let col = 0; col < this.width; col++) {
        this.table[row].push({
          row,
          col,
          isOpen: false,
          isFlag: false,
          isMine: false,
          minesAround: 0,
        });
      }
    }
  }

  saveGame() {
    this.savedTable = {
      time: this.time,
      flags: this.flags,
      table: JSON.parse(JSON.stringify(this.table)),
      difficulty: this.difficulty,
    };
    localStorage.setItem('savedGame', JSON.stringify(this.savedTable));
  }

  loadGame() {
    if (this.savedTable) {
      this.table = JSON.parse(JSON.stringify(this.savedTable.table));
      this.time = this.savedTable.time;
      this.flags = this.savedTable.flags;
      this.difficulty = this.savedTable.difficulty;
      this.gameOver = false;
      if (!this.timer) {
        this.startTimer();
      }
    }
  }

  onClickedCell = (col: number, row: number) => {
    if (this.isGameNotStarted()) {
      this.createBoard(col, row);
      this.startTimer();
    }

    if (this.table[row][col].isMine) {
      this.gameOver = true;
      this.stopTimer();
      this.recordGame();
      this.table.forEach((row) => {
        row.forEach((cel) => {
          if (cel.isMine) {
            cel.isOpen = true;
          }
        });
      });
      return;
    }
    this.table[row][col].isOpen = true;
    if (!this.table[row][col].minesAround) {
      this.openAdjacentMines(col, row);
      return;
    }

    if (this.isGameWon()) {
      this.win = true;
      this.recordGame();
    }
  };

  toggleFlagCell($event: MouseEvent, col: number, row: number) {
    $event.preventDefault();
    if (this.isGameNotStarted() || this.gameOver) {
      return;
    }
    this.table[row][col].isFlag = !this.table[row][col].isFlag;
    this.table[row][col].isFlag ? this.flags++ : this.flags--;
  }

  private isGameWon(): boolean {
    let isWon = true;
    this.table.forEach((row) => {
      row.forEach((col) => {
        if (!col.isMine && !col.isOpen) isWon = false;
      });
    });
    if (isWon) {
      this.stopTimer();
    }
    return isWon;
  }

  isGameNotStarted = (): boolean => {
    let notStarted = true;
    this.table.forEach((row) => {
      row.forEach((col) => {
        if (col.isMine) {
          notStarted = false;
        }
      });
    });
    return notStarted;
  };

  private startTimer() {
    this.timer = setInterval(() => {
      this.time++;
    }, 1000);
  }

  private stopTimer() {
    if (this.timer) {
      this.finishDate = new Date();
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private createBoard(initCol: number, initRow: number) {
    for (let i = 0; i < this.mines; i++) {
      let row, col;
      do {
        row = Math.floor(Math.random() * this.height);
        col = Math.floor(Math.random() * this.width);
      } while (
        this.table[row][col].isMine ||
        (col === initCol && row === initRow)
      );
      this.table[row][col].isMine = true;
    }

    this.table.forEach((row) => {
      row.forEach((cell) => {
        if (!cell.isMine) {
          cell.minesAround = this.countAdjacentMines(cell.col, cell.row);
        }
      });
    });
  }

  private countAdjacentMines(col: number, row: number): number {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    let count = 0;

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 &&
        newRow < this.height &&
        newCol >= 0 &&
        newCol < this.width
      ) {
        if (this.table[newRow][newCol].isMine) {
          count++;
        }
      }
    }

    return count;
  }

  private openAdjacentMines(col: number, row: number) {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dx, dy] of directions) {
      const newRow = row + dx;
      const newCol = col + dy;

      if (
        newRow >= 0 &&
        newRow < this.height &&
        newCol >= 0 &&
        newCol < this.width &&
        !this.table[newRow][newCol].isOpen
      ) {
        this.onClickedCell(newCol, newRow);
      }
    }
  }

  private recordGame() {
    this.settingsService.recordGame({
      win: this.win,
      start: this.startDate!,
      end: this.finishDate!,
      time: this.time,
      difficulty: this.difficulty,
    });
  }
}
