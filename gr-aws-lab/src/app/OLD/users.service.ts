import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let API_URL = "";
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }  
  )
};

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(private http: HttpClient) {     
    API_URL = "https://tcgq84nwjf.execute-api.us-east-1.amazonaws.com/Prod";
  }

  getAllUsers(): Observable<any> {
    return this.http.get(API_URL + '/users',httpOptions);
  }

  saveUser(data:any): Observable<any>{
    // let payload = {
    //   "userId": data.userId,
    //   "department":data.department,
    //   "email": data.email,
    //   "firstName": data.firstName,
    //   "lastName": data.lastName,
    //   "location": data.location,
    //   "personalid": data.personalid    
    // }; 
    console.log(data);
    return this.http.put(API_URL + '/users',data,httpOptions);
  }

}
