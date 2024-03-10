/*
 *プロセスの位置表示
 * Copyright (c) 2024 noz-23
 *  https://github.com/noz-23/
 *
 * Licensed under the MIT License
 * History
 *  2024/03/01 0.1.0 初版
 *  2024/03/01 0.1.1 とりあえずバージョン
 */

( (PLUGIN_ID_)=>{
  const EVENTS =[
    'app.record.detail.show', // 詳細表示
    'app.record.create.show', // 作成表示
    'app.record.edit.show',   // 編集表示
  ];
  kintone.events.on(EVENTS, async (events_) => {
    console.log('events_:%o',events_);

	// Kintone プラグイン 設定パラメータ
	const config = kintone.plugin.app.getConfig(PLUGIN_ID_);

  // 
	const textColorEnd=config['paramTextColorEnd'];
	const textColorNow=config['paramTextColorNow'];
	const textColorYet=config['paramTextColorYet'];
	
  // 背景色
	const backColorEnd=config['paramBackColorEnd'];
	const backColorNow=config['paramBackColorNow'];
	const backColorYet=config['paramBackColorYet'];
	
  // 文字の大きさ
	const textSizeEnd=config['paramTextSizeEnd'];
	const textSizeNow=config['paramTextSizeNow'];
	const textSizeYet=config['paramTextSizeYet'];
	  
  // 文字装飾
	const textFontEnd=config['paramTextFontEnd'];
	const textFontNow=config['paramTextFontNow'];
	const textFontYet=config['paramTextFontYet'];
	
    // 現在ステータス
    var nowStatus =events_.record['ステータス'].value;
	
    // プロセス(ステータス)の取得
    const params = {
      app: kintone.app.getId()   // アプリ番号
    };
    console.log('params:%o',params);

    var status =await kintone.api(kintone.api.url('/k/v1/app/status.json', true), 'GET', params);
    console.log('status:%o',status);
    
    if( status.enable ==false)
    {
    	// 無効の場合は何もせず終了
    	return events_;
    }
    // ステータス名がキーになっているので、一覧化
    var listKey =Object.keys(status.states);
    console.log('listKey:%o',listKey);

    var listStatus =[];
    for( var name of listKey){
      listStatus.push(status.states[name]);
    };
    console.log('listStatus:%o',listStatus);

    // index順にソート(並び替え)
    var listSortStatus =listStatus.sort( ( a, b) =>{ return (a.index < b.index) ? -1 :1});
    console.log('listSortStatus:%o',listSortStatus);

    // 一覧の上部エレメント取得 
    var headElemnt =kintone.app.record.getHeaderMenuSpaceElement();

    // 上部にステータス追加
    var flg =false;
    for(var elemnt of listSortStatus){
      // ここら辺は、今後 css にしようと思います。
      let div = document.createElement("div");
      div.innerHTML = elemnt.name;
      div.style.width ='fit-content';
      div.style.height ='auto';
      div.style.padding ='3px';
      div.style.border = "solid 1px black";
      div.style.float ='left';

      if(elemnt.name ==nowStatus)
      {
      	// 今
        div.style.color=textColorNow;
        div.style.backgroundColor=backColorNow;
        div.style.fontSize =textSizeNow;
        div.style.textDecoration = textFontNow;
        flg =true;
      }else if( flg ==false)
      {
      	// 済
        div.style.color=textColorEnd;
        div.style.backgroundColor=backColorEnd;
        div.style.fontSize =textSizeEnd;
        div.style.textDecoration = textFontEnd;
      }else
      {
      	// 未
        div.style.color=textColorYet;
        div.style.backgroundColor=backColorYet;
        div.style.fontSize =textSizeYet;
        div.style.textDecoration = textFontYet;
      }

      // 追加
      headElemnt.appendChild(div);  
    };

    return events_;
  });
})(kintone.$PLUGIN_ID);
