import { Component, Input } from '@angular/core';
import { Cell } from '../Cell.model';
import { faFlag, faBomb } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss']
})
export class CellComponent {
  @Input() cell: Cell | undefined;
  @Input() gameOver = false;
  faFlag = faFlag;
  faBomb = faBomb;

  getColor(val: number): string {
    switch (val) {
      case 1:
        return 'blue';
      case 2:
        return 'red';
      case 3:
        return 'green';
      case 4:
        return 'purple';
      case 5:
        return 'cyan';
      case 6:
        return 'orange';
      case 7:
        return 'yellow';
      case 8:
        return 'white';
      default:
        return 'black';
    }
  }
}
