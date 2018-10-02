(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* Application-wide Styles */\r\nh1 {\r\n    color: #369;\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    font-size: 250%;\r\n  }\r\nh2, h3 {\r\n    color: #444;\r\n    font-family: Arial, Helvetica, sans-serif;\r\n    font-weight: lighter;\r\n  }\r\nbody {\r\n    margin: 2em;\r\n  }\r\nbody, input[text], button {\r\n    color: #888;\r\n    font-family: Cambria, Georgia;\r\n  }\r\n/* everywhere else */\r\n* {\r\n    font-family: Arial, Helvetica, sans-serif;\r\n  }"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<app-navbar></app-navbar>\r\n     \r\n<main class=\"container py-4 flex-grow-1 bg-white shadow\" id=\"main-content\">\r\n    <router-outlet></router-outlet>\r\n</main>\r\n\r\n<app-footer></app-footer>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.title = 'vQTL';
    }
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        })
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _components_e_qtl_e_qtl_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/e-qtl/e-qtl.component */ "./src/app/components/e-qtl/e-qtl.component.ts");
/* harmony import */ var _components_s_qtl_s_qtl_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/s-qtl/s-qtl.component */ "./src/app/components/s-qtl/s-qtl.component.ts");
/* harmony import */ var _components_me_qtl_me_qtl_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/me-qtl/me-qtl.component */ "./src/app/components/me-qtl/me-qtl.component.ts");
/* harmony import */ var _components_mi_qtl_mi_qtl_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/mi-qtl/mi-qtl.component */ "./src/app/components/mi-qtl/mi-qtl.component.ts");
/* harmony import */ var _components_qtl_interaction_qtl_interaction_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./components/qtl-interaction/qtl-interaction.component */ "./src/app/components/qtl-interaction/qtl-interaction.component.ts");
/* harmony import */ var _components_help_help_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/help/help.component */ "./src/app/components/help/help.component.ts");
/* harmony import */ var _router_app_routing_module__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./router/app-routing.module */ "./src/app/router/app-routing.module.ts");
/* harmony import */ var _components_navbar_navbar_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/navbar/navbar.component */ "./src/app/components/navbar/navbar.component.ts");
/* harmony import */ var _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./components/footer/footer.component */ "./src/app/components/footer/footer.component.ts");
/* harmony import */ var _components_home_home_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/home/home.component */ "./src/app/components/home/home.component.ts");
/* harmony import */ var _components_eqtl_inputs_eqtl_inputs_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components/eqtl-inputs/eqtl-inputs.component */ "./src/app/components/eqtl-inputs/eqtl-inputs.component.ts");
/* harmony import */ var _components_eqtl_results_eqtl_results_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./components/eqtl-results/eqtl-results.component */ "./src/app/components/eqtl-results/eqtl-results.component.ts");
/* harmony import */ var _components_eqtl_results_gene_expressions_eqtl_results_gene_expressions_component__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component */ "./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.ts");
/* harmony import */ var _components_eqtl_results_locuszoom_eqtl_results_locuszoom_component__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./components/eqtl-results-locuszoom/eqtl-results-locuszoom.component */ "./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.ts");
/* harmony import */ var _components_eqtl_results_table_eqtl_results_table_component__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./components/eqtl-results-table/eqtl-results-table.component */ "./src/app/components/eqtl-results-table/eqtl-results-table.component.ts");
/* harmony import */ var _directives_file_value_accessor_directive__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./directives/file-value-accessor.directive */ "./src/app/directives/file-value-accessor.directive.ts");
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/platform-browser/animations */ "./node_modules/@angular/platform-browser/fesm5/animations.js");
/* harmony import */ var _angular_material__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material */ "./node_modules/@angular/material/esm5/material.es5.js");
/* harmony import */ var _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/grid-list */ "./node_modules/@angular/material/esm5/grid-list.es5.js");
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/select */ "./node_modules/@angular/material/esm5/select.es5.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/input */ "./node_modules/@angular/material/esm5/input.es5.js");
/* harmony import */ var _angular_material_tabs__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/tabs */ "./node_modules/@angular/material/esm5/tabs.es5.js");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/progress-spinner */ "./node_modules/@angular/material/esm5/progress-spinner.es5.js");
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! @angular/material/form-field */ "./node_modules/@angular/material/esm5/form-field.es5.js");
/* harmony import */ var angular_plotly_js__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! angular-plotly.js */ "./node_modules/angular-plotly.js/esm5/angular-plotly.js.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





















 // import needed UI modules








var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"],
                _components_e_qtl_e_qtl_component__WEBPACK_IMPORTED_MODULE_4__["EQTLComponent"],
                _components_s_qtl_s_qtl_component__WEBPACK_IMPORTED_MODULE_5__["SQTLComponent"],
                _components_me_qtl_me_qtl_component__WEBPACK_IMPORTED_MODULE_6__["MeQTLComponent"],
                _components_mi_qtl_mi_qtl_component__WEBPACK_IMPORTED_MODULE_7__["MiQTLComponent"],
                _components_qtl_interaction_qtl_interaction_component__WEBPACK_IMPORTED_MODULE_8__["QTLInteractionComponent"],
                _components_help_help_component__WEBPACK_IMPORTED_MODULE_9__["HelpComponent"],
                _components_navbar_navbar_component__WEBPACK_IMPORTED_MODULE_11__["NavbarComponent"],
                _components_footer_footer_component__WEBPACK_IMPORTED_MODULE_12__["FooterComponent"],
                _components_home_home_component__WEBPACK_IMPORTED_MODULE_13__["HomeComponent"],
                _components_eqtl_inputs_eqtl_inputs_component__WEBPACK_IMPORTED_MODULE_14__["EqtlInputsComponent"],
                _components_eqtl_results_eqtl_results_component__WEBPACK_IMPORTED_MODULE_15__["EqtlResultsComponent"],
                _directives_file_value_accessor_directive__WEBPACK_IMPORTED_MODULE_19__["FileValueAccessorDirective"],
                _components_eqtl_results_gene_expressions_eqtl_results_gene_expressions_component__WEBPACK_IMPORTED_MODULE_16__["EqtlResultsGeneExpressionsComponent"],
                _components_eqtl_results_locuszoom_eqtl_results_locuszoom_component__WEBPACK_IMPORTED_MODULE_17__["EqtlResultsLocuszoomComponent"],
                _components_eqtl_results_table_eqtl_results_table_component__WEBPACK_IMPORTED_MODULE_18__["EqtlResultsTableComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClientModule"],
                _router_app_routing_module__WEBPACK_IMPORTED_MODULE_10__["AppRoutingModule"],
                _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_20__["BrowserAnimationsModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_21__["MatButtonModule"],
                _angular_material__WEBPACK_IMPORTED_MODULE_21__["MatCheckboxModule"],
                _angular_material_grid_list__WEBPACK_IMPORTED_MODULE_22__["MatGridListModule"],
                _angular_material_select__WEBPACK_IMPORTED_MODULE_23__["MatSelectModule"],
                _angular_material_form_field__WEBPACK_IMPORTED_MODULE_28__["MatFormFieldModule"],
                _angular_material_input__WEBPACK_IMPORTED_MODULE_25__["MatInputModule"],
                _angular_material_tabs__WEBPACK_IMPORTED_MODULE_26__["MatTabsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_24__["FormsModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_24__["ReactiveFormsModule"],
                _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_27__["MatProgressSpinnerModule"],
                angular_plotly_js__WEBPACK_IMPORTED_MODULE_29__["PlotlyModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_3__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/app/components/e-qtl/e-qtl.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/e-qtl/e-qtl.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "/* #inputs {\r\n    font-size: 10pt;\r\n    font-weight: bold;\r\n} */\r\n\r\n/* #input-files{\r\n    font-weight: bold;\r\n} */\r\n\r\n/* .mat-grid-text {\r\n    position: absolute;\r\n    left: 20px;\r\n} */"

/***/ }),

/***/ "./src/app/components/e-qtl/e-qtl.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/e-qtl/e-qtl.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<!-- eQTL Inputs (component) -->\r\n<app-eqtl-inputs></app-eqtl-inputs>\r\n\r\n<!-- eQTL Results (component) -->\r\n<app-eqtl-results></app-eqtl-results>\r\n\r\n"

/***/ }),

