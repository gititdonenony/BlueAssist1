import { Component, Input, Output, EventEmitter, OnDestroy, NgZone } from '@angular/core';

import { IIconRadioOption } from 'src/app/services/models.service';
import { MessageBusService } from 'src/app/services/messagebus.service';
import { LoggerService } from 'src/app/services/logger.service';
import { GlobalService } from 'src/app/services/global.service';

import { state, transition, style, animate, trigger } from '@angular/animations';

@Component({
  selector: 'app-icon-radio-list-component',
  templateUrl: './icon-radio-list-component.component.html',
  styleUrls: ['./icon-radio-list-component.component.scss'],
  animations: [
    trigger('selected', [
      state('active', style({ transform: 'scale(1)' })),
      state('inactive', style({ transform: 'scale(0)' })),
      transition('active <=> inactive', [
        animate(150)
      ])
    ])
  ]
})
export class IconRadioListComponentComponent implements OnDestroy {

  radioOptions: IIconRadioOption[] = [];

  @Input() set options(options: IIconRadioOption[]) {
    
    
    console.log("options");

    console.log(options);

    this.zone.run(() => {
      console.log(options);
      this.radioOptions = options;
      if (options) {
        this.activeOption = options.find(x => x.Selected);
      }
    });
  }
  @Output() selectionChanged = new EventEmitter<IIconRadioOption>();
  @Input() disabled: boolean;
  @Input() evidenceRequired: boolean;
  @Output() doubleClick = new EventEmitter<IIconRadioOption>();

  private activeOption: IIconRadioOption;

  constructor(private messageBus: MessageBusService,
              private logger: LoggerService,
              private global: GlobalService,
              private zone: NgZone) { }

  ngOnDestroy() {
    this.radioOptions = [];
  }

  setRadioOption(option: IIconRadioOption) {
    try {
      if (this.disabled) {
        return;
      }

      if (this.activeOption) {
        this.activeOption.Selected = false;
      } else if (this.radioOptions.find(x => x.Selected)) {
        this.radioOptions.find(x => x.Selected).Selected = false;
      }
      if (this.activeOption !== option) {
        option.Selected = true;
        this.activeOption = option;
        this.selectionChanged.emit(option);
      } else if (this.evidenceRequired) {
        option.Selected = true;
        this.activeOption = option;
        this.doubleClick.emit(option);
      } else {
        this.activeOption = null;
        option.Selected = false;
        this.selectionChanged.emit({
          Description: '',
          ID: null
        });
      }
    } catch (err) {
      this.logger.error('IconRadioListComponentComponent::setRadioOption', err);
    }
  }

  async remove(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const result = await this.global.prompt('Are you sure you want to remove your selection?');
    if (result) {
      this.activeOption.Selected = false;
      setTimeout(() => {
        this.activeOption = null;
        this.selectionChanged.emit({
          Description: '',
          ID: null
        });
      });
    }
  }

  setStyle(elem) {
    try {
      const imgChild: HTMLElement = elem['el'].shadowRoot.children[0] as HTMLElement;
      if (imgChild) {
        imgChild.style.maxHeight = 'inherit';
        imgChild.style.maxWidth = 'inherit';
      }
    } catch (err) {
      this.logger.error('IconRadioListComponentComponent::setStyle', err);
    }
  }

  updateHeight() {
    this.messageBus.autoAdjustSliderHeight();
  }
}
