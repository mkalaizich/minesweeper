export type Cell = {
  col: number;
  row: number;
  isFlag: boolean;
  isMine: boolean;
  isOpen: boolean;
  minesAround: number;
};
