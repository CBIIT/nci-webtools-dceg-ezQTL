import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class EqtlResultsService {

  // data output from R calculation to plot
  private mainDataSource = new BehaviorSubject<Object>(null);
  currentMainData = this.mainDataSource.asObservable();

  private locuszoomBoxplotsDataSource = new BehaviorSubject<Object>(null);
  currentLocuszoomBoxplotsData = this.locuszoomBoxplotsDataSource.asObservable();

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

  // boolean: whether or not the input panel is collapsed
  private collapseInput = new BehaviorSubject(false);
  currentCollapseInput = this.collapseInput.asObservable();

  constructor(private http: HttpClient) { }

  calculateMain(formData: FormData) {
    const url = environment.endpoint + '/eqtl-calculate-main';
    return this.http.post(url, formData);
  }

  calculateLocuszoomBoxplots(boxplotDataDetailed: Object) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const url = environment.endpoint + '/eqtl-locuszoom-boxplots';
    return this.http.post(url, JSON.stringify(boxplotDataDetailed), {headers: headers});
  }

  changeMainData(mainData: Object) {
    this.mainDataSource.next(mainData);
  }

  changeLocuszoomBoxplotsData(locuszoomBoxplotsData: Object) {
    this.locuszoomBoxplotsDataSource.next(locuszoomBoxplotsData);
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

  changeCollapseInput(collapseInput: boolean) {
    this.collapseInput.next(collapseInput);
  }
}