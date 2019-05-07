import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-results',
  templateUrl: './eqtl-results.component.html',
  styleUrls: ['./eqtl-results.component.css'], 
  encapsulation: ViewEncapsulation.None
})

export class EqtlResultsComponent implements OnInit {

  mainData: Object;
  resultStatus: boolean;
  errorMessage: string;
  disableGeneExpressions: boolean;
  selectedTab: number;
  blurLoad: boolean;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.data.currentMainData.subscribe(mainData => this.mainData = mainData);
    this.data.currentResultStatus.subscribe(resultStatus => this.resultStatus = resultStatus);
    this.data.currentErrorMessage.subscribe(errorMessage => this.errorMessage = errorMessage);
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => this.disableGeneExpressions = disableGeneExpressions);
    this.data.currentSelectedTab.subscribe(selectedTab => this.selectedTab = selectedTab);
    this.data.currentBlurLoad.subscribe(blurLoad => this.blurLoad = blurLoad);
  }

}
