import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IonSlides, IonContent } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { MessageBusService } from 'src/app/services/messagebus.service';
import { LoggerService } from 'src/app/services/logger.service';

@Component({
  selector: 'app-custom-slides-pager',
  templateUrl: './custom-slides-pager.component.html',
  styleUrls: ['./custom-slides-pager.component.scss'],
})
export class CustomSlidesPagerComponent implements OnInit, OnDestroy {

  @Output() slideIndexChange = new EventEmitter();
  @Input() slider: IonSlides;
  @Input() content: IonContent;

  activeSliderPage = 0;
  sliderPages = [];
  private sliderWatcher: Subscription;
  private autoHeightWatcher: Subscription;

  constructor(private messageBus: MessageBusService,
              private logger: LoggerService) {
    this.autoHeightWatcher = this.messageBus.subscribeToSliderAutoHeightMessageBus().subscribe(async () => {
      await this.slider.updateAutoHeight();
    });
  }

  async ngOnInit() {
    try {
      if (this.slider) {
        const sliderPages = await this.slider.length();
        for (let i = 0; i < sliderPages; i++) {
          this.sliderPages.push(i);
        }
        this.sliderWatcher = this.slider.ionSlideWillChange.subscribe(async () => {
          const currentSlideIndex = await this.slider.getActiveIndex();
          this.animateSliderPager(currentSlideIndex);
          if (this.slideIndexChange) {
            this.slideIndexChange.emit(currentSlideIndex);
          }
        });
        this.animateSliderPager(await this.slider.getActiveIndex());
      }
    } catch (err) {
      this.logger.error('CustomSlidesPagerComponent::ngOnInit', err);
    }
  }

  async ngOnDestroy() {
    if (this.slider) {
      this.sliderWatcher.unsubscribe();
    }
    if (this.autoHeightWatcher) {
      this.autoHeightWatcher.unsubscribe();
    }
  }

  private animateSliderPager(toIndex: number) {
    try {
      const width = 10; // pixels of pager dot
      const slider = document.getElementById('slider-background');
      if (slider && this.activeSliderPage !== toIndex) {
        const indexDiff = Math.abs(toIndex - this.activeSliderPage);
        slider.style.width = (width + ((width + 6) * indexDiff)) + 'px';
        if (toIndex > this.activeSliderPage) {
          setTimeout(() => {
            slider.style.width = `${width}px`;
            slider.style.transform = `translate(${(width + 6) * toIndex}px, -50%)`;
          }, 150);
        } else {
          slider.style.transform = `translate(${(width + 6) * toIndex}px, -50%)`;
          setTimeout(() => {
            slider.style.width = `${width}px`;
          }, 150);
        }
      }

      this.activeSliderPage = toIndex;
      if (this.content) {
        this.content.scrollToTop(400);
      }
    } catch (err) {
      this.logger.error('CustomSlidesPagerComponent::animateSliderPager', err);
    }
  }

}
