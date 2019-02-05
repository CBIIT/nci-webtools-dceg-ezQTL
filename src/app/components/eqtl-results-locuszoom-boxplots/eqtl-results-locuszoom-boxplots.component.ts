import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material";
import { PopoverData } from '../eqtl-results-locuszoom/eqtl-results-locuszoom.component';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results-locuszoom-boxplots',
  templateUrl: './eqtl-results-locuszoom-boxplots.component.html',
  styleUrls: ['./eqtl-results-locuszoom-boxplots.component.css']
})
export class EqtlResultsLocuszoomBoxplotsComponent implements OnInit {

  boxplotData: Object;
  eqtlData: Object;
  boxplotDataDetailed: Object;

  public graph = null;

  constructor(private data: EqtlResultsService, @Inject(MAT_DIALOG_DATA) public popoverData: PopoverData) {
      this.boxplotData = popoverData;
    }

  ngOnInit() {
    this.data.currentEqtlData.subscribe(eqtlData => {
      if (eqtlData) {
        this.eqtlData = eqtlData[2];
        this.boxplotDataDetailed = this.eqtlData[this.boxplotData['point_index']]
      }
    });
  }


}
