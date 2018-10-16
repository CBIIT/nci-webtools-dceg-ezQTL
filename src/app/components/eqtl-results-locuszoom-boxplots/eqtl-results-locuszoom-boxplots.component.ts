import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { PopoverData } from '../eqtl-results-locuszoom/eqtl-results-locuszoom.component';


@Component({
  selector: 'app-eqtl-results-locuszoom-boxplots',
  templateUrl: './eqtl-results-locuszoom-boxplots.component.html',
  styleUrls: ['./eqtl-results-locuszoom-boxplots.component.css']
})
export class EqtlResultsLocuszoomBoxplotsComponent implements OnInit {

  boxplotData: Object;

  constructor(@Inject(MAT_DIALOG_DATA) public data: PopoverData) {
      console.log(data);
      this.boxplotData = data;
    }

  ngOnInit() {
  }

  // close() {
  //   this.dialogRef.close();
  // }

}
