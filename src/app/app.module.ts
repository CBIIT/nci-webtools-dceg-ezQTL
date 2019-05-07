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
import { EqtlMessagesComponent } from './components/eqtl-messages/eqtl-messages.component';
import { EqtlResultsComponent } from './components/eqtl-results/eqtl-results.component';
import { EqtlResultsGeneExpressionsComponent } from './components/eqtl-results-gene-expressions/eqtl-results-gene-expressions.component';
import { EqtlResultsLocuszoomComponent } from './components/eqtl-results-locuszoom/eqtl-results-locuszoom.component';
import { EqtlResultsLocuszoomBoxplotsComponent } from './components/eqtl-results-locuszoom-boxplots/eqtl-results-locuszoom-boxplots.component';
import { EqtlResultsTableComponent } from './components/eqtl-results-table/eqtl-results-table.component';

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
  MatIconModule 
} from '@angular/material';

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
    MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [EqtlResultsLocuszoomBoxplotsComponent]
})
export class AppModule { }
