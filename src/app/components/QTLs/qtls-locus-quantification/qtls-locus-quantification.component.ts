import { Component, OnInit } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';


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
              this.heatmap = this.locusQuantificationHeatmap(this.locusQuantificationHeatmapData);
            }
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

    // var pdata = [
    //   {
    //     z: [[1, 20, 30, 50, 1], [20, 1, 60, 80, 30], [30, 60, 1, -10, 20]],
    //     x: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    //     y: ['Morning', 'Afternoon', 'Evening'],
    //     type: 'heatmap',
    //     colorscale: "Viridis",
    //     showscale: false
    //   }
    // ];

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
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"]
      } 
    };
  }

  getGeneSymbols(geneList) {
    var geneSymbols = [];
    for (var i = 0; i < geneList.length; i++) {
      geneSymbols.push(geneList[i]['gene_symbol']);
    }
    return geneSymbols;
  }

  getGeneYData(geneData, xData) {
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

  locusQuantificationViolinBoxPlot(geneData) {
    var xData = this.geneSymbols;
    var yData = this.getGeneYData(geneData, xData);
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
          dtick: 4,
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
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"]
      } 
    };

  }

  replotExpressionsViolinBoxPlot(geneData, xData) {

    var yData = this.getGeneYData(geneData, xData);

    var pdata = [];

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

    var playout = {
        width: 1000,
        height: 600,
        yaxis: {
          title: "Gene Expressions (log2)",
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
        showlegend: false
    };

    this.graph = { 
      data: pdata, 
      layout: playout, 
      config: {
        displaylogo: false, 
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"]
      } 
    };
  }

  triggerReplot() {
    var limitedGeneSymbols = this.geneSymbols.slice(0,parseInt(this.selectNumGenes));
    this.replotExpressionsViolinBoxPlot(this.locusQuantificationData, limitedGeneSymbols);
  }

}
