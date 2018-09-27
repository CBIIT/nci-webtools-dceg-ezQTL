import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EqtlResultsService {

  private eqtlDataSource = new BehaviorSubject<Object>(null);
  currentEqtlData = this.eqtlDataSource.asObservable();

  private showResultStatus = new BehaviorSubject(false);
  currentResultStatus = this.showResultStatus.asObservable();

  private errorMessage = new BehaviorSubject('');
  currentErrorMessage = this.errorMessage.asObservable();

  constructor(private http: HttpClient) { }

  getResults(formData: FormData) {
    const url = environment.endpoint + '/upload-file';
    return this.http.post(url, formData);
  }

  changeEqtlData(eqtlData: Object) {
    this.eqtlDataSource.next(eqtlData);
  }

  changeResultStatus(resultStatus: boolean) {
    this.showResultStatus.next(resultStatus);
  }

  changeErrorMessage(errorMessage: string) {
    this.errorMessage.next(errorMessage);
  }

}