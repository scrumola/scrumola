import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Player } from '../models/player.model';
import { storeDetails } from '../utils/storage.utils';
@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  player: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    ) {
      this.player = '0';
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nickName: [null, Validators.required],
      gameName: [null, Validators.required],
      playerType: [null, Validators.required]
    });
  }

  registerPlayer(player: Player): void {
    if (storeDetails(player.nickName, JSON.stringify(player))) {
      this.router.navigate(['/game'], { queryParams :  this.form.value});
    }
  }

  onLoginSubmit() {
    const { nickName, gameName, playerType } = this.form.value;
    let player: Player = this.form.value;
    this.registerPlayer(player);
  }

}
