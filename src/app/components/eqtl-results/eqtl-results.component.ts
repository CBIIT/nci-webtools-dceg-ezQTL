import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';
import { FormControl, Validators } from '@angular/forms';

export interface Gene {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-eqtl-results',
  templateUrl: './eqtl-results.component.html',
  styleUrls: ['./eqtl-results.component.css']
})

export class EqtlResultsComponent implements OnInit {

  message: string;
  resultsStatus: boolean;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentresultsStatus.subscribe(resultsStatus => this.resultsStatus = resultsStatus);
  }

  getrandom(num , mul) {
    var value = [ ]	
    for(var i=0;i<=num;i++) {
    var rand = Math.random() * mul;
      value.push(rand);
    }
    return value
  }

  exampleBoxPlot() {
    var xData = ['Carmelo<br>Anthony', 'Dwyane<br>Wade',
      'Deron<br>Williams', 'Brook<br>Lopez',
      'Damian<br>Lillard', 'David<br>West',
      'Blake<br>Griffin', 'David<br>Lee',
      'Demar<br>Derozan'];

    var yData = [
      this.getrandom(30 ,10),
      this.getrandom(30, 20),
      this.getrandom(30, 25),
      this.getrandom(30, 40),
      this.getrandom(30, 45),
      this.getrandom(30, 30),
      this.getrandom(30, 20),
      this.getrandom(30, 15),
      this.getrandom(30, 43)
    ];

    var colors = ['rgba(93, 164, 214, 0.5)', 'rgba(255, 144, 14, 0.5)', 'rgba(44, 160, 101, 0.5)', 'rgba(255, 65, 54, 0.5)', 'rgba(207, 114, 255, 0.5)', 'rgba(127, 96, 0, 0.5)', 'rgba(255, 140, 184, 0.5)', 'rgba(79, 90, 117, 0.5)', 'rgba(222, 223, 0, 0.5)'];

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
        paper_bgcolor: 'rgb(243, 243, 243)',
        plot_bgcolor: 'rgb(243, 243, 243)',
        showlegend: false
    };

    return { data: pdata, layout: playout };

        // Plotly.newPlot('myDiv', data, layout);  
  }

  // { pdata, layout } = this.exampleBoxPlot();

  public graph = this.exampleBoxPlot();

  // private x = ['day 1', 'day 2', 'day 1', 'day 2', 'day 1', 'day 2',
  //       'day 1', 'day 2', 'day 1', 'day 2', 'day 1', 'day 2'];

  // public graph = {
  //   data: [
  //     {
  //       y: [0.2, 0.2, 0.6, 1.0, 0.5, 0.4, 0.2, 0.7, 0.9, 0.1, 0.5, 0.3],
  //       x: this.x,
  //       name: 'kale',
  //       marker: { color: '#3D9970' },
  //       type: 'box'
  //     },
  //     {
  //         y: [0.6, 0.7, 0.3, 0.6, 0.0, 0.5, 0.7, 0.9, 0.5, 0.8, 0.7, 0.2],
  //         x: this.x,
  //         name: 'radishes',
  //         marker: { color: '#FF4136' },
  //         type: 'box'
  //     },
  //     {
  //         y: [0.1, 0.3, 0.1, 0.9, 0.6, 0.6, 0.9, 1.0, 0.3, 0.6, 0.8, 0.5],
  //         x: this.x,
  //         name: 'carrots',
  //         marker: { color: '#FF851B' },
  //         type: 'box'
  //     }
  //   ],
  //   layout: {
  //       title: 'Gene Expressions',
  //       width: 1000,
  //       height: 600,
  //       yaxis: {
  //           title: 'Gene Expression (log2)',
  //           zeroline: false
  //       }
  //       // xaxis: {
  //       //     title: 'Genes',
  //       //     zeroline: false
  //       // },
  //       // boxmode: 'group'
  //   }
  // };

  geneControl = new FormControl('', [Validators.required]);
  genes: Gene[] = [
    {value: 'gene-0', viewValue: 'NBPF20'},
    {value: 'gene-1', viewValue: 'NBPF21'},
    {value: 'gene-2', viewValue: 'NBPF22'},
    {value: 'gene-3', viewValue: 'NBPF23'},
    {value: 'gene-4', viewValue: 'NBPF24'},
    {value: 'gene-5', viewValue: 'NBPF25'},
  ];

}
