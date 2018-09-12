import { Component, OnInit } from '@angular/core';
import { EqtlResultsComponent } from '../eqtl-results/eqtl-results.component';
import { EqtlResultsService } from '../../services/eqtl-results.service';

import { FormGroup, FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-eqtl-inputs',
  templateUrl: './eqtl-inputs.component.html',
  styleUrls: ['./eqtl-inputs.component.css']
})

export class EqtlInputsComponent implements OnInit {

  eqtlForm = new FormGroup({
    expressionFile: new FormControl('', Validators.required), 
    genotypeFile: new FormControl('', Validators.required), 
    associationFile: new FormControl('', Validators.required)
  });

  message: string;
  resultsStatus: boolean;

  constructor(private data: EqtlResultsService) { }

  ngOnInit() {
    this.eqtlForm.valueChanges.subscribe(formValue => {
      console.log(formValue);
    });

    this.data.currentMessage.subscribe(message => this.message = message);
    this.data.currentresultsStatus.subscribe(resultsStatus => this.resultsStatus = resultsStatus);
  }

  // newMessage() {
  //   this.data.changeMessage("Hello from Sibling");
  // }

  async submit() {
    this.data.changeresultsStatus(true);

    const { expressionFile, genotypeFile, associationFile } = this.eqtlForm.value;
    console.log(expressionFile, genotypeFile, associationFile);

    const formData = new FormData();
    formData.append('expression-file', expressionFile[0]);
    formData.append('genotype-file', genotypeFile[0]);
    formData.append('association-file', associationFile[0]);
    
    const response = await fetch(environment.endpoint + '/upload-file', {
      method: 'POST',
      body: formData
    });

    // console.log(await response.text());

    this.data.changeMessage(await response.json());
  } 

  reset() {
    this.data.changeresultsStatus(false);
    this.data.changeMessage('');
  }

  // onSubmit() {
  //   // TODO: Use EventEmitter with form value
  //   console.log("Form has been submitted.");
  //   console.warn(this.eqtlForm.value);
  // }
}
