import { Component, OnInit } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;

@NgModule({
    imports: [CommonModule, PlotlyModule],
})

@Component({
  selector: 'app-qtls-locus-quantification',
  templateUrl: './qtls-locus-quantification.component.html',
  styleUrls: ['./qtls-locus-quantification.component.css']
})
export class QTLsLocusQuanitificationComponent implements OnInit {

  disableLocusQuantification: boolean;
  geneSymbols: string[];
  locusQuantificationData: Object;
  locusQuantificationHeatmapData: Object;
  totalNumGenes: number;
  totalNumGenesArray: string[];
  selectNumGenes: string;
  selectedScale: string;
  selectedMedianSort: string;
  warningMessage: string;
  public graph = null;
  public heatmap = null;

  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.data.currentLocusQuantification.subscribe(disableLocusQuantification => {
      this.disableLocusQuantification = disableLocusQuantification;
      if (!this.disableLocusQuantification) {
        this.data.currentMainData.subscribe(mainData => {
          if (mainData) {
            // this.geneSymbols = mainData["info"]["gene_symbols"][0]; // gene list
            this.geneSymbols = this.getGeneSymbols(mainData["info"]["gene_list"]["data"][0]); // get gene list symbols only
            this.locusQuantificationData = mainData["locus_quantification"]["data"][0]; // gene expression data
            this.locusQuantificationHeatmapData = mainData["locus_quantification_heatmap"]["data"][0]; // gene expression heatmap data
            if (this.geneSymbols) {
              this.totalNumGenes = this.geneSymbols.length;
              this.selectNumGenes = this.totalNumGenes.toString(); // default number of genes displayed
              this.totalNumGenesArray = [];
              for(var i = 1; i <= this.totalNumGenes; i++) {
                this.totalNumGenesArray.push(i.toString());
              }
              if (this.totalNumGenes > 30) {
                this.selectNumGenes = "30";
                this.totalNumGenesArray = this.totalNumGenesArray.slice(0, 30);
                // this.data.changeWarningMessage('Data files contain ' + this.totalNumGenes + ' genes. Only top 30 gene expressions with most significant p-values will be displayed.');
                this.warningMessage = 'Data files contain ' + this.totalNumGenes + ' genes. Only top 30 gene expressions with most significant p-values will be displayed.';
              }
            }
            if (this.locusQuantificationData[0] && this.locusQuantificationHeatmapData[0]) {
              this.graph = this.locusQuantificationViolinBoxPlot(this.locusQuantificationData);
              // this.locusQuantificationViolinBoxPlot(this.locusQuantificationData);
              this.heatmap = this.locusQuantificationHeatmap(this.locusQuantificationHeatmapData);
              // this.locusQuantificationHeatmap(this.locusQuantificationHeatmapData);
            }
            this.selectedScale = "log"
          }
        });
        // this.selectNumGenes = "15"; // default number of genes displayed
        // this.data.currentWarningMessage.subscribe(warningMessage => {
        //   this.warningMessage = warningMessage;
        // });
      }
    });
  }

  getHeatmapX(geneHeatmapData) {
    var samples = [];
    var firstObject = geneHeatmapData[0];
    var geneHeatmapDataKeys = Object.keys(firstObject);
    for(var i = 0; i < geneHeatmapDataKeys.length; i++) {
      if (geneHeatmapDataKeys[i] != "gene_symbol") {
        samples.push(geneHeatmapDataKeys[i]);
      }
    }
    return samples;
  }

  getHeatmapY(geneHeatmapData) {
    var geneSymbols = [];
    for (var i = 0; i < geneHeatmapData.length; i++) {
      geneSymbols.push(geneHeatmapData[i]['gene_symbol']);
    }
    return geneSymbols;
  }

  getHeatmapZ(geneHeatmapData, xData) {
    var exp = [];
    for (var x = 0; x < geneHeatmapData.length; x++) {
      var row = [];
      for (var y = 0; y < xData.length; y++) {
        row.push(Math.log2(geneHeatmapData[x][xData[y]] + 0.1));
      }
      exp.push(row);
    }
    return exp;
  }

  locusQuantificationHeatmap(geneHeatmapData) {
    // console.log(geneHeatmapData);
    var xData = this.getHeatmapX(geneHeatmapData);
    // console.log("xData", xData);
    var yData = this.getHeatmapY(geneHeatmapData);
    // console.log("yData", yData);
    var zData = this.getHeatmapZ(geneHeatmapData, xData);
    // console.log("zData", zData);
    var pdata = [
      {
        x: xData,
        y: yData,
        z: zData,
        type: 'heatmap',
        colorscale: "Viridis",
        showscale: false
      }
    ];
    var playout = {
        width: 900,
        height: 800,
        yaxis: {
          side: "right",
          tickangle: 35
        },
        xaxis: {
          showticklabels: false
        },
        margin: {
          r: 100
        },
        showlegend: false
    };
    return { 
      data: pdata, 
      layout: playout, 
      config: {
        displaylogo: false, 
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_quantification_heatmap',
          width: 900,
          height: 800,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      } 
    };
    // var pconfig = {
    //   displaylogo: false, 
    //   modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"],
    //   toImageButtonOptions: {
    //     format: 'svg', // one of png, svg, jpeg, webp
    //     filename: 'locus_quantification_heatmap',
    //     width: 900,
    //     height: 800,
    //     scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    //   }
    // };
    // PlotlyJS.newPlot("qtls-locus-quantification-heatmap", pdata, playout, pconfig);
  }

  getGeneSymbols(geneList) {
    var geneSymbols = [];
    for (var i = 0; i < geneList.length; i++) {
      geneSymbols.push(geneList[i]['gene_symbol']);
    }
    return geneSymbols;
  }

  getGeneYDataLog(geneData, xData) {
    var yData = [];
    for (var i = 0; i < xData.length; i++) {
      var tmp = [];
      for (var j = 0; j < geneData.length; j++) {
        if (xData[i] == geneData[j]['gene_symbol']) {
          tmp.push(Math.log2(geneData[j]['exp']) + 0.1);
        } 
      }
      yData.push(tmp);
    }
    return yData;
  }

  getGeneYDataLinear(geneData, xData) {
    var yData = [];
    for (var i = 0; i < xData.length; i++) {
      var tmp = [];
      for (var j = 0; j < geneData.length; j++) {
        if (xData[i] == geneData[j]['gene_symbol']) {
          tmp.push(geneData[j]['exp']);
        } 
      }
      yData.push(tmp);
    }
    return yData;
  }

  locusQuantificationViolinBoxPlot(geneData) {
    var xData = this.geneSymbols;
    var yData = this.getGeneYDataLog(geneData, xData);
    var pdata = [];
    for ( var i = 0; i < xData.length; i++ ) {
      var result = {
        type: 'violin',
        y: yData[i],
        name: xData[i],
        box: {
          visible: true
        }, 
        points: 'all',
        jitter: 0.5,
        pointpos: 0,
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
        yaxis: {
          title: "Gene Expressions (log2)",
          autorange: true,
          showgrid: true,
          zeroline: true,
          // dtick: 4,
          gridwidth: 1
        },
        margin: {
          l: 40,
          r: 15,
          b: 80,
          t: 40
        },
        showlegend: false
    };
    return { 
      data: pdata, 
      layout: playout, 
      config: {
        displaylogo: false, 
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_quantification_gene_expressions',
          width: 1000,
          height: 600,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      } 
    };
    // var pconfig = {
    //   displaylogo: false, 
    //   modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"],
    //   toImageButtonOptions: {
    //     format: 'svg', // one of png, svg, jpeg, webp
    //     filename: 'locus_quantification_gene_expressions',
    //     width: 1000,
    //     height: 600,
    //     scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    //   }
    // };
    // PlotlyJS.newPlot("qtls-locus-quantification-plot", pdata, playout, pconfig);
  }

  getMedian(data) {
    data.sort(function(a,b){
      return a - b;
    });
    var half = Math.floor(data.length / 2);
    if (data.length % 2)
      return data[half];
    else
      return (data[half - 1] + data[half]) / 2.0;
  }

  compareMedian(a, b) {
    return a[0] - b[0];
  }

  sortMedian(xData, yData, medianSort) {
    var dataSorted = [];
    for ( var i = 0; i < xData.length; i ++) {
      var geneData = [this.getMedian(yData[i])].concat([xData[i]].concat(yData[i]));
      dataSorted.push(geneData);
    }
    // console.log("before sort:", dataSorted);
    dataSorted = dataSorted.sort(this.compareMedian);
    if (medianSort == "desc") {
      dataSorted = dataSorted.reverse();
    }
    // console.log("after sort:", dataSorted);
    return dataSorted;
  }

  replotExpressionsViolinBoxPlot(geneData, xData, scale, medianSort) {
    // var yData = this.getGeneYDataLog(geneData, xData);
    if (scale == "log") {
      var yData = this.getGeneYDataLog(geneData, xData);
    } else {
      var yData = this.getGeneYDataLinear(geneData, xData);
    }
    // console.log(yData);
    var pdata = [];
    if (medianSort == "asc" || medianSort == "desc") {
      var dataSorted = this.sortMedian(xData, yData, medianSort);
      for ( var i = 0; i < xData.length; i ++ ) {
        var resultSorted = {
          type: 'violin',
          y: dataSorted[i].slice(2, dataSorted[i].length),
          name: dataSorted[i][1],
          box: {
            visible: true
          }, 
          points: 'all',
          jitter: 0.5,
          pointpos: 0,
          fillcolor: 'cls',
          marker: {
            size: 2
          },
          line: {
            width: 1
          }
        };
        pdata.push(resultSorted);
      };
    } else {
      for ( var i = 0; i < xData.length; i ++ ) {
        var result = {
          type: 'violin',
          y: yData[i],
          name: xData[i],
          box: {
            visible: true
          }, 
          points: 'all',
          jitter: 0.5,
          pointpos: 0,
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
    }
    var playout = {
        width: 1000,
        height: 600,
        yaxis: {
          title: (scale == "log") ? "Gene Expressions (log2)" : "Gene Expressions",
          autorange: true,
          showgrid: true,
          zeroline: true,
          // dtick: 4,
          gridwidth: 1
        },
        margin: {
          l: 40,
          r: 10,
          b: 80,
          t: 40
        },
        showlegend: false
    };
    this.graph = { 
      data: pdata, 
      layout: playout, 
      config: {
        displaylogo: false, 
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"],
        toImageButtonOptions: {
          format: 'svg', // one of png, svg, jpeg, webp
          filename: 'locus_quantification_gene_expressions',
          width: 1000,
          height: 600,
          scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
        }
      } 
    };
    // var pconfig = {
    //   displaylogo: false, 
    //   modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"],
    //   toImageButtonOptions: {
    //     format: 'svg', // one of png, svg, jpeg, webp
    //     filename: 'locus_quantification_gene_expressions',
    //     width: 1000,
    //     height: 600,
    //     scale: 1 // Multiply title/legend/axis/canvas sizes by this factor
    //   }
    // } 
    // PlotlyJS.react("qtls-locus-quantification-plot", pdata, playout, pconfig);
  }

  triggerReplot() {
    // console.log("scale:", this.selectedScale);
    // console.log("median sort:", this.selectedMedianSort);
    var limitedGeneSymbols = this.geneSymbols.slice(0,parseInt(this.selectNumGenes));
    this.replotExpressionsViolinBoxPlot(this.locusQuantificationData, limitedGeneSymbols, this.selectedScale, this.selectedMedianSort);
  }

  resetSort() {
    // console.log("reset sort");
    this.selectedMedianSort = "";
    // console.log("scale:", this.selectedScale);
    // console.log("median sort:", this.selectedMedianSort);
    var limitedGeneSymbols = this.geneSymbols.slice(0,parseInt(this.selectNumGenes));
    this.replotExpressionsViolinBoxPlot(this.locusQuantificationData, limitedGeneSymbols, this.selectedScale, this.selectedMedianSort);
  }

}
