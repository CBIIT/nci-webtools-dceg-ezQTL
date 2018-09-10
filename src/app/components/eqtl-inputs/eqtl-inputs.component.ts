import { Component, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.eqtlForm.valueChanges.subscribe(formValue => {
      console.log(formValue);
    })
  }

  log(...values: any[]) {
    console.log(...values);
  }

  async submit() {
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

    console.log(await response.text());





    // for (var i = 0; i < files.length; i++) {
    //   console.log(files[i].name);
    //   formData.append('input-files[]', files[i]);
    // }
    // });
    // console.log(await response);
    // console.log(await response.text());
  }  

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log("Form has been submitted.");
    console.warn(this.eqtlForm.value);
  }
}
