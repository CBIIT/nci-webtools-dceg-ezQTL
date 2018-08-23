import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { EQTLComponent } from '../components/e-qtl/e-qtl.component';
import { SQTLComponent } from '../components/s-qtl/s-qtl.component';
import { MeQTLComponent } from '../components/me-qtl/me-qtl.component';
import { MiQTLComponent } from '../components/mi-qtl/mi-qtl.component';
import { QTLInteractionComponent } from '../components/qtl-interaction/qtl-interaction.component';
import { HelpComponent } from '../components/help/help.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Home
  { path: 'home', component: HomeComponent },
  { path: 'eqtl', component: EQTLComponent },
  { path: 'sqtl', component: SQTLComponent },
  { path: 'meqtl', component: MeQTLComponent },
  { path: 'miqtl', component: MiQTLComponent },
  { path: 'eqtl', component: EQTLComponent },
  { path: 'qtl-interaction', component: QTLInteractionComponent },
  { path: 'help', component: HelpComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
