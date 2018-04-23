module game {
	export module display {
		export class Gui extends egret.Sprite {
			private _txtTotalBalls:flash.TextField;
			private _level:number = 1;
			private _txtExplosedBalls:flash.TextField;
			private _mcLives:egret.SwfMovie;
			private _txtLevel:flash.TextField;
			private _totalExplosed:number = 0;
			private _explosed:number = 0;
			private _score:number = 0;
			private _txtScore:flash.TextField;
			private _numLife:number = 0;
			private _asset:mcGui;

			public constructor()
			{
				super();				var _self__:any = this;

				this._asset = new mcGui();
				_self__.addChild(this._asset);
				this._mcLives = this._asset.mcLife;
				this._txtScore = this._asset.txtScore;
				this._txtLevel = this._asset.txtLevel;
				this._txtExplosedBalls = this._asset.txtExplosedBalls;
				this._txtTotalBalls = this._asset.txtTotalBalls;
				this._mcLives.stop();
				this.lives = 3;
				this.score = 0;
			}

			public startLevel()
			{
				gs.TweenMax.from_static_gs_TweenMax(this,1,{"alpha":0,"ease":gs.easing.Quad.easeInOut});
			}

			public get level():number
			{
				return this._level;
			}

			public get lives():number
			{
				return this._numLife;
			}

			public set level(value:number)
			{
				value = flash.checkInt(value);
				this._level = flash.checkInt(value);
				this._txtLevel.text = String(value);
			}

			public set lives(value:number)
			{
				value = flash.checkInt(value);
				console.log("lives " + value);
				this._numLife = flash.checkInt(value);
				this._mcLives.gotoAndStop(value + 1);
			}

			public get totalExplosed():number
			{
				return this._totalExplosed;
			}

			public get score():number
			{
				return this._score;
			}

			public set score(value:number)
			{
				value = flash.checkInt(value);
				this._score = flash.checkInt(value);
				this._txtScore.text = String(value);
			}

			public set totalExplosed(value:number)
			{
				value = flash.checkInt(value);
				this._totalExplosed = flash.checkInt(value);
				this._txtTotalBalls.text = "/" + String(value);
			}

			public get explosed():number
			{
				return this._explosed;
			}

			public set explosedSuccess(value:boolean)
			{
				if(value)
				{
					this._txtExplosedBalls.textColor = flash.checkUint(56576);
				}
				else
				{
					this._txtExplosedBalls.textColor = flash.checkUint(14483456);
				}
			}

			public set explosed(value:number)
			{
				value = flash.checkInt(value);
				if(value == 0)
				{
					this.explosedSuccess = false;
				}
				this._explosed = flash.checkInt(value);
				this._txtExplosedBalls.text = String(value);
			}

		}
	}
}

flash.extendsClass("game.display.Gui","egret.Sprite")
