import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingsService } from './appsettings.service';

const httpOptions = {
  headers: new HttpHeaders(
    {
      'Content-Type': 'application/json'
    }
  )
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  proxyAPI_URL: string  = "http://localhost:4200/Prod";
  products_res: string = "";
  feedback_res: string = "";

  constructor(private http: HttpClient, private fxCfg: AppsettingsService) {
    this.proxyAPI_URL  =  fxCfg.settings.ApiGateway.API_URL;
    this.products_res = fxCfg.settings.ApiGateway.products_res;
    this.feedback_res = fxCfg.settings.ApiGateway.feedback_res;
  }
  getProducts() {
    let data = {
      "TableName": this.fxCfg.settings.ddb.productTable
    }
    return this.http.post(this.proxyAPI_URL + this.products_res, data, httpOptions);
  }
  
  getProducts2() {  
    return this.http.get(this.proxyAPI_URL + this.products_res,  httpOptions);
  }

  saveFeedback(fdb: any) {
    let d = new Date();
    const unixtime = d.valueOf();

    let data = JSON.stringify({
      "feeebackDate": unixtime,
      "productId": fdb.ProductId,
      "productName": fdb.ProductName,
      "rating": fdb.rating
    });
    return this.http.put(this.proxyAPI_URL + this.feedback_res, data,httpOptions);
  }

  getFeedback() {       
    let data = {
      "TableName": this.fxCfg.settings.ddb.feedbackTable
    }
    return this.http.post(this.proxyAPI_URL + this.feedback_res, data,httpOptions);
  }
}