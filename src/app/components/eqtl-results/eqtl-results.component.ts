import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results',
  templateUrl: './eqtl-results.component.html',
  styleUrls: ['./eqtl-results.component.css']
})

export class EqtlResultsComponent implements OnInit {

  message: Object;
  resultStatus: boolean;
  errorMessage: string;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentResultStatus.subscribe(resultStatus => this.resultStatus = resultStatus);
    this.data.currentErrorMessage.subscribe(errorMessage => this.errorMessage = errorMessage);
  }

}
