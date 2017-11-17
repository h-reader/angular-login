import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../common/auth/auth.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  /** ヘッダタイトル名 */
  headerTitle: string = environment.APP_TITLE;
  /** ログイン状態 */
  isLogin: boolean;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.isLogin$.subscribe((isLogin: boolean) => { this.isLogin = isLogin; });
  }

  /**
   * ログインボタン押下時、ログイン画面に遷移
   */
  login() {
    this.router.navigate(['/login']);
  }

  /**
   * ログアウトする
   */
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
