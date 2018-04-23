package mochi
{
   import flash.display.DisplayObjectContainer;
   import flash.display.Loader;
   import flash.display.MovieClip;
   import flash.events.Event;
   import flash.net.LocalConnection;
   import flash.net.URLRequest;
   import flash.net.URLRequestMethod;
   import flash.net.URLVariables;
   import flash.system.Security;
   import flash.utils.getTimer;
   import flash.utils.setTimeout;
   
   public class MochiAd
   {
       
      
      public function MochiAd()
      {
         super();
      }
      
      public static function getVersion() : String
      {
         return "2.7";
      }
      
      public static function showClickAwayAd(options:Object) : void
      {
         var clip:Object = null;
         var mc:MovieClip = null;
         var chk:MovieClip = null;
         var DEFAULTS:Object = {
            "ad_timeout":2000,
            "regpt":"o",
            "method":"showClickAwayAd",
            "res":"300x250",
            "no_bg":true,
            "ad_started":function():void
            {
            },
            "ad_finished":function():void
            {
            },
            "ad_loaded":function(width:Number, height:Number):void
            {
            },
            "ad_failed":function():void
            {
               trace("[MochiAd] Couldn\'t load an ad, make sure your game\'s local security sandbox is configured for Access Network Only and that you are not using ad blocking software");
            },
            "ad_skipped":function():void
            {
            }
         };
         var options:Object = MochiAd._parseOptions(options,DEFAULTS);
         clip = options.clip;
         var ad_timeout:Number = options.ad_timeout;
         delete options.ad_timeout;
         if(!MochiAd.load(options))
         {
            options.ad_failed();
            options.ad_finished();
            return;
         }
         options.ad_started();
         mc = clip._mochiad;
         mc["onUnload"] = function():void
         {
            MochiAd._cleanup(mc);
            options.ad_finished();
         };
         var wh:Array = MochiAd._getRes(options,clip);
         var w:Number = wh[0];
         var h:Number = wh[1];
         mc.x = w * 0.5;
         mc.y = h * 0.5;
         chk = createEmptyMovieClip(mc,"_mochiad_wait",3);
         chk.ad_timeout = ad_timeout;
         chk.started = getTimer();
         chk.showing = false;
         mc.unloadAd = function():void
         {
            MochiAd.unload(clip);
         };
         mc.adLoaded = options.ad_loaded;
         mc.adSkipped = options.ad_skipped;
         mc.rpc = function(callbackID:Number, arg:Object):void
         {
            MochiAd.rpc(clip,callbackID,arg);
         };
         var sendHostProgress:Boolean = false;
         mc.regContLC = function(lc_name:String):void
         {
            mc._containerLCName = lc_name;
         };
         chk["onEnterFrame"] = function():void
         {
            var total:Number = NaN;
            if(!this.parent)
            {
               delete this.onEnterFrame;
               return;
            }
            var ad_clip:Object = this.parent._mochiad_ctr;
            var elapsed:Number = getTimer() - this.started;
            var finished:Boolean = false;
            if(!chk.showing)
            {
               total = this.parent._mochiad_ctr.contentLoaderInfo.bytesTotal;
               if(total > 0)
               {
                  chk.showing = true;
                  finished = true;
                  chk.started = getTimer();
               }
               else if(elapsed > chk.ad_timeout)
               {
                  options.ad_failed();
                  finished = true;
               }
            }
            if(this.root == null)
            {
               finished = true;
            }
            if(finished)
            {
               delete this.onEnterFrame;
            }
         };
         doOnEnterFrame(chk);
      }
      
      public static function _isNetworkAvailable() : Boolean
      {
         return Security.sandboxType != "localWithFile";
      }
      
      public static function _allowDomains(server:String) : String
      {
         var hostname:String = server.split("/")[2].split(":")[0];
         Security.allowDomain("*");
         Security.allowDomain(hostname);
         Security.allowInsecureDomain("*");
         Security.allowInsecureDomain(hostname);
         return hostname;
      }
      
      public static function unload(clip:Object) : Boolean
      {
         if(clip.clip && clip.clip._mochiad)
         {
            clip = clip.clip;
         }
         if(clip.origFrameRate != undefined)
         {
            clip.stage.frameRate = clip.origFrameRate;
         }
         if(!clip._mochiad)
         {
            return false;
         }
         if(clip._mochiad._containerLCName != undefined)
         {
            clip._mochiad.lc.send(clip._mochiad._containerLCName,"notify",{"id":"unload"});
         }
         if(clip._mochiad.onUnload)
         {
            clip._mochiad.onUnload();
         }
         delete clip._mochiad_loaded;
         delete clip._mochiad;
         return true;
      }
      
      public static function showInterLevelAd(options:Object) : void
      {
         var clip:Object = null;
         var mc:MovieClip = null;
         var chk:MovieClip = null;
         var DEFAULTS:Object = {
            "ad_timeout":2000,
            "fadeout_time":250,
            "regpt":"o",
            "method":"showTimedAd",
            "ad_started":function():void
            {
               if(this.clip is MovieClip)
               {
                  this.clip.stop();
                  return;
               }
               throw new Error("MochiAd.showInterLevelAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.");
            },
            "ad_finished":function():void
            {
               if(this.clip is MovieClip)
               {
                  this.clip.play();
                  return;
               }
               throw new Error("MochiAd.showInterLevelAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.");
            },
            "ad_loaded":function(width:Number, height:Number):void
            {
            },
            "ad_failed":function():void
            {
               trace("[MochiAd] Couldn\'t load an ad, make sure your game\'s local security sandbox is configured for Access Network Only and that you are not using ad blocking software");
            },
            "ad_skipped":function():void
            {
            }
         };
         var options:Object = MochiAd._parseOptions(options,DEFAULTS);
         clip = options.clip;
         var ad_msec:Number = 11000;
         var ad_timeout:Number = options.ad_timeout;
         delete options.ad_timeout;
         var fadeout_time:Number = options.fadeout_time;
         delete options.fadeout_time;
         if(!MochiAd.load(options))
         {
            options.ad_failed();
            options.ad_finished();
            return;
         }
         options.ad_started();
         mc = clip._mochiad;
         mc["onUnload"] = function():void
         {
            MochiAd._cleanup(mc);
            options.ad_finished();
         };
         var wh:Array = MochiAd._getRes(options,clip);
         var w:Number = wh[0];
         var h:Number = wh[1];
         mc.x = w * 0.5;
         mc.y = h * 0.5;
         chk = createEmptyMovieClip(mc,"_mochiad_wait",3);
         chk.ad_msec = ad_msec;
         chk.ad_timeout = ad_timeout;
         chk.started = getTimer();
         chk.showing = false;
         chk.fadeout_time = fadeout_time;
         chk.fadeFunction = function():void
         {
            if(!this.parent)
            {
               delete this.onEnterFrame;
               delete this.fadeFunction;
               return;
            }
            var p:Number = 100 * (1 - (getTimer() - this.fadeout_start) / this.fadeout_time);
            if(p > 0)
            {
               this.parent.alpha = p * 0.01;
            }
            else
            {
               MochiAd.unload(clip);
               delete this["onEnterFrame"];
            }
         };
         mc.unloadAd = function():void
         {
            MochiAd.unload(clip);
         };
         mc.adLoaded = options.ad_loaded;
         mc.adSkipped = options.ad_skipped;
         mc.adjustProgress = function(msec:Number):void
         {
            var _chk:Object = mc._mochiad_wait;
            _chk.server_control = true;
            _chk.showing = true;
            _chk.started = getTimer();
            _chk.ad_msec = msec - 250;
         };
         mc.rpc = function(callbackID:Number, arg:Object):void
         {
            MochiAd.rpc(clip,callbackID,arg);
         };
         chk["onEnterFrame"] = function():void
         {
            var total:Number = NaN;
            if(!this.parent)
            {
               delete this.onEnterFrame;
               delete this.fadeFunction;
               return;
            }
            var ad_clip:Object = this.parent._mochiad_ctr;
            var elapsed:Number = getTimer() - this.started;
            var finished:Boolean = false;
            if(!chk.showing)
            {
               total = this.parent._mochiad_ctr.contentLoaderInfo.bytesTotal;
               if(total > 0)
               {
                  chk.showing = true;
                  chk.started = getTimer();
                  MochiAd.adShowing(clip);
               }
               else if(elapsed > chk.ad_timeout)
               {
                  options.ad_failed();
                  finished = true;
               }
            }
            if(elapsed > chk.ad_msec)
            {
               finished = true;
            }
            if(finished)
            {
               if(this.server_control)
               {
                  delete this.onEnterFrame;
               }
               else
               {
                  this.fadeout_start = getTimer();
                  this.onEnterFrame = this.fadeFunction;
               }
            }
         };
         doOnEnterFrame(chk);
      }
      
      public static function _parseOptions(options:Object, defaults:Object) : Object
      {
         var k:* = null;
         var pairs:Array = null;
         var i:Number = NaN;
         var kv:Array = null;
         var optcopy:Object = {};
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
         if(optcopy.clip == undefined)
         {
            throw new Error("MochiAd is missing the \'clip\' parameter.  This should be a MovieClip, Sprite or an instance of a class that extends MovieClip or Sprite.");
         }
         options = optcopy.clip.loaderInfo.parameters.mochiad_options;
         if(options)
         {
            pairs = options.split("&");
            for(i = 0; i < pairs.length; i++)
            {
               kv = pairs[i].split("=");
               optcopy[unescape(kv[0])] = unescape(kv[1]);
            }
         }
         if(optcopy.id == "test")
         {
            trace("[MochiAd] WARNING: Using the MochiAds test identifier, make sure to use the code from your dashboard, not this example!");
         }
         return optcopy;
      }
      
      public static function _cleanup(mc:Object) : void
      {
         var k:String = null;
         var lc:LocalConnection = null;
         var f:Function = null;
         if("lc" in mc)
         {
            lc = mc.lc;
            f = function():void
            {
               try
               {
                  lc.client = null;
                  lc.close();
               }
               catch(e:Error)
               {
               }
            };
            setTimeout(f,0);
         }
         var idx:Number = DisplayObjectContainer(mc).numChildren;
         while(idx > 0)
         {
            idx--;
            DisplayObjectContainer(mc).removeChildAt(idx);
         }
         for(k in mc)
         {
            delete mc[k];
         }
      }
      
      public static function load(options:Object) : MovieClip
      {
         var clip:Object = null;
         var k:String = null;
         var server:String = null;
         var hostname:String = null;
         var lc:LocalConnection = null;
         var name:String = null;
         var loader:Loader = null;
         var g:Function = null;
         var req:URLRequest = null;
         var v:Object = null;
         var DEFAULTS:Object = {
            "server":"http://x.mochiads.com/srv/1/",
            "method":"load",
            "depth":10333,
            "id":"_UNKNOWN_"
         };
         var options:Object = MochiAd._parseOptions(options,DEFAULTS);
         options.swfv = 9;
         options.mav = MochiAd.getVersion();
         clip = options.clip;
         if(!MochiAd._isNetworkAvailable())
         {
            return null;
         }
         try
         {
            if(clip._mochiad_loaded)
            {
               return null;
            }
         }
         catch(e:Error)
         {
            throw new Error("MochiAd requires a clip that is an instance of a dynamic class.  If your class extends Sprite or MovieClip, you must make it dynamic.");
         }
         var depth:Number = options.depth;
         delete options.depth;
         var mc:MovieClip = createEmptyMovieClip(clip,"_mochiad",depth);
         var wh:Array = MochiAd._getRes(options,clip);
         options.res = wh[0] + "x" + wh[1];
         options.server = options.server + options.id;
         delete options.id;
         clip._mochiad_loaded = true;
         if(clip.loaderInfo.loaderURL.indexOf("http") == 0)
         {
            options.as3_swf = clip.loaderInfo.loaderURL;
         }
         var lv:URLVariables = new URLVariables();
         for(k in options)
         {
            v = options[k];
            if(!(v is Function))
            {
               lv[k] = v;
            }
         }
         server = lv.server;
         delete lv.server;
         hostname = _allowDomains(server);
         lc = new LocalConnection();
         lc.client = mc;
         name = ["",Math.floor(new Date().getTime()),Math.floor(Math.random() * 999999)].join("_");
         lc.allowDomain("*","localhost");
         lc.allowInsecureDomain("*","localhost");
         lc.connect(name);
         mc.lc = lc;
         mc.lcName = name;
         lv.lc = name;
         lv.st = getTimer();
         loader = new Loader();
         g = function(ev:Object):void
         {
            ev.target.removeEventListener(ev.type,arguments.callee);
            MochiAd.unload(clip);
         };
         loader.contentLoaderInfo.addEventListener(Event.UNLOAD,g);
         req = new URLRequest(server + ".swf?cacheBust=" + new Date().getTime());
         req.contentType = "application/x-www-form-urlencoded";
         req.method = URLRequestMethod.POST;
         req.data = lv;
         loader.load(req);
         mc.addChild(loader);
         mc._mochiad_ctr = loader;
         return mc;
      }
      
      public static function runMethod(base:Object, methodName:String, argsArray:Array) : Object
      {
         var nameArray:Array = methodName.split(".");
         for(var i:Number = 0; i < nameArray.length - 1; i++)
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
      
      public static function createEmptyMovieClip(parent:Object, name:String, depth:Number) : MovieClip
      {
         var mc:MovieClip = new MovieClip();
         if(false && depth)
         {
            parent.addChildAt(mc,depth);
         }
         else
         {
            parent.addChild(mc);
         }
         parent[name] = mc;
         mc["_name"] = name;
         return mc;
      }
      
      public static function _getRes(options:Object, clip:Object) : Array
      {
         var xy:Array = null;
         var b:Object = clip.getBounds(clip.root);
         var w:Number = 0;
         var h:Number = 0;
         if(typeof options.res != "undefined")
         {
            xy = options.res.split("x");
            w = parseFloat(xy[0]);
            h = parseFloat(xy[1]);
         }
         else
         {
            w = b.xMax - b.xMin;
            h = b.yMax - b.yMin;
         }
         if(w == 0 || h == 0)
         {
            w = clip.stage.stageWidth;
            h = clip.stage.stageHeight;
         }
         return [w,h];
      }
      
      public static function adShowing(mc:Object) : void
      {
         mc.origFrameRate = mc.stage.frameRate;
         mc.stage.frameRate = 30;
      }
      
      public static function getValue(base:Object, objectName:String) : Object
      {
         var nameArray:Array = objectName.split(".");
         for(var i:Number = 0; i < nameArray.length - 1; i++)
         {
            if(base[nameArray[i]] == undefined || base[nameArray[i]] == null)
            {
               return undefined;
            }
            base = base[nameArray[i]];
         }
         return base[nameArray[i]];
      }
      
      public static function rpc(clip:Object, callbackID:Number, arg:Object) : void
      {
         var val:Object = null;
         var ret:Object = null;
         switch(arg.id)
         {
            case "setValue":
               MochiAd.setValue(clip,arg.objectName,arg.value);
               break;
            case "getValue":
               val = MochiAd.getValue(clip,arg.objectName);
               clip._mochiad.lc.send(clip._mochiad._containerLCName,"rpcResult",callbackID,val);
               break;
            case "runMethod":
               ret = MochiAd.runMethod(clip,arg.method,arg.args);
               clip._mochiad.lc.send(clip._mochiad._containerLCName,"rpcResult",callbackID,ret);
               break;
            default:
               trace("[mochiads rpc] unknown rpc id: " + arg.id);
         }
      }
      
      public static function setValue(base:Object, objectName:String, value:Object) : void
      {
         var nameArray:Array = objectName.split(".");
         for(var i:Number = 0; i < nameArray.length - 1; i++)
         {
            if(base[nameArray[i]] == undefined || base[nameArray[i]] == null)
            {
               return;
            }
            base = base[nameArray[i]];
         }
         base[nameArray[i]] = value;
      }
      
      public static function showPreGameAd(options:Object) : void
      {
         var clip:Object = null;
         var mc:MovieClip = null;
         var chk:MovieClip = null;
         var complete:Boolean = false;
         var unloaded:Boolean = false;
         var sendHostProgress:Boolean = false;
         var fn:Function = null;
         var r:MovieClip = null;
         var DEFAULTS:Object = {
            "ad_timeout":3000,
            "fadeout_time":250,
            "regpt":"o",
            "method":"showPreloaderAd",
            "color":16747008,
            "background":16777161,
            "outline":13994812,
            "no_progress_bar":false,
            "ad_started":function():void
            {
               if(this.clip is MovieClip)
               {
                  this.clip.stop();
                  return;
               }
               throw new Error("MochiAd.showPreGameAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.");
            },
            "ad_finished":function():void
            {
               if(this.clip is MovieClip)
               {
                  this.clip.play();
                  return;
               }
               throw new Error("MochiAd.showPreGameAd requires a clip that is a MovieClip or is an instance of a class that extends MovieClip.  If your clip is a Sprite, then you must provide custom ad_started and ad_finished handlers.");
            },
            "ad_loaded":function(width:Number, height:Number):void
            {
            },
            "ad_failed":function():void
            {
               trace("[MochiAd] Couldn\'t load an ad, make sure your game\'s local security sandbox is configured for Access Network Only and that you are not using ad blocking software");
            },
            "ad_skipped":function():void
            {
            },
            "ad_progress":function(percent:Number):void
            {
            }
         };
         var options:Object = MochiAd._parseOptions(options,DEFAULTS);
         if("c862232051e0a94e1c3609b3916ddb17".substr(0) == "dfeada81ac97cde83665f81c12da7def")
         {
            options.ad_started();
            fn = function():void
            {
               options.ad_finished();
            };
            setTimeout(fn,100);
            return;
         }
         clip = options.clip;
         var ad_msec:Number = 11000;
         var ad_timeout:Number = options.ad_timeout;
         delete options.ad_timeout;
         var fadeout_time:Number = options.fadeout_time;
         delete options.fadeout_time;
         if(!MochiAd.load(options))
         {
            options.ad_failed();
            options.ad_finished();
            return;
         }
         options.ad_started();
         mc = clip._mochiad;
         mc["onUnload"] = function():void
         {
            MochiAd._cleanup(mc);
            var fn:Function = function():void
            {
               options.ad_finished();
            };
            setTimeout(fn,100);
         };
         var wh:Array = MochiAd._getRes(options,clip);
         var w:Number = wh[0];
         var h:Number = wh[1];
         mc.x = w * 0.5;
         mc.y = h * 0.5;
         chk = createEmptyMovieClip(mc,"_mochiad_wait",3);
         chk.x = w * -0.5;
         chk.y = h * -0.5;
         var bar:MovieClip = createEmptyMovieClip(chk,"_mochiad_bar",4);
         if(options.no_progress_bar)
         {
            bar.visible = false;
            delete options.no_progress_bar;
         }
         else
         {
            bar.x = 10;
            bar.y = h - 20;
         }
         var bar_color:Number = options.color;
         delete options.color;
         var bar_background:Number = options.background;
         delete options.background;
         var bar_outline:Number = options.outline;
         delete options.outline;
         var backing_mc:MovieClip = createEmptyMovieClip(bar,"_outline",1);
         var backing:Object = backing_mc.graphics;
         backing.beginFill(bar_background);
         backing.moveTo(0,0);
         backing.lineTo(w - 20,0);
         backing.lineTo(w - 20,10);
         backing.lineTo(0,10);
         backing.lineTo(0,0);
         backing.endFill();
         var inside_mc:MovieClip = createEmptyMovieClip(bar,"_inside",2);
         var inside:Object = inside_mc.graphics;
         inside.beginFill(bar_color);
         inside.moveTo(0,0);
         inside.lineTo(w - 20,0);
         inside.lineTo(w - 20,10);
         inside.lineTo(0,10);
         inside.lineTo(0,0);
         inside.endFill();
         inside_mc.scaleX = 0;
         var outline_mc:MovieClip = createEmptyMovieClip(bar,"_outline",3);
         var outline:Object = outline_mc.graphics;
         outline.lineStyle(0,bar_outline,100);
         outline.moveTo(0,0);
         outline.lineTo(w - 20,0);
         outline.lineTo(w - 20,10);
         outline.lineTo(0,10);
         outline.lineTo(0,0);
         chk.ad_msec = ad_msec;
         chk.ad_timeout = ad_timeout;
         chk.started = getTimer();
         chk.showing = false;
         chk.last_pcnt = 0;
         chk.fadeout_time = fadeout_time;
         chk.fadeFunction = function():void
         {
            var p:Number = 100 * (1 - (getTimer() - this.fadeout_start) / this.fadeout_time);
            if(p > 0)
            {
               this.parent.alpha = p * 0.01;
            }
            else
            {
               MochiAd.unload(clip);
               delete this["onEnterFrame"];
            }
         };
         complete = false;
         unloaded = false;
         var f:Function = function(ev:Event):void
         {
            ev.target.removeEventListener(ev.type,arguments.callee);
            complete = true;
            if(unloaded)
            {
               MochiAd.unload(clip);
            }
         };
         clip.loaderInfo.addEventListener(Event.COMPLETE,f);
         if(clip.root is MovieClip)
         {
            r = clip.root as MovieClip;
            if(r.framesLoaded >= r.totalFrames)
            {
               complete = true;
            }
         }
         mc.unloadAd = function():void
         {
            unloaded = true;
            if(complete)
            {
               MochiAd.unload(clip);
            }
         };
         mc.adLoaded = options.ad_loaded;
         mc.adSkipped = options.ad_skipped;
         mc.adjustProgress = function(msec:Number):void
         {
            var _chk:Object = mc._mochiad_wait;
            _chk.server_control = true;
            _chk.showing = true;
            _chk.started = getTimer();
            _chk.ad_msec = msec;
         };
         mc.rpc = function(callbackID:Number, arg:Object):void
         {
            MochiAd.rpc(clip,callbackID,arg);
         };
         mc.rpcTestFn = function(s:String):Object
         {
            trace("[MOCHIAD rpcTestFn] " + s);
            return s;
         };
         mc.regContLC = function(lc_name:String):void
         {
            mc._containerLCName = lc_name;
         };
         sendHostProgress = false;
         mc.sendHostLoadProgress = function(lc_name:String):void
         {
            sendHostProgress = true;
         };
         chk["onEnterFrame"] = function():void
         {
            var total:Number = NaN;
            if(!this.parent || !this.parent.parent)
            {
               delete this["onEnterFrame"];
               return;
            }
            var _clip:Object = this.parent.parent.root;
            var ad_clip:Object = this.parent._mochiad_ctr;
            var elapsed:Number = getTimer() - this.started;
            var finished:Boolean = false;
            var clip_total:Number = _clip.loaderInfo.bytesTotal;
            var clip_loaded:Number = _clip.loaderInfo.bytesLoaded;
            if(complete)
            {
               clip_loaded = Math.max(1,clip_loaded);
               clip_total = clip_loaded;
            }
            var clip_pcnt:Number = 100 * clip_loaded / clip_total;
            var ad_pcnt:Number = 100 * elapsed / chk.ad_msec;
            var _inside:Object = this._mochiad_bar._inside;
            var pcnt:Number = Math.min(100,Math.min(Number(clip_pcnt) || Number(0),ad_pcnt));
            pcnt = Math.max(this.last_pcnt,pcnt);
            this.last_pcnt = pcnt;
            _inside.scaleX = pcnt * 0.01;
            options.ad_progress(pcnt);
            if(sendHostProgress)
            {
               clip._mochiad.lc.send(clip._mochiad._containerLCName,"notify",{
                  "id":"hostLoadPcnt",
                  "pcnt":clip_pcnt
               });
               if(clip_pcnt == 100)
               {
                  sendHostProgress = false;
               }
            }
            if(!chk.showing)
            {
               total = this.parent._mochiad_ctr.contentLoaderInfo.bytesTotal;
               if(total > 0)
               {
                  chk.showing = true;
                  chk.started = getTimer();
                  MochiAd.adShowing(clip);
               }
               else if(elapsed > chk.ad_timeout && clip_pcnt == 100)
               {
                  options.ad_failed();
                  finished = true;
               }
            }
            if(elapsed > chk.ad_msec)
            {
               finished = true;
            }
            if(complete && finished)
            {
               if(this.server_control)
               {
                  delete this.onEnterFrame;
               }
               else
               {
                  this.fadeout_start = getTimer();
                  this.onEnterFrame = chk.fadeFunction;
               }
            }
         };
         doOnEnterFrame(chk);
      }
      
      public static function showPreloaderAd(options:Object) : void
      {
         trace("[MochiAd] DEPRECATED: showPreloaderAd was renamed to showPreGameAd in 2.0");
         MochiAd.showPreGameAd(options);
      }
      
      public static function showTimedAd(options:Object) : void
      {
         trace("[MochiAd] DEPRECATED: showTimedAd was renamed to showInterLevelAd in 2.0");
         MochiAd.showInterLevelAd(options);
      }
      
      public static function doOnEnterFrame(mc:MovieClip) : void
      {
         var f:Function = function(ev:Object):void
         {
            if("onEnterFrame" in mc && mc.onEnterFrame)
            {
               mc.onEnterFrame();
            }
            else
            {
               ev.target.removeEventListener(ev.type,arguments.callee);
            }
         };
         mc.addEventListener(Event.ENTER_FRAME,f);
      }
   }
}
