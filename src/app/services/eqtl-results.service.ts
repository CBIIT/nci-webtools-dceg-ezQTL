import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EqtlResultsService {

  // data output from R calculation to plot
  private eqtlDataSource = new BehaviorSubject<Object>(null);
  currentEqtlData = this.eqtlDataSource.asObservable();

  // data output from R calculation to plot
  private geneList = new BehaviorSubject([]);
  currentGeneList = this.geneList.asObservable();
  
  // boolean: true=show results container
  private resultStatus = new BehaviorSubject(false);
  currentResultStatus = this.resultStatus.asObservable();

  // error message output from R calculation
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

  changeGeneList(geneList: string[]) {
    this.geneList.next(geneList);
  }

  changeResultStatus(resultStatus: boolean) {
    this.resultStatus.next(resultStatus);
  }

  changeErrorMessage(errorMessage: string) {
    this.errorMessage.next(errorMessage);
  }

}