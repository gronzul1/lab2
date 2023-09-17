import { Component, OnInit } from '@angular/core';
import { DataService } from '../_services/data.service';
import { MessageService } from 'primeng/api';

interface products {
  productId: number,
  productName: string
}
interface feedback {
  productId: number,
  productName: string,
  rating: number
}

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css'],
})

export class FeedbackComponent implements OnInit {
  loading: boolean = true;
  Products: products[] = [];
  selectedproduct: any | undefined;
  selectedrating: any  | undefined;
  fdb: feedback = {
    productId: 0,
    productName:'',
    rating: 1,
  };

  constructor(private fxData: DataService, private fxMsg: MessageService) {
  }

  ngOnInit(): void {
    this.getProducts();
  }
  getProducts() {

    this.fxData.getProducts().subscribe({
      next: data => {
        const data1: any = data;
        this.Products = JSON.parse(data1.body).Items;
        this.loading = false;
      },
      error: err => {
        this.fxMsg.add(
          {
            severity: 'error',
            summary: 'Error', detail: err.detail.message, life: 3000
          })
      }
    });
  }
  savefdb() {    
    this.fdb.rating = this.selectedrating;
    this.fxData.saveFeedback(this.fdb).subscribe({
      next: data => {
        this.fxMsg.add(
          {
            severity: 'success',
            summary: 'Feedback Submitted', detail: 'Your feedback has been saved!\nThank you', life: 3000
          })
      },
      error: err => {
        this.fxMsg.add(
          {
            severity: 'error',
            summary: 'Error', detail: err.detail.message, life: 3000
          }
        )
      }
    })    
  }
}
