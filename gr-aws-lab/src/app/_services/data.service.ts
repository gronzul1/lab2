import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppsettingsService } from './appsettings.service';

const proxyAPI_URL = "http://localhost:4200/Prod";
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
  products_res: string = "";
  feedback_res: string = "";

  constructor(private http: HttpClient, private fxCfg: AppsettingsService) {
    this.products_res = fxCfg.settings.ApiGateway.products_res;
    this.feedback_res = fxCfg.settings.ApiGateway.feedback_res;
  }
  getProducts() {
    let data = {
      "TableName": this.fxCfg.settings.ddb.productTable
    }
    return this.http.post(proxyAPI_URL + this.products_res, data, httpOptions);
  }
  
  getProducts2() {  
    return this.http.get(proxyAPI_URL + this.products_res,  httpOptions);
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
    return this.http.put(proxyAPI_URL + this.feedback_res, data,httpOptions);
  }

  getFeedback() {       
    let data = {
      "TableName": this.fxCfg.settings.ddb.feedbackTable
    }
    return this.http.post(proxyAPI_URL + this.feedback_res, data,httpOptions);
  }
}