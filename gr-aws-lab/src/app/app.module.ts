import { APP_INITIALIZER, NgModule, inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';
import { TableModule } from 'primeng/table';
import { HomeComponent } from './home/home.component';
import { NavComponent } from './_nav/nav.component';
import { AddUserComponent } from './OLD/add-user/add-user.component';
import { InputTextModule } from 'primeng/inputtext';
import { InputMaskModule } from 'primeng/inputmask';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { FeedbackComponent } from './feedback/feedback.component';
import { MngdataComponent } from './mngdata/mngdata.component';
import { RatingModule } from 'primeng/rating';
import { DataViewModule, DataViewLayoutOptions } from 'primeng/dataview';
import { ChartModule } from 'primeng/chart';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { MessagesModule } from 'primeng/messages';
import { MessageService } from 'primeng/api';
import { FbktableComponent } from './mngdata/fbktable/fbktable.component';
import { FbkchartComponent } from './mngdata/fbkchart/fbkchart.component';
import { AppsettingsService } from './_services/appsettings.service';
import { authInterceptorProviders } from './_services/auth.interceptor';
import { LabTextComponent } from './home/lab-text/lab-text.component';
import { TestpageComponent } from './home/testpage/testpage.component';
import { UserListComponent } from './OLD/user-list/user-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavComponent,
    AddUserComponent,
    FeedbackComponent,
    MngdataComponent,
    FbktableComponent,
    FbkchartComponent,
    LabTextComponent,    
    TestpageComponent, UserListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    MenubarModule,
    TableModule,
    InputTextModule,
    InputMaskModule,
    DropdownModule,
    MessagesModule,
    ToastModule,
    RatingModule,
    DataViewModule,
    ChartModule,
    ProgressSpinnerModule,
  ],
  providers: [    
    authInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      useFactory: () => {
        const fxCfg = inject(AppsettingsService);
        return () =>
          new Promise((resolve) => {
            const setting = require("../assets/params.json");
            fxCfg.settings = setting;
            resolve(true);
          });
      },
      multi: true,
    },
    MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
