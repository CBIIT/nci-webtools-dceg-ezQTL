import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EqtlResultsService {

  private messageSource = new BehaviorSubject<Object>(null);
  currentMessage = this.messageSource.asObservable();

  private showresultsStatus = new BehaviorSubject(false);
  currentresultsStatus = this.showresultsStatus.asObservable();

  constructor(private http: HttpClient) { }

  getResults(formData: FormData) {
    const url = environment.endpoint + '/upload-file';
    return this.http.post(url, formData);
  }

  changeMessage(message: Object) {
    this.messageSource.next(message);
  }

  changeresultsStatus(resultsStatus: boolean) {
    this.showresultsStatus.next(resultsStatus);
  }

}