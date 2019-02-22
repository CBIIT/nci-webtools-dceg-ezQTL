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

  disableGeneExpressions: boolean;

  boxplotData: Object;
  mainData: Object;
  boxplotDataDetailed: Object;

  locuszoomBoxplotsData: Object;

  public graph = null;

  constructor(private data: EqtlResultsService, @Inject(MAT_DIALOG_DATA) public popoverData: PopoverData) {
      this.boxplotData = popoverData;
    }

  ngOnInit() {
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => {
      this.disableGeneExpressions = disableGeneExpressions;
      if (!this.disableGeneExpressions) {
        this.data.currentMainData.subscribe(mainData => {
          if (mainData) {
            this.mainData = mainData[2];
            this.boxplotDataDetailed = this.mainData[this.boxplotData['point_index']]

            this.data.calculateLocuszoomBoxplots(this.boxplotDataDetailed)
              .subscribe(
                res => { 
                  this.locuszoomBoxplotsData = res[0] 
                },
                error => this.handleError(error)
              )
          }
        });
      }
    });
  }

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

}
