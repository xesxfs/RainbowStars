module game {
	export module display {
		export class Highscores extends egret.Sprite {
			private _score:number = NaN;
			private txtS2:flash.TextField;
			private txtS4:flash.TextField;
			private txtS6:flash.TextField;
			private btnMainMenu:egret.SwfButton;
			private txtS1:flash.TextField;
			private txtS9:flash.TextField;
			private txtS3:flash.TextField;
			private txtS5:flash.TextField;
			private btnOnlineLeaders:egret.SwfButton;
			private txtS8:flash.TextField;
			private txtS10:flash.TextField;
			private txtS7:flash.TextField;
			private txtP1:flash.TextField;
			private txtP2:flash.TextField;
			private txtP3:flash.TextField;
			private txtP4:flash.TextField;
			private txtP5:flash.TextField;
			private txtP6:flash.TextField;
			private txtP7:flash.TextField;
			private txtP8:flash.TextField;
			private txtP9:flash.TextField;
			private _name:string;
			private txtP10:flash.TextField;

			public constructor($score:number = 0,$name:string = "")
			{
				super();				var _self__:any = this;

				var _asset:mcHighscores = new mcHighscores();
				_self__.addChild(_asset);
				this.fillContent(_asset);
				this.btnMainMenu.addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.closeHighscores,this),null);
				this.btnOnlineLeaders.addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.showOnline,this),null);
				this.showLocalLeaders();
				this._score = $score;
				this._name = $name;
			}

			private onCloseOnline()
			{
				this.btnMainMenu.enabled = true;
				this.btnOnlineLeaders.enabled = true;
			}

			private showOnline(e:egret.Event)
			{
				if(<any>!this.btnOnlineLeaders.enabled)
				{
					return ;
				}
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				this.btnMainMenu.enabled = false;
				this.btnOnlineLeaders.enabled = false;
				if(game.common.Cookies.isDoSubmitScore(this._score))
				{
					mochi.MochiScores.showLeaderboard({"boardID":Main.MOCHI_LEADERBOARD_ID,"score":this._score,"name":this._name,"onClose":flash.bind(this.onCloseOnline,this)});
				}
				else
				{
					mochi.MochiScores.showLeaderboard({"boardID":Main.MOCHI_LEADERBOARD_ID,"onClose":flash.bind(this.onCloseOnline,this)});
				}
			}

			private showLocalLeaders()
			{
				var arrLeaders:Array<any> = game.common.Cookies.leaderboard;
				var length:number = flash.checkInt(arrLeaders.length);
				var i:number = flash.checkInt(1);
				while(i < length + 1 && i < 11)
				{
					this["txtP" + i].text = arrLeaders[i - 1].n;
					this["txtS" + i].text = arrLeaders[i - 1].s;
					if(arrLeaders[i - 1].n == game.common.Cookies.playerName && arrLeaders[i - 1].s == game.common.Cookies.playerScore)
					{
						this["txtP" + i].textColor = 14276864;
						this["txtS" + i].textColor = 14276864;
					}
					i++;
				}
			}

			private closeHighscores(e:egret.Event)
			{
				var _self__:any = this;
				_self__.dispatchEvent(new egret.Event(game.display.GameOverPanel.GO_TO_MAIN,true));
				if(<any>!this.btnOnlineLeaders.enabled)
				{
					return ;
				}
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				this.parent.removeChild(this);
			}

			private fillContent($asset:egret.Sprite)
			{
				for(var i:number = flash.checkInt(0);i < $asset.numChildren; i++)
				{
					try 
					{
						this[$asset.getChildAt(i).name] = $asset.getChildAt(i);
					}
					catch(e)
					{}
				}
			}

		}
	}
}

flash.extendsClass("game.display.Highscores","egret.Sprite")
