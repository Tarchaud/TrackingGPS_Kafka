import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapComponent } from './map/map.component';

const routes: Routes = [
  { path :  'Tracking', component: MapComponent },
  { path :  '', redirectTo: '/Tracking', pathMatch: 'full' },
  { path :  '**', redirectTo: '/Tracking', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
