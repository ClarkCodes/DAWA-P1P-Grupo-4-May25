// home.component.ts
import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

export interface Tile {
  cols: number;
  rows: number;
  text?: string; // Optional, as not used in HTML
  color?: string; // Optional, as not used in HTML
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatGridListModule],
  template: `
    <mat-grid-list cols="4" rowHeight="300">
      @for (item of list; track item; let index = $index) {
        <mat-grid-tile
          [rowspan]="item.rows"
          [colspan]="item.cols"
          style="background-color: royalblue;">
          <img
            src="https://picsum.photos/200/{{300 + index}}"
            alt=""
            style="object-fit: cover; width: 100%; height: 100%;">
        </mat-grid-tile>
      }
    </mat-grid-list>
  `,
  styles: []
})
export class HomeComponent {
  list: Tile[] = [
    { cols: 3, rows: 1 },
    { cols: 1, rows: 2 },
    { cols: 1, rows: 1 },
    { cols: 2, rows: 1 }
  ];
}