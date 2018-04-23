 class Preloader extends egret.SwfMovie {
	private _mainClass:any;

	public constructor()
	{
		super();
		this.addMochi();
	}

	private addMochi()
	{
		mochi.MochiAd.showPreGameAd({"clip":this,"ad_finished":flash.bind(this.closeMochiAd,this),"id":Main.MOCHI_ID,"res":"640x480","background":16777161,"color":16747008,"outline":13994812,"no_bg":false});
		mochi.MochiServices.connect(Main.MOCHI_ID,this);
		mochi.MochiBot.track(this,Main.MOCHI_BOT_ID);
		mochi.MochiScores.setBoardID(Main.MOCHI_LEADERBOARD_ID);
	}

	private closeMochiAd()
	{
		var _self__:any = this;
		_self__.addEventListener(egret.Event.ENTER_FRAME,flash.bind(this.checkFrame,this),null);
	}

	private checkFrame(e:egret.Event)
	{
		var _self__:any = this;
		if(this["loaderInfo"].bytesLoaded == this["loaderInfo"].bytesTotal)
		{
			_self__.removeEventListener(egret.Event.ENTER_FRAME,flash.bind(this.checkFrame,this),null);
			this.startup();
		}
	}

	private startup()
	{
		var _self__:any = this;
		Main.STAGE = this.stage;
		_self__.stop();
		this["loaderInfo"].removeEventListener(egret.ProgressEvent.PROGRESS,flash.bind(this.progress,this),null);
		if(<any>!this._mainClass)
		{
			this._mainClass = <any>flash.getDefinitionByName("Main");
			_self__.addChild(flash.As3As(new this._mainClass(),egret.DisplayObject));
		}
	}

	private progress(e:egret.ProgressEvent)
	{
	}

}

flash.extendsClass("Preloader","egret.SwfMovie")
