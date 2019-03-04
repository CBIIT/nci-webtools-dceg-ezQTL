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

  recalculateMain(associationFile: string, expressionFile: string, genotypeFile: string, gwasFile: string, request_id: number, select_pop: string, select_gene: string, recalculate: string) {
    let recalculateParameters = {
      associationFile: associationFile,
      expressionFile: expressionFile,
      genotypeFile: genotypeFile,
      gwasFile: gwasFile,
      request_id: request_id, 
      select_pop: select_pop,
      select_gene: select_gene,
      recalculate: recalculate
    };
    console.log("recalculateParameters", recalculateParameters);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const url = environment.endpoint + '/eqtl-recalculate-main';
    return this.http.post(url, JSON.stringify(recalculateParameters), {headers: headers});
    // return this.http.post(url, formData);
  }

  calculateLocuszoomBoxplots(expressionFile: string, genotypeFile: string, boxplotDataDetailed: Object) {
    let locuszoomBoxplotsParameters= {
      expressionFile: expressionFile,
      genotypeFile: genotypeFile,
      boxplotDataDetailed: boxplotDataDetailed
    };
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const url = environment.endpoint + '/eqtl-locuszoom-boxplots';
    return this.http.post(url, JSON.stringify(locuszoomBoxplotsParameters), {headers: headers});
  }

  changeMainData(mainData: Object) {
    this.mainDataSource.next(mainData);
  }

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