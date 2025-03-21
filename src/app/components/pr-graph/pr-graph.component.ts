import { Component, Input, OnInit } from '@angular/core';
import { PrModel } from 'src/app/models/Pr';
import { ChartModule } from 'primeng/chart';
@Component({
  selector: 'app-pr-graph',
  templateUrl: './pr-graph.component.html',
  styleUrls: ['./pr-graph.component.scss'],
  standalone: true,
  imports: [ChartModule]
})
export class PrGraphComponent  implements OnInit {

  data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,

            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            tension: 0.4
        }
    ]
};

options = {
  maintainAspectRatio: false,
  aspectRatio: 0.6,
  plugins: {
      legend: {
          labels: {
              color: "#495057"
          }
      }
  },
  scales: {
      x: {
          ticks: {
              color: "red"
          },
          grid: {
              color: "green",
              drawBorder: false
          }
      },
      y: {
          ticks: {
              color: "blue"
          },
          grid: {
              color: "blue",
              drawBorder: false
          }
      }
  }
};

  constructor() { }
  @Input({required:true}) prList: PrModel[] = []
  @Input({required:true}) unity: string = ' Kg '

  ngOnInit() {
    console.log("pr list", this.prList)
    console.log("unity", this.unity)
    this.data.labels = this.prList.sort((a,b) => a.date - b.date).map((pr) => new Date(pr.date).toLocaleDateString())
    this.data.datasets =[
      {label:"pr", data: this.prList.sort((a,b) => a.date - b.date).map((pr) => pr.prestazione) as number[], fill: false, tension: 0.4},
    ]
  }

}
