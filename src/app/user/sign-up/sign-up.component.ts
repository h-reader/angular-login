import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validator } from '@angular/forms';

import { AuthService } from '../../common/auth/auth.service';
import { User } from '../user';
import { MessageService, MessageKey } from '../../common/message/message.service';

/**
 * サインアップ情報
 */
export class SignUpInfo {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
}

/**
 * サインアップコンポーネント
 */
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  errorMessages: any;
  signupErrorMessage: string;
  user: SignUpInfo;

  constructor(private service: AuthService, private messageService: MessageService, private router: Router) { }

  ngOnInit() {
    this.user = new SignUpInfo();

    this.errorMessages = {
      required: this.messageService.getMessage(MessageKey.requied),
      email: this.messageService.getMessage(MessageKey.email),
      passwordMinLength: this.messageService.getMessage(MessageKey.minlength, ['8']),
    };
  }

  async entry() {

    console.log(this.user);

    const body = JSON.stringify({
      'email': this.user.email,
      'password': this.user.password,
      'password_confirmation': this.user.passwordConfirm,
      'name': this.user.name,
    });

    try {
      const user = await this.service.signup(body);

      console.log(user);
      this.signupErrorMessage = null;
      this.router.navigate(['/home']);

    } catch (e) {
      console.error(e);
      this.signupErrorMessage = '失敗';
    }

  }

  private validate(values: any) {

    if (values.password !== values.password_confirm) {

      // TODO: メッセージ
    }

  }


}
