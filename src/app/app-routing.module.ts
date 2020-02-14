import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from '../app/index/index.component';
import { LoginComponent } from './login/login.component';


const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path:'index', component:IndexComponent
  },
  { path:'login', component:LoginComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
