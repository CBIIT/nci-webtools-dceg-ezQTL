import { Component, OnInit } from '@angular/core';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import * as PlotlyJS from 'plotly.js/dist/plotly.js';
import { PlotlyModule } from 'angular-plotly.js';

PlotlyModule.plotlyjs = PlotlyJS;
declare let $: any;

@NgModule({
  imports: [CommonModule, PlotlyModule],
})

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // this.graphBasic();
  }

  // graphBasic() {
  //   var data = [
  //     { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
  //     { x: [1, 2, 3], y: [2, 5, 3], type: 'scatter', mode: 'markers', 
  //       marker: {
  //         size: 40,
  //         opacity: 1.0
  //       } 
  //     },
  //   ];
    
  //   var layout = {
  //     width: 1000, 
  //     height: 800, 
  //     title: 'A Fancy Plot'
  //   };
  
  //   PlotlyJS.newPlot("basic", data, layout);
  //   PlotlyJS.moveTraces("basic", 1);
  //   var myPlot = $('#basic')[0];
  //   // let myPlot = document.getElementById("basic");
  //   myPlot.on('plotly_click', function(data){
  //     console.log(data);
  //   });
  // }
  
  // clickPoint(event) {
  //   console.log(event);
  // }

}