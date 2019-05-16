import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class QTLsResultsService {

  // data output from R calculation to plot
  private mainDataSource = new BehaviorSubject<Object>(null);
  currentMainData = this.mainDataSource.asObservable();

  // boolean: true=show results container
  private resultStatus = new BehaviorSubject(false);
  currentResultStatus = this.resultStatus.asObservable();

  // error message output from R calculation
  private errorMessage = new BehaviorSubject('');
  currentErrorMessage = this.errorMessage.asObservable();

  // warning message if uploaded data files has > 30 genes
  // private warningMessage = new BehaviorSubject('');
  // currentWarningMessage = this.warningMessage.asObservable();

  // disable/enable gene expressions result tab
  private disableLocusQuantification = new BehaviorSubject(true);
  currentLocusQuantification = this.disableLocusQuantification.asObservable();

  // programmatically select result tab
  private selectedTab = new BehaviorSubject(0);
  currentSelectedTab = this.selectedTab.asObservable();

  // boolean: whether or not the input panel is collapsed
  private collapseInput = new BehaviorSubject(false);
  currentCollapseInput = this.collapseInput.asObservable();

  // boolean: whether or not to display the blur loading spinner
  private blurLoad = new BehaviorSubject(false);
  currentBlurLoad = this.blurLoad.asObservable();

  constructor(private http: HttpClient) { }

  calculateMain(formData: FormData) {
    const url = environment.endpoint + 'qtls-calculate-main';
    return this.http.post(url, formData);
  }

  recalculateMain(associationFile: string, expressionFile: string, genotypeFile: string, gwasFile: string, request_id: number, select_pop: string, select_gene: string, select_ref: string, recalculateAttempt: string, recalculatePop: string, recalculateGene: string, recalculateRef: string) {
    let recalculateParameters = {
      associationFile: associationFile, 
      expressionFile: expressionFile, 
      genotypeFile: genotypeFile, 
      gwasFile: gwasFile, 
      request_id: request_id, 
      select_pop: select_pop, 
      select_gene: select_gene, 
      select_ref: select_ref, 
      recalculateAttempt: recalculateAttempt,
      recalculatePop: recalculatePop, 
      recalculateGene: recalculateGene, 
      recalculateRef: recalculateRef
    };
    // console.log("recalculateParameters", recalculateParameters);
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const url = environment.endpoint + 'qtls-recalculate-main';
    return this.http.post(url, JSON.stringify(recalculateParameters), {headers: headers});
    // return this.http.post(url, formData);
  }

  calculateLocusAlignmentBoxplots(expressionFile: string, genotypeFile: string, boxplotDataDetailed: Object) {
    let locusAlignmentBoxplotsParameters= {
      expressionFile: expressionFile,
      genotypeFile: genotypeFile,
      boxplotDataDetailed: boxplotDataDetailed
    };
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    const url = environment.endpoint + 'qtls-locus-alignment-boxplots';
    return this.http.post(url, JSON.stringify(locusAlignmentBoxplotsParameters), {headers: headers});
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

  // changeWarningMessage(warningMessage: string) {
  //   this.warningMessage.next(warningMessage);
  // }

  changeDisableLocusQuantification(disableLocusQuantification: boolean) {
    this.disableLocusQuantification.next(disableLocusQuantification);
  }

  changeSelectedTab(selectedTab: number) {
    this.selectedTab.next(selectedTab);
  }

  changeCollapseInput(collapseInput: boolean) {
    this.collapseInput.next(collapseInput);
  }

  changeBlurLoad(blurLoad: boolean) {
    this.blurLoad.next(blurLoad);
  }
}