import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';


@Component({
  selector: 'app-qtls-results',
  templateUrl: './qtls-results.component.html',
  styleUrls: ['./qtls-results.component.css'], 
  encapsulation: ViewEncapsulation.None
})

export class QTLsResultsComponent implements OnInit {

  mainData: Object;
  resultStatus: boolean;
  errorMessage: string;
  disableLocusColocalization: boolean;
  disableLocusQuantification: boolean;
  selectedTab: number;
  blurLoad: boolean;

  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.data.currentMainData.subscribe(mainData => this.mainData = mainData);
    this.data.currentResultStatus.subscribe(resultStatus => this.resultStatus = resultStatus);
    this.data.currentErrorMessage.subscribe(errorMessage => this.errorMessage = errorMessage);
    this.data.currentLocusColocalization.subscribe(disableLocusColocalization => this.disableLocusColocalization = disableLocusColocalization);
    this.data.currentLocusQuantification.subscribe(disableLocusQuantification => this.disableLocusQuantification = disableLocusQuantification);
    this.data.currentSelectedTab.subscribe(selectedTab => this.selectedTab = selectedTab);
    this.data.currentBlurLoad.subscribe(blurLoad => this.blurLoad = blurLoad);
  }

}
