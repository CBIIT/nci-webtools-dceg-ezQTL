import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results',
  templateUrl: './eqtl-results.component.html',
  styleUrls: ['./eqtl-results.component.css']
})

export class EqtlResultsComponent implements OnInit {

  eqtlData: Object;
  resultStatus: boolean;
  errorMessage: string;
  disableGeneExpressions: boolean;
  selectedTab: number;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentEqtlData.subscribe(eqtlData => this.eqtlData = eqtlData);
    this.data.currentResultStatus.subscribe(resultStatus => this.resultStatus = resultStatus);
    this.data.currentErrorMessage.subscribe(errorMessage => this.errorMessage = errorMessage);
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => this.disableGeneExpressions = disableGeneExpressions);
    this.data.currentSelectedTab.subscribe(selectedTab => this.selectedTab = selectedTab);
  }

}
