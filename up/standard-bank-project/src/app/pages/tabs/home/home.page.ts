import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor( private route: Router,private modalCtrl: ModalController) {}

  ngOnInit() {

    this.route.navigate(['/shop-home']);

  }
}
