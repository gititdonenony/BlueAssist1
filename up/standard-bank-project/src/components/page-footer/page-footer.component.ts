import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';

import { MessageBusService } from 'src/app/services/messagebus.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-page-footer',
  templateUrl: './page-footer.component.html',
  styleUrls: ['./page-footer.component.scss'],
})
export class PageFooterComponent implements OnInit, OnDestroy {

  @Output() back = new EventEmitter();
  @Output() next = new EventEmitter();

  isKeyBoardOpen = false;
  private keyboardSubscription: Subscription;

  constructor(private messageBus: MessageBusService) { }

  ngOnInit() {
    this.keyboardSubscription = this.messageBus.subscribeToKeyboardToggle().subscribe((isOpen: boolean) => {
      this.isKeyBoardOpen = isOpen;
    });
  }

  ngOnDestroy() {
    this.keyboardSubscription.unsubscribe();
  }

  goBack() {
    this.back.emit();
  }

  goNext() {
    // console.log(this.next);
    
    this.next.emit();
  }

}

