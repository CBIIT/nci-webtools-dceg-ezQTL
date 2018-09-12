import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EqtlResultsService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  private showresultsStatus = new BehaviorSubject(true);
  currentresultsStatus = this.showresultsStatus.asObservable();

  constructor() { }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }

  changeresultsStatus(resultsStatus: boolean) {
    this.showresultsStatus.next(resultsStatus);
  }

}