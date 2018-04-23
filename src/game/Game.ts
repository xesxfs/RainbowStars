module game {
	export class Game extends egret.Sprite {
		public static stageW:number;
		public static stageH:number;
		private _gui:game.display.Gui;
		private _background:egret.Sprite;
		private _levelScreen:mcLevel;
		private _totalLevels:number = 10;
		private _balls:flash.Dictionary;
		private _endLevelPanel:game.display.EndLevelPanel;
		private _ballsHolder:egret.Sprite;
		private _startupPanel:game.display.StartupPanel;
		private _successLevelScreen:game.display.LevelSuccessPanel;
		private _mcGameOver:game.display.GameOverPanel;
		private _levelSuccess:boolean = false;

		public constructor()
		{
			super();
			this._balls = new flash.Dictionary(true);
			this.addBackground();
			this.addStartupPanel();
		}

		private addEndLevelPanel()
		{
			var _self__:any = this;
			console.log("## addEndLevelPanel");
			this._endLevelPanel = new game.display.EndLevelPanel();
			this.centerMovie(this._endLevelPanel);
			this._endLevelPanel.lives = this._gui.lives;
			_self__.addChild(this._endLevelPanel);
			this._endLevelPanel.addEventListener(game.display.EndLevelPanel.PLAY_AGAIN,flash.bind(this.replayLevel,this),null);
		}

		private subscribeBallToEvents($ball:game.Ball)
		{
			$ball.addEventListener(game.Ball.EXPAND,flash.bind(this.checkNearBalls,this),null);
			$ball.addEventListener(game.Ball.REMOVE,flash.bind(this.removeBall,this),null);
			$ball.addEventListener(game.Ball.END_ALL,flash.bind(this.endLevel,this),null);
			$ball.addEventListener(game.Ball.START_EXPAND,flash.bind(this.onStartExpand,this),null);
		}

		private addStartupPanel(e:egret.Event = null)
		{
			var _self__:any = this;
			this.clearPanel(this._mcGameOver);
			this._startupPanel = new game.display.StartupPanel();
			_self__.addChild(this._startupPanel);
			this._startupPanel.addEventListener(game.display.StartupPanel.PLAY,flash.bind(this.onClickPlay,this),null,false,0);
			this._levelSuccess = false;
		}

		private endLevel(e:egret.Event)
		{
			var ball:game.Ball = <any>null;
			var ball_key_a;
			for(ball_key_a in this._balls.map)
			{
				ball = this._balls.map[ball_key_a][1];
				ball.removeEventListener(game.Ball.END_ALL,flash.bind(this.endLevel,this),null);
				ball.stopAndDissappear();
			}
			this._gui.alpha = 0;
			this._levelSuccess = this._gui.explosed >= game.common.GameData.GOAL_BALLS[this._gui.level - 1];
			console.log("endLevel",this._levelSuccess);
			if(this._levelSuccess)
			{
				this.showSuccessLevelScreen();
			}
			else
			{
				this._gui.lives--;
				if(this._gui.lives == 0)
				{
					this.gameOver();
				}
				else
				{
					this.addEndLevelPanel();
				}
			}
		}

		private removeAllBalls()
		{
			var ball:game.Ball = <any>null;
			var ball_key_a;
			for(ball_key_a in this._balls.map)
			{
				ball = this._balls.map[ball_key_a][1];
				ball.reportRemove();
			}
			this._balls = new flash.Dictionary(true);
		}

		private centerMovie($mc:egret.DisplayObject)
		{
			$mc.x = game.Game.stageW / 2 - $mc.width / 2;
			$mc.y = game.Game.stageH / 2 - $mc.height / 2;
		}

		private replayLevel(e:egret.Event = null)
		{
			var _self__:any = this;
			console.log("## replayLevel");
			if(this._endLevelPanel)
			{
				this._endLevelPanel.removeEventListener(game.display.EndLevelPanel.PLAY_AGAIN,flash.bind(this.replayLevel,this),null);
				_self__.removeChild(this._endLevelPanel);
				this._endLevelPanel = null;
			}
			this.showStartLevel();
		}

		private removeMe($sprite:egret.DisplayObject)
		{
			var _self__:any = this;
			try 
			{
				_self__.removeChild($sprite);
				var $sprite:egret.DisplayObject = <any>null;
			}
			catch(e)
			{}
		}

		private showStartLevel(e:egret.Event = null)
		{
			var _self__:any = this;
			console.log("## showStartLevel");
			this.clearPanel(this._successLevelScreen);
			if(<any>!this._gui)
			{
				this._gui = new game.display.Gui();
			}
			console.log("LevelSuccessPanel success ",this._levelSuccess);
			if(this._levelSuccess)
			{
				this._gui.level++;
			}
			this._levelScreen = new mcLevel();
			_self__.addChild(this._levelScreen);
			this._gui.alpha = 0;
			this._levelScreen.gotoAndStop(this._gui.level);
			gs.TweenMax.from_static_gs_TweenMax(this._levelScreen,2,{"alpha":0.1});
			this._levelScreen.btnPlay.addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.startGameLevel,this),null);
			this._levelScreen.txtCollect.text = "Explode " + game.common.GameData.GOAL_BALLS[this._gui.level - 1] + " stars out of a total of " + game.common.GameData.TOTAL_BALLS[this._gui.level - 1] + " stars";
			this._levelScreen.txtCollect.textAlign = "center";
			this.centerMovie(this._levelScreen);
		}

		private onStartExpand(e:egret.Event)
		{
			if(<any>!(flash.As3is(e.target,game.Cursor)))
			{
				this.addExplodeText(e.target["x"],e.target["y"]);
				this._gui.explosed++;
				this._gui.score = this._gui.score + game.Ball.activated * 1000;
				game.sound.SoundManager.playRandomExplodeSound();
			}
			this._gui.explosedSuccess = this._gui.explosed >= game.common.GameData.GOAL_BALLS[this._gui.level - 1];
		}

		private removeBall(e:egret.Event)
		{
			var ball:game.Ball = flash.As3As(e.target,game.Ball);
			this._balls.delItem(ball);
			try 
			{
				this._ballsHolder.removeChild(ball);
			}
			catch(e)
			{}
		}

		private checkNearBalls(e:egret.Event)
		{
			var ball:game.Ball = <any>null;
			var ball_key_a;
			for(ball_key_a in this._balls.map)
			{
				ball = this._balls.map[ball_key_a][1];
				if(ball.checkIntersectWithBall(flash.As3As(e.target,game.Ball)))
				{
					ball.expand();
				}
			}
		}

		private addExplodeText($x:number,$y:number)
		{
			$x = flash.checkInt($x);
			$y = flash.checkInt($y);
			var _self__:any = this;
			var mcExplode:mcExplodeStarText = new mcExplodeStarText();
			_self__.addChild(mcExplode);
			mcExplode.x = $x;
			mcExplode.y = $y;
			mcExplode.txt.text = String((this._gui.explosed + 1) * 1000);
			mcExplode.alpha = 0;
			gs.TweenMax.to_static_gs_TweenMax(mcExplode,0.3,{"delay":2,"alpha":1});
			gs.TweenMax.to_static_gs_TweenMax(mcExplode,0.3,{"delay":2.5,"alpha":0,"onComplete":flash.bind(this.removeMe,this),"onCompleteParams":[mcExplode]});
		}

		private addGui()
		{
			var _self__:any = this;
			_self__.addChild(this._gui);
		}

		private gameOver(e:egret.Event = null)
		{
			var _self__:any = this;
			console.log("## gameOver");
			this.removeAllBalls();
			this.clearPanel(this._successLevelScreen);
			this._mcGameOver = new game.display.GameOverPanel();
			this._mcGameOver.addEventListener(game.display.GameOverPanel.PLAY_AGAIN,flash.bind(this.onPlayAgain,this),null);
			this._mcGameOver.addEventListener(game.display.GameOverPanel.GO_TO_MAIN,flash.bind(this.addStartupPanel,this),null,true);
			this._mcGameOver.score = this._gui.score;
			this.centerMovie(this._mcGameOver);
			_self__.addChild(this._mcGameOver);
			if(this._gui.level == this._totalLevels && this._levelSuccess)
			{
				this._mcGameOver.winGame();
			}
			_self__.removeChild(this._gui);
			this._gui = null;
		}

		private addChargedBall(e:egret.Event)
		{
			var _self__:any = this;
			if(this._gui.alpha <= 0.7)
			{
				return ;
			}
			var ball:game.Cursor = new game.Cursor();
			this._ballsHolder.addChildAt(ball,0);
			this.subscribeBallToEvents(ball);
			ball.expand();
			ball.x = this["mouseX"];
			ball.y = this["mouseY"];
			_self__.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,flash.bind(this.addChargedBall,this),null);
		}

		private addBackground()
		{
			var _self__:any = this;
			this._background = new egret.Sprite();
			this._background.graphics.beginFill(0);
			this._background.graphics.drawRect(0,0,game.Game.stageW,game.Game.stageH);
			_self__.addChild(new flash.Bitmap(new imgBackground(1,1)));
		}

		private startGameLevel(e:egret.Event = null)
		{
			var _self__:any = this;
			console.log("## startGameLevel");
			game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
			this.addGui();
			this._gui.alpha = 1;
			_self__.removeChild(this._levelScreen);
			this._ballsHolder = new egret.Sprite();
			_self__.addChild(this._ballsHolder);
			this.addBalls(game.common.GameData.TOTAL_BALLS[this._gui.level - 1]);
			_self__.addEventListener(egret.TouchEvent.TOUCH_BEGIN,flash.bind(this.addChargedBall,this),null);
			this._gui.totalExplosed = game.common.GameData.GOAL_BALLS[this._gui.level - 1];
			this._gui.explosed = 0;
			this._gui.startLevel();
		}

		private showSuccessLevelScreen()
		{
			var _self__:any = this;
			console.log("## showSuccessLevelScreen");
			this._successLevelScreen = new game.display.LevelSuccessPanel();
			this.centerMovie(this._successLevelScreen);
			this._successLevelScreen.levelBonus = this._gui.level * 1000;
			this._successLevelScreen.livesBonus = this._gui.lives * 10000;
			this._successLevelScreen.extraBonus = (this._gui.explosed - game.common.GameData.GOAL_BALLS[this._gui.level - 1]) * 10000;
			this._gui.score = this._gui.score + this._successLevelScreen.calculateScore();
			this._successLevelScreen.totalScore = this._gui.score;
			if(this._gui.level != this._totalLevels)
			{
				this._successLevelScreen.addEventListener(game.display.LevelSuccessPanel.PLAY_NEXT_ROUND,flash.bind(this.showStartLevel,this),null);
			}
			else
			{
				this._successLevelScreen.addEventListener(game.display.LevelSuccessPanel.PLAY_NEXT_ROUND,flash.bind(this.gameOver,this),null);
			}
			_self__.addChild(this._successLevelScreen);
		}

		private onPlayAgain(e:egret.Event)
		{
			console.log("## onPlayAgain");
			this.clearPanel(this._mcGameOver);
			this._levelSuccess = false;
			this.showStartLevel();
		}

		private clearPanel($do:egret.DisplayObject)
		{
			console.log("clear " + $do);
			if($do)
			{
				try 
				{
					$do.parent.removeChild($do);
				}
				catch(e)
				{}
				var $do:egret.DisplayObject = <any>null;
			}
		}

		private addBalls($numBalls:number)
		{
			$numBalls = flash.checkInt($numBalls);
			var ball:game.Ball = <any>null;
			for(var i:number = flash.checkInt(0);i < $numBalls; i++)
			{
				ball = new game.Ball();
				this._ballsHolder.addChild(ball);
				this._balls.setItem(ball,ball);
				this.subscribeBallToEvents(ball);
			}
		}

		private onClickPlay(e:egret.Event)
		{
			var _self__:any = this;
			_self__.removeChild(this._startupPanel);
			this.showStartLevel();
		}

	}
}

game.Game.stageW = 640;
game.Game.stageH = 480;
flash.extendsClass("game.Game","egret.Sprite")
