import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results-gene-expressions',
  templateUrl: './eqtl-results-gene-expressions.component.html',
  styleUrls: ['./eqtl-results-gene-expressions.component.css']
})
export class EqtlResultsGeneExpressionsComponent implements OnInit {

  message: Object;
  public graph = null;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => {
      this.message = message;
      this.graph = this.exampleBoxPlot(this.message);
    });
  }

  getrandom(num , mul) {
    var value = [ ];	
    for(var i = 0; i < num; i++) {
      var rand = Math.random() * mul;
      value.push(rand);
    }
    return value;
  }

  getGeneSymbols(geneData) {
    function getUnique(value, index, self) { 
        return self.indexOf(value) === index;
    }
    var genes = [];
    for (var i = 0; i < geneData.length; i++) {
      genes.push(geneData[i]['gene_symbol']);
    }
    var uniqueGenes = genes.filter(getUnique);
    return uniqueGenes;
  }

  getGeneYData(geneData, xData) {
    var yData = [];
    for (var i = 0; i <xData.length; i++) {
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

  exampleBoxPlot(geneData) {

    var xData = this.getGeneSymbols(geneData);
    console.log(xData);

    var yData = this.getGeneYData(geneData, xData);
    console.log(yData);

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
        // title: 'Gene Expressions',
        width: 1000,
        height: 600,
        yaxis: {
          title: "Gene Expressions (log2)",
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: 4,
          // gridcolor: 'rgb(255, 255, 255)',
          gridwidth: 1
          // zerolinecolor: 'rgb(255, 255, 255)',
          // zerolinewidth: 2
        },
        margin: {
          l: 40,
          r: 10,
          b: 80,
          t: 40
        },
        // paper_bgcolor: 'rgb(243, 243, 243)',
        // plot_bgcolor: 'rgb(243, 243, 243)',
        showlegend: false
    };

    return { data: pdata, layout: playout, config: {displaylogo: false} };

  }


}
