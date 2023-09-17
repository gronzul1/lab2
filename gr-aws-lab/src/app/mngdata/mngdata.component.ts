import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-mngdata',
  templateUrl: './mngdata.component.html',
  styleUrls: ['./mngdata.component.css']
})
export class MngdataComponent implements OnInit {
  constructor(private fxData: DataService,private fxMsg: MessageService) { }
  fbks:any[]=[];
  
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
        if(err instanceof HttpErrorResponse){
          this.fxMsg.add(
            {
              severity: 'error',
              summary: 'Error', detail: err.message, life: 3000
            })
        }
          // console.error(err.message);

      }
    })
  }
}
