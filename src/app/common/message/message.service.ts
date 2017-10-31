import { Injectable } from '@angular/core';

/**
 * メッセージ取得サービス
 */
@Injectable()
export class MessageService {

  private MAX_EXT_STR_COUNT = 1;

  constructor() { }

  /**
   * メッセージを取得する
   * @param messageKey メッセージキー(MessageKeyクラスのパラメータを利用)
   * @param extStr 置換文字列
   */
  getMessage(messageKey: string, extStr?: string[]): string {

    if(!extStr) extStr = []
    for(let i=0; i<this.MAX_EXT_STR_COUNT; i++) {
      if(!extStr[i]) extStr.push('');
    }

    var messageList = {
      requied: `値を入力して下さい`,
      email: `正しいメールアドレスを入力してください`,
      minlength: `${extStr[0]} 文字以上入力してください`,
      maxlength: `${extStr[0]} 文字以内で入力してください`,
      loginError: `メースアドレス、またはパスワードが違います。`,
    }

    return messageList[messageKey];
  }
}

/**
 * メッセージキー
 */
export class MessageKey {
  static requied: string = 'requied';
  static email: string = 'email';
  static minlength: string = 'minlength';
  static maxlength: string = 'maxlength';
  static loginError: string = 'loginError';
}
