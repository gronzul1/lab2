import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppsettingsService {

  settings: any | undefined;

  public setIdToken(token: string) {
    localStorage.setItem('id_token', token);
  }
  public setAccessToken(token: string) {
    localStorage.setItem("access_token", token);
  }

  public logout() {
    localStorage.clear();
  }

}
