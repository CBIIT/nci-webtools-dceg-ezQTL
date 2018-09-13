import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results',
  templateUrl: './eqtl-results.component.html',
  styleUrls: ['./eqtl-results.component.css']
})

export class EqtlResultsComponent implements OnInit {

  message: Object;
  resultsStatus: boolean;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentresultsStatus.subscribe(resultsStatus => this.resultsStatus = resultsStatus);
  }

}
