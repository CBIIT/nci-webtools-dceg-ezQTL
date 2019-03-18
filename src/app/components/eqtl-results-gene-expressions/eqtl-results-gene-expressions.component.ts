import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results-gene-expressions',
  templateUrl: './eqtl-results-gene-expressions.component.html',
  styleUrls: ['./eqtl-results-gene-expressions.component.css']
})
export class EqtlResultsGeneExpressionsComponent implements OnInit {

  disableGeneExpressions: boolean;
  geneSymbols: string[];
  geneExpressionsData: Object;
  totalNumGenes: number;
  selectNumGenes: string;
  warningMessage: string;
  public graph = null;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => {
      this.disableGeneExpressions = disableGeneExpressions;
      if (!this.disableGeneExpressions) {
        this.data.currentMainData.subscribe(mainData => {
          if (mainData) {
            // this.geneSymbols = mainData["info"]["gene_symbols"][0]; // gene list
            this.geneSymbols = this.getGeneSymbols(mainData["info"]["gene_list"]["data"][0]); // get gene list symbols only
            this.geneExpressionsData = mainData["gene_expressions"]["data"][0]; // gene expression data
            if (this.geneSymbols) {
              this.totalNumGenes = this.geneSymbols.length;
              if (this.totalNumGenes > 15) {
                this.data.changeWarningMessage('Data files contain ' + this.totalNumGenes + ' genes. Only top 15 gene expressions with most significant p-values will be displayed.');
              }
            }
            if (this.geneExpressionsData) {
              this.graph = this.geneExpressionsBoxPlot(this.geneExpressionsData);
            }
          }
        });
        this.selectNumGenes = "15"; // default number of genes displayed
        this.data.currentWarningMessage.subscribe(warningMessage => {
          this.warningMessage = warningMessage;
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

  geneExpressionsBoxPlot(geneData) {
    var xData = this.geneSymbols;
    var yData = this.getGeneYData(geneData, xData);
    var pdata = [];

    for ( var i = 0; i < xData.length; i++ ) {
      var result = {
        type: 'box',
        y: yData[i],
        name: xData[i],
        boxpoints: 'all',
        jitter: 0.5,
        pointpos: 0,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        marker: {
          size: 4
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

    return { 
      data: pdata, 
      layout: playout, 
      config: {
        displaylogo: false, 
        modeBarButtonsToRemove: ["lasso2d", "hoverCompareCartesian"]
      } 
    };

  }

  replotExpressionsBoxPlot(geneData, xData) {

    var yData = this.getGeneYData(geneData, xData);

    var pdata = [];

    for ( var i = 0; i < xData.length; i ++ ) {
      var result = {
        type: 'box',
        y: yData[i],
        name: xData[i],
        boxpoints: 'all',
        jitter: 0.5,
        pointpos: 0,
        whiskerwidth: 0.2,
        fillcolor: 'cls',
        marker: {
          size: 4
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
    // var limitedGeneSymbols = this.getGeneSymbols(this.mainData).slice(0,parseInt(this.selectNumGenes));
    var limitedGeneSymbols = this.geneSymbols.slice(0,parseInt(this.selectNumGenes));
    this.replotExpressionsBoxPlot(this.geneExpressionsData, limitedGeneSymbols);
  }

}
