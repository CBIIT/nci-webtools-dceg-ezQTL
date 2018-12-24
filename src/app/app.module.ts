import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { EQTLComponent } from './components/e-qtl/e-qtl.component';
import { SQTLComponent } from './components/s-qtl/s-qtl.component';
import { MeQTLComponent } from './components/me-qtl/me-qtl.component';
import { MiQTLComponent } from './components/mi-qtl/mi-qtl.component';
import { QTLInteractionComponent } from './components/qtl-interaction/qtl-interaction.component';
import { HelpComponent } from './components/help/help.component';
import { AppRoutingModule } from './router/app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { EqtlInputsComponent } from './components/eqtl-inputs/eqtl-inputs.component';
import { EqtlResultsComponent } from './components/eqtl-results/eqtl-results.component';
import { EqtlResultsGeneExpressionsComponent } from './components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component';
import { EqtlResultsLocuszoomComponent } from './components/eqtl-results-locuszoom/eqtl-results-locuszoom.component';
import { EqtlResultsTableComponent } from './components/eqtl-results-table/eqtl-results-table.component';

import { FileValueAccessorDirective } from './directives/file-value-accessor.directive';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatCheckboxModule } from '@angular/material'; // import needed UI modules
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatInput } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { PlotlyModule } from 'angular-plotly.js';
import { EqtlResultsLocuszoomBoxplotsComponent } from './components/eqtl-results-locuszoom-boxplots/eqtl-results-locuszoom-boxplots.component';
import { EqtlMessagesComponent } from './components/eqtl-messages/eqtl-messages.component';


@NgModule({
  declarations: [
    AppComponent,
    EQTLComponent,
    SQTLComponent,
    MeQTLComponent,
    MiQTLComponent,
    QTLInteractionComponent,
    HelpComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    EqtlInputsComponent,
    EqtlResultsComponent,
    FileValueAccessorDirective,
    EqtlResultsGeneExpressionsComponent,
    EqtlResultsLocuszoomComponent,
    EqtlResultsTableComponent,
    EqtlResultsLocuszoomBoxplotsComponent,
    EqtlMessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule, //import need UI modules
    MatCheckboxModule,
    MatGridListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    PlotlyModule,
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EqtlResultsLocuszoomBoxplotsComponent]
})
export class AppModule { }
