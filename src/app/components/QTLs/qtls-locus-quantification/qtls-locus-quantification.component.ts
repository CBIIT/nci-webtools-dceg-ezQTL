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
  selectedSort: string;
  selectedSortOrder: string;
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
            this.locusQuantificationData = mainData["locus_quantification"]["data"][0]; // gene quantification data
            this.locusQuantificationHeatmapData = mainData["locus_quantification_heatmap"]["data"][0]; // gene quantification heatmap data
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
                this.warningMessage = 'Data files contain ' + this.totalNumGenes + ' genes. Only top 30 gene quantifications with most significant p-values will be displayed.';
              }
            }
            this.selectedScale = "linear";
            this.selectedSort = "pvalue";
            this.selectedSortOrder = "asc";
            if (this.locusQuantificationData[0] && this.locusQuantificationHeatmapData[0]) {
              this.locusQuantificationViolinBoxPlot(this.locusQuantificationData, this.geneSymbols, this.selectedScale, this.selectedSort, this.selectedSortOrder);
              this.locusQuantificationHeatmap(this.locusQuantificationHeatmapData, this.selectedScale);
            }
          }
        });
      }
    });
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

  getMedian(data) {
    var sortedData = data.sort(function(a, b) {
      return a - b;
    });
    // console.log("sortedData", sortedData);
    var half = Math.floor(sortedData.length / 2.0);
    // console.log("half", half);
    if (sortedData.length % 2 == 1) {
      // console.log("median odd", sortedData[half]);
      return sortedData[half];
    }
    else {
      // console.log("median even", (sortedData[half - 1] + sortedData[half]) / 2.0);
      return (sortedData[half - 1] + sortedData[half]) / 2.0;
    }
  }

  compareMedian(a, b) {
    return a[0] - b[0];
  }

  sortMedian(xData, yData, sortOrder) {
    var dataSorted = [];
    for ( var i = 0; i < xData.length; i ++) {
      var geneData = [this.getMedian(yData[i])].concat([xData[i]].concat(yData[i]));
      dataSorted.push(geneData);
    }
    dataSorted = dataSorted.sort(this.compareMedian);
    if (sortOrder == "desc") {
      dataSorted = dataSorted.reverse();
    }
    return dataSorted;
  }

  locusQuantificationViolinBoxPlot(geneData, xData, scale, sort, sortOrder) {
    // var yData = this.getGeneYDataLog(geneData, xData);
    if (scale == "log") {
      var yData = this.getGeneYDataLog(geneData, xData);
    } else {
      var yData = this.getGeneYDataLinear(geneData, xData);
    }
    // console.log(yData);
    var pdata = [];
    // if (sortOrder == "asc" || sortOrder == "desc") {
    if (sort == "median") {
      var dataSorted = this.sortMedian(xData, yData, sortOrder);
      // console.log(dataSorted);
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
      if (sortOrder == "asc") {
        var yDataSorted = yData;
        var xDataSorted = xData;
        // console.log("yData", yDataSorted);
        // console.log("xData", xDataSorted);
      } else {
        var yDataSorted = yData.reverse();
        var xDataSorted = xData.reverse();
        // console.log("yData", yDataSorted);
        // console.log("xData", xDataSorted);
      }
      for ( var i = 0; i < xData.length; i ++ ) {
        var result = {
          type: 'violin',
          y: yDataSorted[i],
          name: xDataSorted[i],
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
          // title: (scale == "log") ? "Gene Expressions (log2)" : "Gene Expressions",
          title: "Trait Quantification",
          autorange: true,
          automargin: true,
          showgrid: true,
          zeroline: true,
          // dtick: 4,
          gridwidth: 1,
        },
        xaxis: {
          showticklabels: true,
          tickangle: 45
        },
        margin: {
          l: 40,
          r: 25,
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

  getHeatmapZLog(geneHeatmapData, xData) {
    var exp = [];
    for (var x = 0; x < geneHeatmapData.length; x++) {
      var row = [];
      for (var y = 0; y < xData.length; y++) {
        // console.log(geneHeatmapData[x][xData[y]]);
        row.push(Math.log2(geneHeatmapData[x][xData[y]] + 0.1));
      }
      exp.push(row);
    }
    return exp;
  }

  getHeatmapZLinear(geneHeatmapData, xData) {
    var exp = [];
    for (var x = 0; x < geneHeatmapData.length; x++) {
      var row = [];
      for (var y = 0; y < xData.length; y++) {
        // console.log(geneHeatmapData[x][xData[y]]);
        row.push(geneHeatmapData[x][xData[y]]);
      }
      exp.push(row);
    }
    return exp;
  }

  locusQuantificationHeatmap(geneHeatmapData, scale) {
    // console.log(geneHeatmapData);
    var xData = this.getHeatmapX(geneHeatmapData);
    // console.log("xData", xData);
    var yData = this.getHeatmapY(geneHeatmapData);
    // console.log("yData", yData);
    if (scale == "log") {
      var zData = this.getHeatmapZLog(geneHeatmapData, xData);
      // console.log("zData Log", zData);
    } else {
      var zData = this.getHeatmapZLinear(geneHeatmapData, xData);
      // console.log("zData Linear", zData);
    }
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
    this.heatmap = { 
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

  triggerReplot() {
    // console.log("scale:", this.selectedScale);
    // console.log("median sort:", this.selectedSort);
    // console.log("sort order:", this.selectedSortOrder);
    var limitedGeneSymbols = this.geneSymbols.slice(0,parseInt(this.selectNumGenes));
    this.locusQuantificationViolinBoxPlot(this.locusQuantificationData, limitedGeneSymbols, this.selectedScale, this.selectedSort, this.selectedSortOrder);
    this.locusQuantificationHeatmap(this.locusQuantificationHeatmapData, this.selectedScale);
  }

}
