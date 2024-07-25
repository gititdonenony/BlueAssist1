import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.page.html',
  styleUrls: ['./add-post.page.scss'],
})
export class AddPostPage implements OnInit {

  constructor( private route: Router,private modalCtrl: ModalController) {}

  ngOnInit() {

    this.route.navigate(['/traffic-fines']);

  }

}
