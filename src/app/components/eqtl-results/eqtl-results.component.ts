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

  public graph = {
      data: [
          { x: [1, 2, 3], y: [2, 6, 3], type: 'scatter', mode: 'lines+points', marker: {color: 'red'} },
          { x: [1, 2, 3], y: [2, 5, 3], type: 'bar' },
      ],
      layout: {width: 1000, height: 600, title: 'A Fancy Plot'}
  };

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
