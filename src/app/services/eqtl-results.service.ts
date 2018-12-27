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
  // private geneList = new BehaviorSubject([]);
  // currentGeneList = this.geneList.asObservable();
  
  // boolean: true=show results container
  private resultStatus = new BehaviorSubject(false);
  currentResultStatus = this.resultStatus.asObservable();

  // error message output from R calculation
  private errorMessage = new BehaviorSubject('');
  currentErrorMessage = this.errorMessage.asObservable();

  // warning message if uploaded data files has > 15 genes
  private warningMessage = new BehaviorSubject('');
  currentWarningMessage = this.warningMessage.asObservable();

  // disable/enable gene expressions result tab
  private disableGeneExpressions = new BehaviorSubject(true);
  currentGeneExpressions = this.disableGeneExpressions.asObservable();

  // programmatically select result tab
  private selectedTab = new BehaviorSubject(0);
  currentSelectedTab = this.selectedTab.asObservable();

  constructor(private http: HttpClient) { }

  getResults(formData: FormData) {
    const url = environment.endpoint + '/upload-file';
    return this.http.post(url, formData);
  }

  changeEqtlData(eqtlData: Object) {
    this.eqtlDataSource.next(eqtlData);
  }

  // changeGeneList(geneList: string[]) {
  //   this.geneList.next(geneList);
  // }

  changeResultStatus(resultStatus: boolean) {
    this.resultStatus.next(resultStatus);
  }

  changeErrorMessage(errorMessage: string) {
    this.errorMessage.next(errorMessage);
  }

  changeWarningMessage(warningMessage: string) {
    this.warningMessage.next(warningMessage);
  }

  changeDisableGeneExpressions(disableGeneExpressions: boolean) {
    this.disableGeneExpressions.next(disableGeneExpressions);
  }

  changeSelectedTab(selectedTab: number) {
    this.selectedTab.next(selectedTab);
  }
}