import { Component, OnInit } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';

// declare var $; // declare jquery $
import * as $ from 'jquery';

@Component({
  selector: 'app-e-qtl',
  templateUrl: './e-qtl.component.html',
  styleUrls: ['./e-qtl.component.css']
})

export class EQTLComponent implements OnInit {

  resultStatus: boolean;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    // hide input panel once calculate button is hit
    this.data.currentResultStatus.subscribe(resultStatus => {
      this.resultStatus = resultStatus
      if (this.resultStatus) {
        this.toggleView();
      }
    });
  }

  toggleView() {
    console.log("clicked");
    $("#toggle-view-button").toggleClass('fa-caret-left fa-caret-right');
    console.log($("#toggle-view-button").attr("class"));
    var direction = $("#toggle-view-button").attr("class");
    if (direction.includes("left")) {
      // show input pabel
      console.log("show");
      $("#input-panel").show();
      $("#results-panel").toggleClass('col-9 col');
    } else {
      // hide input panel
      console.log("hide");
      $("#input-panel").hide();
      $("#results-panel").toggleClass('col-9 col');
    }
  }

}


