import { Component, Input, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PrModel } from 'src/app/models/Pr';
import { Chart, registerables } from 'chart.js';
import { AlertController } from '@ionic/angular';

Chart.register(...registerables);

@Component({
  selector: 'app-pr-graph',
  templateUrl: './pr-graph.component.html',
  styleUrls: ['./pr-graph.component.scss'],
  standalone: true,
  imports: []
})
export class PrGraphComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild('prChartCanvas', { static: false }) prChartCanvas!: ElementRef<HTMLCanvasElement>;
  
  @Input({required:true}) prList: PrModel[] = [];
  @Input({required:true}) unity: string = ' Kg ';
  @Output() editedPrList = new EventEmitter<PrModel[]>();

  chart: Chart | null = null;

  constructor(private alertCtrl: AlertController) { }

  ngOnInit() {
    console.log("pr list", this.prList);
    console.log("unity", this.unity);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['prList'] && !changes['prList'].firstChange) {
      this.initChart();
    }
  }

  ngAfterViewInit() {
    this.initChart();
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  makeAlert4kg(pr: PrModel, title: string) {
    return this.alertCtrl.create({
      header: title,
      inputs: [
        {
          name: 'prestazione',
          placeholder: 'massimale',
          type: 'number',
          label: 'prestazione',
          value: pr.prestazione,
        },
        {
          name: 'data',
          placeholder: 'data',
          type: 'date',
          value: new Date(pr.date).toISOString().split('T')[0],
        },
        {
          name: 'note',
          type: 'text',
          value: pr.note,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
          handler: (data: {
            prestazione: number;
            note: string;
            data: string | number | Date;
          }) => {
            pr.prestazione = data.prestazione;
            pr.note = data.note;
            pr.unity = ' Kg ';
            pr.date = new Date(data.data).getTime();
            if (!this.prList.includes(pr)) {
              this.prList = [...this.prList, pr];
            } else {
              this.prList = [...this.prList];
            }
            this.editedPrList.emit(this.prList);
            this.initChart();
          },
        },
      ],
    });
  }

  makeAlert4sec(pr: PrModel, title: string) {
    return this.alertCtrl.create({
      header: title,
      inputs: [
        {
          name: 'minuti',
          placeholder: 'minuti',
          type: 'number',
          value: Math.floor(Number(pr.prestazione) / 60),
        },
        {
          name: 'secondi',
          type: 'number',
          placeholder: 'secondi',
          value: Number(pr.prestazione) % 60,
        },
        {
          placeholder: 'data',
          name: 'data',
          type: 'date',
          value: new Date(pr.date).toISOString().split('T')[0],
        },
        {
          name: 'note',
          type: 'text',
          value: pr.note,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
          handler: (data: {
            minuti: number;
            secondi: number;
            note: string;
            data: string | number | Date;
          }) => {
            pr.prestazione = Number(data.minuti) * 60 + Number(data.secondi);
            pr.note = data.note;
            pr.unity = ' sec ';
            pr.date = new Date(data.data).getTime();
            if (!this.prList.includes(pr)) {
              this.prList = [...this.prList, pr];
            } else {
              this.prList = [...this.prList];
            }
            this.editedPrList.emit(this.prList);
            this.initChart();
          },
        },
      ],
    });
  }

  makeAlert(pr: PrModel, title: string) {
    return this.unity.includes('Kg')
      ? this.makeAlert4kg(pr, title)
      : this.makeAlert4sec(pr, title);
  }

  initChart() {
    if (!this.prChartCanvas) return;
    
    const canvas = this.prChartCanvas.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (this.chart) {
      this.chart.destroy();
    }

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
          borderColor: '#3880ff', 
          backgroundColor: 'rgba(56, 128, 255, 0.1)',
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#3880ff',
          pointBorderColor: '#ffffff',
          pointHoverRadius: 6,
          pointHitRadius: 15
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        onClick: async (event: any, elements: any[]) => {
          if (elements.length > 0) {
            const index = elements[0].index;
            const pr = sortedPrs[index];
            if (pr) {
              const alert = await this.makeAlert(pr, 'Modifica PR');
              await alert.present();
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#ffffff'
            }
          },
          tooltip: {
            callbacks: {
              label: (context: any) => {
                let labelText = (context.dataset.label || 'PR') + ' 🎯 ';
                if (context.parsed.y !== null) {
                  labelText += context.parsed.y + (this.unity === ' sec ' ? ' sec' : ' Kg');
                }
                const index = context.dataIndex;
                const pr = sortedPrs[index];
                const note = pr?.note;
                
                if (note && note.trim() !== '') {
                  return [labelText, `📝 Note: ${note}`];
                } else {
                  return [labelText, `📝 Note: nessuna nota`];
                }
              }
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
