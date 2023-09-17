import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-fbkchart',
  templateUrl: './fbkchart.component.html',
  styleUrls: ['./fbkchart.component.css']
})
export class FbkchartComponent  implements OnInit{
  basicOptions: any;
  productRatings: any
  constructor(private fxData: DataService, private fxMsg: MessageService) { }
  
  
  ngOnInit(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.getFeedback();
    this.basicOptions = {
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

  }

  getFeedback() {
    this.fxData.getFeedback().subscribe({
      next: data => {
        const data1: any = data;
        let data2: any = JSON.parse(data1.body).Items;

        let AvgData =this.getAverages(data2,['productName'],['rating'] );
        let Labels:string[]=[];
        let LabelData:number[]=[];
        let LabelColorBkg: any[]=[];

        AvgData.forEach((el: any) => {
          Labels.push(el.productName);
          LabelData.push(el.rating);
          LabelColorBkg.push('rgba('+ this.getRandomInt() +', '+ this.getRandomInt() +', '+ this.getRandomInt() +', 0.2)')
        });
        // console.log(AvgData);

        this.productRatings = {
          labels: Labels,
          datasets: [
            {
              label: 'Product Rating',
              data: LabelData,
              backgroundColor: LabelColorBkg,
              // borderColor: ['rgb(255, 159, 64)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)'],
              borderWidth: 1
            }
          ]
        };
      },
      error: err => {

      }
    })
  }

  getRandomInt() {
    return Math.floor(Math.random() * 255);
  }

  getAverages(array: any[], groupKeys: any[], averageKeys: any[]) {
    var groups:any = {},
      result:any = [];

    array.forEach(o => {
      var key = groupKeys.map(k => o[k]).join('|'),
        group = groups[key];

      if (!group) {
        groups[key] = { count: 0.0, payload: {} };
        group = groups[key];
        averageKeys.forEach(k => group[k] = 0.0);
        groupKeys.forEach(k => group.payload[k] = o[k]);
        result.push(group.payload);
      }
      groups[key].count++;
      averageKeys.forEach(k => group.payload[k] = (group[k] += o[k]) / group.count);
    })
    return result;
  }

}
