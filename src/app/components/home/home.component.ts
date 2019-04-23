import { Component, OnInit } from '@angular/core';
import * as Plotly from 'plotly.js/dist/plotly.js';
import { Config, Data, Layout } from 'plotly.js/dist/plotly.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // var data = [{
    //   x: [1, 2, 3, 4, 5],
    //   y: [1, 2, 4, 8, 16] }];

    // var layout = {
    //   margin: { t: 0 } };

    // var TESTER = document.getElementById('tester');
    // Plotly.plot(TESTER, data, layout);
  }

}