module game {
	export class Ball extends egret.Sprite {
		public static EXPAND:string;
		public static REMOVE:string;
		public static activated:number;
		public static explosionSpeed:number;
		public static START_EXPAND:string;
		public static END_ALL:string;
		protected _isExpand:boolean = false;
		protected _radius:number = 0;
		private _expandScaleValue:number = 4;
		private _maxSpeed:number = 1.5;
		private _clockwizeRotation:number = -1;
		private Star:any;
		protected _dx:number = NaN;
		protected _asset:flash.Bitmap;
		protected _dy:number = NaN;

		public constructor()
		{
			super();			var _self__:any = this;

			this.Star = game.Ball_Star;
			this._dx = 2 + Math.random() * this._maxSpeed;
			this._dy = 2 + Math.random() * this._maxSpeed;
			this._dx = this._dx * (Math.random() < 0.5?1:-1);
			this._dy = this._dy * (Math.random() < 0.5?1:-1);
			if(Math.random() < 0.5)
			{
				this._clockwizeRotation = flash.checkInt(1);
			}
			this.x = Math.random() * game.Game.stageW;
			this.y = Math.random() * game.Game.stageH;
			_self__.addEventListener(egret.Event.ENTER_FRAME,flash.bind(this.onEnterFrame,this),null);
			this.drawBall();
		}

		private onExpandUpdate()
		{
			var _self__:any = this;
			_self__.dispatchEvent(new egret.Event(game.Ball.EXPAND));
		}

		public stopAndDissappear()
		{
			var _self__:any = this;
			_self__.removeEventListener(egret.Event.ENTER_FRAME,flash.bind(this.onEnterFrame,this),null);
			gs.TweenMax.to_static_gs_TweenMax(this,2,{"scaleX":0,"scaleY":0,"onComplete":flash.bind(this.reportRemove,this)});
		}

		public set radius(value:number)
		{
			value = flash.checkInt(value);
			this._radius = flash.checkInt(value);
		}

		public get radius():number
		{
			return this._radius;
		}

		public reportRemove()
		{
			var _self__:any = this;
			if(game.Ball.activated > 0)
			{
				game.Ball.activated--;
			}
			_self__.removeEventListener(egret.Event.ENTER_FRAME,flash.bind(this.onEnterFrame,this),null);
			_self__.dispatchEvent(new egret.Event(game.Ball.REMOVE));
			if(game.Ball.activated == 0)
			{
				_self__.dispatchEvent(new egret.Event(game.Ball.END_ALL));
			}
		}

		public expand()
		{
			var _self__:any = this;
			if(this._isExpand)
			{
				return ;
			}
			_self__.dispatchEvent(new egret.Event(game.Ball.START_EXPAND));
			game.Ball.activated++;
			gs.TweenMax.to_static_gs_TweenMax(this,1,{"scaleX":this._expandScaleValue,"scaleY":this._expandScaleValue,"onComplete":flash.bind(this.collapse,this),"onUpdate":flash.bind(this.changeRadius,this)});
			this._isExpand = true;
		}

		protected drawBall()
		{
			var _self__:any = this;
			this._asset = new this.Star();
			this._asset.scaleX = this._asset.scaleY = 0.2;
			this._asset.x = -this._asset.width * 0.5;
			this._asset.y = -this._asset.height * 0.5;
			this._asset["smoothing"] = true;
			_self__.addChild(this._asset);
			var cm:com.gskinner.geom.ColorMatrix = new com.gskinner.geom.ColorMatrix();
			cm.adjustHue(Math.random() * 360 - 180);
			this.filters = [new flash.ColorMatrixFilter(cm)];
		}

		public get isExpand():boolean
		{
			return this._isExpand;
		}

		private collapse()
		{
			gs.TweenMax.to_static_gs_TweenMax(this,0.3,{"delay":game.Ball.explosionSpeed,"scaleX":0,"scaleY":0,"onComplete":flash.bind(this.reportRemove,this),"onUpdate":flash.bind(this.changeRadius,this)});
			this._isExpand = true;
		}

		private changeRadius()
		{
			this._radius = flash.checkInt(this.width * 0.7);
		}

		protected onEnterFrame(e:egret.Event)
		{
			var _self__:any = this;
			if(<any>!this._isExpand)
			{
				this.x = this.x + this._dx;
				this.y = this.y + this._dy;
				if(this.x < 0 || this.x > game.Game.stageW)
				{
					this._dx = -this._dx;
				}
				if(this.y < 0 || this.y > game.Game.stageH)
				{
					this._dy = -this._dy;
				}
			}
			else
			{
				_self__.dispatchEvent(new egret.Event(game.Ball.EXPAND));
			}
			this.rotation = this.rotation + this._dx * 2 * this._clockwizeRotation;
		}

		public checkIntersectWithBall($ball:game.Ball):boolean
		{
			return egret.Point.distance(new egret.Point($ball.x,$ball.y),new egret.Point(this.x,this.y)) < $ball.radius * 0.5 + this._radius * 0.5;
		}

	}
}

game.Ball.EXPAND = "expand";
game.Ball.REMOVE = "remove";
game.Ball.activated = 0;
game.Ball.explosionSpeed = 1;
game.Ball.START_EXPAND = "startExpand";
game.Ball.END_ALL = "endAllBalls";
flash.extendsClass("game.Ball","egret.Sprite")
