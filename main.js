//近づくと熊が逃げていくように変更
//100匹中、50匹捕まえればクリア
//50匹以上に逃げられればゲームオーバー


enchant();
window.onload = function(){
 	//ゲームの本体部分を生成
	var game = new Core(320,320);

	//Zキーが反応するようにしよう
	game.keybind(90, "z");
	//game.input.z←この部分に対応したラベルを設定。
	game.keybind(88, "x");
	game.keybind(32, "spaceKey")

 	//ゲームの実行速度（フレーム数）を指定
	game.fps = 30;

 	//画像の読み込み
	var chara1 = "images/chara1.png";
	var start = "images/start.png";
	var end = "images/end.png";
	var end2 = "images/clear.png";
	var map0 = "images/map0.png";	//マップチップを読み込む

 	//音声データの読み込み
	var shot2 = "sound/shot2.wav";


	//スコアに関する変数
	var time = 0;
	var score = 400;
	var end_flag = false;
	var escape = 1;

 	//使用画像のプリロード（事前読込）
	game.preload(chara1, shot2, start, end, end2, map0);

	game.onload = function(){
		//スタート画面を追加
		start_ = function(){
			var titleScene = new Scene();
			var s_start = new Sprite(236,48);
			s_start.image = game.assets[start];

			//位置調整
			s_start.x = ((320 - 236)/2);
			s_start.y = ((320 - 48)/2);


			var label1 = new Label();
			label1.text = ("逃げられる前に50匹捕まえろ！！");
			label1.x = (60);
			label1.y = (210);
			var label2 = new Label();
			label2.text = ("'スペース'　キーでスタート");
			label2.x = (80);
			label2.y = (240);

			//ゲームスタートさせる
			label2.addEventListener('touchend', function(){
				game.popScene();
			});
			titleScene.on("spaceKeybuttonup", function(){
				game.popScene();
			});

			titleScene.addChild(s_start);
			titleScene.addChild(label1);
			titleScene.addChild(label2);
			game.pushScene(titleScene);
		}
		start_();


		//ゲームオーバー画面を追加
		gameover = function(img){
			var gameoverScene = new Scene();
			var s_gameover = new Sprite(189,97);
			s_gameover.image = game.assets[img];

			//位置調整
			s_gameover.x = ((320 - 189)/2);
			s_gameover.y = ((320 - 97)/2);

			//ラベル
			var label = new Label();
			label.text = ('クマに逃げられてしまいました！');
			label.x = (60);
			label.y = (75);

			//リトライの用意
			var retryLabel = new Label();
			retryLabel.text = ('>>リトライ<<');
			retryLabel.x = (110);
			retryLabel.y = (230);
			retryLabel.addEventListener('touchend', function(){
				location.reload();
			});
			gameoverScene.on("spaceKeybuttonup", function(){
				location.reload();
			});
			gameoverScene.on("spaceKeybuttonup", function(){
				location.reload();
			});


			//追加
			gameoverScene.addChild(s_gameover);
			gameoverScene.addChild(label);
			gameoverScene.addChild(retryLabel);
			game.pushScene(gameoverScene);

		}

		Bear = Class.create(Sprite, {
			initialize: function(x, y, spd){
				Sprite.call(this, 32, 32);
				this.image = game.assets[chara1];
				this.x = x;
				this.y = y;
				this.spd = spd;
				this.baseframe = 5;	//白熊
				this.frame = this.baseframe;		//白熊
				this.scale(-1,1);	//左右反転
				game.rootScene.addChild(this);

				this.on("enterframe", function(){
					//①一定範囲内に近づくと、プレイヤー（bear）の方に向かってくる
					//逃げていくように変更
					if(this.within(bear, 150)){
						this.x -= (this.x > bear.x) ? -this.spd : this.spd;
						this.y += (this.y < bear.y) ? -this.spd : this.spd;
						if(this.age % 3 == 0){
							this.frame = this.baseframe + this.frame % 3;
						}
					}
					if (this.x < 0 || this.x > 320 || this.y > 320 || this.y < 0 && !end_flag) {
						escape++
						game.rootScene.removeChild(this);
						//5匹以上に逃げられたらゲームオーバー
						if (escape > 50) {
							end_flag = true;
							gameover(end);
						}
					}

					//プレイヤー（bear）と接触したらプレイヤーのHPを減らして後で消える
					if(this.intersect(bear)){
						game.rootScene.removeChild(this);

						//ここで音を鳴らす
						var sound = DOMSound.load(shot2);
						sound.volume = 0.2;
						sound.play();

						if (!end_flag) {
							bear.hp--;
							if(bear.hp < 1){
								// gameover(end2);
								end_flag = true;
								var score_label = new Label();		//文字用のオブジェクト
								score -= time * escape;
								score_label.text = "スコア:" + (score * 10) + "　逃げられた数：" + (escape-1);	//文字の内容
								// score.size();

								score_label.color = "#333333";		//文字の色
								score_label.x = 30;					//文字のX座標
								score_label.y = 150;				//文字のY座標
								score_label.font = "16px cursive";
								score_label.color = "#ff0000";		//文字の色

								//リトライの用意
								var retryLabel = new Label();
								retryLabel.text = ('>>リトライ<<');
								retryLabel.x = (110);
								retryLabel.y = (180);
								retryLabel.addEventListener('touchend', function(){
									location.reload();
								});
								game.on("spaceKeybuttonup", function(){
									location.reload();
								});
								game.on("spaceKeybuttonup", function(){
									location.reload();
								});

								game.rootScene.addChild(retryLabel);
								game.rootScene.addChild(score_label);	//ラベルをゲーム中に追加


							}
						}
					}

					//行動パターンを書き換えてみよう
				});
			},
		});

		//大量生産する場合は、配列に格納すると便利です
		//10匹に変更
		var bears = [];
		for(i=0; i<100; i++){
			bears.push(new Bear(60+rand(220), 60+rand(220), rand(5) ));
		}


		//熊の画像をスプライトとして読み込み
		var bear = new Sprite(32,32);
		bear.image = game.assets[chara1];

		//熊の座標を指定
		bear.x = 0;
		bear.y = 30;

		//熊のHPを指定
		bear.hp = 50;	//★

		//熊の移動方向を指定
		bear.dir_x = 1;	//★
		bear.dir_y = 1;	//★

		//熊のスプライトのフレーム数を指定
		bear.frame = 0;

		//熊の移動速度を指定
		bear.move = 10;

		//熊をゲーム内に追加
		game.rootScene.addChild(bear);

		//熊の毎フレーム処理
		bear.addEventListener("enterframe", function(){
			//キー入力にあわせて移動するように書き換えてみよう
			if(game.input.left && this.x > 0 && !end_flag){ this.x -= this.move; }
			if(game.input.right && this.x < (320-32) && !end_flag){ this.x += this.move; }
			if(game.input.up && this.y > 0  && !end_flag){ this.y -= this.move; }
			if(game.input.down && this.y < (320-32) && !end_flag){ this.y += this.move; }
		});

		//熊に対してのクリックイベント(touchstart)を追加してみよう
		// bear.on("touchstart", function(){
		// 	this.hp--;
		// 	if(this.hp <= 0){
		// 		game.rootScene.removeChild(this);
		// 	}
		// });

		//ゲームのルートシーンの毎フレーム処理
		game.rootScene.on("enterframe", function(e){
			hp.text = "残り必要捕獲数" + bear.hp;
		});

		//熊の体力表示用のラベルを作成
		var hp = new Label();		//文字用のオブジェクト
		hp.text = "熊のHP：" + bear.hp;	//文字の内容
		hp.color = "#333333";		//文字の色
		hp.x = 10;			//文字のX座標
		hp.y = 10;			//文字のY座標
		// hp.font = "50px";
		game.rootScene.addChild(hp);	//ラベルをゲーム中に追加



		var time_label = new Label();		//文字用のオブジェクト
		time_label.text = "タイム：0";				//文字の内容
		time_label.x = 235;			//文字のX座標
		time_label.y = 10;			//文字のY座標

		time_label.addEventListener(enchant.Event.ENTER_FRAME, function(){
			if (!end_flag) {
				var progress = parseInt(game.frame/game.fps);
				time = parseInt(game.frame/game.fps);
				// console.log(time);
				this.text = "タイム：" + time;
			}
		});
		game.rootScene.addChild(time_label);

		//アイテム用のクラスを作ってみよう


		//タイムラインによるアニメーションを試してみよう


		//マップ用のデータを読み込んでみよう
		load_map();	//マップのデータを読み込む

		//マップを生成してゲームに追加してみよう

	}	//onload閉じ

	// game.debug();	//startの代わりにdebugと書くと判定が見えるように
	game.start();	//
}

//乱数の生成用関数を書いてみよう
rand = function(v){
	return Math.floor((v+1)*Math.random());
}

//＋ーの生成用関数を書いてみよう
tf = function(){
	return Math.round(Math.random()) == 1 ? 1 : -1;
	//乱数の値（0~1）を四捨五入して1になるか否かで1か-1を返す
}

//マップデータはゲームの処理部に書くと長くなるので切り分け
load_map = function(){
	layer0 = [
			[ 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 0, 0, 0, 0, 0, 0, 0, 5, 5, 5, 2, 2, 2, 2, 2, 2, 2, 2, 4 ],
			[ 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 4, 4, 4, 4, 4, 4, 4, 4, 4 ]
	];

	collision = [
			[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1 ],
			[ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ],
	];
}