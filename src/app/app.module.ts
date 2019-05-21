import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { QTLsComponent } from './components/QTLs/qtls-analysis/qtls-analysis.component';
import { SQTLComponent } from './components/s-qtl/s-qtl.component';
import { MeQTLComponent } from './components/me-qtl/me-qtl.component';
import { MiQTLComponent } from './components/mi-qtl/mi-qtl.component';
import { QTLInteractionComponent } from './components/qtl-interaction/qtl-interaction.component';
import { HelpComponent } from './components/help/help.component';
import { AppRoutingModule } from './router/app-routing.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { QTLsDataInputsComponent } from './components/QTLs/qtls-data-inputs/qtls-data-inputs.component';
import { QTLsErrorMessagesComponent } from './components/QTLs/qtls-error-messages/qtls-error-messages.component';
import { QTLsResultsComponent } from './components/QTLs/qtls-results/qtls-results.component';
import { QTLsLocusQuanitificationComponent } from './components/QTLs/qtls-locus-quantification/qtls-locus-quantification.component';
import { QTLsLocusAlignmentComponent } from './components/QTLs/qtls-locus-alignment/qtls-locus-alignment.component';
import { QTLsLocusAlignmentBoxplotsComponent } from './components/QTLs/qtls-locus-alignment-boxplots/qtls-locus-alignment-boxplots.component';
import { QTLsLocusTableComponent } from './components/QTLs/qtls-locus-table/qtls-locus-table.component';
import { QTLsCalculationInputsComponent } from './components/QTLs/qtls-calculation-inputs/qtls-calculation-inputs.component';

import { FileValueAccessorDirective } from './directives/file-value-accessor.directive';
import { PlotlyModule } from 'angular-plotly.js';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { 
  MatButtonModule, 
  MatCheckboxModule, 
  MatGridListModule, 
  MatSelectModule, 
  MatInputModule, 
  MatTabsModule, 
  MatProgressSpinnerModule, 
  MatFormFieldModule, 
  MatDialogModule, 
  MatTableModule, 
  MatPaginatorModule, 
  MatSortModule, 
  MatIconModule, 
  MatAutocompleteModule 
} from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    QTLsComponent,
    SQTLComponent,
    MeQTLComponent,
    MiQTLComponent,
    QTLInteractionComponent,
    HelpComponent,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    QTLsDataInputsComponent,
    QTLsResultsComponent,
    FileValueAccessorDirective,
    QTLsLocusQuanitificationComponent,
    QTLsLocusAlignmentComponent,
    QTLsLocusTableComponent,
    QTLsLocusAlignmentBoxplotsComponent,
    QTLsErrorMessagesComponent,
    QTLsCalculationInputsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    PlotlyModule,
    MatButtonModule, //import need UI modules
    MatCheckboxModule,
    MatGridListModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [QTLsLocusAlignmentBoxplotsComponent]
})
export class AppModule { }
