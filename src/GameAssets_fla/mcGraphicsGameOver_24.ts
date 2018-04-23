module GameAssets_fla {
	export class mcGraphicsGameOver_24 extends egret.SwfMovie {

		public constructor()
		{
			super();
			this["addFrameScript"](0,flash.bind(this.frame1,this));
		}

		public frame1():any
		{
			var _self__:any = this;
			_self__.stop();
		}

	}
}

flash.extendsClass("GameAssets_fla.mcGraphicsGameOver_24","egret.SwfMovie")
