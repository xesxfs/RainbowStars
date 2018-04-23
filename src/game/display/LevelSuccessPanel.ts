module game {
	export module display {
		export class LevelSuccessPanel extends egret.Sprite {
			public static PLAY_NEXT_ROUND:string;
			private _txtExtraStarsExploded:flash.TextField;
			private _totalScore:number = NaN;
			private _extraBonus:number = NaN;
			private _levelBonus:number = NaN;
			private _t1:flash.TextField;
			private _t2:flash.TextField;
			private _t3:flash.TextField;
			private _t4:flash.TextField;
			private _txtLivesBonus:flash.TextField;
			private _asset:mcSuccessLevel;
			private _appearSpeed:number = 0.3;
			private _livesBonus:number = NaN;
			private _txtRoundNumberBonus:flash.TextField;
			private _txtTotalScore:flash.TextField;

			public constructor()
			{
				super();				var _self__:any = this;

				this._asset = new mcSuccessLevel();
				this._asset.btnPlay.addEventListener(egret.TouchEvent.TOUCH_TAP,flash.bind(this.onPlayClick,this),null);
				this._txtExtraStarsExploded = this._asset.txtExtraStarsExploded;
				this._txtLivesBonus = this._asset.txtLivesBonus;
				this._txtRoundNumberBonus = this._asset.txtRoundNumberBonus;
				this._txtTotalScore = this._asset.txtTotalScore;
				this._t1 = this._asset.t1;
				this._t2 = this._asset.t2;
				this._t3 = this._asset.t3;
				this._t4 = this._asset.t4;
				_self__.addChild(this._asset);
				this._asset.alpha = 0;
				gs.TweenMax.to_static_gs_TweenMax(this._asset,2,{"alpha":1,"delay":0});
				this.appearTextField(this._t1,1 * this._appearSpeed);
				this.appearTextField(this._txtRoundNumberBonus,2 * this._appearSpeed);
				this.appearTextField(this._t2,3 * this._appearSpeed);
				this.appearTextField(this._txtLivesBonus,4 * this._appearSpeed);
				this.appearTextField(this._t3,5 * this._appearSpeed);
				this.appearTextField(this._txtExtraStarsExploded,6 * this._appearSpeed);
				this.appearTextField(this._t4,7 * this._appearSpeed);
				this.appearTextField(this._txtTotalScore,8 * this._appearSpeed);
				this.appearTextField(this._asset.btnPlay,10 * this._appearSpeed);
				game.sound.SoundManager.play(game.sound.SoundManager.STAR_EXPLODE_1);
			}

			private appearTextField($tf:egret.DisplayObject,$delay:number)
			{
				$tf.alpha = 0;
				gs.TweenMax.to_static_gs_TweenMax($tf,1,{"delay":$delay,"y":$tf.y + 10,"alpha":1,"ease":gs.easing.Elastic.easeOut,"onStart":flash.bind(this.onStartAppearing,this),"onStartParams":[$tf]});
			}

			public calculateScore():number
			{
				var result:number = this.levelBonus + this.livesBonus + this.extraBonus;
				this._levelBonus = this._livesBonus = this._extraBonus = 0;
				return result;
			}

			private onPlayClick(e:flash.MouseEvent)
			{
				var _self__:any = this;
				if(this._asset.btnPlay.alpha < 1)
				{
					return ;
				}
				game.sound.SoundManager.play(game.sound.SoundManager.BUTTON_CLICK);
				_self__.dispatchEvent(new egret.Event(game.display.LevelSuccessPanel.PLAY_NEXT_ROUND));
			}

			public get livesBonus():number
			{
				return this._livesBonus;
			}

			public set extraBonus(value:number)
			{
				if(value < 0)
				{
					value = 0;
				}
				this._txtExtraStarsExploded.text = String(value);
				this._extraBonus = value;
			}

			private onStartAppearing($tf:egret.DisplayObject)
			{
				if($tf == this._txtRoundNumberBonus)
				{
					game.sound.SoundManager.play(game.sound.SoundManager.STAR_EXPLODE_2);
				}
				else if($tf == this._txtLivesBonus)
				{
					game.sound.SoundManager.play(game.sound.SoundManager.STAR_EXPLODE_3);
				}
				else if($tf == this._txtExtraStarsExploded)
				{
					game.sound.SoundManager.play(game.sound.SoundManager.STAR_EXPLODE_4);
				}
				else if($tf == this._txtTotalScore)
				{
					game.sound.SoundManager.play(game.sound.SoundManager.STAR_EXPLODE_5);
				}
				else if($tf == this._asset.btnPlay)
				{
					game.sound.SoundManager.play(game.sound.SoundManager.STAR_EXPLODE_5);
				}
			}

			public set totalScore(value:number)
			{
				this._txtTotalScore.text = String(value);
				this._totalScore = value;
			}

			public get extraBonus():number
			{
				return this._extraBonus;
			}

			public set livesBonus(value:number)
			{
				this._txtLivesBonus.text = String(value);
				this._livesBonus = value;
			}

			public get totalScore():number
			{
				return this._totalScore;
			}

			public set levelBonus(value:number)
			{
				this._txtRoundNumberBonus.text = String(value);
				this._levelBonus = value;
			}

			public get levelBonus():number
			{
				return this._levelBonus;
			}

		}
	}
}

game.display.LevelSuccessPanel.PLAY_NEXT_ROUND = "playNextRound";
flash.extendsClass("game.display.LevelSuccessPanel","egret.Sprite")
