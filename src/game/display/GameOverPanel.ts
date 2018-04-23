module game {
	export module display {
		export class GameOverPanel extends egret.Sprite {
			public static PLAY_AGAIN:string;
			public static GO_TO_MAIN:string;
			private _firework:game.display.effects.Fireworks;
			private _asset:mcGameOver;
			private _score:number = NaN;
			private _txtPlayerName:flash.TextField;

			public constructor()
			{
				super();				var _self__:any = this;

				this._asset = new mcGameOver();
				_self__.addChild(this._asset);
				this._asset.btnPlayMoreGames.addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.onClickGoToSite,this),null);
				this._asset.btnHighScores.addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.onClickHighScores,this),null);
				this._txtPlayerName = this._asset.txtPlayerName;
				Main.STAGE["focus"] = this._txtPlayerName;
				this._txtPlayerName.text = game.common.Cookies.playerName;
				this._firework = new game.display.effects.Fireworks();
				_self__.addChildAt(this._firework,0);
				this._asset.mcGraphics.stop();
			}

			private onClickPlayAgain(e:egret.Event)
			{
				var _self__:any = this;
				_self__.removeChild(this._firework);
				this._firework = null;
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				_self__.dispatchEvent(new egret.Event(game.display.GameOverPanel.PLAY_AGAIN));
			}

			public set score(value:number)
			{
				this._asset.txtScore.text = String(value);
				this._score = value;
			}

			private onClickGoToMain(e:egret.Event)
			{
				var _self__:any = this;
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				_self__.dispatchEvent(new egret.Event(game.display.GameOverPanel.GO_TO_MAIN));
			}

			private onClickHighScores(e:egret.Event)
			{
				var _self__:any = this;
				game.common.Cookies.playerName = this._txtPlayerName.text;
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				game.common.Cookies.addUserScore(this._txtPlayerName.text,this._score);
				var highscores:game.display.Highscores = new game.display.Highscores(this._score,this._txtPlayerName.text);
				_self__.addChild(highscores);
			}

			public winGame()
			{
				this._asset.mcGraphics.gotoAndStop(2);
			}

			public get score():number
			{
				return this._score;
			}

			private onClickGoToSite(e:egret.Event)
			{
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				var urlReq:egret.URLRequest = new egret.URLRequest("http://www.match3.com");
				flash.navigateToURL(urlReq,"_blank");
			}

		}
	}
}

game.display.GameOverPanel.PLAY_AGAIN = "playAgain";
game.display.GameOverPanel.GO_TO_MAIN = "goToMain";
flash.extendsClass("game.display.GameOverPanel","egret.Sprite")
