import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finish',
  templateUrl: './finish.page.html',
  styleUrls: ['./finish.page.scss'],
})
export class FinishPage implements OnInit {

  refNum: any
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    this.refNum = this.activatedRoute.snapshot.paramMap.get('rafNumber');
  }

  ngOnInit() {
  }

}
