import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { CognitoJwtVerifier } from "aws-jwt-verify";


@Component({
  selector: 'app-testpage',
  templateUrl: './testpage.component.html',
  styleUrls: ['./testpage.component.css']
})
export class TestpageComponent  implements OnInit {
  products: any[]=[];
  spinnerVisible:boolean=true;

  constructor(private fxData: DataService){}
  ngOnInit(): void {
    this.getProducts();
    this.test();
    setTimeout(() => {
      this.spinnerVisible=false;
    }, 10*1000);
  }


  getProducts(){
    this.fxData.getProducts2().subscribe({
      next: data=>{
        const data1: any=  data;
        // console.log(data);        
        this.products = JSON.parse(data1.body).Items;
        this.spinnerVisible=false;
      },
      error: err=>{
        if(err instanceof HttpErrorResponse){
          console.log(err);
          this.spinnerVisible=false;
        }
      }
    })
  }


  test() {

    // const idToken = localStorage.getItem('access_token') || "";
    const idToken = localStorage.getItem('id_token') || "";
    const verifier = CognitoJwtVerifier.create({
      userPoolId: "us-east-1_rLgLFeEeH",
      tokenUse: "id",
      clientId: "4f9aqr565citu124qffdq8j7v3",
    });

    try {
      const payload = verifier.verifySync(
        idToken // the JWT as string
      );
      console.log("Token is valid. Payload:", payload);
    } catch {
      console.log("Token not valid!");
    }
  }
}
