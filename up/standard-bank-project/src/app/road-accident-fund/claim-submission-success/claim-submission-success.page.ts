import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-claim-submission-success',
  templateUrl: './claim-submission-success.page.html',
  styleUrls: ['./claim-submission-success.page.scss'],
})
export class ClaimSubmissionSuccessPage implements OnInit {
  refNum: any
  constructor(
    private activatedRoute: ActivatedRoute,
  ) {

    this.refNum = this.activatedRoute.snapshot.paramMap.get('rafNumber');
  }

  ngOnInit() {
  }

}
