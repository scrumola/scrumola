import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    ) {
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      nickName: [null, Validators.required],
      gameName: [null, Validators.required],
    });
  }

  onLoginSubmit() {
    const { nickName, gameName } = this.form.value;
    this.router.navigate(['/game'], { queryParams :  this.form.value});
  }

}
