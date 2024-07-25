import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private panicData = new Subject();

  constructor() { }
  publish(event: string, data: any) {
    switch (event) {
      case 'isPanicActivated':
        this.panicData.next(data);
    }
  }
  get(event: string) {
    switch (event) {
      case 'isPanicActivated':
        return this.panicData;
    }
  }
}
