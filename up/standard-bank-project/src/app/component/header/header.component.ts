import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() heading;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onButtonTap: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {}
  openGuideline(event) {
    this.onButtonTap.emit(event);
  }

}
