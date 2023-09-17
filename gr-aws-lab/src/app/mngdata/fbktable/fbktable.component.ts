import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-fbktable',
  templateUrl: './fbktable.component.html',
  styleUrls: ['./fbktable.component.css']
})
export class FbktableComponent implements OnInit {
    
  loading:boolean=false;
  fbks:any[]=[];

  constructor(private fxData: DataService){}
  
  ngOnInit(): void {
    this.getFeedback();
  }

  getFeedback() {
    this.fxData.getFeedback().subscribe({
      next: data => {
        const data1: any = data;
        this.fbks = JSON.parse(data1.body).Items;
      },
      error: err => {

      }
    })
  }

}
