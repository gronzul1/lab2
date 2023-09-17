import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { AppsettingsService } from '../_services/appsettings.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  mnu_items: MenuItem[] = [];
  linkLogin: string = "";
  linkLogout: string = "";
  loginVisible: boolean=true;

  constructor(
    private fxCfg: AppsettingsService,
    private router: Router){}

  ngOnInit(): void {
    const idToken = localStorage.getItem('id_token') || "";
    this.loginVisible = idToken.length>0? false: true;

    
    this.getMnuItems();
    this.linkLogin = this.fxCfg.settings.cognito.appurl;
    // this.linkLogout = this.fxCfg.settings.cognito.logouturl    
    
  }

  Logout(){
    this.fxCfg.logout();
  }
  // Login(){
  //   // this.router.navigateByUrl(this.fxCfg.settings.cognito.appurl);
  //   this.router.navigate(this.fxCfg.settings.cognito.appurl)
  // }
  getMnuItems() {
    this.mnu_items = [
      {
        label: 'Home',
        icon: 'pi pi-home',
        routerLink: "/"
      },
      /*{
        label: 'Add User',
        icon: 'pi pi-user-plus',        
        routerLink: "/adduser"
      },*/
      {
        label: 'User Feedback',
        icon: 'pi pi-pencil',        
        routerLink: "/prodfbk"
      },
      {
        label: 'Admin',
        icon: 'pi pi-fw pi-database',
        visible: !this.loginVisible,
        items: [
          { label: 'User feedback', icon: 'pi pi-user-edit', routerLink:"mngdata" },

        ]
      }
    ];
  }
}


