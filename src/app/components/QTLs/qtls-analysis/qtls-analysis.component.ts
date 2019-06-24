import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';

// declare var $; // declare jquery $
// import * as $ from 'jquery';
declare let $: any;

@Component({
  selector: 'app-qtls-analysis',
  templateUrl: './qtls-analysis.component.html',
  styleUrls: ['./qtls-analysis.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class QTLsComponent implements OnInit {

  resultStatus: boolean;
  errorMessage: string;
  opened: boolean;
  collapseInput: boolean;

  constructor(private data: QTLsResultsService) { }

  ngOnInit() {
    this.opened = true;
    // hide input panel once calculate button is hit
    this.data.currentResultStatus.subscribe(resultStatus => {
      this.resultStatus = resultStatus;
      if (this.resultStatus) {
        this.toggleView();
      }
    });
    this.data.currentErrorMessage.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
      if (this.errorMessage) {
        this.toggleView();
      }
    });
    this.data.currentCollapseInput.subscribe(collapseInput => {
      this.collapseInput = collapseInput;
      if (this.collapseInput) {
        this.opened = false;
      } else {
        this.opened = true;
      }
    });
  }

  toggleView() {
    // console.log("clicked");
    $("#toggle-view-button").toggleClass('fa-caret-left fa-caret-right');
    // toggle position of locus alignment manhattan plot for popovers to fit
    $("#qtls-locus-alignment-plot").toggleClass('justify-content-start justify-content-center');
    $("#qtls-locus-alignment-scatter-plot").toggleClass('justify-content-start justify-content-center');
    // console.log($("#toggle-view-button").attr("class"));
    var direction = $("#toggle-view-button").attr("class");
    if (direction.includes("left")) {
      // show input panel
      this.opened = true;
      // $("#input-panel").show();
      // $("#results-panel").toggleClass('col-9 col');
      this.data.changeCollapseInput(false);
      // shift popovers to the left if any are open
      if ($(".popover").is(":visible")) {
        $('.popover').css({
          left: $(".popover").position().left - 220 + "px"
        });
      }
    } else {
      // hide input panel
      this.opened = false;
      // $("#input-panel").hide();
      // $("#results-panel").toggleClass('col-9 col');
      this.data.changeCollapseInput(true);
      // shift popovers to the right if any are open
      if ($(".popover").is(":visible")) {
        $('.popover').css({
          left: $(".popover").position().left + 220 + "px"
        });
      }
    }
  }

}


