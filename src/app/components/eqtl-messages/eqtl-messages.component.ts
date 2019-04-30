import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EqtlResultsService } from '../../services/eqtl-results.service';


@Component({
  selector: 'app-eqtl-messages',
  templateUrl: './eqtl-messages.component.html',
  styleUrls: ['./eqtl-messages.component.css']
})
export class EqtlMessagesComponent implements OnInit {

  errorMessage: string;
  // warningMessage: string;
  disableGeneExpressions: boolean;

  constructor(private cdr: ChangeDetectorRef, private data: EqtlResultsService) { }

  ngAfterViewChecked(){
    // this.data.currentWarningMessage.subscribe(warningMessage => {
    //   this.warningMessage = warningMessage;
    // });
    this.cdr.detectChanges();
  }

  ngOnInit() {
    this.data.currentErrorMessage.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
    });
    this.data.currentGeneExpressions.subscribe(disableGeneExpressions => {
      this.disableGeneExpressions = disableGeneExpressions;
    });
  }

}
