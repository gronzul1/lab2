import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AppsettingsService } from '../_services/appsettings.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private fxCfg: AppsettingsService,
  ) {

  }
  ngOnInit(): void {
    // this.getAllUsers(); 
    this.getToken();

  }

  getToken() {
    this.route.fragment.subscribe(fragment => {
      const searchParams = new URLSearchParams(fragment!);
      let id_token = searchParams.get("id_token") || "";
      if (id_token.length > 0) {
        this.fxCfg.setIdToken(id_token);
      }

      let access_token = searchParams.get("access_token") || "";
      if (access_token.length > 0) {
        this.fxCfg.setAccessToken(access_token);
      }
    })
  }
}