/***/ "./src/app/components/e-qtl/e-qtl.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/e-qtl/e-qtl.component.ts ***!
  \*****************************************************/
/*! exports provided: EQTLComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EQTLComponent", function() { return EQTLComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EQTLComponent = /** @class */ (function () {
    function EQTLComponent() {
    }
    EQTLComponent.prototype.ngOnInit = function () {
    };
    EQTLComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-e-qtl',
            template: __webpack_require__(/*! ./e-qtl.component.html */ "./src/app/components/e-qtl/e-qtl.component.html"),
            styles: [__webpack_require__(/*! ./e-qtl.component.css */ "./src/app/components/e-qtl/e-qtl.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], EQTLComponent);
    return EQTLComponent;
}());



/***/ }),

/***/ "./src/app/components/eqtl-inputs/eqtl-inputs.component.css":
/*!******************************************************************!*\
  !*** ./src/app/components/eqtl-inputs/eqtl-inputs.component.css ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#inputs {\r\n    font-size: 9pt;\r\n    font-weight: bold;\r\n}\r\n\r\n.cf:before, .cf:after {\r\n    content: \" \";\r\n    display: table;\r\n}\r\n\r\n.cf:after {\r\n    clear: both;\r\n}\r\n\r\n.cf {\r\n    *zoom: 1;\r\n}\r\n\r\n.fl {\r\n    float: left;\r\n    _display: inline;\r\n}\r\n\r\n.w-100 {\r\n    width: 100%;\r\n}\r\n\r\n.bg-light-gray {\r\n    background-color: #eee;\r\n}\r\n\r\n.bg-near-white {\r\n    background-color: #f4f4f4;\r\n}\r\n\r\n.tc {\r\n    text-align: center;\r\n}\r\n\r\n@media screen and (min-width: 30em) {\r\n    .w-50-ns {\r\n        width: 50%;\r\n    }\r\n}"

/***/ }),

/***/ "./src/app/components/eqtl-inputs/eqtl-inputs.component.html":
/*!*******************************************************************!*\
  !*** ./src/app/components/eqtl-inputs/eqtl-inputs.component.html ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"alert alert-danger\" role=\"alert\"  *ngIf=\"errorMessage\">\n  Unable to calculate: {{errorMessage}} — please check input files. Reset form to try again.\n</div>\n\n<!-- Inputs -->\n<div class=\"container border border-light rounded p-3\" id=\"inputs\">\n  <form class=\"row\" [formGroup]=\"eqtlForm\" id=\"input-files\">\n\n    <!-- Expression Data File -->\n    <div class=\"col\">\n      <div class=\"row\" id=\"input-files\">\n        <div class=\"col-sm\">\n          Expression Data File<span style=\"color:red\">*</span>\n          <div class=\"d-block d-md-none w-100\"></div>\n          <input required \n            type=\"file\" \n            formControlName=\"expressionFile\"  \n            class=\"ng-hide\" \n            id=\"expression-file\" \n            name=\"input-files\" \n            accept=\".txt\" \n            hidden \n            #expressionInput>\n          <button \n            style=\"width:120px; overflow:hidden; text-overflow:ellipsis;\" \n            (click)=\"expressionInput.click()\" \n            [disabled]=\"resultStatus\" \n            class=\"ml-3 mr-3\" \n            mat-raised-button>\n            <!-- {{ eqtlForm.value?.expressionFile[0]?.name || 'Choose File' }} -->\n            <!-- {{ eqtlForm.value.expressionFile[0]\n                ? eqtlForm.value.expressionFile[0].name.substring(0, 11)\n                : 'Choose File' }} -->\n            {{ !eqtlForm.value.expressionFile ? 'Choose File' : (eqtlForm.value?.expressionFile[0]?.name || 'Choose File') }}\n          </button>\n          <div class=\"d-block d-md-none w-100\"></div>\n          <i class=\"fas fa-download mr-1\"></i><a href=\"/src/assets/files/1q21_3.expression.txt\" download>Sample</a>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"d-block d-md-none w-100 mt-2 mb-2 border border-light\"></div>\n\n    <!-- Genotype Data File -->\n    <div class=\"col\">\n      <div class=\"row\" id=\"input-files\">\n        <div class=\"col-sm\">\n          Genotype Data File<span style=\"color:red\">*</span>\n          <div class=\"d-block d-md-none w-100\"></div>\n          <input required \n            type=\"file\" \n            formControlName=\"genotypeFile\" \n            class=\"ng-hide\" \n            id=\"genotype-file\" \n            name=\"input-files\" \n            accept=\".txt\" \n            hidden \n            #genotypeInput>\n          <button \n            style=\"width:120px; overflow:hidden; text-overflow:ellipsis;\" \n            (click)=\"genotypeInput.click()\" \n            [disabled]=\"resultStatus\" \n            class=\"ml-3 mr-3\" \n            mat-raised-button>\n            {{ !eqtlForm.value.genotypeFile ? 'Choose File' : (eqtlForm.value?.genotypeFile[0]?.name || 'Choose File') }}\n          </button>\n          <div class=\"d-block d-md-none w-100\"></div>\n          <i class=\"fas fa-download mr-1\"></i><a href=\"/src/assets/files/1q21_3.genotyping.txt\" download>Sample</a>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"d-block d-md-none w-100 mt-2 mb-2 border border-light\"></div>\n\n    <!-- Association Data File -->\n    <div class=\"col\">\n      <div class=\"row\" id=\"input-files\">\n        <div class=\"col-sm\">\n          Association Data File<span style=\"color:red\">*</span>\n          <div class=\"d-block d-md-none w-100\"></div>\n          <input required \n            type=\"file\" \n            formControlName=\"associationFile\"\n            class=\"ng-hide\" \n            id=\"association-file\" \n            name=\"input-files\" \n            accept=\".txt\" \n            hidden \n            required \n            #associationInput>\n          <button \n            style=\"width:120px; overflow:hidden; text-overflow:ellipsis;\" \n            (click)=\"associationInput.click()\" \n            [disabled]=\"resultStatus\" \n            class=\"ml-3 mr-3\" \n            mat-raised-button>\n            {{ !eqtlForm.value.associationFile ? 'Choose File' : (eqtlForm.value?.associationFile[0]?.name || 'Choose File') }}\n          </button>\n          <div class=\"d-block d-md-none w-100\"></div>\n          <i class=\"fas fa-download mr-1\"></i><a href=\"/src/assets/files/1q21_3.eQTL.txt\" download>Sample</a>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"w-100\"></div>\n\n    <div class=\"d-block d-md-none w-100 mt-2 mb-2 border border-light\"></div>\n\n    <div class=\"col-sm\">\n      <!-- <div class=\"mt-3\">{{ resultStatus }}</div> -->\n    </div>\n    <div class=\"col-sm\">\n      \n    </div>\n\n    <!-- Submit and Reset Button   -->\n    <div class=\"col-sm text-center\">\n      <button \n        type=\"submit\" \n        class=\"mt-3 mr-3\" \n        [disabled]=\"(!eqtlForm.valid || resultStatus)\" \n        mat-raised-button color=\"primary\" \n        (click)=\"submit()\">\n        Calculate\n      </button>\n      <button \n        type=\"reset\" \n        class=\"mt-3\" \n        mat-raised-button \n        (click)=\"reset()\" \n        [color]=\"resetColor\">\n        Reset\n      </button>\n    </div>\n  </form>\n</div>\n\n\n \n\n"

/***/ }),

