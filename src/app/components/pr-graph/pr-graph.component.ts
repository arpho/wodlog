import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PrModel } from 'src/app/models/Pr';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-pr-graph',
  templateUrl: './pr-graph.component.html',
  styleUrls: ['./pr-graph.component.scss'],
  standalone: true,
  imports: []
})
export class PrGraphComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('prChartCanvas', { static: false }) prChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input({required:true}) prList: PrModel[] = [];
  @Input({required:true}) unity: string = ' Kg ';

  chart: Chart | null = null;

  constructor() { }

  ngOnInit() {
    console.log("pr list", this.prList);
    console.log("unity", this.unity);
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  initChart() {
    if (!this.prChartCanvas) return;
    
    const canvas = this.prChartCanvas.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clean up any pre-existing chart instance
    if (this.chart) {
      this.chart.destroy();
    }

    // Sort prList chronologically by date
    const sortedPrs = [...this.prList].sort((a, b) => a.date - b.date);
    
    const labels = sortedPrs.map(pr => {
      const dateStr = new Date(pr.date).toLocaleDateString();
      if (this.unity !== ' Kg ') {
        const mins = Math.floor(Number(pr.prestazione) / 60);
        const secs = Number(pr.prestazione) % 60;
        return `${dateStr} ${mins} min ${secs} sec`;
      }
      return dateStr;
    });

    const datasetData = sortedPrs.map(pr => pr.prestazione as number);

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'PR',
          data: datasetData,
          fill: false,
          borderColor: '#3880ff', // Vibrant Ionic blue
          backgroundColor: 'rgba(56, 128, 255, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#3880ff',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff' // Crisp white labels for Midnight Ocean dark mode
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          },
          y: {
            ticks: {
              color: 'rgba(255, 255, 255, 0.7)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            }
          }
        }
      }
    });
  }
}
