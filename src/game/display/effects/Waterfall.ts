module game {
	export module display {
		export module effects {
			export class Waterfall extends egret.Sprite {
				private stars:Array<any>;
				private starsSpeed:Array<any>;
				private starsRotat:Array<any>;
				private Star:any;

				public constructor()
				{
					super()					var _self__:any = this;
;
					this.Star = game.display.effects.Waterfall_Star;
					this.stars = [];
					this.starsSpeed = [];
					this.starsRotat = [];
					_self__.addEventListener(egret.Event.REMOVED_FROM_STAGE,flash.bind(this.clearAll,this),null);
					_self__.addEventListener(egret.Event.ENTER_FRAME,flash.bind(this.enterFrame,this),null);
					this.createWaterFall();
				}

				private clearAll(e:egret.Event)
				{
					var _self__:any = this;
					_self__.removeEventListener(egret.Event.REMOVED_FROM_STAGE,flash.bind(this.clearAll,this),null);
					while(this.numChildren)
					{
						_self__.removeChildAt(0);
					}
				}

				private enterFrame(e:egret.Event)
				{
					for(var i:number = flash.checkInt(0);i < this.stars.length; i++)
					{
						this.stars[i].y = this.stars[i].y + this.starsSpeed[i];
						this.stars[i].rotation = this.stars[i].rotation + this.starsSpeed[i] * this.starsRotat[i];
						if(this.stars[i].y > 650)
						{
							this.stars[i].y = -50;
							this.stars[i].x = Math.random() * 600;
						}
					}
				}

				private createWaterFall()
				{
					for(var i:number = flash.checkInt(0);i < 20; i++)
					{
						this.starsSpeed.push(1 + Math.random() * 7);
						this.createRandomColorStar().x = Math.random() * 600;
						this.starsRotat.push(Math.random() > 0.5?-1:1);
					}
				}

				private createRandomColorStar():flash.Bitmap
				{
					var _self__:any = this;
					var _asset:flash.Bitmap = <any>new this.Star();
					_asset.scaleX = _asset.scaleY = Math.random() < 0.5?flash.trannumber(0.2):flash.trannumber(-0.2);
					_asset.x = -_asset.width * 0.5;
					_asset.y = -100;
					_asset["smoothing"] = true;
					_self__.addChild(_asset);
					var cm:com.gskinner.geom.ColorMatrix = new com.gskinner.geom.ColorMatrix();
					cm.adjustHue(Math.random() * 360 - 180);
					_asset.filters = [new flash.ColorMatrixFilter(cm)];
					this.stars.push(_asset);
					return _asset;
				}

			}
		}
	}
}

flash.extendsClass("game.display.effects.Waterfall","egret.Sprite")
