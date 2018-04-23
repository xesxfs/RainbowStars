module game {
	export module display {
		export class StartupPanel extends egret.Sprite {
			public static HIGHSCORES:string;
			public static PLAY:string;
			public static INSTRUCTIONS:string;
			private highscores:game.display.Highscores;
			private btnSoundOn:egret.SwfButton;
			private btnSoundOff:egret.SwfButton;
			private btnCredits:egret.SwfButton;
			private btnHighScores:egret.SwfButton;
			private btnInstructions:egret.SwfButton;
			private btnPlayMoreGames:egret.SwfButton;
			private _mcCredits:egret.DisplayObject;
			private btnPlay:egret.SwfButton;
			private _mcStartScreen:mcStartScreen;

			public constructor()
			{
				super();				var _self__:any = this;

				this._mcStartScreen = new mcStartScreen();
				_self__.addChild(this._mcStartScreen);
				this.fillContent();
				var waterFall:game.display.effects.Waterfall = new game.display.effects.Waterfall();
				_self__.addChildAt(waterFall,0);
				this.mute(game.common.Cookies.mute);
			}

			private closeModalScreens(e:egret.Event)
			{
				var _self__:any = this;
				if(this._mcCredits)
				{
					_self__.removeChild(this._mcCredits);
					this._mcCredits = null;
				}
				if(this.highscores)
				{
					_self__.removeChild(this.highscores);
					this.highscores = null;
				}
			}

			private mute($isMute:boolean)
			{
				game.sound.SoundManager.mute = $isMute;
				this.btnSoundOn.visible = <any>!$isMute;
				this.btnSoundOff.visible = $isMute;
			}

			private navigateToGlowingEye(e:flash.MouseEvent)
			{
				flash.navigateToURL(new egret.URLRequest("http://www.glowingeyegames.com"));
			}

			private navigateToMFNW(e:egret.Event)
			{
				flash.navigateToURL(new egret.URLRequest("http://www.makeflashnotwar.com"));
			}

			private fillContent()
			{
				for(var i:number = flash.checkInt(0);i < this._mcStartScreen.numChildren; i++)
				{
					if(flash.As3is(this._mcStartScreen.getChildAt(i),egret.SwfButton))
					{
						this[this._mcStartScreen.getChildAt(i).name] = this._mcStartScreen.getChildAt(i);
					}
					this._mcStartScreen.getChildAt(i).addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.onClickButton,this),null);
				}
			}

			private onClickButton(e:flash.MouseEvent)
			{
				var _self__:any = this;
				var urlReq:egret.URLRequest = <any>null;
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				switch(e.target)
				{
				case this.btnPlayMoreGames :
					urlReq = new egret.URLRequest("http://www.match3.com");
					flash.navigateToURL(urlReq,"_blank");
					break;
				case this.btnCredits :
					this._mcCredits = new mcCredits();
					this._mcCredits["btnMainMenu"].addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.closeModalScreens,this),false,0,true);
					this._mcCredits["btnGlowingEye"].addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.navigateToGlowingEye,this),false,0,true);
					this._mcCredits["btnMFNW"].addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.navigateToMFNW,this),false,0,true);
					_self__.addChild(this._mcCredits);
					break;
				case this.btnPlay :
					_self__.dispatchEvent(new egret.Event(game.display.StartupPanel.PLAY));
					break;
				case this.btnHighScores :
					this.highscores = new game.display.Highscores();
					_self__.addChild(this.highscores);
					_self__.dispatchEvent(new egret.Event(game.display.StartupPanel.HIGHSCORES));
					break;
				case this.btnInstructions :
					this._mcCredits = new mcInstructions();
					this._mcCredits["btnMainMenu"].addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.closeModalScreens,this),false,0,true);
					_self__.addChild(this._mcCredits);
					break;
				case this.btnSoundOn :
					this.mute(true);
					break;
				case this.btnSoundOff :
					this.mute(false);
				}
			}

		}
	}
}

game.display.StartupPanel.HIGHSCORES = "highscores";
game.display.StartupPanel.PLAY = "play";
game.display.StartupPanel.INSTRUCTIONS = "instructions";
flash.extendsClass("game.display.StartupPanel","egret.Sprite")
