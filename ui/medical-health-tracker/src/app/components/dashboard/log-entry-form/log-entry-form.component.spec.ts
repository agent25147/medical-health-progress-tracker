import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogEntryFormComponent } from './log-entry-form.component';

describe('LogEntryFormComponent', () => {
  let component: LogEntryFormComponent;
  let fixture: ComponentFixture<LogEntryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogEntryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogEntryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
