import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results-gene-expressions',
  templateUrl: './eqtl-results-gene-expressions.component.html',
  styleUrls: ['./eqtl-results-gene-expressions.component.css']
})
export class EqtlResultsGeneExpressionsComponent implements OnInit {

  disableGeneExpressions: boolean;
  geneList: string[];
  eqtlData: Object;
  totalNumGenes: Number;
  selectNumGenes: string;
  warningMessage: string;
  public graph = null;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => {
      this.disableGeneExpressions = disableGeneExpressions;
      if (!this.disableGeneExpressions) {
        this.data.currentEqtlData.subscribe(eqtlData => {
          if (eqtlData) {
            this.geneList = eqtlData[0];
            this.eqtlData = eqtlData[1];
          }
          if (this.geneList) {
            this.totalNumGenes = this.geneList.length;
            if (this.totalNumGenes > 15) {
              this.data.changeWarningMessage('Data files contain ' + this.totalNumGenes + ' genes. Only top 15 gene expressions with most significant p-values will be displayed.');
            }
          }
          if (this.eqtlData) {
            // this.data.currentGeneList.subscribe(geneList => this.geneList = geneList);
            this.graph = this.geneExpressionsBoxPlot(this.eqtlData);
          }
        });
        this.selectNumGenes = "15"; // default number of genes displayed
        this.data.currentWarningMessage.subscribe(warningMessage => {
          this.warningMessage = warningMessage;
        });
      }
    });
  }

  // getGeneSymbols(geneData) {
  //   function getUnique(value, index, self) { 
  //       return self.indexOf(value) === index;
  //   }
  //   var genes = [];
  //   for (var i = 0; i < geneData.length; i++) {
  //     genes.push(geneData[i]['gene_symbol']);
  //   }
  //   var uniqueGenes = genes.filter(getUnique);
  //   this.totalNumGenes = uniqueGenes.length;
  //   if (this.totalNumGenes > 15) {
  //     this.data.changeWarningMessage('Data files contain ' + this.totalNumGenes + ' genes. Only top 15 gene expressions with most significant p-values will be displayed.');
  //   }
  //   // this.data.changeGeneList(uniqueGenes);
  //   return uniqueGenes;
  // }

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

    // var xData = this.getGeneSymbols(geneData);
    var xData = this.geneList;

    var yData = this.getGeneYData(geneData, xData);

    var pdata = [];

    for ( var i = 0; i < xData.length; i ++ ) {
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
    // var limitedGeneSymbols = this.getGeneSymbols(this.eqtlData).slice(0,parseInt(this.selectNumGenes));
    var limitedGeneSymbols = this.geneList.slice(0,parseInt(this.selectNumGenes));
    this.replotExpressionsBoxPlot(this.eqtlData, limitedGeneSymbols);
  }

}
