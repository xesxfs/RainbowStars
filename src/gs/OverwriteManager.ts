module gs {
	export class OverwriteManager extends egret.HashObject {
		public static ALL:number;
		public static mode:number = 0;
		public static NONE:number;
		public static enabled:boolean = false;
		public static AUTO:number;
		public static CONCURRENT:number;
		public static version:number;

		public constructor()
		{
			super();
			super();
		}

		public static killVars($killVars:any,$vars:any,$tweens:Array<any>,$subTweens:Array<any>,$filters:Array<any>)
		{
			var i:number = flash.checkInt(0);
			var p:any = null;
			for(i = flash.checkInt($subTweens.length - 1); i > -1; i--)
			{
				if($killVars[$subTweens[i].name] != undefined)
				{
					$subTweens.splice(i,1);
				}
			}
			for(i = flash.checkInt($tweens.length - 1); i > -1; i--)
			{
				if($killVars[$tweens[i][4]] != undefined)
				{
					$tweens.splice(i,1);
				}
			}
			for(i = flash.checkInt($filters.length - 1); i > -1; i--)
			{
				if($killVars[$filters[i].name] != undefined)
				{
					$filters.splice(i,1);
				}
			}
			for(p in $killVars)
			{
				delete $vars[p];
			}
		}

		public static manageOverwrites($tween:gs.TweenLite,$targetTweens:Array<any>)
		{
			var i:number = flash.checkInt(0);
			var tween:gs.TweenLite = <any>null;
			var v:any = <any>null;
			var p:any = null;
			var vars:any = $tween.vars;
			var m:number = flash.checkInt(vars["overwrite"] == undefined?flash.tranint(gs.OverwriteManager.mode):flash.tranint(flash.tranint(vars["overwrite"])));
			if(m < 2 || $targetTweens == null)
			{
				return ;
			}
			var startTime:number = $tween.startTime;
			var a:Array<any> = [];
			for(i = flash.checkInt($targetTweens.length - 1); i > -1; i--)
			{
				tween = $targetTweens[i];
				if(tween != $tween && tween.startTime <= startTime && tween.startTime + tween.duration * 1000 / tween.combinedTimeScale > startTime)
				{
					a[a.length] = tween;
				}
			}
			if(a.length == 0)
			{
				return ;
			}
			if(m == gs.OverwriteManager.AUTO)
			{
				if(vars["isTV"] == true)
				{
					vars = vars["exposedProps"];
				}
				v = {};
				for(p in vars)
				{
					if(<any>!(p == "ease" || p == "delay" || p == "overwrite" || p == "onComplete" || p == "onCompleteParams" || p == "runBackwards" || p == "persist" || p == "onUpdate" || p == "onUpdateParams" || p == "timeScale" || p == "onStart" || p == "onStartParams" || p == "renderOnStart" || p == "proxiedEase" || p == "easeParams" || p == "onCompleteAll" || p == "onCompleteAllParams" || p == "yoyo" || p == "loop" || p == "onCompleteListener" || p == "onStartListener" || p == "onUpdateListener"))
					{
						v[p] = 1;
						if(p == "shortRotate")
						{
							v["rotation"] = 1;
						}
						else if(p == "removeTint")
						{
							v["tint"] = 1;
						}
						else if(p == "autoAlpha")
						{
							v["alpha"] = 1;
							v["visible"] = 1;
						}
					}
				}
				for(i = flash.checkInt(a.length - 1); i > -1; i--)
				{
					a[i].killVars(v);
				}
			}
			else
			{
				for(i = flash.checkInt(a.length - 1); i > -1; i--)
				{
					a[i].enabled = false;
				}
			}
		}

		public static init($mode:number = 2):number
		{
			if(gs.TweenLite.version < 9.29)
			{
				console.log("TweenLite warning: Your TweenLite class needs to be updated to work with OverwriteManager (or you may need to clear your ASO files). Please download and install the latest version from http://www.tweenlite.com.");
			}
			gs.TweenLite.overwriteManager = gs.OverwriteManager;
			gs.OverwriteManager.mode = flash.checkInt($mode);
			gs.OverwriteManager.enabled = true;
			return gs.OverwriteManager.mode;
		}

	}
}

gs.OverwriteManager.ALL = 1;
gs.OverwriteManager.NONE = 0;
gs.OverwriteManager.AUTO = 2;
gs.OverwriteManager.CONCURRENT = 3;
gs.OverwriteManager.version = 1;