/***/ "./src/app/components/eqtl-inputs/eqtl-inputs.component.ts":
/*!*****************************************************************!*\
  !*** ./src/app/components/eqtl-inputs/eqtl-inputs.component.ts ***!
  \*****************************************************************/
/*! exports provided: EqtlInputsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqtlInputsComponent", function() { return EqtlInputsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/eqtl-results.service */ "./src/app/services/eqtl-results.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};




var EqtlInputsComponent = /** @class */ (function () {
    function EqtlInputsComponent(data) {
        this.data = data;
        this.eqtlForm = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
            expressionFile: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required),
            genotypeFile: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required),
            associationFile: new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]('', _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required)
        });
        this.resetColor = null;
    }
    EqtlInputsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.eqtlForm.valueChanges.subscribe(function (formValue) {
            console.log(formValue);
        });
        this.data.currentEqtlData.subscribe(function (eqtlData) { return _this.eqtlData = eqtlData; });
        this.data.currentResultStatus.subscribe(function (resultStatus) { return _this.resultStatus = resultStatus; });
        this.data.currentErrorMessage.subscribe(function (errorMessage) {
            _this.errorMessage = errorMessage;
            if (_this.errorMessage) {
                _this.resetColor = 'warn';
            }
            else {
                _this.resetColor = null;
            }
        });
    };
    EqtlInputsComponent.prototype.submit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var _a, expressionFile, genotypeFile, associationFile, formData;
            return __generator(this, function (_b) {
                this.data.changeResultStatus(true);
                _a = this.eqtlForm.value, expressionFile = _a.expressionFile, genotypeFile = _a.genotypeFile, associationFile = _a.associationFile;
                console.log([expressionFile[0].name, genotypeFile[0].name, associationFile[0].name]);
                formData = new FormData();
                formData.append('expression-file', expressionFile[0]);
                formData.append('genotype-file', genotypeFile[0]);
                formData.append('association-file', associationFile[0]);
                this.data.getResults(formData)
                    .subscribe(function (res) { return _this.data.changeEqtlData(res); }, function (error) { return _this.handleError(error); });
                return [2 /*return*/];
            });
        });
    };
    EqtlInputsComponent.prototype.handleError = function (error) {
        console.log(error);
        var errorTrimmed = error.error.trim().split('\n');
        // var errorMessage = errorTrimmed.slice(1, errorTrimmed.length - 1).join(' ');
        var errorMessage = errorTrimmed[2];
        console.log(errorMessage);
        this.data.changeErrorMessage(errorMessage);
    };
    EqtlInputsComponent.prototype.reset = function () {
        this.data.changeResultStatus(false);
        this.data.changeEqtlData(null);
        this.data.changeErrorMessage('');
    };
    EqtlInputsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-eqtl-inputs',
            template: __webpack_require__(/*! ./eqtl-inputs.component.html */ "./src/app/components/eqtl-inputs/eqtl-inputs.component.html"),
            styles: [__webpack_require__(/*! ./eqtl-inputs.component.css */ "./src/app/components/eqtl-inputs/eqtl-inputs.component.css")]
        }),
        __metadata("design:paramtypes", [_services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__["EqtlResultsService"]])
    ], EqtlInputsComponent);
    return EqtlInputsComponent;
}());



/***/ }),

/***/ "./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.css":
/*!******************************************************************************************************!*\
  !*** ./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.css ***!
  \******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "#display-number {\r\n    font-size: 9pt;\r\n    font-weight: bold;\r\n    color: grey;\r\n}"

/***/ }),

/***/ "./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.html":
/*!*******************************************************************************************************!*\
  !*** ./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.html ***!
  \*******************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row justify-content-between\">\r\n\r\n  <!-- Number of Genes input -->\r\n  <div class=\"col-md-auto p-4\">\r\n    <mat-form-field>\r\n      <mat-label>Number of Genes (for Plot)</mat-label>\r\n      <mat-select #numGenes [(value)]=\"selectNumGenes\" (selectionChange)=\"triggerReplot()\" required>\r\n        <mat-option value=\"15\">All (15 max.)</mat-option>\r\n        <mat-option value=\"1\">1</mat-option>\r\n        <mat-option value=\"2\">2</mat-option>\r\n        <mat-option value=\"3\">3</mat-option>\r\n        <mat-option value=\"4\">4</mat-option>\r\n        <mat-option value=\"5\">5</mat-option>\r\n        <mat-option value=\"6\">6</mat-option>\r\n        <mat-option value=\"7\">7</mat-option>\r\n        <mat-option value=\"8\">8</mat-option>\r\n        <mat-option value=\"9\">9</mat-option>\r\n        <mat-option value=\"10\">10</mat-option>\r\n        <mat-option value=\"11\">11</mat-option>\r\n        <mat-option value=\"12\">12</mat-option>\r\n        <mat-option value=\"13\">13</mat-option>\r\n        <mat-option value=\"14\">14</mat-option>\r\n      </mat-select>\r\n    </mat-form-field>\r\n  </div>\r\n\r\n  <!-- Message showing number of genes displayed and total number of genes -->\r\n  <div class=\"col-md-auto p-4\" id=\"display-number\">\r\n    Showing <u>{{ numGenes.value }}</u> of <u>{{ totalNumGenes }}</u> genes\r\n  </div>\r\n  \r\n</div>\r\n\r\n<!-- Show centered Plotly gene expressions boxplot if graph is generated -->\r\n<div class=\"d-flex justify-content-center\" id=\"eqtl-gene-expressions-plot\" *ngIf=\"graph\">\r\n    <plotly-plot [data]=\"graph.data\" [layout]=\"graph.layout\" [config]=\"graph.config\"></plotly-plot>\r\n</div>\r\n\r\n<br>\r\n\r\n<!-- <pre>{{ eqtlData | json }}</pre> -->"

/***/ }),

/***/ "./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.ts":
/*!*****************************************************************************************************!*\
  !*** ./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.ts ***!
  \*****************************************************************************************************/
/*! exports provided: EqtlResultsGeneExpressionsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqtlResultsGeneExpressionsComponent", function() { return EqtlResultsGeneExpressionsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/eqtl-results.service */ "./src/app/services/eqtl-results.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EqtlResultsGeneExpressionsComponent = /** @class */ (function () {
    function EqtlResultsGeneExpressionsComponent(data) {
        this.data = data;
        this.graph = null;
    }
    EqtlResultsGeneExpressionsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.currentEqtlData.subscribe(function (eqtlData) {
            if (eqtlData) {
                _this.eqtlData = eqtlData[0];
            }
            if (_this.eqtlData) {
                _this.data.currentGeneList.subscribe(function (geneList) { return _this.geneList = geneList; });
                _this.graph = _this.geneExpressionsBoxPlot(_this.eqtlData);
            }
        });
        this.selectNumGenes = "15";
    };
    EqtlResultsGeneExpressionsComponent.prototype.getGeneSymbols = function (geneData) {
        function getUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var genes = [];
        for (var i = 0; i < geneData.length; i++) {
            genes.push(geneData[i]['gene_symbol']);
        }
        var uniqueGenes = genes.filter(getUnique);
        this.totalNumGenes = uniqueGenes.length;
        this.data.changeGeneList(uniqueGenes);
        return uniqueGenes;
    };
    EqtlResultsGeneExpressionsComponent.prototype.getGeneYData = function (geneData, xData) {
        var yData = [];
        for (var i = 0; i < xData.length; i++) {
            var tmp = [];
            for (var j = 0; j < geneData.length; j++) {
                if (xData[i] == geneData[j]['gene_symbol']) {
                    tmp.push(Math.log2(geneData[j]['exp']) + 0.1);
                }
            }
            yData.push(tmp);
        }
        return yData;
    };
    EqtlResultsGeneExpressionsComponent.prototype.geneExpressionsBoxPlot = function (geneData) {
        var xData = this.getGeneSymbols(geneData);
        console.log(xData);
        var yData = this.getGeneYData(geneData, xData);
        console.log(yData);
        var pdata = [];
        for (var i = 0; i < xData.length; i++) {
            var result = {
                type: 'box',
                y: yData[i],
                name: xData[i],
                boxpoints: 'all',
                jitter: 0.5,
                whiskerwidth: 0.2,
                fillcolor: 'cls',
                marker: {
                    size: 2
                },
                line: {
                    width: 1
                }
            };
            pdata.push(result);
        }
        ;
        var playout = {
            // title: 'Gene Expressions',
            width: 1000,
            height: 600,
            yaxis: {
                title: "Gene Expressions (log2)",
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 4,
                // gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1
                // zerolinecolor: 'rgb(255, 255, 255)',
                // zerolinewidth: 2
            },
            margin: {
                l: 40,
                r: 10,
                b: 80,
                t: 40
            },
            // paper_bgcolor: 'rgb(243, 243, 243)',
            // plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        };
        return { data: pdata, layout: playout, config: { displaylogo: false } };
    };
    EqtlResultsGeneExpressionsComponent.prototype.replotExpressionsBoxPlot = function (geneData, xData) {
        var yData = this.getGeneYData(geneData, xData);
        console.log(yData);
        var pdata = [];
        for (var i = 0; i < xData.length; i++) {
            var result = {
                type: 'box',
                y: yData[i],
                name: xData[i],
                boxpoints: 'all',
                jitter: 0.5,
                whiskerwidth: 0.2,
                fillcolor: 'cls',
                marker: {
                    size: 2
                },
                line: {
                    width: 1
                }
            };
            pdata.push(result);
        }
        ;
        var playout = {
            // title: 'Gene Expressions',
            width: 1000,
            height: 600,
            yaxis: {
                title: "Gene Expressions (log2)",
                autorange: true,
                showgrid: true,
                zeroline: true,
                dtick: 4,
                // gridcolor: 'rgb(255, 255, 255)',
                gridwidth: 1
                // zerolinecolor: 'rgb(255, 255, 255)',
                // zerolinewidth: 2
            },
            margin: {
                l: 40,
                r: 10,
                b: 80,
                t: 40
            },
            // paper_bgcolor: 'rgb(243, 243, 243)',
            // plot_bgcolor: 'rgb(243, 243, 243)',
            showlegend: false
        };
        this.graph = { data: pdata, layout: playout, config: { displaylogo: false } };
    };
    EqtlResultsGeneExpressionsComponent.prototype.triggerReplot = function () {
        console.log("replot graph");
        console.log(parseInt(this.selectNumGenes));
        var limitedGeneSymbols = this.getGeneSymbols(this.eqtlData).slice(0, parseInt(this.selectNumGenes));
        console.log(limitedGeneSymbols);
        this.replotExpressionsBoxPlot(this.eqtlData, limitedGeneSymbols);
    };
    EqtlResultsGeneExpressionsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-eqtl-results-gene-expressions',
            template: __webpack_require__(/*! ./eqtl-results-gene-expressions.component.html */ "./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.html"),
            styles: [__webpack_require__(/*! ./eqtl-results-gene-expressions.component.css */ "./src/app/components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component.css")]
        }),
        __metadata("design:paramtypes", [_services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__["EqtlResultsService"]])
    ], EqtlResultsGeneExpressionsComponent);
    return EqtlResultsGeneExpressionsComponent;
}());



/***/ }),

/***/ "./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.css":
/*!****************************************************************************************!*\
  !*** ./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.css ***!
  \****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".example-additional-selection {\r\n    opacity: 0.75;\r\n    font-size: 0.75em;\r\n  }"

/***/ }),

/***/ "./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.html":
/*!*****************************************************************************************!*\
  !*** ./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.html ***!
  \*****************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"row\">\r\n\r\n  <!-- Choose Population -->\r\n  <div class=\"col-md-auto p-4\">\r\n    <mat-form-field>\r\n      <mat-label>Population</mat-label>\r\n      <mat-select #population [(value)]=\"selectedPop\" (selectionChange)=\"changePop()\" multiple required>\r\n        <!-- Edit dropdown placeholder -->\r\n        <mat-select-trigger>\r\n          <span *ngIf=\"selectedPop.length < 26\">\r\n            <span *ngIf=\"selectedPop.length <= 3\">\r\n              {{ selectedPop.join('+') }}\r\n            </span>\r\n            <span *ngIf=\"selectedPop.length > 3\">\r\n              {{ selectedPop[0] }} \r\n              <span class=\"example-additional-selection\">\r\n                (+{{selectedPop.length - 1}} {{ selectedPop?.length === 2 ? 'other' : 'others'}})\r\n              </span>\r\n            </span>\r\n          </span>\r\n          <span *ngIf=\"selectedPop.length == 26\">\r\n            (ALL) All Populations\r\n          </span>\r\n        </mat-select-trigger>\r\n        <br>\r\n        <mat-checkbox class=\"p-3\" (change)=\"selectAll()\" color=\"primary\" [checked]=\"populationSelectedAll\">\r\n          (ALL) All Populations\r\n        </mat-checkbox>\r\n        <mat-optgroup *ngFor=\"let group of populationGroups\" [label]=\"group.name\">\r\n          <mat-option class=\"p-4\" *ngFor=\"let subPopulation of group.subPopulations\" [value]=\"subPopulation.value\">\r\n            ({{ subPopulation.value }}) {{ subPopulation.viewValue }}\r\n          </mat-option>\r\n        </mat-optgroup>\r\n      </mat-select>\r\n    </mat-form-field>\r\n  </div>\r\n\r\n  <!-- Choose Reference Gene -->\r\n  <div class=\"col-md-auto p-4\">\r\n    <mat-form-field>\r\n      <mat-label>Reference Gene</mat-label>\r\n      <mat-select #refGene [(value)]=\"selectGene\" required>\r\n        <mat-option *ngFor=\"let gene of geneList\" [value]=\"gene\">\r\n          {{ gene }}\r\n        </mat-option>\r\n      </mat-select>\r\n    </mat-form-field>\r\n  </div>\r\n\r\n</div>\r\n\r\n<br>\r\n\r\n<pre>{{ eqtlData | json }}</pre>\r\n\r\n<pre>{{ geneList }}</pre>\r\n\r\n<pre>{{ selectedPop }}</pre>\r\n"

/***/ }),

/***/ "./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.ts":
/*!***************************************************************************************!*\
  !*** ./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.ts ***!
  \***************************************************************************************/
/*! exports provided: EqtlResultsLocuszoomComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqtlResultsLocuszoomComponent", function() { return EqtlResultsLocuszoomComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/eqtl-results.service */ "./src/app/services/eqtl-results.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EqtlResultsLocuszoomComponent = /** @class */ (function () {
    function EqtlResultsLocuszoomComponent(data) {
        this.data = data;
    }
    EqtlResultsLocuszoomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.currentEqtlData.subscribe(function (eqtlData) {
            if (eqtlData) {
                _this.eqtlData = eqtlData[1];
            }
            if (_this.eqtlData) {
                _this.data.currentGeneList.subscribe(function (geneList) {
                    _this.geneList = geneList;
                    if (_this.geneList) {
                        _this.selectGene = _this.geneList[0]; //default reference gen
                    }
                });
            }
        });
        this.populationGroups = this.populatePopulationDropdown();
        this.selectedPop = ["CEU"]; // default population
        this.populationSelectedAll = false;
    };
    EqtlResultsLocuszoomComponent.prototype.populatePopulationDropdown = function () {
        var populations = [
            {
                namecode: "AFR",
                name: "African",
                subPopulations: [
                    { value: "YRI", viewValue: "Yoruba in Ibadan, Nigera" },
                    { value: "LWK", viewValue: "Luhya in Webuye, Kenya" },
                    { value: "GWD", viewValue: "Gambian in Western Gambia" },
                    { value: "MSL", viewValue: "Mende in Sierra Leone" },
                    { value: "ESN", viewValue: "Esan in Nigera" },
                    { value: "ASW", viewValue: "Americans of African Ancestry in SW USA" },
                    { value: "ACB", viewValue: "African Carribbeans in Barbados" },
                ]
            },
            {
                namecode: 'AMR',
                name: "Ad Mixed American",
                subPopulations: [
                    { value: "MXL", viewValue: "Mexican Ancestry from Los Angeles, USA" },
                    { value: "PUR", viewValue: "Puerto Ricans from Puerto Rico" },
                    { value: "CLM", viewValue: "Colombians from Medellin, Colombia" },
                    { value: "PEL", viewValue: "Peruvians from Lima, Peru" },
                ]
            },
            {
                namecode: "EAS",
                name: "East Asian",
                subPopulations: [
                    { value: "CHB", viewValue: "Han Chinese in Bejing, China" },
                    { value: "JPT", viewValue: "Japanese in Tokyo, Japan" },
                    { value: "CHS", viewValue: "Southern Han Chinese" },
                    { value: "CDX", viewValue: "Chinese Dai in Xishuangbanna, China" },
                    { value: "KHV", viewValue: "Kinh in Ho Chi Minh City, Vietnam" },
                ]
            },
            {
                namecode: "EUR",
                name: "European",
                subPopulations: [
                    { value: "CEU", viewValue: "Utah Residents from North and West Europe" },
                    { value: "TSI", viewValue: "Toscani in Italia" },
                    { value: "FIN", viewValue: "Finnish in Finland" },
                    { value: "GBR", viewValue: "British in England and Scotland" },
                    { value: "IBS", viewValue: "Iberian population in Spain" },
                ]
            },
            {
                namecode: "SAS",
                name: "South Asian",
                subPopulations: [
                    { value: "GIH", viewValue: "Gujarati Indian from Houston, Texas" },
                    { value: "PJL", viewValue: "Punjabi from Lahore, Pakistan" },
                    { value: "BEB", viewValue: "Bengali from Bangladesh" },
                    { value: "STU", viewValue: "Sri Lankan Tamil from the UK" },
                    { value: "ITU", viewValue: "Indian Telugu from the UK" },
                ]
            }
        ];
        return populations;
    };
    EqtlResultsLocuszoomComponent.prototype.selectAll = function () {
        console.log("DO SOMETHING");
        if (this.selectedPop.length == 26 && this.populationSelectedAll == true) {
            this.selectedPop = [];
            this.populationSelectedAll = false;
        }
        else if (this.selectedPop.length < 26 || this.populationSelectedAll == false) {
            this.selectedPop = ["ACB", "ASW", "BEB", "CDX", "CEU", "CHB", "CHS", "CLM", "ESN", "FIN", "GBR", "GIH", "GWD", "IBS", "ITU", "JPT", "KHV", "LWK", "MSL", "MXL", "PEL", "PJL", "PUR", "STU", "TSI", "YRI"];
            this.populationSelectedAll = true;
        }
        else {
            // do nothing
        }
    };
    EqtlResultsLocuszoomComponent.prototype.changePop = function () {
        if (this.selectedPop.length < 26) {
            this.populationSelectedAll = false;
        }
        else {
            this.populationSelectedAll = true;
        }
    };
    EqtlResultsLocuszoomComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-eqtl-results-locuszoom',
            template: __webpack_require__(/*! ./eqtl-results-locuszoom.component.html */ "./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.html"),
            styles: [__webpack_require__(/*! ./eqtl-results-locuszoom.component.css */ "./src/app/components/eqtl-results-locuszoom/eqtl-results-locuszoom.component.css")]
        }),
        __metadata("design:paramtypes", [_services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__["EqtlResultsService"]])
    ], EqtlResultsLocuszoomComponent);
    return EqtlResultsLocuszoomComponent;
}());



/***/ }),

/***/ "./src/app/components/eqtl-results-table/eqtl-results-table.component.css":
/*!********************************************************************************!*\
  !*** ./src/app/components/eqtl-results-table/eqtl-results-table.component.css ***!
  \********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/eqtl-results-table/eqtl-results-table.component.html":
/*!*********************************************************************************!*\
  !*** ./src/app/components/eqtl-results-table/eqtl-results-table.component.html ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\n  eqtl-results-table works!\n</p>\n"

/***/ }),

/***/ "./src/app/components/eqtl-results-table/eqtl-results-table.component.ts":
/*!*******************************************************************************!*\
  !*** ./src/app/components/eqtl-results-table/eqtl-results-table.component.ts ***!
  \*******************************************************************************/
/*! exports provided: EqtlResultsTableComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqtlResultsTableComponent", function() { return EqtlResultsTableComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var EqtlResultsTableComponent = /** @class */ (function () {
    function EqtlResultsTableComponent() {
    }
    EqtlResultsTableComponent.prototype.ngOnInit = function () {
    };
    EqtlResultsTableComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-eqtl-results-table',
            template: __webpack_require__(/*! ./eqtl-results-table.component.html */ "./src/app/components/eqtl-results-table/eqtl-results-table.component.html"),
            styles: [__webpack_require__(/*! ./eqtl-results-table.component.css */ "./src/app/components/eqtl-results-table/eqtl-results-table.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], EqtlResultsTableComponent);
    return EqtlResultsTableComponent;
}());



/***/ }),

