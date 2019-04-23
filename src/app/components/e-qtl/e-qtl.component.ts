import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';

// declare var $; // declare jquery $
// import * as $ from 'jquery';
declare let $: any;

@Component({
  selector: 'app-e-qtl',
  templateUrl: './e-qtl.component.html',
  styleUrls: ['./e-qtl.component.css']
})

export class EQTLComponent implements OnInit {

  resultStatus: boolean;
  errorMessage: string;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
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
  }

  toggleView() {
    // console.log("clicked");
    $("#toggle-view-button").toggleClass('fa-caret-left fa-caret-right');
    // console.log($("#toggle-view-button").attr("class"));
    var direction = $("#toggle-view-button").attr("class");
    if (direction.includes("left")) {
      // show input panel
      $("#input-panel").show();
      $("#results-panel").toggleClass('col-9 col');
      this.data.changeCollapseInput(false);
      // shift popovers to the left if any are open
      if ($(".popover").is(":visible")) {
        $('.popover').css({
          left: $(".popover").position().left - 165 + "px"
        });
      }
    } else {
      // hide input panel
      $("#input-panel").hide();
      $("#results-panel").toggleClass('col-9 col');
      this.data.changeCollapseInput(true);
      // shift popovers to the right if any are open
      if ($(".popover").is(":visible")) {
        $('.popover').css({
          left: $(".popover").position().left + 165 + "px"
        });
      }
    }
  }

}


