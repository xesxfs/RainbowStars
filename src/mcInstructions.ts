 class mcInstructions extends egret.SwfMovie {
	public btnMainMenu:egret.SwfButton;
	public btnBlocker:egret.SwfButton;

	public constructor()
	{
		super();
		this["addFrameScript"](0,flash.bind(this.frame1,this));
	}

	public frame1():any
	{
		this.btnBlocker.useHandCursor = false;
	}

}

flash.extendsClass("mcInstructions","egret.SwfMovie")