/***/ "./src/app/components/eqtl-results/eqtl-results.component.css":
/*!********************************************************************!*\
  !*** ./src/app/components/eqtl-results/eqtl-results.component.css ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/eqtl-results/eqtl-results.component.html":
/*!*********************************************************************!*\
  !*** ./src/app/components/eqtl-results/eqtl-results.component.html ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div *ngIf=\"resultStatus\">\r\n  <div class=\"mt-5 d-flex justify-content-center\" *ngIf=\"!eqtlData && !errorMessage\" id=\"results\">\r\n    <mat-spinner></mat-spinner>\r\n  </div>\r\n\r\n  <div *ngIf=\"eqtlData\" id=\"results\">\r\n    <mat-tab-group>\r\n      <div class=\"row\">\r\n\r\n        <!-- Gene Expressions Result Tab -->\r\n        <mat-tab label=\"Gene Expressions\"> \r\n          <div class=\"col border border-light rounded\" id=\"result-main\">\r\n            <app-eqtl-results-gene-expressions></app-eqtl-results-gene-expressions>\r\n          </div>\r\n        </mat-tab>\r\n\r\n        <!-- Locuszoom Result Tab -->\r\n        <mat-tab label=\"Locuszoom Plot\"> \r\n          <div class=\"col border border-light rounded\" id=\"result-main\">\r\n            <app-eqtl-results-locuszoom></app-eqtl-results-locuszoom>\r\n          </div>\r\n        </mat-tab>\r\n\r\n        <!-- Table Result Tab -->\r\n        <mat-tab label=\"Table\"> \r\n          <div class=\"col border border-light rounded\" id=\"result-main\">\r\n            <app-eqtl-results-table></app-eqtl-results-table>\r\n          </div>\r\n        </mat-tab>\r\n        \r\n      </div>\r\n    </mat-tab-group>\r\n  </div>\r\n</div>"

/***/ }),

/***/ "./src/app/components/eqtl-results/eqtl-results.component.ts":
/*!*******************************************************************!*\
  !*** ./src/app/components/eqtl-results/eqtl-results.component.ts ***!
  \*******************************************************************/
/*! exports provided: EqtlResultsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqtlResultsComponent", function() { return EqtlResultsComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../services/eqtl-results.service */ "./src/app/services/eqtl-results.service.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var EqtlResultsComponent = /** @class */ (function () {
    function EqtlResultsComponent(data) {
        this.data = data;
    }
    EqtlResultsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.currentEqtlData.subscribe(function (eqtlData) { return _this.eqtlData = eqtlData; });
        this.data.currentResultStatus.subscribe(function (resultStatus) { return _this.resultStatus = resultStatus; });
        this.data.currentErrorMessage.subscribe(function (errorMessage) { return _this.errorMessage = errorMessage; });
    };
    EqtlResultsComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-eqtl-results',
            template: __webpack_require__(/*! ./eqtl-results.component.html */ "./src/app/components/eqtl-results/eqtl-results.component.html"),
            styles: [__webpack_require__(/*! ./eqtl-results.component.css */ "./src/app/components/eqtl-results/eqtl-results.component.css")]
        }),
        __metadata("design:paramtypes", [_services_eqtl_results_service__WEBPACK_IMPORTED_MODULE_1__["EqtlResultsService"]])
    ], EqtlResultsComponent);
    return EqtlResultsComponent;
}());



/***/ }),

/***/ "./src/app/components/footer/footer.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/footer/footer.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/footer/footer.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/footer/footer.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<footer class=\"text-left text-md-center pt-4 pb-4 bg-primary-light text-light flex-none\">\r\n    <div class=\"container\">\r\n        <ul class=\"list-inline  text-light\">\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://www.cancer.gov/\">Home</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_top\" href=\"mailto:NCIAuthorArrangerWebAdmin@mail.nih.gov?subject=AuthorArranger%20Support\">Support</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://www.cancer.gov/global/web/policies\">Policies</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://www.cancer.gov/global/web/policies/accessibility\">Accessibility</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://cancer.gov/global/viewing-files\">Viewing Files</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://www.cancer.gov/global/web/policies/foia\">FOIA</a>\r\n        </li>\r\n        </ul>\r\n        <ul class=\"list-inline\">\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://www.hhs.gov/\">U.S. Department of Health and Human Services</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://www.nih.gov\">National Institutes of Health</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://www.cancer.gov/\">National Cancer Institute</a>\r\n        </li>\r\n        <li class=\"pb-1 d-none d-md-inline\">|</li>\r\n        <li class=\"pb-1 d-block d-md-inline\">\r\n            <a class=\" text-light m-1\" target=\"_blank\" href=\"https://usa.gov\">USA.gov</a>\r\n        </li>\r\n        </ul>\r\n        <div>\r\n        NIH ... Turning Discovery Into Health\r\n        <sup>&reg;</sup>\r\n        </div>\r\n    </div>\r\n</footer>"

/***/ }),

/***/ "./src/app/components/footer/footer.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/footer/footer.component.ts ***!
  \*******************************************************/
/*! exports provided: FooterComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FooterComponent", function() { return FooterComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var FooterComponent = /** @class */ (function () {
    function FooterComponent() {
    }
    FooterComponent.prototype.ngOnInit = function () {
    };
    FooterComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-footer',
            template: __webpack_require__(/*! ./footer.component.html */ "./src/app/components/footer/footer.component.html"),
            styles: [__webpack_require__(/*! ./footer.component.css */ "./src/app/components/footer/footer.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], FooterComponent);
    return FooterComponent;
}());



/***/ }),

/***/ "./src/app/components/help/help.component.css":
/*!****************************************************!*\
  !*** ./src/app/components/help/help.component.css ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/help/help.component.html":
/*!*****************************************************!*\
  !*** ./src/app/components/help/help.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  help works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/components/help/help.component.ts":
/*!***************************************************!*\
  !*** ./src/app/components/help/help.component.ts ***!
  \***************************************************/
/*! exports provided: HelpComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HelpComponent", function() { return HelpComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HelpComponent = /** @class */ (function () {
    function HelpComponent() {
    }
    HelpComponent.prototype.ngOnInit = function () {
    };
    HelpComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-help',
            template: __webpack_require__(/*! ./help.component.html */ "./src/app/components/help/help.component.html"),
            styles: [__webpack_require__(/*! ./help.component.css */ "./src/app/components/help/help.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], HelpComponent);
    return HelpComponent;
}());



/***/ }),

/***/ "./src/app/components/home/home.component.css":
/*!****************************************************!*\
  !*** ./src/app/components/home/home.component.css ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/home/home.component.html":
/*!*****************************************************!*\
  !*** ./src/app/components/home/home.component.html ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  <b>vQTL</b> is an online tool for interactively exploring multiple QTL results and prioritizing variants for functional investigation.\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/components/home/home.component.ts":
/*!***************************************************!*\
  !*** ./src/app/components/home/home.component.ts ***!
  \***************************************************/
/*! exports provided: HomeComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "HomeComponent", function() { return HomeComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var HomeComponent = /** @class */ (function () {
    function HomeComponent() {
    }
    HomeComponent.prototype.ngOnInit = function () {
    };
    HomeComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-home',
            template: __webpack_require__(/*! ./home.component.html */ "./src/app/components/home/home.component.html"),
            styles: [__webpack_require__(/*! ./home.component.css */ "./src/app/components/home/home.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], HomeComponent);
    return HomeComponent;
}());



/***/ }),

/***/ "./src/app/components/me-qtl/me-qtl.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/me-qtl/me-qtl.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/me-qtl/me-qtl.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/me-qtl/me-qtl.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  me-qtl works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/components/me-qtl/me-qtl.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/me-qtl/me-qtl.component.ts ***!
  \*******************************************************/
/*! exports provided: MeQTLComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MeQTLComponent", function() { return MeQTLComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MeQTLComponent = /** @class */ (function () {
    function MeQTLComponent() {
    }
    MeQTLComponent.prototype.ngOnInit = function () {
    };
    MeQTLComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-me-qtl',
            template: __webpack_require__(/*! ./me-qtl.component.html */ "./src/app/components/me-qtl/me-qtl.component.html"),
            styles: [__webpack_require__(/*! ./me-qtl.component.css */ "./src/app/components/me-qtl/me-qtl.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], MeQTLComponent);
    return MeQTLComponent;
}());



/***/ }),

