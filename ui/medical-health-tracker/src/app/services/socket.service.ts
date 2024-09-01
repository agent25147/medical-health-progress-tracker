import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: Socket;
  private newLogSubject = new Subject<boolean>();

  constructor() {
    this.socket = io(environment.apiUrl);

    // Listen for 'new-log' event from the server
    this.socket.on('NewLog', (data) => {
      this.newLogSubject.next(true);
    });
  }

  get newLog$() {
    return this.newLogSubject.asObservable();
  }
}
