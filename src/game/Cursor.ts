module game {
	export class Cursor extends game.Ball {
		private Sta:any;
		private Star_game_Cursor:any;

		public constructor()
		{
			super();
			this.Star_game_Cursor = game.Cursor_Star;
			this.Sta = game.Cursor_Sta;
		}

		public get radius():number
		{
			return this._radius * 1.5;
		}

		public set radius(value:number)
		{
			egret.superSetter(game.Cursor, this, "radius", value);
		}
	
 		protected drawBall()
		{
			var _self__:any = this;
			this._asset = new this.Star_game_Cursor();
			this._asset.scaleX = this._asset.scaleY = 0.2;
			this._asset.x = -this._asset.width * 0.5;
			this._asset.y = -this._asset.height * 0.5;
			this._asset["smoothing"] = true;
			_self__.addChild(this._asset);
		}

		protected onEnterFrame(e:egret.Event)
		{
			var _self__:any = this;
			_self__.dispatchEvent(new egret.Event(game.Ball.EXPAND));
		}

	}
}

flash.extendsClass("game.Cursor","game.Ball")