/***/ "./src/app/components/mi-qtl/mi-qtl.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/mi-qtl/mi-qtl.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/mi-qtl/mi-qtl.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/mi-qtl/mi-qtl.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  mi-qtl works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/components/mi-qtl/mi-qtl.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/mi-qtl/mi-qtl.component.ts ***!
  \*******************************************************/
/*! exports provided: MiQTLComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MiQTLComponent", function() { return MiQTLComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var MiQTLComponent = /** @class */ (function () {
    function MiQTLComponent() {
    }
    MiQTLComponent.prototype.ngOnInit = function () {
    };
    MiQTLComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-mi-qtl',
            template: __webpack_require__(/*! ./mi-qtl.component.html */ "./src/app/components/mi-qtl/mi-qtl.component.html"),
            styles: [__webpack_require__(/*! ./mi-qtl.component.css */ "./src/app/components/mi-qtl/mi-qtl.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], MiQTLComponent);
    return MiQTLComponent;
}());



/***/ }),

/***/ "./src/app/components/navbar/navbar.component.css":
/*!********************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.css ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/navbar/navbar.component.html":
/*!*********************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.html ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<div class=\"bg-primary-light text-light d-none d-sm-block\">\r\n    <div class=\"container pt-1 pb-1\">\r\n      <span style=\"font-size: 1.1rem; font-weight: 600\">Mean-<b><font color='#F5Ab35'>V</font></b>ariances <b><font color='#F5Ab35'>Q</font></b>uantitative <b><font color='#F5Ab35'>T</font></b>rait <b><font color='#F5Ab35'>L</font></b>ocus (vQTL)</span>\r\n    </div>\r\n</div>\r\n<nav class=\"navbar navbar-expand-sm navbar-dark shadow-sm bg-dark-gradient text-light py-0\">\r\n  <div class=\"container\">\r\n    <a class=\"navbar-brand d-sm-none\" href=\"#\"><span style=\"font-size: 1.1rem; font-weight: 600\">vQTL</span></a>\r\n    <ul class=\"navbar-nav\">\r\n        <!-- Home -->\r\n        <li class=\"nav-item mr-2\">\r\n            <a \r\n              routerLink=\"/home\"\r\n              routerLinkActive=\"active\"\r\n              [routerLinkActiveOptions]=\"{exact: true}\"\r\n              class=\"nav-link\">\r\n              Home\r\n            </a>\r\n        </li>\r\n        <!-- eQTL -->\r\n        <li class=\"nav-item mr-2\">\r\n            <a \r\n              routerLink=\"/eqtl\"\r\n              routerLinkActive=\"active\"\r\n              [routerLinkActiveOptions]=\"{exact: true}\"\r\n              class=\"nav-link\">\r\n              eQTL\r\n            </a>\r\n        </li>\r\n        <!-- sQTL -->\r\n        <li class=\"nav-item mr-2\">\r\n            <a \r\n              routerLink=\"/sqtl\"\r\n              routerLinkActive=\"active\"\r\n              [routerLinkActiveOptions]=\"{exact: true}\"\r\n              class=\"nav-link\">\r\n              sQTL\r\n            </a>\r\n        </li>\r\n        <!-- meQTL -->\r\n        <li class=\"nav-item mr-2\">\r\n            <a \r\n              routerLink=\"/meqtl\"\r\n              routerLinkActive=\"active\"\r\n              [routerLinkActiveOptions]=\"{exact: true}\"\r\n              class=\"nav-link\">\r\n              meQTL\r\n            </a>\r\n        </li>\r\n        <!-- miQTL -->\r\n        <li class=\"nav-item mr-2\">\r\n            <a \r\n              routerLink=\"/miqtl\"\r\n              routerLinkActive=\"active\"\r\n              [routerLinkActiveOptions]=\"{exact: true}\"\r\n              class=\"nav-link\">\r\n              miQTL\r\n            </a>\r\n        </li>\r\n        <!-- QTL Interaction -->\r\n        <li class=\"nav-item mr-2\">\r\n            <a \r\n              routerLink=\"/qtl-interaction\"\r\n              routerLinkActive=\"active\"\r\n              [routerLinkActiveOptions]=\"{exact: true}\"\r\n              class=\"nav-link\">\r\n              QTL Interaction\r\n            </a>\r\n        </li>\r\n        <!-- Help -->\r\n        <li class=\"nav-item mr-2\">\r\n            <a \r\n              routerLink=\"/help\"\r\n              routerLinkActive=\"active\"\r\n              [routerLinkActiveOptions]=\"{exact: true}\"\r\n              class=\"nav-link\">\r\n              Help\r\n            </a>\r\n        </li>\r\n    </ul>\r\n  </div>\r\n</nav>"

/***/ }),

/***/ "./src/app/components/navbar/navbar.component.ts":
/*!*******************************************************!*\
  !*** ./src/app/components/navbar/navbar.component.ts ***!
  \*******************************************************/
/*! exports provided: NavbarComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarComponent", function() { return NavbarComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var NavbarComponent = /** @class */ (function () {
    function NavbarComponent() {
    }
    NavbarComponent.prototype.ngOnInit = function () {
    };
    NavbarComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-navbar',
            template: __webpack_require__(/*! ./navbar.component.html */ "./src/app/components/navbar/navbar.component.html"),
            styles: [__webpack_require__(/*! ./navbar.component.css */ "./src/app/components/navbar/navbar.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], NavbarComponent);
    return NavbarComponent;
}());



/***/ }),

/***/ "./src/app/components/qtl-interaction/qtl-interaction.component.css":
/*!**************************************************************************!*\
  !*** ./src/app/components/qtl-interaction/qtl-interaction.component.css ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/qtl-interaction/qtl-interaction.component.html":
/*!***************************************************************************!*\
  !*** ./src/app/components/qtl-interaction/qtl-interaction.component.html ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  qtl-interaction works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/components/qtl-interaction/qtl-interaction.component.ts":
/*!*************************************************************************!*\
  !*** ./src/app/components/qtl-interaction/qtl-interaction.component.ts ***!
  \*************************************************************************/
/*! exports provided: QTLInteractionComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "QTLInteractionComponent", function() { return QTLInteractionComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var QTLInteractionComponent = /** @class */ (function () {
    function QTLInteractionComponent() {
    }
    QTLInteractionComponent.prototype.ngOnInit = function () {
    };
    QTLInteractionComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-qtlinteraction',
            template: __webpack_require__(/*! ./qtl-interaction.component.html */ "./src/app/components/qtl-interaction/qtl-interaction.component.html"),
            styles: [__webpack_require__(/*! ./qtl-interaction.component.css */ "./src/app/components/qtl-interaction/qtl-interaction.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], QTLInteractionComponent);
    return QTLInteractionComponent;
}());



/***/ }),

/***/ "./src/app/components/s-qtl/s-qtl.component.css":
/*!******************************************************!*\
  !*** ./src/app/components/s-qtl/s-qtl.component.css ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/components/s-qtl/s-qtl.component.html":
/*!*******************************************************!*\
  !*** ./src/app/components/s-qtl/s-qtl.component.html ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<p>\r\n  s-qtl works!\r\n</p>\r\n"

/***/ }),

/***/ "./src/app/components/s-qtl/s-qtl.component.ts":
/*!*****************************************************!*\
  !*** ./src/app/components/s-qtl/s-qtl.component.ts ***!
  \*****************************************************/
