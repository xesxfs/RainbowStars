module mochi {
	export class MochiAd extends egret.HashObject {

		public constructor()
		{
			super();
			super();
		}

		public static getVersion():string
		{
			return "2.7";
		}

		public static showClickAwayAd(options:any)
		{
			var clip:any = <any>null;
			var mc:egret.SwfMovie = <any>null;
			var chk:egret.SwfMovie = <any>null;
			var DEFAULTS:any = {"ad_timeout":2000,"regpt":"o","method":"showClickAwayAd","res":"300x250","no_bg":true,"ad_started":function ()
{
},"ad_finished":function ()
{
},"ad_loaded":function (width:number,height:number)
{
},"ad_failed":function ()
{
	console.log("[MochiAd] Couldn\'t load an ad, make sure your game\'s local security sandbox is configured for Access Network Only and that you are not using ad blocking software");
},"ad_skipped":function ()
{
}};
			var options:any = mochi.MochiAd._parseOptions(options,DEFAULTS);
			clip = options["clip"];
			var ad_timeout:number = <any>options["ad_timeout"];
			delete options["ad_timeout"];
			if(<any>!mochi.MochiAd.load(options))
			{
				options["ad_failed"]();
				options["ad_finished"]();
				return ;
			}
			options["ad_started"]();
			mc = clip["_mochiad"];
			mc["onUnload"] = function ()
			{
				mochi.MochiAd._cleanup(mc);
				options["ad_finished"]();
			};
			var wh:Array<any> = mochi.MochiAd._getRes(options,clip);
			var w:number = <any>wh[0];
			var h:number = <any>wh[1];
			mc.x = w * 0.5;
			mc.y = h * 0.5;
			chk = mochi.MochiAd.createEmptyMovieClip(mc,"_mochiad_wait",3);
			chk["ad_timeout"] = ad_timeout;
			chk["started"] = egret.getTimer();
			chk["showing"] = false;
			mc["unloadAd"] = function ()
			{
				mochi.MochiAd.unload(clip);
			};
			mc["adLoaded"] = options["ad_loaded"];
			mc["adSkipped"] = options["ad_skipped"];
			mc["rpc"] = function (callbackID:number,arg:any)
			{
				mochi.MochiAd.rpc(clip,callbackID,arg);
			};
			var sendHostProgress:boolean = <any>false;
			mc["regContLC"] = function (lc_name:string)
			{
				mc["_containerLCName"] = lc_name;
			};
			chk["onEnterFrame"] = function ()
			{
				var total:number = <any>NaN;
				if(<any>!this["parent"])
				{
					delete this["onEnterFrame"];
					return ;
				}
				var ad_clip:any = <any>this["parent"]._mochiad_ctr;
				var elapsed:number = egret.getTimer() - this["started"];
				var finished:boolean = <any>false;
				if(<any>!chk["showing"])
				{
					total = this["parent"]._mochiad_ctr.contentLoaderInfo.bytesTotal;
					if(total > 0)
					{
						chk["showing"] = true;
						finished = true;
						chk["started"] = egret.getTimer();
					}
					else if(elapsed > chk["ad_timeout"])
					{
						options["ad_failed"]();
						finished = true;
					}
				}
				if(this["root"] == null)
				{
					finished = true;
				}
				if(finished)
				{
					delete this["onEnterFrame"];
				}
			};
			mochi.MochiAd.doOnEnterFrame(chk);
		}

		public static _isNetworkAvailable():boolean
		{
			return flash.Security["sandboxType"] != "localWithFile";
		}

		public static _allowDomains(server:string):string
		{
			var hostname:string = <any>server.split("/")[2].split(":")[0];
			flash.Security["allowDomain"]("*");
			flash.Security["allowDomain"](hostname);
			flash.Security["allowInsecureDomain"]("*");
			flash.Security["allowInsecureDomain"](hostname);
			return hostname;
		}

		public static unload(clip:any):boolean
		{
			if(clip["clip"] && clip["clip"]._mochiad)
			{
				clip = clip["clip"];
			}
			if(clip["origFrameRate"] != undefined)
			{
				clip["stage"].frameRate = clip["origFrameRate"];
			}
			if(<any>!clip["_mochiad"])
			{
				return false;
			}
			if(clip["_mochiad"]._containerLCName != undefined)
			{
				clip["_mochiad"].lc.send(clip["_mochiad"]._containerLCName,"notify",{"id":"unload"});
			}
			if(clip["_mochiad"].onUnload)
			{
				clip["_mochiad"].onUnload();
			}
			delete clip["_mochiad_loaded"];
			delete clip["_mochiad"];
			return true;
		}

		public static showInterLevelAd(options:any)
		{
			var clip:any = <any>null;
			var mc:egret.SwfMovie = <any>null;
			var chk:egret.SwfMovie = <any>null;
			var DEFAULTS:any = {"ad_timeout":2000,"fadeout_time":250,"regpt":"o","method":"showTimedAd","ad_started":function ()
{
	if(flash.As3is(this["clip"],egret.SwfMovie))
	{
		this["clip"].stop();
		return ;
	}
	throw new flash.Error("MochiAd.showInterLevelAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.").message;
},"ad_finished":function ()
{
	if(flash.As3is(this["clip"],egret.SwfMovie))
	{
		this["clip"].play();
		return ;
	}
	throw new flash.Error("MochiAd.showInterLevelAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.").message;
},"ad_loaded":function (width:number,height:number)
{
},"ad_failed":function ()
{
	console.log("[MochiAd] Couldn\'t load an ad, make sure your game\'s local security sandbox is configured for Access Network Only and that you are not using ad blocking software");
},"ad_skipped":function ()
{
}};
			var options:any = mochi.MochiAd._parseOptions(options,DEFAULTS);
			clip = options["clip"];
			var ad_msec:number = <any>11000;
			var ad_timeout:number = <any>options["ad_timeout"];
			delete options["ad_timeout"];
			var fadeout_time:number = <any>options["fadeout_time"];
			delete options["fadeout_time"];
			if(<any>!mochi.MochiAd.load(options))
			{
				options["ad_failed"]();
				options["ad_finished"]();
				return ;
			}
			options["ad_started"]();
			mc = clip["_mochiad"];
			mc["onUnload"] = function ()
			{
				mochi.MochiAd._cleanup(mc);
				options["ad_finished"]();
			};
			var wh:Array<any> = mochi.MochiAd._getRes(options,clip);
			var w:number = <any>wh[0];
			var h:number = <any>wh[1];
			mc.x = w * 0.5;
			mc.y = h * 0.5;
			chk = mochi.MochiAd.createEmptyMovieClip(mc,"_mochiad_wait",3);
			chk["ad_msec"] = ad_msec;
			chk["ad_timeout"] = ad_timeout;
			chk["started"] = egret.getTimer();
			chk["showing"] = false;
			chk["fadeout_time"] = fadeout_time;
			chk["fadeFunction"] = function ()
			{
				if(<any>!this["parent"])
				{
					delete this["onEnterFrame"];
					delete this["fadeFunction"];
					return ;
				}
				var p:number = 100 * (1 - (egret.getTimer() - this["fadeout_start"]) / this["fadeout_time"]);
				if(p > 0)
				{
					this["parent"].alpha = p * 0.01;
				}
				else
				{
					mochi.MochiAd.unload(clip);
					delete this["onEnterFrame"];
				}
			};
			mc["unloadAd"] = function ()
			{
				mochi.MochiAd.unload(clip);
			};
			mc["adLoaded"] = options["ad_loaded"];
			mc["adSkipped"] = options["ad_skipped"];
			mc["adjustProgress"] = function (msec:number)
			{
				var _chk:any = <any>mc["_mochiad_wait"];
				_chk["server_control"] = true;
				_chk["showing"] = true;
				_chk["started"] = egret.getTimer();
				_chk["ad_msec"] = msec - 250;
			};
			mc["rpc"] = function (callbackID:number,arg:any)
			{
				mochi.MochiAd.rpc(clip,callbackID,arg);
			};
			chk["onEnterFrame"] = function ()
			{
				var total:number = <any>NaN;
				if(<any>!this["parent"])
				{
					delete this["onEnterFrame"];
					delete this["fadeFunction"];
					return ;
				}
				var ad_clip:any = <any>this["parent"]._mochiad_ctr;
				var elapsed:number = egret.getTimer() - this["started"];
				var finished:boolean = <any>false;
				if(<any>!chk["showing"])
				{
					total = this["parent"]._mochiad_ctr.contentLoaderInfo.bytesTotal;
					if(total > 0)
					{
						chk["showing"] = true;
						chk["started"] = egret.getTimer();
						mochi.MochiAd.adShowing(clip);
					}
					else if(elapsed > chk["ad_timeout"])
					{
						options["ad_failed"]();
						finished = true;
					}
				}
				if(elapsed > chk["ad_msec"])
				{
					finished = true;
				}
				if(finished)
				{
					if(this["server_control"])
					{
						delete this["onEnterFrame"];
					}
					else
					{
						this["fadeout_start"] = egret.getTimer();
						this["onEnterFrame"] = this["fadeFunction"];
					}
				}
			};
			mochi.MochiAd.doOnEnterFrame(chk);
		}

		public static _parseOptions(options:any,defaults:any):any
		{
			var k:any = null;
			var pairs:Array<any> = <any>null;
			var i:number = <any>NaN;
			var kv:Array<any> = <any>null;
			var optcopy:any = {};
			for(k in defaults)
			{
				optcopy[k] = defaults[k];
			}
			if(options)
			{
				for(k in options)
				{
					optcopy[k] = options[k];
				}
			}
			if(optcopy["clip"] == undefined)
			{
				throw new flash.Error("MochiAd is missing the \'clip\' parameter.  This should be a MovieClip, Sprite or an instance of a class that extends MovieClip or Sprite.").message;
			}
			options = optcopy["clip"].loaderInfo.parameters.mochiad_options;
			if(options)
			{
				pairs = options["split"]("&");
				for(i = 0; i < pairs.length; i++)
				{
					kv = pairs[i].split("=");
					optcopy[unescape(kv[0])] = unescape(kv[1]);
				}
			}
			if(optcopy["id"] == "test")
			{
				console.log("[MochiAd] WARNING: Using the MochiAds test identifier, make sure to use the code from your dashboard, not this example!");
			}
			return optcopy;
		}

		public static _cleanup(mc:any)
		{
			var k:string = <any>null;
			var lc:flash.LocalConnection = <any>null;
			var f:Function = <any>null;
			if("lc" in mc)
			{
				lc = mc["lc"];
				f = function ()
				{
					try 
					{
						lc.client = null;
						lc["close"]();
					}
					catch(e)
					{}
				};
				flash.setTimeout(f,0);
			}
			var idx:number = <any>(<egret.DisplayObjectContainer>(mc)).numChildren;
			while(idx > 0)
			{
				idx--;
				(<egret.DisplayObjectContainer>(mc)).removeChildAt(idx);
			}
			for(k in mc)
			{
				delete mc[k];
			}
		}

		public static load(options:any):egret.SwfMovie
		{
			var _arguments__ = [];
			for(var _arguments__key in arguments)
			{
				_arguments__ = arguments[_arguments__key];
			}
			var clip:any = <any>null;
			var k:string = <any>null;
			var server:string = <any>null;
			var hostname:string = <any>null;
			var lc:flash.LocalConnection = <any>null;
			var name:string = <any>null;
			var loader:flash.Loader = <any>null;
			var g:Function = <any>null;
			var req:egret.URLRequest = <any>null;
			var v:any = <any>null;
			var DEFAULTS:any = {"server":"http://x.mochiads.com/srv/1/","method":"load","depth":10333,"id":"_UNKNOWN_"};
			var options:any = mochi.MochiAd._parseOptions(options,DEFAULTS);
			options["swfv"] = 9;
			options["mav"] = mochi.MochiAd.getVersion();
			clip = options["clip"];
			if(<any>!mochi.MochiAd._isNetworkAvailable())
			{
				return null;
			}
			try 
			{
				if(clip["_mochiad_loaded"])
				{
					return null;
				}
			}
			catch(e)
			{
				throw new flash.Error("MochiAd requires a clip that is an instance of a dynamic class.  If your class extends Sprite or MovieClip, you must make it dynamic.").message;
			}
			var depth:number = <any>options["depth"];
			delete options["depth"];
			var mc:egret.SwfMovie = mochi.MochiAd.createEmptyMovieClip(clip,"_mochiad",depth);
			var wh:Array<any> = mochi.MochiAd._getRes(options,clip);
			options["res"] = wh[0] + "x" + wh[1];
			options["server"] = options["server"] + options["id"];
			delete options["id"];
			clip["_mochiad_loaded"] = true;
			if(clip["loaderInfo"].loaderURL.indexOf("http") == 0)
			{
				options["as3_swf"] = clip["loaderInfo"].loaderURL;
			}
			var lv:egret.URLVariables = new egret.URLVariables();
			for(k in options)
			{
				v = options[k];
				if(<any>!(flash.As3is(v,Function)))
				{
					lv[k] = v;
				}
			}
			server = lv["server"];
			delete lv["server"];
			hostname = mochi.MochiAd._allowDomains(server);
			lc = new flash.LocalConnection();
			lc.client = mc;
			name = ["",Math.floor(new flash.As3Date().getTime()),Math.floor(Math.random() * 999999)].join("_");
			lc["allowDomain"]("*","localhost");
			lc["allowInsecureDomain"]("*","localhost");
			lc["connect"](name);
			mc["lc"] = lc;
			mc["lcName"] = name;
			lv["lc"] = name;
			lv["st"] = egret.getTimer();
			loader = new flash.Loader();
			g = function (ev:any)
			{
				ev["target"].removeEventListener(ev["type"],_arguments__["callee"]);
				mochi.MochiAd.unload(clip);
			};
			loader.contentLoaderInfo.addEventListener(flash.Event.UNLOAD,g,null);
			req = new egret.URLRequest(server + ".swf?cacheBust=" + new flash.As3Date().getTime());
			req.contentType = "application/x-www-form-urlencoded";
			req.method = egret.URLRequestMethod.POST;
			req.data = lv;
			loader.load(req);
			mc.addChild(loader);
			mc["_mochiad_ctr"] = loader;
			return mc;
		}

		public static runMethod(base:any,methodName:string,argsArray:Array<any>):any
		{
			var nameArray:Array<any> = methodName.split(".");
			for(var i:number = <any>0;i < nameArray.length - 1; i++)
			{
				if(base[nameArray[i]] == undefined || base[nameArray[i]] == null)
				{
					return undefined;
				}
				base = base[nameArray[i]];
			}
			if(typeof base[nameArray[i]] == "function")
			{
				return base[nameArray[i]].apply(base,argsArray);
			}
			return undefined;
		}

		public static createEmptyMovieClip(parent:any,name:string,depth:number):egret.SwfMovie
		{
			var mc:egret.SwfMovie = new egret.SwfMovie();
			if(false && depth)
			{
				parent["addChildAt"](mc,depth);
			}
			else
			{
				parent["addChild"](mc);
			}
			parent[name] = mc;
			mc["_name"] = name;
			return mc;
		}

		public static _getRes(options:any,clip:any):Array<any>
		{
			var xy:Array<any> = <any>null;
			var b:any = <any>clip["getBounds"](clip["root"]);
			var w:number = <any>0;
			var h:number = <any>0;
			if(typeof options["res"] != "undefined")
			{
				xy = options["res"].split("x");
				w = parseFloat(xy[0]);
				h = parseFloat(xy[1]);
			}
			else
			{
				w = b["xMax"] - b["xMin"];
				h = b["yMax"] - b["yMin"];
			}
			if(w == 0 || h == 0)
			{
				w = clip["stage"].stageWidth;
				h = clip["stage"].stageHeight;
			}
			return [w,h];
		}

		public static adShowing(mc:any)
		{
			mc["origFrameRate"] = mc["stage"].frameRate;
			mc["stage"].frameRate = 30;
		}

		public static getValue(base:any,objectName:string):any
		{
			var nameArray:Array<any> = objectName.split(".");
			for(var i:number = <any>0;i < nameArray.length - 1; i++)
			{
				if(base[nameArray[i]] == undefined || base[nameArray[i]] == null)
				{
					return undefined;
				}
				base = base[nameArray[i]];
			}
			return base[nameArray[i]];
		}

		public static rpc(clip:any,callbackID:number,arg:any)
		{
			var val:any = <any>null;
			var ret:any = <any>null;
			switch(arg["id"])
			{
			case "setValue" :
				mochi.MochiAd.setValue(clip,arg["objectName"],arg["value"]);
				break;
			case "getValue" :
				val = mochi.MochiAd.getValue(clip,arg["objectName"]);
				clip["_mochiad"].lc.send(clip["_mochiad"]._containerLCName,"rpcResult",callbackID,val);
				break;
			case "runMethod" :
				ret = mochi.MochiAd.runMethod(clip,arg["method"],arg["args"]);
				clip["_mochiad"].lc.send(clip["_mochiad"]._containerLCName,"rpcResult",callbackID,ret);
				break;
			default :
				console.log("[mochiads rpc] unknown rpc id: " + arg["id"]);
			}
		}

		public static setValue(base:any,objectName:string,value:any)
		{
			var nameArray:Array<any> = objectName.split(".");
			for(var i:number = <any>0;i < nameArray.length - 1; i++)
			{
				if(base[nameArray[i]] == undefined || base[nameArray[i]] == null)
				{
					return ;
				}
				base = base[nameArray[i]];
			}
			base[nameArray[i]] = value;
		}

		public static showPreGameAd(options:any)
		{
			var _arguments__ = [];
			for(var _arguments__key in arguments)
			{
				_arguments__ = arguments[_arguments__key];
			}
			var clip:any = <any>null;
			var mc:egret.SwfMovie = <any>null;
			var chk:egret.SwfMovie = <any>null;
			var complete:boolean = <any>false;
			var unloaded:boolean = <any>false;
			var sendHostProgress:boolean = <any>false;
			var fn:Function = <any>null;
			var r:egret.SwfMovie = <any>null;
			var DEFAULTS:any = {"ad_timeout":3000,"fadeout_time":250,"regpt":"o","method":"showPreloaderAd","color":16747008,"background":16777161,"outline":13994812,"no_progress_bar":false,"ad_started":function ()
{
	if(flash.As3is(this["clip"],egret.SwfMovie))
	{
		this["clip"].stop();
		return ;
	}
	throw new flash.Error("MochiAd.showPreGameAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.").message;
},"ad_finished":function ()
{
	if(flash.As3is(this["clip"],egret.SwfMovie))
	{
		this["clip"].play();
		return ;
	}
	throw new flash.Error("MochiAd.showPreGameAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.").message;
},"ad_loaded":function (width:number,height:number)
{
},"ad_failed":function ()
{
	console.log("[MochiAd] Couldn\'t load an ad, make sure your game\'s local security sandbox is configured for Access Network Only and that you are not using ad blocking software");
},"ad_skipped":function ()
{
},"ad_progress":function (percent:number)
{
}};
			var options:any = mochi.MochiAd._parseOptions(options,DEFAULTS);
			if("c862232051e0a94e1c3609b3916ddb17".substr(0) == "dfeada81ac97cde83665f81c12da7def")
			{
				options["ad_started"]();
				fn = function ()
				{
					options["ad_finished"]();
				};
				flash.setTimeout(fn,100);
				return ;
			}
			clip = options["clip"];
			var ad_msec:number = <any>11000;
			var ad_timeout:number = <any>options["ad_timeout"];
			delete options["ad_timeout"];
			var fadeout_time:number = <any>options["fadeout_time"];
			delete options["fadeout_time"];
			if(<any>!mochi.MochiAd.load(options))
			{
				options["ad_failed"]();
				options["ad_finished"]();
				return ;
			}
			options["ad_started"]();
			mc = clip["_mochiad"];
			mc["onUnload"] = function ()
			{
				mochi.MochiAd._cleanup(mc);
				var fn:Function = <any>function ()
				{
					options["ad_finished"]();
				};
				flash.setTimeout(fn,100);
			};
			var wh:Array<any> = mochi.MochiAd._getRes(options,clip);
			var w:number = <any>wh[0];
			var h:number = <any>wh[1];
			mc.x = w * 0.5;
			mc.y = h * 0.5;
			chk = mochi.MochiAd.createEmptyMovieClip(mc,"_mochiad_wait",3);
			chk.x = w * -0.5;
			chk.y = h * -0.5;
			var bar:egret.SwfMovie = mochi.MochiAd.createEmptyMovieClip(chk,"_mochiad_bar",4);
			if(options["no_progress_bar"])
			{
				bar.visible = false;
				delete options["no_progress_bar"];
			}
			else
			{
				bar.x = 10;
				bar.y = h - 20;
			}
			var bar_color:number = <any>options["color"];
			delete options["color"];
			var bar_background:number = <any>options["background"];
			delete options["background"];
			var bar_outline:number = <any>options["outline"];
			delete options["outline"];
			var backing_mc:egret.SwfMovie = mochi.MochiAd.createEmptyMovieClip(bar,"_outline",1);
			var backing:any = <any>backing_mc.graphics;
			backing["beginFill"](bar_background);
			backing["moveTo"](0,0);
			backing["lineTo"](w - 20,0);
			backing["lineTo"](w - 20,10);
			backing["lineTo"](0,10);
			backing["lineTo"](0,0);
			backing["endFill"]();
			var inside_mc:egret.SwfMovie = mochi.MochiAd.createEmptyMovieClip(bar,"_inside",2);
			var inside:any = <any>inside_mc.graphics;
			inside["beginFill"](bar_color);
			inside["moveTo"](0,0);
			inside["lineTo"](w - 20,0);
			inside["lineTo"](w - 20,10);
			inside["lineTo"](0,10);
			inside["lineTo"](0,0);
			inside["endFill"]();
			inside_mc.scaleX = 0;
			var outline_mc:egret.SwfMovie = mochi.MochiAd.createEmptyMovieClip(bar,"_outline",3);
			var outline:any = <any>outline_mc.graphics;
			outline["lineStyle"](0,bar_outline,100);
			outline["moveTo"](0,0);
			outline["lineTo"](w - 20,0);
			outline["lineTo"](w - 20,10);
			outline["lineTo"](0,10);
			outline["lineTo"](0,0);
			chk["ad_msec"] = ad_msec;
			chk["ad_timeout"] = ad_timeout;
			chk["started"] = egret.getTimer();
			chk["showing"] = false;
			chk["last_pcnt"] = 0;
			chk["fadeout_time"] = fadeout_time;
			chk["fadeFunction"] = function ()
			{
				var p:number = 100 * (1 - (egret.getTimer() - this["fadeout_start"]) / this["fadeout_time"]);
				if(p > 0)
				{
					this["parent"].alpha = p * 0.01;
				}
				else
				{
					mochi.MochiAd.unload(clip);
					delete this["onEnterFrame"];
				}
			};
			complete = false;
			unloaded = false;
			var f:Function = <any>function (ev:egret.Event)
			{
				ev.target["removeEventListener"](ev.type,_arguments__["callee"]);
				complete = true;
				if(unloaded)
				{
					mochi.MochiAd.unload(clip);
				}
			};
			clip["loaderInfo"].addEventListener(egret.Event.COMPLETE,f);
			if(flash.As3is(clip["root"],egret.SwfMovie))
			{
				r = flash.As3As(clip["root"],egret.SwfMovie);
				if(r["framesLoaded"] >= r.totalFrames)
				{
					complete = true;
				}
			}
			mc["unloadAd"] = function ()
			{
				unloaded = true;
				if(complete)
				{
					mochi.MochiAd.unload(clip);
				}
			};
			mc["adLoaded"] = options["ad_loaded"];
			mc["adSkipped"] = options["ad_skipped"];
			mc["adjustProgress"] = function (msec:number)
			{
				var _chk:any = <any>mc["_mochiad_wait"];
				_chk["server_control"] = true;
				_chk["showing"] = true;
				_chk["started"] = egret.getTimer();
				_chk["ad_msec"] = msec;
			};
			mc["rpc"] = function (callbackID:number,arg:any)
			{
				mochi.MochiAd.rpc(clip,callbackID,arg);
			};
			mc["rpcTestFn"] = function (s:string):any
			{
				console.log("[MOCHIAD rpcTestFn] " + s);
				return s;
			};
			mc["regContLC"] = function (lc_name:string)
			{
				mc["_containerLCName"] = lc_name;
			};
			sendHostProgress = false;
			mc["sendHostLoadProgress"] = function (lc_name:string)
			{
				sendHostProgress = true;
			};
			chk["onEnterFrame"] = function ()
			{
				var total:number = <any>NaN;
				if(<any>!this["parent"] || <any>!this["parent"].parent)
				{
					delete this["onEnterFrame"];
					return ;
				}
				var _clip:any = <any>this["parent"].parent.root;
				var ad_clip:any = <any>this["parent"]._mochiad_ctr;
				var elapsed:number = egret.getTimer() - this["started"];
				var finished:boolean = <any>false;
				var clip_total:number = <any>_clip["loaderInfo"].bytesTotal;
				var clip_loaded:number = <any>_clip["loaderInfo"].bytesLoaded;
				if(complete)
				{
					clip_loaded = Math.max(1,clip_loaded);
					clip_total = clip_loaded;
				}
				var clip_pcnt:number = 100 * clip_loaded / clip_total;
				var ad_pcnt:number = 100 * elapsed / chk["ad_msec"];
				var _inside:any = <any>this["_mochiad_bar"]._inside;
				var pcnt:number = Math.min(100,Math.min(flash.trannumber(clip_pcnt) || flash.trannumber(0),ad_pcnt));
				pcnt = Math.max(this["last_pcnt"],pcnt);
				this["last_pcnt"] = pcnt;
				_inside["scaleX"] = pcnt * 0.01;
				options["ad_progress"](pcnt);
				if(sendHostProgress)
				{
					clip["_mochiad"].lc.send(clip["_mochiad"]._containerLCName,"notify",{"id":"hostLoadPcnt","pcnt":clip_pcnt});
					if(clip_pcnt == 100)
					{
						sendHostProgress = false;
					}
				}
				if(<any>!chk["showing"])
				{
					total = this["parent"]._mochiad_ctr.contentLoaderInfo.bytesTotal;
					if(total > 0)
					{
						chk["showing"] = true;
						chk["started"] = egret.getTimer();
						mochi.MochiAd.adShowing(clip);
					}
					else if(elapsed > chk["ad_timeout"] && clip_pcnt == 100)
					{
						options["ad_failed"]();
						finished = true;
					}
				}
				if(elapsed > chk["ad_msec"])
				{
					finished = true;
				}
				if(complete && finished)
				{
					if(this["server_control"])
					{
						delete this["onEnterFrame"];
					}
					else
					{
						this["fadeout_start"] = egret.getTimer();
						this["onEnterFrame"] = chk["fadeFunction"];
					}
				}
			};
			mochi.MochiAd.doOnEnterFrame(chk);
		}

		public static showPreloaderAd(options:any)
		{
			console.log("[MochiAd] DEPRECATED: showPreloaderAd was renamed to showPreGameAd in 2.0");
			mochi.MochiAd.showPreGameAd(options);
		}

		public static showTimedAd(options:any)
		{
			console.log("[MochiAd] DEPRECATED: showTimedAd was renamed to showInterLevelAd in 2.0");
			mochi.MochiAd.showInterLevelAd(options);
		}

		public static doOnEnterFrame(mc:egret.SwfMovie)
		{
			var _arguments__ = [];
			for(var _arguments__key in arguments)
			{
				_arguments__ = arguments[_arguments__key];
			}
			var f:Function = <any>function (ev:any)
			{
				if("onEnterFrame" in mc && mc["onEnterFrame"])
				{
					mc["onEnterFrame"]();
				}
				else
				{
					ev["target"].removeEventListener(ev["type"],_arguments__["callee"]);
				}
			};
			mc.addEventListener(egret.Event.ENTER_FRAME,f,null);
		}

	}
}

