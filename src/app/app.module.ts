import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
