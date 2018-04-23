module mochi {
	export class MochiServices extends egret.HashObject {
		public static _container:any;
		public static _connected:boolean;
		public static _swfVersion:string;
		public static _sendChannel:flash.LocalConnection;
		public static _rcvChannelName:string;
		public static _gatewayURL:string;
		public static _clip:egret.SwfMovie;
		public static _loader:flash.Loader;
		public static _id:string;
		public static _listenChannel:flash.LocalConnection;
		public static _timer:egret.Timer;
		public static _sendChannelName:string;
		public static _startTime:number = NaN;
		public static _connecting:boolean;
		public static onError:any;
		public static _listenChannelName:string;
		public static _rcvChannel:flash.LocalConnection;

		public constructor()
		{
			super();
			super();
		}

		public static isNetworkAvailable():boolean
		{
			return flash.Security["sandboxType"] != "localWithFile";
		}

		public static send(methodName:string,args:any = null,callbackObject:any = null,callbackMethod:any = null)
		{
			if(mochi.MochiServices._connected)
			{
				mochi.MochiServices._sendChannel["send"](mochi.MochiServices._sendChannelName,"onReceive",{"methodName":methodName,"args":args,"callbackID":mochi.MochiServices._clip["_nextcallbackID"]});
			}
			else
			{
				if(mochi.MochiServices._clip == null || <any>!mochi.MochiServices._connecting)
				{
					mochi.MochiServices.onError;
					mochi.MochiServices.handleError(args,callbackObject,callbackMethod);
					mochi.MochiServices.flush(true);
					return ;
				}
				mochi.MochiServices._clip["_queue"].push({"methodName":methodName,"args":args,"callbackID":mochi.MochiServices._clip["_nextcallbackID"]});
			}
			if(mochi.MochiServices._clip != null)
			{
				if(mochi.MochiServices._clip["_callbacks"] != null && mochi.MochiServices._clip["_nextcallbackID"] != null)
				{
					mochi.MochiServices._clip["_callbacks"][mochi.MochiServices._clip["_nextcallbackID"]] = {"callbackObject":callbackObject,"callbackMethod":callbackMethod};
					mochi.MochiServices._clip["_nextcallbackID"]++;
				}
			}
		}

		public static get connected():boolean
		{
			return mochi.MochiServices._connected;
		}

		private static flush(error:boolean)
		{
			var request:any = <any>null;
			var callback:any = <any>null;
			if(mochi.MochiServices._clip != null)
			{
				if(mochi.MochiServices._clip["_queue"] != null)
				{
					while(mochi.MochiServices._clip["_queue"].length > 0)
					{
						request = mochi.MochiServices._clip["_queue"].shift();
						callback = null;
						if(request != null)
						{
							if(request["callbackID"] != null)
							{
								callback = mochi.MochiServices._clip["_callbacks"][request["callbackID"]];
							}
							delete mochi.MochiServices._clip["_callbacks"][request["callbackID"]];
							if(error && callback != null)
							{
								mochi.MochiServices.handleError(request["args"],callback["callbackObject"],callback["callbackMethod"]);
							}
						}
					}
				}
			}
		}

		private static clickMovie(url:string,cb:Function):egret.SwfMovie
		{
			var b:number = flash.checkInt(0);
			var loader:flash.Loader = <any>null;
			var avm1_bytecode:Array<any> = [150,21,0,7,1,0,0,0,0,98,116,110,0,7,2,0,0,0,0,116,104,105,115,0,28,150,22,0,0,99,114,101,97,116,101,69,109,112,116,121,77,111,118,105,101,67,108,105,112,0,82,135,1,0,0,23,150,13,0,4,0,0,111,110,82,101,108,101,97,115,101,0,142,8,0,0,0,0,2,42,0,114,0,150,17,0,0,32,0,7,1,0,0,0,8,0,0,115,112,108,105,116,0,82,135,1,0,1,23,150,7,0,4,1,7,0,0,0,0,78,150,8,0,0,95,98,108,97,110,107,0,154,1,0,0,150,7,0,0,99,108,105,99,107,0,150,7,0,4,1,7,1,0,0,0,78,150,27,0,7,2,0,0,0,7,0,0,0,0,0,76,111,99,97,108,67,111,110,110,101,99,116,105,111,110,0,64,150,6,0,0,115,101,110,100,0,82,79,150,15,0,4,0,0,95,97,108,112,104,97,0,7,0,0,0,0,79,150,23,0,7,255,0,255,0,7,1,0,0,0,4,0,0,98,101,103,105,110,70,105,108,108,0,82,23,150,25,0,7,0,0,0,0,7,0,0,0,0,7,2,0,0,0,4,0,0,109,111,118,101,84,111,0,82,23,150,25,0,7,100,0,0,0,7,0,0,0,0,7,2,0,0,0,4,0,0,108,105,110,101,84,111,0,82,23,150,25,0,7,100,0,0,0,7,100,0,0,0,7,2,0,0,0,4,0,0,108,105,110,101,84,111,0,82,23,150,25,0,7,0,0,0,0,7,100,0,0,0,7,2,0,0,0,4,0,0,108,105,110,101,84,111,0,82,23,150,25,0,7,0,0,0,0,7,0,0,0,0,7,2,0,0,0,4,0,0,108,105,110,101,84,111,0,82,23,150,16,0,7,0,0,0,0,4,0,0,101,110,100,70,105,108,108,0,82,23];
			var header:Array<any> = [104,0,31,64,0,7,208,0,0,12,1,0,67,2,255,255,255,63,3];
			var footer:Array<any> = [0,64,0,0,0];
			var mc:egret.SwfMovie = new egret.SwfMovie();
			var lc:flash.LocalConnection = new flash.LocalConnection();
			var lc_name:string = "_click_" + Math.floor(Math.random() * 999999) + "_" + Math.floor(new flash.As3Date().getTime());
			lc = new flash.LocalConnection();
			mc["lc"] = lc;
			mc["click"] = cb;
			lc.client = mc;
			lc["connect"](lc_name);
			var ba:flash.ByteArray = new flash.ByteArray();
			var cpool:flash.ByteArray = new flash.ByteArray();
			cpool.endian = flash.Endian.LITTLE_ENDIAN;
			cpool.writeShort(1);
			cpool.writeUTFBytes(url + " " + lc_name);
			cpool.writeByte(0);
			var actionLength:number = flash.checkUint(avm1_bytecode.length + cpool.length + 4);
			var fileLength:number = flash.checkUint(actionLength + 35);
			ba.endian = flash.Endian.LITTLE_ENDIAN;
			ba.writeUTFBytes("FWS");
			ba.writeByte(8);
			ba.writeUnsignedInt(fileLength);
			var b_key_a;
			for(b_key_a in header)
			{
				b = header[b_key_a];
				ba.writeByte(b);
			}
			ba.writeUnsignedInt(actionLength);
			ba.writeByte(136);
			ba.writeShort(cpool.length);
			ba.writeBytes(cpool);
			var b_key_a;
			for(b_key_a in avm1_bytecode)
			{
				b = avm1_bytecode[b_key_a];
				ba.writeByte(b);
			}
			var b_key_a;
			for(b_key_a in footer)
			{
				b = footer[b_key_a];
				ba.writeByte(b);
			}
			loader = new flash.Loader();
			loader["loadBytes"](ba);
			mc.addChild(loader);
			return mc;
		}

		private static init(id:string,clip:any)
		{
			mochi.MochiServices._id = id;
			if(clip != null)
			{
				mochi.MochiServices._container = clip;
				mochi.MochiServices.loadCommunicator(id,mochi.MochiServices._container);
			}
		}

		public static get childClip():any
		{
			return mochi.MochiServices._clip;
		}

		public static get id():string
		{
			return mochi.MochiServices._id;
		}

		public static stayOnTop()
		{
			mochi.MochiServices._container["addEventListener"](egret.Event.ENTER_FRAME,mochi.MochiServices.bringToTop,false,0,true);
			if(mochi.MochiServices._clip != null)
			{
				mochi.MochiServices._clip.visible = true;
			}
		}

		public static addLinkEvent(url:string,burl:string,btn:egret.DisplayObjectContainer,onClick:Function = null)
		{
			var _arguments__ = [];
			for(var _arguments__key in arguments)
			{
				_arguments__ = arguments[_arguments__key];
			}
			var netup:boolean = <any>false;
			var s:string = <any>null;
			var x:string = <any>null;
			var req:egret.URLRequest = <any>null;
			var loader:flash.Loader = <any>null;
			var err:Function = <any>null;
			var complete:Function = <any>null;
			var setURL:Function = <any>null;
			var vars:any = new Object();
			vars["mav"] = mochi.MochiServices.getVersion();
			vars["swfv"] = "9";
			vars["swfurl"] = btn["loaderInfo"].loaderURL;
			vars["fv"] = flash.Capabilities.version;
			vars["os"] = flash.Capabilities.os;
			vars["lang"] = flash.Capabilities.language;
			vars["scres"] = flash.Capabilities.screenResolutionX + "x" + flash.Capabilities.screenResolutionY;
			s = "?";
			var i:number = <any>0;
			for(x in vars)
			{
				if(i != 0)
				{
					s = s + "&";
				}
				i++;
				s = s + x + "=" + escape(vars[x]);
			}
			req = new egret.URLRequest("http://x.mochiads.com/linkping.swf");
			loader = new flash.Loader();
			err = function (ev:any)
			{
				netup = false;
				ev["target"].removeEventListener(ev["type"],_arguments__["callee"]);
			};
			complete = function (ev:any)
			{
				netup = true;
				ev["target"].removeEventListener(ev["type"],_arguments__["callee"]);
			};
			loader.contentLoaderInfo.addEventListener(egret.IOErrorEvent.IO_ERROR,err,null);
			loader.contentLoaderInfo.addEventListener(egret.Event.COMPLETE,complete,null);
			loader.load(req);
			setURL = function ()
			{
				var u:string = <any>null;
				if(netup)
				{
					u = url + s;
				}
				else
				{
					u = burl;
				}
				var avm1Click:egret.DisplayObject = <any>mochi.MochiServices.clickMovie(u,onClick);
				btn.addChild(avm1Click);
				avm1Click.scaleX = 0.01 * btn.width;
				avm1Click.scaleY = 0.01 * btn.height;
			};
			flash.setTimeout(setURL,1500);
		}

		public static getVersion():string
		{
			return "1.35";
		}

		public static disconnect()
		{
			if(mochi.MochiServices._connected || mochi.MochiServices._connecting)
			{
				if(mochi.MochiServices._clip != null)
				{
					if(mochi.MochiServices._clip.parent != null)
					{
						if(flash.As3is(mochi.MochiServices._clip.parent,egret.Sprite))
						{
							(<egret.Sprite>(mochi.MochiServices._clip.parent)).removeChild(mochi.MochiServices._clip);
							mochi.MochiServices._clip = null;
						}
					}
				}
				mochi.MochiServices._connecting = mochi.MochiServices._connected = false;
				mochi.MochiServices.flush(true);
				try 
				{
					mochi.MochiServices._listenChannel["close"]();
					mochi.MochiServices._rcvChannel["close"]();
				}
				catch(error)
				{}
			}
			if(mochi.MochiServices._timer != null)
			{
				try 
				{
					mochi.MochiServices._timer.stop();
				}
				catch(error)
				{}
			}
		}

		public static allowDomains(server:string):string
		{
			var hostname:string = <any>null;
			flash.Security["allowDomain"]("*");
			flash.Security["allowInsecureDomain"]("*");
			if(server.indexOf("http://") != -1)
			{
				hostname = server.split("/")[2].split(":")[0];
				flash.Security["allowDomain"](hostname);
				flash.Security["allowInsecureDomain"](hostname);
			}
			return hostname;
		}

		public static doClose()
		{
			mochi.MochiServices._container["removeEventListener"](egret.Event.ENTER_FRAME,mochi.MochiServices.bringToTop);
			if(mochi.MochiServices._clip.parent != null)
			{
				(<egret.Sprite>(mochi.MochiServices._clip.parent)).removeChild(mochi.MochiServices._clip);
			}
		}

		public static setContainer(container:any = null,doAdd:boolean = true)
		{
			if(container != null)
			{
				if(flash.As3is(container,egret.Sprite))
				{
					mochi.MochiServices._container = container;
				}
			}
			if(doAdd)
			{
				if(flash.As3is(mochi.MochiServices._container,egret.Sprite))
				{
					(<egret.Sprite>(mochi.MochiServices._container)).addChild(mochi.MochiServices._clip);
				}
			}
		}

		private static onStatus(event:flash.events.StatusEvent)
		{
			switch(event["level"])
			{
			case "error" :
				mochi.MochiServices._connected = false;
				mochi.MochiServices._listenChannel["connect"](mochi.MochiServices._listenChannelName);
			}
		}

		private static initComChannels()
		{
			if(<any>!mochi.MochiServices._connected)
			{
				mochi.MochiServices._sendChannel["addEventListener"](StatusEvent.STATUS,mochi.MochiServices.onStatus);
				mochi.MochiServices._sendChannel["send"](mochi.MochiServices._sendChannelName,"onReceive",{"methodName":"handshakeDone"});
				mochi.MochiServices._sendChannel["send"](mochi.MochiServices._sendChannelName,"onReceive",{"methodName":"registerGame","id":mochi.MochiServices._id,"clip":mochi.MochiServices._container,"version":mochi.MochiServices.getVersion(),"parentURL":mochi.MochiServices._container["loaderInfo"].loaderURL});
				mochi.MochiServices._rcvChannel["addEventListener"](StatusEvent.STATUS,mochi.MochiServices.onStatus);
				mochi.MochiServices._clip["onReceive"] = function (pkg:any)
				{
					var methodName:string = <any>null;
					var cb:string = <any>pkg["callbackID"];
					var cblst:any = <any>this["client"]._callbacks[cb];
					if(<any>!cblst)
					{
						return ;
					}
					var method:any = cblst["callbackMethod"];
					methodName = "";
					var obj:any = <any>cblst["callbackObject"];
					if(obj && typeof method == "string")
					{
						methodName = method;
						if(obj[method] != null)
						{
							method = obj[method];
						}
						else
						{
							console.log("Error: Method  " + method + " does not exist.");
						}
					}
					if(method != undefined)
					{
						try 
						{
							method.apply(obj,pkg["args"]);
						}
						catch(error)
						{
							console.log("Error invoking callback method \'" + methodName + "\': " + error.toString());
						}
					}
					else if(obj != null)
					{
						try 
						{
							obj;
						}
						catch(error)
						{
							console.log("Error invoking method on object: " + error.toString());
						}
					}
					delete this["client"]._callbacks[cb];
				};
				mochi.MochiServices._clip["onError"] = function ()
				{
					mochi.MochiServices.onError;
				};
				mochi.MochiServices._rcvChannel["connect"](mochi.MochiServices._rcvChannelName);
				console.log("connected!");
				mochi.MochiServices._connecting = false;
				mochi.MochiServices._connected = true;
				mochi.MochiServices._listenChannel["close"]();
				while(mochi.MochiServices._clip["_queue"].length > 0)
				{
					mochi.MochiServices._sendChannel["send"](mochi.MochiServices._sendChannelName,"onReceive",mochi.MochiServices._clip["_queue"].shift());
				}
			}
		}

		private static listen()
		{
			mochi.MochiServices._listenChannel = new flash.LocalConnection();
			mochi.MochiServices._listenChannel.client = mochi.MochiServices._clip;
			mochi.MochiServices._clip["handshake"] = function (args:any)
			{
				mochi.MochiServices.comChannelName = args["newChannel"];
			};
			mochi.MochiServices._listenChannel["allowDomain"]("*","localhost");
			mochi.MochiServices._listenChannel["allowInsecureDomain"]("*","localhost");
			mochi.MochiServices._listenChannel["connect"](mochi.MochiServices._listenChannelName);
			console.log("Waiting for MochiAds services to connect...");
		}

		private static handleError(args:any,callbackObject:any,callbackMethod:any)
		{
			if(args != null)
			{
				if(args["onError"] != null)
				{
					args["onError"].apply(null,["NotConnected"]);
				}
				if(args["options"] != null && args["options"].onError != null)
				{
					args["options"].onError.apply(null,["NotConnected"]);
				}
			}
			if(callbackMethod != null)
			{
				var args:any = {};
				args["error"] = true;
				args["errorCode"] = "NotConnected";
				if(callbackObject != null && flash.As3is(callbackMethod,"string"))
				{
					try 
					{
						callbackObject[callbackMethod](args);
					}
					catch(error)
					{}
				}
				else if(callbackMethod != null)
				{
					try 
					{
						callbackMethod["apply"](args);
					}
					catch(error)
					{}
				}
			}
		}

		public static get clip():any
		{
			return mochi.MochiServices._container;
		}

		public static set comChannelName(val:string)
		{
			if(val != null)
			{
				if(val.length > 3)
				{
					mochi.MochiServices._sendChannelName = val + "_fromgame";
					mochi.MochiServices._rcvChannelName = val;
					mochi.MochiServices.initComChannels();
				}
			}
		}

		private static loadCommunicator(id:string,clip:any):egret.SwfMovie
		{
			var clipname:string = "_mochiservices_com_" + id;
			if(mochi.MochiServices._clip != null)
			{
				return mochi.MochiServices._clip;
			}
			if(<any>!mochi.MochiServices.isNetworkAvailable())
			{
				return null;
			}
			mochi.MochiServices.allowDomains(mochi.MochiServices._gatewayURL);
			mochi.MochiServices._clip = mochi.MochiServices.createEmptyMovieClip(clip,clipname,10336,false);
			mochi.MochiServices._loader = new flash.Loader();
			mochi.MochiServices._timer = new egret.Timer(1000,0);
			mochi.MochiServices._startTime = egret.getTimer();
			mochi.MochiServices._timer.addEventListener(egret.TimerEvent.TIMER,mochi.MochiServices.connectWait,null);
			mochi.MochiServices._timer.start();
			var f:Function = <any>function (ev:any)
			{
				mochi.MochiServices._clip["_mochiad_ctr_failed"] = true;
				console.log("MochiServices could not load.");
				mochi.MochiServices.disconnect();
				mochi.MochiServices.onError;
			};
			mochi.MochiServices._loader.contentLoaderInfo.addEventListener(egret.IOErrorEvent.IO_ERROR,f,null);
			var req:egret.URLRequest = new egret.URLRequest(mochi.MochiServices._gatewayURL);
			mochi.MochiServices._loader.load(req);
			mochi.MochiServices._clip.addChild(mochi.MochiServices._loader);
			mochi.MochiServices._clip["_mochiservices_com"] = mochi.MochiServices._loader;
			mochi.MochiServices._sendChannel = new flash.LocalConnection();
			mochi.MochiServices._clip["_queue"] = [];
			mochi.MochiServices._rcvChannel = new flash.LocalConnection();
			mochi.MochiServices._rcvChannel["allowDomain"]("*","localhost");
			mochi.MochiServices._rcvChannel["allowInsecureDomain"]("*","localhost");
			mochi.MochiServices._rcvChannel.client = mochi.MochiServices._clip;
			mochi.MochiServices._clip["_nextcallbackID"] = 0;
			mochi.MochiServices._clip["_callbacks"] = {};
			mochi.MochiServices.listen();
			return mochi.MochiServices._clip;
		}

		public static bringToTop(e:egret.Event)
		{
			if(mochi.MochiServices.clip != null)
			{
				if(mochi.MochiServices.childClip != null)
				{
					try 
					{
						if(mochi.MochiServices.clip["numChildren"] > 1)
						{
							mochi.MochiServices.clip["setChildIndex"](mochi.MochiServices.childClip,mochi.MochiServices.clip["numChildren"] - 1);
						}
					}
					catch(errorObject)
					{
						console.log("Warning: Depth sort error.");
						mochi.MochiServices._container["removeEventListener"](egret.Event.ENTER_FRAME,mochi.MochiServices.bringToTop);
					}
				}
			}
		}

		public static connect(id:string,clip:any,onError:any = null)
		{
			if(flash.As3is(clip,egret.DisplayObject))
			{
				if(<any>!mochi.MochiServices._connected && mochi.MochiServices._clip == null)
				{
					console.log("MochiServices Connecting...");
					mochi.MochiServices._connecting = true;
					mochi.MochiServices.init(id,clip);
				}
			}
			else
			{
				console.log("Error, MochiServices requires a Sprite, Movieclip or instance of the stage.");
			}
			if(onError != null)
			{
				mochi.MochiServices.onError = onError;
			}
			else if(mochi.MochiServices.onError == null)
			{
				mochi.MochiServices.onError = function (errorCode:string)
				{
					console.log(errorCode);
				};
			}
		}

		public static createEmptyMovieClip(parent:any,name:string,depth:number,doAdd:boolean = true):egret.SwfMovie
		{
			var mc:egret.SwfMovie = new egret.SwfMovie();
			if(doAdd)
			{
				if(false && depth)
				{
					parent["addChildAt"](mc,depth);
				}
				else
				{
					parent["addChild"](mc);
				}
			}
			try 
			{
				parent[name] = mc;
			}
			catch(e)
			{
				throw new flash.Error("MochiServices requires a clip that is an instance of a dynamic class.  If your class extends Sprite or MovieClip, you must make it dynamic.").message;
			}
			mc["_name"] = name;
			return mc;
		}

		public static connectWait(e:egret.TimerEvent)
		{
			if(egret.getTimer() - mochi.MochiServices._startTime > 10000)
			{
				if(<any>!mochi.MochiServices._connected)
				{
					mochi.MochiServices._clip["_mochiad_ctr_failed"] = true;
					console.log("MochiServices could not load.");
					mochi.MochiServices.disconnect();
					mochi.MochiServices.onError;
				}
				mochi.MochiServices._timer.stop();
			}
		}

	}
}

mochi.MochiServices._connected = false;
mochi.MochiServices._gatewayURL = "http://www.mochiads.com/static/lib/services/services.swf";
mochi.MochiServices._connecting = false;
mochi.MochiServices._listenChannelName = "__mochiservices";
