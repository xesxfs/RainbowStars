module game {
	export module display {
		export class EndLevelPanel extends egret.Sprite {
			public static PLAY_AGAIN:string;
			private _asset:mcEndLevelPanel;
			private _lives:number = 0;

			public constructor()
			{
				super();				var _self__:any = this;

				this._asset = new mcEndLevelPanel();
				_self__.addEventListener(egret.Event.ADDED_TO_STAGE,flash.bind(this.onAdded,this),null);
				_self__.addChild(this._asset);
				this.alpha = 0;
				gs.TweenMax.to_static_gs_TweenMax(this,4,{"alpha":3,"onComplete":flash.bind(this.onClickPlayAgain,this)});
			}

			private onAdded(e:egret.Event)
			{
				var _self__:any = this;
				_self__.removeEventListener(egret.Event.ADDED_TO_STAGE,flash.bind(this.onAdded,this),null);
				this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,flash.bind(this.onClickPlayAgain,this),null);
			}

			private onClickPlayAgain(e:flash.MouseEvent = null)
			{
				var _self__:any = this;
				if(this.stage)
				{
					this.stage.removeEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.onClickPlayAgain,this),null);
					gs.TweenMax.killTweensOf_static_gs_TweenMax(this);
					_self__.dispatchEvent(new egret.Event(game.display.EndLevelPanel.PLAY_AGAIN));
				}
			}

			public set lives(value:number)
			{
				value = flash.checkInt(value);
				this._asset.txtLives.text = value + " lives left";
				if(value == 1)
				{
					this._asset.txtLives.text = value + " life left";
				}
				this._lives = flash.checkInt(value);
			}

		}
	}
}

game.display.EndLevelPanel.PLAY_AGAIN = "playAgain";
flash.extendsClass("game.display.EndLevelPanel","egret.Sprite")