/*! exports provided: SQTLComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SQTLComponent", function() { return SQTLComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var SQTLComponent = /** @class */ (function () {
    function SQTLComponent() {
    }
    SQTLComponent.prototype.ngOnInit = function () {
    };
    SQTLComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-s-qtl',
            template: __webpack_require__(/*! ./s-qtl.component.html */ "./src/app/components/s-qtl/s-qtl.component.html"),
            styles: [__webpack_require__(/*! ./s-qtl.component.css */ "./src/app/components/s-qtl/s-qtl.component.css")]
        }),
        __metadata("design:paramtypes", [])
    ], SQTLComponent);
    return SQTLComponent;
}());



/***/ }),

/***/ "./src/app/directives/file-value-accessor.directive.ts":
/*!*************************************************************!*\
  !*** ./src/app/directives/file-value-accessor.directive.ts ***!
  \*************************************************************/
/*! exports provided: FileValueAccessorDirective */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FileValueAccessorDirective", function() { return FileValueAccessorDirective; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var FileValueAccessorDirective = /** @class */ (function () {
    function FileValueAccessorDirective(hostElement) {
        this.hostElement = hostElement;
        this.onTouched = function () { };
        this.onChange = function (_) { };
    }
    FileValueAccessorDirective_1 = FileValueAccessorDirective;
    FileValueAccessorDirective.prototype.writeValue = function (value) { if (!value)
        this.hostElement.nativeElement.value = ''; };
    FileValueAccessorDirective.prototype.registerOnChange = function (fn) { this.onChange = fn; };
    FileValueAccessorDirective.prototype.registerOnTouched = function (fn) { this.onTouched = fn; };
    FileValueAccessorDirective = FileValueAccessorDirective_1 = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Directive"])({
            selector: "input[type=file]",
            host: {
                "(change)": "onChange($event.target.files)",
                "(blur)": "onTouched()"
            },
            providers: [
                { provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__["NG_VALUE_ACCESSOR"], useExisting: FileValueAccessorDirective_1, multi: true }
            ]
        }),
        __metadata("design:paramtypes", [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ElementRef"]])
    ], FileValueAccessorDirective);
    return FileValueAccessorDirective;
    var FileValueAccessorDirective_1;
}());



/***/ }),

/***/ "./src/app/router/app-routing.module.ts":
/*!**********************************************!*\
  !*** ./src/app/router/app-routing.module.ts ***!
  \**********************************************/
/*! exports provided: AppRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppRoutingModule", function() { return AppRoutingModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _components_home_home_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../components/home/home.component */ "./src/app/components/home/home.component.ts");
/* harmony import */ var _components_e_qtl_e_qtl_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/e-qtl/e-qtl.component */ "./src/app/components/e-qtl/e-qtl.component.ts");
/* harmony import */ var _components_s_qtl_s_qtl_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../components/s-qtl/s-qtl.component */ "./src/app/components/s-qtl/s-qtl.component.ts");
/* harmony import */ var _components_me_qtl_me_qtl_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../components/me-qtl/me-qtl.component */ "./src/app/components/me-qtl/me-qtl.component.ts");
/* harmony import */ var _components_mi_qtl_mi_qtl_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../components/mi-qtl/mi-qtl.component */ "./src/app/components/mi-qtl/mi-qtl.component.ts");
/* harmony import */ var _components_qtl_interaction_qtl_interaction_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../components/qtl-interaction/qtl-interaction.component */ "./src/app/components/qtl-interaction/qtl-interaction.component.ts");
/* harmony import */ var _components_help_help_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../components/help/help.component */ "./src/app/components/help/help.component.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









var routes = [
    { path: 'home', component: _components_home_home_component__WEBPACK_IMPORTED_MODULE_2__["HomeComponent"] },
    { path: 'eqtl', component: _components_e_qtl_e_qtl_component__WEBPACK_IMPORTED_MODULE_3__["EQTLComponent"] },
    { path: 'sqtl', component: _components_s_qtl_s_qtl_component__WEBPACK_IMPORTED_MODULE_4__["SQTLComponent"] },
    { path: 'meqtl', component: _components_me_qtl_me_qtl_component__WEBPACK_IMPORTED_MODULE_5__["MeQTLComponent"] },
    { path: 'miqtl', component: _components_mi_qtl_mi_qtl_component__WEBPACK_IMPORTED_MODULE_6__["MiQTLComponent"] },
    { path: 'eqtl', component: _components_e_qtl_e_qtl_component__WEBPACK_IMPORTED_MODULE_3__["EQTLComponent"] },
    { path: 'qtl-interaction', component: _components_qtl_interaction_qtl_interaction_component__WEBPACK_IMPORTED_MODULE_7__["QTLInteractionComponent"] },
    { path: 'help', component: _components_help_help_component__WEBPACK_IMPORTED_MODULE_8__["HelpComponent"] },
    { path: '**', redirectTo: '/home', pathMatch: 'full' } // Home
    // { path: '**', redirectTo: '' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forRoot(routes, { useHash: true })],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());



/***/ }),

/***/ "./src/app/services/eqtl-results.service.ts":
/*!**************************************************!*\
  !*** ./src/app/services/eqtl-results.service.ts ***!
  \**************************************************/
/*! exports provided: EqtlResultsService */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EqtlResultsService", function() { return EqtlResultsService; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../environments/environment */ "./src/environments/environment.ts");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var EqtlResultsService = /** @class */ (function () {
    function EqtlResultsService(http) {
        this.http = http;
        // data output from R calculation to plot
        this.eqtlDataSource = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](null);
        this.currentEqtlData = this.eqtlDataSource.asObservable();
        // data output from R calculation to plot
        this.geneList = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]([]);
        this.currentGeneList = this.geneList.asObservable();
        // boolean: true=show results container
        this.resultStatus = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"](false);
        this.currentResultStatus = this.resultStatus.asObservable();
        // error message output from R calculation
        this.errorMessage = new rxjs__WEBPACK_IMPORTED_MODULE_1__["BehaviorSubject"]('');
        this.currentErrorMessage = this.errorMessage.asObservable();
    }
    EqtlResultsService.prototype.getResults = function (formData) {
        var url = _environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].endpoint + '/upload-file';
        return this.http.post(url, formData);
    };
    EqtlResultsService.prototype.changeEqtlData = function (eqtlData) {
        this.eqtlDataSource.next(eqtlData);
    };
    EqtlResultsService.prototype.changeGeneList = function (geneList) {
        this.geneList.next(geneList);
    };
    EqtlResultsService.prototype.changeResultStatus = function (resultStatus) {
        this.resultStatus.next(resultStatus);
    };
    EqtlResultsService.prototype.changeErrorMessage = function (errorMessage) {
        this.errorMessage.next(errorMessage);
    };
    EqtlResultsService = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Injectable"])({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_2__["HttpClient"]])
    ], EqtlResultsService);
    return EqtlResultsService;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false,
    endpoint: 'http://localhost:3000'
};
/*
 * In development mode, for easier debugging, you can ignore zone related error
 * stack frames such as `zone.run`/`zoneDelegate.invokeTask` by importing the
 * below file. Don't forget to comment it out in production mode
 * because it will have a performance impact when errors are thrown
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! hammerjs */ "./node_modules/hammerjs/hammer.js");
/* harmony import */ var hammerjs__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(hammerjs__WEBPACK_IMPORTED_MODULE_4__);





if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! C:\Users\jiangk3\Desktop\nci-webtools-dceg-vQTL\src\main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map