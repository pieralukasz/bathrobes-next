declare module "excel4node" {
  interface StyleOptions {
    font?: {
      bold?: boolean;
      size?: number;
      color?: string;
    };
  }

  interface Cell {
    string(val: string): Cell;
    number(val: number): Cell;
    style(style: Style): Cell;
  }

  interface Worksheet {
    cell(row: number, col: number): Cell;
  }

  interface Style {
    // Style properties
  }

  interface Workbook {
    createStyle(options: StyleOptions): Style;
    addWorksheet(name: string): Worksheet;
    writeToBuffer(): Buffer;
  }

  export class Workbook implements Workbook {}
}
