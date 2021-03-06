import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/Rx';

import { environment } from '../../../environments/environment';
import { User } from '../../user/user';

@Injectable()
export class AuthService {

  /** ログイン状態通知 */
  isLogin$: BehaviorSubject<boolean>;

  private ACESS_TOKEN_KEY = 'access-token';
  private UID_KEY= 'uid';
  private CLIENT_KEY= 'client';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: Http) {
    this.isLogin$ = new BehaviorSubject<boolean>(this.isLogin());
  }

  /**
   * ローカルストレージに保存してあるtoken情報を取得する
   */
  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.ACESS_TOKEN_KEY);
    } else {
      return null;
    }
  }

  /**
   * ローカルストレージに保存してあるuid情報を取得する
   */
  getUid() {
    if (isPlatformBrowser(this.platformId) && localStorage.getItem('uid')) {
      return localStorage.getItem(this.UID_KEY);
    } else {
      return null;
    }
  }

  /**
   * ローカルストレージに保存してあるclient情報を取得する
   */
  getClient() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(this.CLIENT_KEY);
    } else {
      return null;
    }
  }

  /**
   * ログインしているかどうか
   */
  isLogin(): boolean {
    return this.getToken() != null && this.getUid() != null && this.getClient() != null;
  }

  /**
   * ログイン中のユーザを取得する。
   * ログインしていない場合はNullを返却
   */
  async getCurrentUser(): Promise<User> {
    if(this.isLogin()) {
      // ユーザ取得
      try {
        return await this.validateUser();
      } catch(e) {
        this.clearAuthInfo();
      }
    }
    return null;
  }

  /**
   * ログインする
   * @param body ログイン情報（メールアドレス、パスワード）
   */
  logIn(body: any): Promise<User> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(environment.API_URL + '/auth/sign_in', body, options)
    .toPromise().then(response => {
      // 認証情報を保存
      this.saveAuthInfo(response.headers);

      this.isLogin$.next(true);

      // ユーザ情報を返却
      return response.json().data as User;
    })
    .catch(this.handleError);
  }

  /**
   * ログアウトする
   */
  logout() {
    this.clearAuthInfo();
    this.isLogin$.next(false);
  }

  /**
   * ユーザの新規登録
   * @param body 登録ユーザ情報
   */
  signup(body: any): Promise<User> {
    const headers = new Headers({'Content-Type': 'application/json'});
    const options = new RequestOptions({headers: headers});
    return this.http.post(environment.API_URL + '/auth', body, options)
    .toPromise().then(response => {
      // 認証情報を保存
      this.saveAuthInfo(response.headers);

      // ユーザ情報を返却
      return response.json().data as User;
    })
    .catch(this.handleError);
  }

  /**
   * アクセストークンをローカルストレージに保存
   * @param token アクセストークン
   */
  private setToken(token: string) {
    if (isPlatformBrowser(this.platformId) && token) {
      localStorage.setItem(this.ACESS_TOKEN_KEY, token);
    }
  }

  /**
   * uid = email 情報をローカルストレージに保存
   * @param uid UID
   */
  private setUid(uid: string) {
    if (isPlatformBrowser(this.platformId) && uid) {
      localStorage.setItem(this.UID_KEY, uid);
    }
  }

  /**
   * client = 使用端末情報をローカルストレージに保存
   * @param client 使用端末情報
   */
  private setClient(client: string) {
    if (isPlatformBrowser(this.platformId) && client) {
      localStorage.setItem(this.CLIENT_KEY, client);
    }
  }

  /**
   * トークン情報からユーザ情報を取得する
   */
  private validateUser(): Promise<User> {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'access-token': this.getToken(),
      'uid': this.getUid(),
      'client': this.getClient(),
    });
    const options = new RequestOptions({headers: headers});
    return this.http.get(environment.API_URL + '/auth/validate_token', options)
    .toPromise().then(response => {
      // 認証情報を保存
      this.saveAuthInfo(response.headers);
      return response.json().data as User;
    }).catch(this.handleError);
  }

  /**
   * 認証情報を保存
   * @param headers レスポンスヘッダ
   */
  private saveAuthInfo(headers: Headers) {
    this.setToken(headers.get('access-token'));
    this.setUid(headers.get('uid'));
    this.setClient(headers.get('client'));
  }

  /**
   * 認証情報を削除
   */
  private clearAuthInfo() {
    localStorage.removeItem(this.ACESS_TOKEN_KEY);
    localStorage.removeItem(this.UID_KEY);
    localStorage.removeItem(this.CLIENT_KEY);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }

  /**
   * 認証情報を印字する
   */
  private printAuthInfo() {
    console.log('token : ' + this.getToken());
    console.log('uid : ' + this.getUid());
    console.log('client : ' + this.getClient());
  }

}
