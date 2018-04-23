 class Main extends egret.Sprite {
	public static MOCHI_BOT_ID:string;
	public static MOCHI_ID:string;
	public static MOCHI_LEADERBOARD_ID:string;
	public static STAGE:egret.Stage;

	public constructor()
	{
		super();
		var _self__:any = this;
		if(this.stage)
		{
			Main.STAGE = this.stage;
			this.init();
		}
		else
		{
			_self__.addEventListener(egret.Event.ADDED_TO_STAGE,flash.bind(this.init,this),null);
		}
	}

	private init(e:egret.Event = null)
	{
		var _self__:any = this;
		_self__.removeEventListener(egret.Event.ADDED_TO_STAGE,flash.bind(this.init,this),null);
		flash.Security["allowDomain"]("*");
		_self__.addChild(new game.Game());
	}

}

Main.MOCHI_BOT_ID = "905bbfbf";
Main.MOCHI_ID = "af37b7db51f3cc0a";
Main.MOCHI_LEADERBOARD_ID = "4932d4cce294441e";
flash.extendsClass("Main","egret.Sprite")
