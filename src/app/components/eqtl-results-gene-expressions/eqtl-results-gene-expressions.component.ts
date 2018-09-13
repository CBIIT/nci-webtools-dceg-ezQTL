import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results-gene-expressions',
  templateUrl: './eqtl-results-gene-expressions.component.html',
  styleUrls: ['./eqtl-results-gene-expressions.component.css']
})
export class EqtlResultsGeneExpressionsComponent implements OnInit {

  message: Object;
  public graph = null;;

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

  exampleBoxPlot(geneData) {
    var xData = ['Carmelo<br>Anthony', 'Dwyane<br>Wade',
      'Deron<br>Williams', 'Brook<br>Lopez',
      'Damian<br>Lillard', 'David<br>West',
      'Blake<br>Griffin', 'David<br>Lee',
      'Demar<br>Derozan'];

    var x1Data = this.getGeneSymbols(geneData);
    console.log(x1Data);

    var yData = [
      this.getrandom(10 ,10),
      this.getrandom(30, 20),
      this.getrandom(30, 25),
      this.getrandom(30, 40),
      this.getrandom(30, 45),
      this.getrandom(30, 30),
      this.getrandom(30, 20),
      this.getrandom(30, 15),
      this.getrandom(30, 43)
    ];

    // var colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];

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
        title: 'Points Scored by the Top 9 Scoring NBA Players in 2012',
        width: 1000,
        height: 600,
        yaxis: {
          title: "Gene Expressions (log2)",
          autorange: true,
          showgrid: true,
          zeroline: true,
          dtick: 5,
          gridcolor: 'rgb(255, 255, 255)',
          gridwidth: 1,
          zerolinecolor: 'rgb(255, 255, 255)',
          zerolinewidth: 2
        },
        margin: {
          l: 40,
          r: 30,
          b: 80,
          t: 100
        },
        // paper_bgcolor: 'rgb(243, 243, 243)',
        // plot_bgcolor: 'rgb(243, 243, 243)',
        showlegend: false
    };

    return { data: pdata, layout: playout };

  }


}
