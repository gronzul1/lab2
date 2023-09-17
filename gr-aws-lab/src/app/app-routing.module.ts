import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AddUserComponent } from './OLD/add-user/add-user.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { MngdataComponent } from './mngdata/mngdata.component';

const routes: Routes = [
  // {path: 'home', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'prodfbk', component: FeedbackComponent},  
  {path: 'mngdata', component: MngdataComponent},  
  {path: 'adduser', component: AddUserComponent},
  { path: '**', redirectTo: 'home'},
  { path: '', redirectTo: 'home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
