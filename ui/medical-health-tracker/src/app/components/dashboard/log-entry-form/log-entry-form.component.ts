import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { LogService } from '../../../services/log.service';
import { AddLogDto } from '../../../dto/addLog.dto';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { scalesMap } from '../../../models/scalesMap';
@Component({
  selector: 'app-log-entry-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    CommonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './log-entry-form.component.html',
  styleUrl: './log-entry-form.component.css'
})
export class LogEntryFormComponent implements OnInit {
  logForm: FormGroup;

  scalesMap = scalesMap;

  hours: number[] = Array.from({ length: 25 }, (_, i) => i);

  private _snackBar = inject(MatSnackBar);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<LogEntryFormComponent>,
    private logService: LogService
  ) { }

  maxDate: Date = new Date();

  ngOnInit(): void {

    this.logForm = this.fb.group({
      date: ['', Validators.required],
      mood: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      anxietyLevel: [null, [Validators.required, Validators.min(1), Validators.max(3)]],
      sleepHours: [null, [Validators.required, Validators.min(0), Validators.max(24)]],
      sleepQuality: [null, [Validators.required, Validators.min(1), Validators.max(3)]],
      sleepDisturbances: [''],
      physicalActivity: [''],
      socialInteractionsFrequency: [null, [Validators.required, Validators.min(1), Validators.max(4)]],
      stressLevel: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      anxietyDepressionSymptoms: ['']
    });
  }

  onSubmit() {
    if (this.logForm.valid) {

      var dto = this.logForm.value as AddLogDto;

      this.logService.addLog(dto).subscribe({
        next: (value) => {
          this._snackBar.open('Log Saved', 'Close',
            {
              duration: 3000,
              horizontalPosition: 'end',
              verticalPosition: 'top',
            });
          this.dialogRef.close();
        },
        error: (error) => {
          console.log(error);
          this._snackBar.open(error.error || 'An error occurred', 'Close', {
            duration: 6000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
          });
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
