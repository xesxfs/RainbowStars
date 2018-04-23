module game {
	export module display {
		export module effects {
			export class Fireworks extends egret.Sprite {
				private _stars:Array<any>;
				private Star:any;

				public constructor()
				{
					super()					var _self__:any = this;
;
					this.Star = game.display.effects.Fireworks_Star;
					this._stars = [];
					_self__.addEventListener(egret.Event.REMOVED_FROM_STAGE,flash.bind(this.clearAll,this),null);
					this.createFirework();
				}

				private runExplosionAgain($star:egret.Sprite)
				{
					var scaleValue:number = Math.random();
					$star.x = Math.random() * 600;
					$star.y = Math.random() * 400;
					$star.scaleX = $star.scaleY = 0;
					gs.TweenMax.to_static_gs_TweenMax($star,1 + Math.random(),{"onStart":flash.bind(this.playExplosionSound,this),"rotation":180 - Math.random() * 360,"delay":Math.random() * 3,"scaleX":scaleValue,"scaleY":scaleValue,"onComplete":flash.bind(this.collapseStar,this),"onCompleteParams":[$star]});
				}

				private createFirework()
				{
					var star:egret.Sprite = <any>null;
					var scaleValue:number = <any>NaN;
					for(var i:number = flash.checkInt(0);i < 20; i++)
					{
						star = this.createRandomColorStar();
						star.x = Math.random() * 600;
						star.y = Math.random() * 400;
						star.scaleX = star.scaleY = 0;
						scaleValue = Math.random();
						gs.TweenMax.to_static_gs_TweenMax(star,1 + Math.random(),{"onStart":flash.bind(this.playExplosionSound,this),"rotation":180 - Math.random() * 360,"delay":1 + Math.random() * 2,"scaleX":scaleValue,"scaleY":scaleValue,"onComplete":flash.bind(this.collapseStar,this),"onCompleteParams":[star]});
					}
				}

				private clearAll(e:egret.Event)
				{
					var _self__:any = this;
					_self__.removeEventListener(egret.Event.REMOVED_FROM_STAGE,flash.bind(this.clearAll,this),null);
					gs.TweenMax.killAllTweens(false);
					gs.TweenMax.killAllDelayedCalls(false);
					while(this.numChildren)
					{
						_self__.removeChildAt(0);
					}
					this._stars = [];
				}

				private createRandomColorStar():egret.Sprite
				{
					var _self__:any = this;
					var spr:egret.Sprite = <any>null;
					var _asset:flash.Bitmap = <any>null;
					spr = new egret.Sprite();
					_self__.addChild(spr);
					_asset = new this.Star();
					_asset.x = -_asset.width * 0.5;
					_asset.y = -_asset.height * 0.5;
					_asset["smoothing"] = true;
					spr.addChild(_asset);
					var cm:com.gskinner.geom.ColorMatrix = new com.gskinner.geom.ColorMatrix();
					cm.adjustHue(Math.random() * 360 - 180);
					_asset.filters = [new flash.ColorMatrixFilter(cm)];
					this._stars.push(_asset);
					return spr;
				}

				private playExplosionSound()
				{
					if(Math.random() < 0.5)
					{
						game.sound.SoundManager.playRandomExplodeSound();
					}
				}

				private collapseStar($star:egret.Sprite)
				{
					var scaleValue:number = <any>0;
					gs.TweenMax.to_static_gs_TweenMax($star,0.6,{"scaleX":scaleValue,"scaleY":scaleValue,"rotation":50 - Math.random() * 100,"onComplete":flash.bind(this.runExplosionAgain,this),"onCompleteParams":[$star]});
				}

			}
		}
	}
}

flash.extendsClass("game.display.effects.Fireworks","egret.Sprite")
