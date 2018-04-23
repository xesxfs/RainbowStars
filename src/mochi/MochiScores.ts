module mochi {
	export class MochiScores extends egret.HashObject {
		public static boardID:string;
		public static onErrorHandler:any;
		public static onCloseHandler:any;

		public constructor()
		{
			super();
			super();
		}

		public static showLeaderboard(options:any = null)
		{
			if(options != null)
			{
				if(options["clip"] != null)
				{
					if(flash.As3is(options["clip"],egret.Sprite))
					{
						mochi.MochiServices.setContainer(options["clip"]);
					}
					delete options["clip"];
				}
				else
				{
					mochi.MochiServices.setContainer();
				}
				mochi.MochiServices.stayOnTop();
				if(options["name"] != null)
				{
					if(flash.As3is(options["name"],flash.TextField))
					{
						if(options["name"].text.length > 0)
						{
							options["name"] = options["name"].text;
						}
					}
				}
				if(options["score"] != null)
				{
					if(flash.As3is(options["score"],flash.TextField))
					{
						if(options["score"].text.length > 0)
						{
							options["score"] = options["score"].text;
						}
					}
				}
				if(options["onDisplay"] != null)
				{
					options["onDisplay"]();
				}
				else if(mochi.MochiServices.clip != null)
				{
					if(flash.As3is(mochi.MochiServices.clip,egret.SwfMovie))
					{
						mochi.MochiServices.clip["stop"]();
					}
					else
					{
						console.log("Warning: Container is not a MovieClip, cannot call default onDisplay.");
					}
				}
			}
			else
			{
				var options:any = {};
				if(flash.As3is(mochi.MochiServices.clip,egret.SwfMovie))
				{
					mochi.MochiServices.clip["stop"]();
				}
				else
				{
					console.log("Warning: Container is not a MovieClip, cannot call default onDisplay.");
				}
			}
			if(options["onClose"] != null)
			{
				mochi.MochiScores.onCloseHandler = options["onClose"];
			}
			else
			{
				mochi.MochiScores.onCloseHandler = function ()
				{
					if(flash.As3is(mochi.MochiServices.clip,egret.SwfMovie))
					{
						mochi.MochiServices.clip["play"]();
					}
					else
					{
						console.log("Warning: Container is not a MovieClip, cannot call default onClose.");
					}
				};
			}
			if(options["onError"] != null)
			{
				mochi.MochiScores.onErrorHandler = options["onError"];
			}
			else
			{
				mochi.MochiScores.onErrorHandler = null;
			}
			if(options["boardID"] == null)
			{
				if(mochi.MochiScores.boardID != null)
				{
					options["boardID"] = mochi.MochiScores.boardID;
				}
			}
			mochi.MochiServices.send("scores_showLeaderboard",{"options":options},null,mochi.MochiScores.onClose);
		}

		public static closeLeaderboard()
		{
			mochi.MochiServices.send("scores_closeLeaderboard");
		}

		public static getPlayerInfo(callbackObj:any,callbackMethod:any = null)
		{
			mochi.MochiServices.send("scores_getPlayerInfo",null,callbackObj,callbackMethod);
		}

		public static requestList(callbackObj:any,callbackMethod:any = null)
		{
			mochi.MochiServices.send("scores_requestList",null,callbackObj,callbackMethod);
		}

		public static scoresArrayToObjects(scores:any):any
		{
			var i:number = <any>NaN;
			var j:number = <any>NaN;
			var o:any = <any>null;
			var row_obj:any = <any>null;
			var item:any = null;
			var param:any = null;
			var so:any = {};
			for(item in scores)
			{
				if(typeof scores[item] == "object")
				{
					if(scores[item].cols != null && scores[item].rows != null)
					{
						so[item] = [];
						o = scores[item];
						for(j = 0; j < o["rows"].length; j++)
						{
							row_obj = {};
							for(i = 0; i < o["cols"].length; i++)
							{
								row_obj[o["cols"][i]] = o["rows"][j][i];
							}
							so[item].push(row_obj);
						}
					}
					else
					{
						so[item] = {};
						for(param in scores[item])
						{
							so[item][param] = scores[item][param];
						}
					}
				}
				else
				{
					so[item] = scores[item];
				}
			}
			return so;
		}

		public static submit(score:number,name:string,callbackObj:any = null,callbackMethod:any = null)
		{
			mochi.MochiServices.send("scores_submit",{"score":score,"name":name},callbackObj,callbackMethod);
		}

		public static onClose(args:any = null)
		{
			if(args != null)
			{
				if(args["error"] != null)
				{
					if(args["error"] == true)
					{
						if(mochi.MochiScores.onErrorHandler != null)
						{
							if(args["errorCode"] == null)
							{
								args["errorCode"] = "IOError";
							}
							mochi.MochiScores.onErrorHandler;
							mochi.MochiServices.doClose();
							return ;
						}
					}
				}
			}
			mochi.MochiScores.onCloseHandler;
			mochi.MochiServices.doClose();
		}

		public static setBoardID(boardID:string)
		{
			mochi.MochiScores.boardID = boardID;
			mochi.MochiServices.send("scores_setBoardID",{"boardID":boardID});
		}

	}
}

