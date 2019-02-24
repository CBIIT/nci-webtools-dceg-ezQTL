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
                  this.locuszoomBoxplotsData = res[0];
                  this.graph = this.locuszoomBoxplots(this.boxplotDataDetailed, this.locuszoomBoxplotsData);
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

  // getXData(boxplotData) {
  //   var xData = [];
  //   // var yData = [];
  //   for (var i = 0; i < boxplotData.length; i++) {
  //     xData.push(boxplotData[i]['Genotype']);
  //     // yData.push((Math.log2(boxplotData[i]['exp']) + 0.1) * -1.0);
  //   }
  //   // var xyData = [xData, yData];
  //   // return xyData;
  //   return xData;
  // }

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
    // var xData = this.getXData(boxplotData);
    var xData = ["0/0", "0/1", "1/1"];
    // console.log("xData");
    console.log(xData);
    var yData = this.getYData(boxplotData);
    // console.log("yData");
    // console.log(yData);

    console.log(info);

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
