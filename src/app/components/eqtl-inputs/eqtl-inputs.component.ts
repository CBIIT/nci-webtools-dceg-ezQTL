import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-eqtl-inputs',
  templateUrl: './eqtl-inputs.component.html',
  styleUrls: ['./eqtl-inputs.component.css']
})

export class EqtlInputsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // $scope.expressionButtonText = 'Choose File';

  // $scope.save = function(file) {
  //   console.log(file);
  //   $scope.buttonText = file;
  // };

  save(file): void {
    console.log(file);
  }

  log(...values: any[]) {
    console.log(...values);
  }

  async submit(...files: File[]) {
    var formData = new FormData();

    for (var i = 0; i < files.length; i++) {
      console.log(files[i].name);
      formData.append('input-files[]', files[i]);
    }

    var response = await fetch(environment.endpoint + '/upload-file', {
      method: 'POST',
      body: formData
    });

    console.log(await response);
    console.log(await response.text());
  }

 

}
