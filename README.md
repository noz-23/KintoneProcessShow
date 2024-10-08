# KintoneProcessShow

## Kintone プロセス位置表示プラグイン

## 1.概要

プロセスの現在位置を表示するプラグインです。

表示色は｢済｣｢今｣｢未｣でそれぞれで変更きます。

### イメージ

　![KintoneProcessShow03](https://github.com/noz-23/KintoneProcessShow/assets/160399039/10fb28f0-a625-4dfb-9a34-0bfba1bbdd08)


## 2.注意点

表示位置はフォーム上部となります。

tinyColorPicker が JQuery の Ver.3 以降(context削除)に対応してないっぽいので、再利用する場合は気をつけ下さい。

## 3.今後

cssなど利用し表示の見栄えを良くしようと思います。

## 4.ライセンス

MIT license

## 5.利用

JQuery   :https://jquery.com

    https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js


jsrender :https://www.jsviews.com

    https://cdnjs.cloudflare.com/ajax/libs/jsrender/0.9.91/jsrender.min.js


tinyColorPicker and colors :https://github.com/PitPik/tinyColorPicker

    https://cdnjs.cloudflare.com/ajax/libs/tinyColorPicker/1.1.1/jqColorPicker.min.js

参考
　条件書式プラグイン：
　　https://github.com/kintone-samples/plugin-samples

　　https://cybozu.dev/ja/kintone/tips/development/plugins/sample-plugin/conditionformat-v2-plugin/


## 6.バージョン履歴

 2024/03/06 0.1.0 初版 

 2024/03/10 0.1.1 とりあえずバージョン公開(cybozu から cloudflare へ cdn を変更で不具合修正)

 2024/03/24 0.2.0 プラグイン設定画面に Google AdSense 追加

 2024/06/06 0.3.0 プロセス処理者の名前表示機能追加

 2024/07/29 0.3.1 名前表示機能不備する場合があるのを改善(クラス名変更対応とダメなら出さない)

 2024/08/06 0.3.2 不具合修正(作りミス)

 2024/08/16 0.3.3 プロセス処理者の名前表示を非公開API版で取得に変更
 
## 7.連絡

nzds23@yahoo.co.jp

## 8.商用利用

ライセンス条項を守って頂ければ特に制限ありません。

可能なら記載したいので、メールアドレスに連絡頂ければ幸いです。

プラグイン設定画面で Google AdSense の広告表示をしています。

わかり易くしてますので、削除は自分でやって下さい。


