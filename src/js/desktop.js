/*
 *プロセスの位置表示
 * Copyright (c) 2024 noz-23
 *  https://github.com/noz-23/
 *
 * Licensed under the MIT License
 * 
 *  利用：
 *   JQuery:
 *     https://jquery.com/
 *     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js
 *   
 *   jsrender:
 *     https://www.jsviews.com/
 *     https://cdnjs.cloudflare.com/ajax/libs/jsrender/0.9.91/jsrender.min.js
 *
 *   tinyColorPicker and colors :
 *     https://github.com/PitPik/tinyColorPicker
 *     https://cdnjs.cloudflare.com/ajax/libs/tinyColorPicker/1.1.1/jqColorPicker.min.js
 * 
 *  参考：
 *   New Condition Format plug-in
 *    Copyright (c) 2016 Cybozu
 *
 *    Licensed under the MIT License
 *
 * History
 *  2024/03/01 0.1.0 初版
 *  2024/03/01 0.1.1 とりあえずバージョン
 *  2024/03/24 0.2.0 プラグイン設定画面に Google AdSense 追加
 *  2024/06/06 0.3.0 プロセス処理者の名前表示機能追加
 */

jQuery.noConflict();

(async (PLUGIN_ID_) => {
  'use strict';

  const EVENTS = [
    'app.record.detail.show', // 詳細表示
    'app.record.create.show', // 作成表示
    'app.record.edit.show',   // 編集表示
  ];

  // 一覧の上部エレメント取得 
  const headElemnt = kintone.app.record.getHeaderMenuSpaceElement();

  kintone.events.on(EVENTS, async (events_) => {
    console.log('events_:%o', events_);

    // 現在ステータス
    const nowStatus = events_.record['ステータス'].value;

    // プロセス(ステータス)の取得
    const params = {
      app: kintone.app.getId()   // アプリ番号
    };

    const status = await kintone.api(kintone.api.url('/k/v1/app/status.json', true), 'GET', params);
    //console.log('status:%o', status);

    if (status.enable == false) {
      // 無効の場合は何もせず終了
      return events_;
    }

    // ステータス名がキーになっているので、一覧化
    const listKey = Object.keys(status.states);
    //console.log('listKey:%o', listKey);

    const listStatus = [];
    for (let name of listKey) {
      listStatus.push(status.states[name]);
    };
    //console.log('listStatus:%o', listStatus);

    // index順にソート(並び替え)
    const listSortStatus = listStatus.sort((a, b) => { return (a.index < b.index) ? -1 : 1 });
    console.log('listSortStatus:%o', listSortStatus);

    showiFrame(nowStatus, listSortStatus);

    return events_;
  });
  
  const showProcess = async (nowStatus_, listStatus_, listNameStatus_) => {

    // Kintone プラグイン 設定パラメータ
    const config = kintone.plugin.app.getConfig(PLUGIN_ID_);
    console.log('config:%o', config);

    const paramShowName = config['paramShowName'];
    // 
    const textColorEnd = config['paramTextColorEnd'];
    const textColorNow = config['paramTextColorNow'];
    const textColorYet = config['paramTextColorYet'];

    // 背景色
    const backColorEnd = config['paramBackColorEnd'];
    const backColorNow = config['paramBackColorNow'];
    const backColorYet = config['paramBackColorYet'];

    // 文字の大きさ
    const textSizeEnd = config['paramTextSizeEnd'];
    const textSizeNow = config['paramTextSizeNow'];
    const textSizeYet = config['paramTextSizeYet'];

    // 文字装飾
    const textFontEnd = config['paramTextFontEnd'];
    const textFontNow = config['paramTextFontNow'];
    const textFontYet = config['paramTextFontYet'];

    // 一覧の上部エレメント取得 
    var headElemnt = kintone.app.record.getHeaderMenuSpaceElement();

    // 上部にステータス追加
    let flg = false;
    for (var elemnt of listStatus_) {
      // ここら辺は、今後 css にしようと思います。
      let div = document.createElement("div");
      div.innerHTML = elemnt.name;
      //
      if (paramShowName == 'true') {
        const find = listNameStatus_.find(f => f.status == elemnt.name);
        if (typeof find != 'undefined') {
          div.innerHTML += '<br>' + find.name;
        }
      }
      //
      div.style.width = 'fit-content';
      div.style.height = 'auto';
      div.style.padding = '3px';
      div.style.border = "solid 1px black";
      div.style.float = 'left';

      if (elemnt.name == nowStatus_) {
        // 今
        div.style.color = textColorNow;
        div.style.backgroundColor = backColorNow;
        div.style.fontSize = textSizeNow;
        div.style.textDecoration = textFontNow;
        flg = true;
      } else if (flg == false) {
        // 済
        div.style.color = textColorEnd;
        div.style.backgroundColor = backColorEnd;
        div.style.fontSize = textSizeEnd;
        div.style.textDecoration = textFontEnd;
      } else {
        // 未
        div.style.color = textColorYet;
        div.style.backgroundColor = backColorYet;
        div.style.fontSize = textSizeYet;
        div.style.textDecoration = textFontYet;
      }

      // 追加
      headElemnt.appendChild(div);
    };
  };

  const IFRAME_DATA = 'iframeData';	// 重複表示防止用のid名
  const showiFrame = (nowStatus_, listStatus_) => {
    // "https://*.cybozu.com/k/742/show#record=1" 形式のURLが入る
    // 公式でない引数の使い方のため、出来なくなるかもです
    var iframeSrc = location.href;
    console.log("iframeSrc:%o", iframeSrc);

    // 重複表示防止
    var frame = document.getElementById(IFRAME_DATA);
    if (frame != null || frame != undefined) {
      // 詳細表示後、編集などすると同じものが増えるのでIDで重複表示防止
      frame.remove();
    }

    // <iframe></iframe>タグの作成
    // css 化する予定
    frame = document.createElement("iframe");
    frame.id = IFRAME_DATA;
    frame.src = iframeSrc;
    // 実際は非表示
    frame.width = '0%';
    frame.height = '0%';
    //console.log('frame:%o', iframeSrc);

    // iframeの追加
    // スペースでの割り当ての場合、｢contentWindow.onload｣が処理しないため、document.bodyで一番下に追加
    document.body.appendChild(frame);
    // 参考
    // https://qiita.com/munieru_jp/items/a6f1433652124a2165e4
    // https://qiita.com/twrcd1227/items/182de980e821336756f7

    // iframe 読み込み後の処理
    frame.contentWindow.onload = function () {
      const doc = document.getElementsByTagName("iframe")[0].contentWindow.document;
      const targetDoc = doc.documentElement;
      //const targetDoc = document.documentElement;
      console.log('targetDoc:%o', targetDoc);

      // 監視オプションの設定
      const configObs = { attributes: true, childList: false, subtree: true };
      const obServer = new MutationObserver(records => {
        // 変化が発生したときの処理を記述
        let getHist = null;
        for (let rec of records) {
          if (rec.target.className == 'gaia-app-statusbar-historypopup') {
            //console.log('rec:%o', rec);
            getHist = rec.target;
            break;
          }
        }

        if (getHist != null) {
          obServer.disconnect();
          var list = jQuery(getHist).find('tr');
          //console.log('list:%o', list);

          let listNameStatus = [];
          for (let row of list) {
            var col = jQuery(row).find('td');
            if (col.length < 3) {
              continue;
            }
            // 名前 ステータス
            listNameStatus.push({ name: col[1].innerHTML, status: col[2].innerText })
          }
          console.log('listNameStatus:%o', listNameStatus);
          showProcess(nowStatus_, listStatus_, listNameStatus);
        }
      });

      // 監視の開始
      obServer.observe(targetDoc, configObs);

      let histButtons = [...doc.getElementsByClassName('gaia-app-statusbar-history')];
      console.log('histButtons:%o', histButtons);
      histButtons[0].click();
    };
  };

  /*
  スリープ関数
   引数　：ms_ ms単位のスリープ時間
   戻り値：なし
  */
  const Sleep = (ms_) => {
    return new Promise(resolve_ => setTimeout(resolve_, ms_));
  };
})(kintone.$PLUGIN_ID);
