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
  locuszoomData: Object;
  boxplotDataDetailed: Object;
  locuszoomBoxplotsData: Object;
  expressionFile: string;
  genotypeFile: string;

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
            this.expressionFile = mainData["info"]["inputs"]["expression_file"][0]; // expression filename
            this.genotypeFile = mainData["info"]["inputs"]["genotype_file"][0]; // genotype filename
            this.locuszoomData = mainData["locuszoom"]["data"][0]; // locuszoom data
            this.boxplotDataDetailed = this.locuszoomData[this.boxplotData['point_index']];
            if (this.expressionFile != 'false' && this.genotypeFile != 'false') {
              this.data.calculateLocuszoomBoxplots(this.expressionFile, this.genotypeFile, this.boxplotDataDetailed)
              .subscribe(
                res => { 
                  this.locuszoomBoxplotsData = res["locuszoom_boxplots"]["data"][0];
                  if (this.locuszoomBoxplotsData) {
                    this.graph = this.locuszoomBoxplots(this.boxplotDataDetailed, this.locuszoomBoxplotsData);
                  }
                },
                error => this.handleError(error)
              );
            }
          }
        });
      }
    });
  }

  handleError(error) {
    console.log(error);
    var errorTrimmed = error.error.trim().split('\n');
    var errorMessage = errorTrimmed[2];
    console.log(errorMessage);
    this.data.changeErrorMessage(errorMessage);
  }

  getYData(boxplotData) {
    var a0a0 = [];
    var a0a1 = [];
    var a1a1 = [];
    for (var i = 0; i < boxplotData.length; i++) {
      if (boxplotData[i]['Genotype'] == "0/0") {
        a0a0.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
      } 
      if (boxplotData[i]['Genotype'] == "0/1") {
        a0a1.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
      } 
      if (boxplotData[i]['Genotype'] == "1/1") {
        a1a1.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
      } 
  }
    var yData = [a0a0, a0a1, a1a1];
    return yData;
  }

  // x: genotype, y: -log2(exp) + 0.1
  locuszoomBoxplots(info, boxplotData) {
    var xData = ["0/0", "0/1", "1/1"];
    var yData = this.getYData(boxplotData);

    var pdata = [];

    for ( var i = 0; i < xData.length; i++ ) {
      var result = {
        type: 'box',
        y: yData[i],
        name: xData[i],
        boxpoints: 'all',
        jitter: 0.5,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        marker: {
          size: 2
        },
        line: {
          width: 1
        }
      };
      pdata.push(result);
    };

    var playout = {
        width: 1000,
        height: 600,
        xaxis: {
          title: info['rsnum'] + " genotype: " + info['ref'] + "->" + info['alt']
        },
        yaxis: {
          title: info['gene_symbol'] + " mRNA expression (log2)",
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: 4,
          gridwidth: 1
        },
        margin: {
          l: 40,
          r: 10,
          b: 80,
          t: 40
        },
        showlegend: true,
        legend: { "orientation": "h" }
    };

    return { 
      data: pdata, 
      layout: playout, 
      config: {
        displaylogo: false, 
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"]
      } 
    };

  }

}
