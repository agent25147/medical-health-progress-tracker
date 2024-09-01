import { Component, OnInit } from '@angular/core';
import { LogEntryFormComponent } from "./log-entry-form/log-entry-form.component";
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { LogService } from '../../services/log.service';
import { ChartData, ChartOptions } from 'chart.js';
import { Chart, registerables } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { scalesMap } from '../../models/scalesMap';
import { MatIconModule } from '@angular/material/icon';
import { SocketService } from '../../services/socket.service';

Chart.register(...registerables);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    LogEntryFormComponent,
    MatDialogModule,
    MatButtonModule,
    BaseChartDirective,
    MatIconModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  constructor(public dialog: MatDialog, private logService: LogService,private socketService: SocketService) { }

  scalesMap = scalesMap;

  ngOnInit(): void {
    this.loadData();
    this.chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const datasetLabel = context.dataset.label || '';
              const value: number = context.raw as number;

            let textualValue = '';
            if (datasetLabel.includes('Mood')) {
              textualValue = scalesMap.mood[value] || value;
            } else if (datasetLabel.includes('Anxiety')) {
              textualValue = scalesMap.anxietyLevel[value] || value;
            } else if (datasetLabel.includes('Sleep Hours')) {
              textualValue = scalesMap.sleepQuality[value] || value; // Adjust as necessary
            } else if (datasetLabel.includes('Social Interactions')) {
              textualValue = scalesMap.socialInteractionsFrequency[value] || value;
            } else if (datasetLabel.includes('Stress')) {
              textualValue = scalesMap.stressLevel[value] || value;
            } else {
              textualValue = value.toString();
            }

            return `${datasetLabel}: ${textualValue}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Values'
          }
        }
      }
    };


    this.socketService.newLog$.subscribe((d) => {
      this.loadData();
    });
  }

  loadData() {
    this.logService.getWeeklyTrendData().subscribe({
      next: (v) => {
        this.weeklyTrendData = v;
        this.chartData = {
          labels: this.weeklyTrendData.map(item => item.date),
          datasets: [
            {
              label: 'Average Mood',
              data: this.weeklyTrendData.map(item => item.averageMood),
              borderColor: 'blue',
              backgroundColor: 'rgba(0, 0, 255, 0.2)',
              fill: false
            },
            {
              label: 'Min Anxiety',
              data: this.weeklyTrendData.map(item => item.minAnxiety),
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              fill: false
            },
            {
              label: 'Max Anxiety',
              data: this.weeklyTrendData.map(item => item.maxAnxiety),
              borderColor: 'green',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
              fill: false
            },
            {
              label: 'Average Sleep Hours',
              data: this.weeklyTrendData.map(item => item.averageSleepHours),
              borderColor: 'purple',
              backgroundColor: 'rgba(128, 0, 128, 0.2)',
              fill: false
            }
          ]
        };
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  chartData: ChartData<'line'>;
  chartOptions: ChartOptions<'line'>;

  weeklyTrendData: any[] = [
  ];


  openDialog(): void {
    const dialogRef = this.dialog.open(LogEntryFormComponent, {
      width: '400px',
      data: { name: 'User' },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }



}
