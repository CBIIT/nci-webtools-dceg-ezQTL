import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { QTLsResultsService } from '../../../services/qtls-results.service';


@Component({
  selector: 'app-qtls-error-messages',
  templateUrl: './qtls-error-messages.component.html',
  styleUrls: ['./qtls-error-messages.component.css']
})
export class QTLsErrorMessagesComponent implements OnInit {

  errorMessage: string;
  // warningMessage: string;
  disableLocusQuantification: boolean;

  constructor(private cdr: ChangeDetectorRef, private data: QTLsResultsService) { }

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
  }

}
