package gs
{
   import flash.events.Event;
   import flash.events.EventDispatcher;
   import flash.events.IEventDispatcher;
   import flash.utils.Dictionary;
   import gs.events.TweenEvent;
   
   public class TweenMax extends TweenFilterLite implements IEventDispatcher
   {
      
      public static var removeTween:Function = TweenLite.removeTween;
      
      private static var _overwriteMode:int = !!OverwriteManager.enabled?int(OverwriteManager.mode):int(OverwriteManager.init());
      
      protected static var _pausedTweens:Dictionary = new Dictionary(false);
      
      public static var setGlobalTimeScale:Function = TweenFilterLite.setGlobalTimeScale;
      
      public static var killTweensOf:Function = TweenLite.killTweensOf;
      
      public static var version:Number = 3.5;
      
      protected static const _RAD2DEG:Number = 180 / Math.PI;
      
      public static var killDelayedCallsTo:Function = TweenLite.killTweensOf;
       
      
      protected var _dispatcher:EventDispatcher;
      
      public var pauseTime:Number;
      
      protected var _callbacks:Object;
      
      protected var _repeatCount:Number;
      
      public function TweenMax($target:Object, $duration:Number, $vars:Object)
      {
         super($target,$duration,$vars);
         if(this.vars.onCompleteListener != null || this.vars.onUpdateListener != null || this.vars.onStartListener != null)
         {
            this.initDispatcher();
            if($duration == 0 && this.delay == 0)
            {
               this.onUpdateDispatcher();
               this.onCompleteDispatcher();
            }
         }
         this._repeatCount = 0;
         if(!isNaN(this.vars.yoyo) || !isNaN(this.vars.loop))
         {
            this.vars.persist = true;
         }
         if(TweenFilterLite.version < 9.29)
         {
            trace("TweenMax error! Please update your TweenFilterLite class or try deleting your ASO files. TweenMax requires a more recent version. Download updates at http://www.TweenMax.com.");
         }
      }
      
      public static function sequence($target:Object, $tweens:Array) : Array
      {
         for(var i:uint = 0; i < $tweens.length; i++)
         {
            $tweens[i].target = $target;
         }
         return multiSequence($tweens);
      }
      
      public static function bezierProxy($o:Object, $time:Number = 0) : void
      {
         var i:int = 0;
         var p:* = null;
         var b:Object = null;
         var t:Number = NaN;
         var segments:uint = 0;
         var factor:Number = $o.target.t;
         var props:Object = $o.info.props;
         var tg:Object = $o.info.target;
         if(factor == 1)
         {
            for(p in props)
            {
               i = props[p].length - 1;
               tg[p] = props[p][i].e;
            }
         }
         else
         {
            for(p in props)
            {
               segments = props[p].length;
               if(factor < 0)
               {
                  i = 0;
               }
               else if(factor >= 1)
               {
                  i = segments - 1;
               }
               else
               {
                  i = int(segments * factor);
               }
               t = (factor - i * (1 / segments)) * segments;
               b = props[p][i];
               tg[p] = b.s + t * (2 * (1 - t) * (b.cp - b.s) + t * (b.e - b.s));
            }
         }
      }
      
      public static function hexColorsProxy($o:Object, $time:Number = 0) : void
      {
         $o.info.target[$o.info.prop] = uint($o.target.r << 16 | $o.target.g << 8 | $o.target.b);
      }
      
      public static function parseBeziers($props:Object, $through:Boolean = false) : Object
      {
         var i:int = 0;
         var a:Array = null;
         var b:Object = null;
         var p:* = null;
         var all:Object = {};
         if($through)
         {
            for(p in $props)
            {
               a = $props[p];
               all[p] = b = [];
               if(a.length > 2)
               {
                  b[b.length] = {
                     "s":a[0],
                     "cp":a[1] - (a[2] - a[0]) / 4,
                     "e":a[1]
                  };
                  for(i = 1; i < a.length - 1; i++)
                  {
                     b[b.length] = {
                        "s":a[i],
                        "cp":a[i] + (a[i] - b[i - 1].cp),
                        "e":a[i + 1]
                     };
                  }
               }
               else
               {
                  b[b.length] = {
                     "s":a[0],
                     "cp":(a[0] + a[1]) / 2,
                     "e":a[1]
                  };
               }
            }
         }
         else
         {
            for(p in $props)
            {
               a = $props[p];
               all[p] = b = [];
               if(a.length > 3)
               {
                  b[b.length] = {
                     "s":a[0],
                     "cp":a[1],
                     "e":(a[1] + a[2]) / 2
                  };
                  for(i = 2; i < a.length - 2; i++)
                  {
                     b[b.length] = {
                        "s":b[i - 2].e,
                        "cp":a[i],
                        "e":(a[i] + a[i + 1]) / 2
                     };
                  }
                  b[b.length] = {
                     "s":b[b.length - 1].e,
                     "cp":a[a.length - 2],
                     "e":a[a.length - 1]
                  };
               }
               else if(a.length == 3)
               {
                  b[b.length] = {
                     "s":a[0],
                     "cp":a[1],
                     "e":a[2]
                  };
               }
               else if(a.length == 2)
               {
                  b[b.length] = {
                     "s":a[0],
                     "cp":(a[0] + a[1]) / 2,
                     "e":a[1]
                  };
               }
            }
         }
         return all;
      }
      
      public static function bezierProxy2($o:Object, $time:Number = 0) : void
      {
         var a:Number = NaN;
         var dx:Number = NaN;
         var dy:Number = NaN;
         var cotb:Array = null;
         var toAdd:Number = NaN;
         bezierProxy($o,$time);
         var future:Object = {};
         var tg:Object = $o.info.target;
         $o.info.target = future;
         $o.target.t = $o.target.t + 0.01;
         bezierProxy($o);
         var otb:Array = $o.info.orientToBezier;
         for(var i:uint = 0; i < otb.length; i++)
         {
            cotb = otb[i];
            toAdd = Number(cotb[3]) || Number(0);
            dx = future[cotb[0]] - tg[cotb[0]];
            dy = future[cotb[1]] - tg[cotb[1]];
            tg[cotb[2]] = Math.atan2(dy,dx) * _RAD2DEG + toAdd;
         }
         $o.info.target = tg;
         $o.target.t = $o.target.t - 0.01;
      }
      
      public static function pauseAll($tweens:Boolean = true, $delayedCalls:Boolean = false) : void
      {
         changePause(true,$tweens,$delayedCalls);
      }
      
      public static function set globalTimeScale($n:Number) : void
      {
         setGlobalTimeScale($n);
      }
      
      public static function get globalTimeScale() : Number
      {
         return _globalTimeScale;
      }
      
      public static function killAllDelayedCalls($complete:Boolean = false) : void
      {
         killAll($complete,false,true);
      }
      
      public static function multiSequence($tweens:Array) : Array
      {
         var tw:Object = null;
         var tgt:Object = null;
         var dl:Number = NaN;
         var t:Number = NaN;
         var i:uint = 0;
         var o:Object = null;
         var p:* = null;
         trace("WARNING: TweenMax.multiSequence() and TweenMax.sequence() have been deprecated in favor of the much more powerful and flexible TweenGroup class. See http://blog.greensock.com/tweengroup/ for more details. Future versions of TweenMax may not include sequence() and multiSequence() (to conserve file size).");
         var dict:Dictionary = new Dictionary();
         var a:Array = [];
         var overwriteMode:int = TweenLite.overwriteManager.mode;
         var totalDelay:Number = 0;
         for(i = 0; i < $tweens.length; i++)
         {
            tw = $tweens[i];
            t = Number(tw.time) || Number(0);
            o = {};
            for(p in tw)
            {
               o[p] = tw[p];
            }
            delete o.time;
            dl = Number(o.delay) || Number(0);
            o.delay = totalDelay + dl;
            tgt = o.target;
            delete o.target;
            if(overwriteMode == 1)
            {
               if(dict[tgt] == undefined)
               {
                  dict[tgt] = o;
               }
               else
               {
                  o.overwrite = 2;
               }
            }
            a[a.length] = new TweenMax(tgt,t,o);
            totalDelay = totalDelay + (t + dl);
         }
         return a;
      }
      
      public static function getTweensOf($target:Object) : Array
      {
         var i:int = 0;
         var a:Array = masterList[$target];
         var toReturn:Array = [];
         if(a != null)
         {
            for(i = a.length - 1; i > -1; i--)
            {
               if(!a[i].gc)
               {
                  toReturn[toReturn.length] = a[i];
               }
            }
         }
         return toReturn;
      }
      
      public static function delayedCall($delay:Number, $onComplete:Function, $onCompleteParams:Array = null, $persist:Boolean = false) : TweenMax
      {
         return new TweenMax($onComplete,0,{
            "delay":$delay,
            "onComplete":$onComplete,
            "onCompleteParams":$onCompleteParams,
            "persist":$persist,
            "overwrite":0
         });
      }
      
      public static function isTweening($target:Object) : Boolean
      {
         var a:Array = getTweensOf($target);
         for(var i:int = a.length - 1; i > -1; i--)
         {
            if(a[i].active && !a[i].gc)
            {
               return true;
            }
         }
         return false;
      }
      
      public static function killAll($complete:Boolean = false, $tweens:Boolean = true, $delayedCalls:Boolean = true) : void
      {
         var isDC:* = false;
         var a:Array = getAllTweens();
         for(var i:int = a.length - 1; i > -1; i--)
         {
            isDC = a[i].target == a[i].vars.onComplete;
            if(isDC == $delayedCalls || isDC != $tweens)
            {
               if($complete)
               {
                  a[i].complete(false);
                  a[i].clear();
               }
               else
               {
                  TweenLite.removeTween(a[i],true);
               }
            }
         }
      }
      
      public static function changePause($pause:Boolean, $tweens:Boolean = true, $delayedCalls:Boolean = false) : void
      {
         var isDC:* = false;
         var a:Array = getAllTweens();
         for(var i:int = a.length - 1; i > -1; i--)
         {
            isDC = a[i].target == a[i].vars.onComplete;
            if(a[i] is TweenMax && (isDC == $delayedCalls || isDC != $tweens))
            {
               a[i].paused = $pause;
            }
         }
      }
      
      public static function callbackProxy($functions:Array, $params:Array = null) : void
      {
         for(var i:uint = 0; i < $functions.length; i++)
         {
            if($functions[i] != undefined)
            {
               $functions[i].apply(null,$params[i]);
            }
         }
      }
      
      public static function allFrom($targets:Array, $duration:Number, $vars:Object) : Array
      {
         $vars.runBackwards = true;
         return allTo($targets,$duration,$vars);
      }
      
      public static function killAllTweens($complete:Boolean = false) : void
      {
         killAll($complete,true,false);
      }
      
      public static function getAllTweens() : Array
      {
         var a:Array = null;
         var i:int = 0;
         var tween:TweenLite = null;
         var ml:Dictionary = masterList;
         var toReturn:Array = [];
         for each(a in ml)
         {
            for(i = a.length - 1; i > -1; i--)
            {
               if(!a[i].gc)
               {
                  toReturn[toReturn.length] = a[i];
               }
            }
         }
         for each(tween in _pausedTweens)
         {
            toReturn[toReturn.length] = tween;
         }
         return toReturn;
      }
      
      public static function resumeAll($tweens:Boolean = true, $delayedCalls:Boolean = false) : void
      {
         changePause(false,$tweens,$delayedCalls);
      }
      
      public static function from($target:Object, $duration:Number, $vars:Object) : TweenMax
      {
         $vars.runBackwards = true;
         return new TweenMax($target,$duration,$vars);
      }
      
      public static function to($target:Object, $duration:Number, $vars:Object) : TweenMax
      {
         return new TweenMax($target,$duration,$vars);
      }
      
      public static function allTo($targets:Array, $duration:Number, $vars:Object) : Array
      {
         var i:int = 0;
         var v:Object = null;
         var p:* = null;
         var dl:Number = NaN;
         var lastVars:Object = null;
         trace("WARNING: TweenMax.allTo() and TweenMax.allFrom() have been deprecated in favor of the much more powerful and flexible TweenGroup class. See http://blog.greensock.com/tweengroup/ for more details. Future versions of TweenMax may not include allTo() and allFrom() (to conserve file size).");
         if($targets.length == 0)
         {
            return [];
         }
         var a:Array = [];
         var dli:Number = Number($vars.delayIncrement) || Number(0);
         delete $vars.delayIncrement;
         if($vars.onCompleteAll == undefined)
         {
            lastVars = $vars;
         }
         else
         {
            lastVars = {};
            for(p in $vars)
            {
               lastVars[p] = $vars[p];
            }
            lastVars.onCompleteParams = [[$vars.onComplete,$vars.onCompleteAll],[$vars.onCompleteParams,$vars.onCompleteAllParams]];
            lastVars.onComplete = TweenMax.callbackProxy;
            delete $vars.onCompleteAll;
         }
         delete $vars.onCompleteAllParams;
         if(dli == 0)
         {
            for(i = 0; i < $targets.length - 1; i++)
            {
               v = {};
               for(p in $vars)
               {
                  v[p] = $vars[p];
               }
               a[a.length] = new TweenMax($targets[i],$duration,v);
            }
         }
         else
         {
            dl = Number($vars.delay) || Number(0);
            for(i = 0; i < $targets.length - 1; i++)
            {
               v = {};
               for(p in $vars)
               {
                  v[p] = $vars[p];
               }
               v.delay = dl + i * dli;
               a[a.length] = new TweenMax($targets[i],$duration,v);
            }
            lastVars.delay = dl + ($targets.length - 1) * dli;
         }
         a[a.length] = new TweenMax($targets[$targets.length - 1],$duration,lastVars);
         if($vars.onCompleteAllListener is Function)
         {
            a[a.length - 1].addEventListener(TweenEvent.COMPLETE,$vars.onCompleteAllListener);
         }
         return a;
      }
      
      public function dispatchEvent($e:Event) : Boolean
      {
         if(this._dispatcher == null)
         {
            return false;
         }
         return this._dispatcher.dispatchEvent($e);
      }
      
      public function get reversed() : Boolean
      {
         return this.ease == this.reverseEase;
      }
      
      public function set reversed($b:Boolean) : void
      {
         if(this.reversed != $b)
         {
            this.reverse();
         }
      }
      
      protected function onStartDispatcher(... $args) : void
      {
         if(this._callbacks.onStart != null)
         {
            this._callbacks.onStart.apply(null,this.vars.onStartParams);
         }
         this._dispatcher.dispatchEvent(new TweenEvent(TweenEvent.START));
      }
      
      public function setDestination($property:String, $value:*, $adjustStartValues:Boolean = true) : void
      {
         var v:Object = null;
         var i:int = 0;
         var varsOld:Object = null;
         var tweensOld:Array = null;
         var subTweensOld:Array = null;
         var p:Number = this.progress;
         if(this.vars[$property] != undefined && this.initted)
         {
            if(!$adjustStartValues && p != 0)
            {
               for(i = this.tweens.length - 1; i > -1; i--)
               {
                  if(this.tweens[i][4] == $property)
                  {
                     this.tweens[i][0][this.tweens[i][1]] = this.tweens[i][2];
                  }
               }
            }
            v = {};
            v[$property] = 1;
            killVars(v);
         }
         this.vars[$property] = $value;
         if(this.initted)
         {
            varsOld = this.vars;
            tweensOld = this.tweens;
            subTweensOld = _subTweens;
            this.vars = {};
            this.tweens = [];
            _subTweens = [];
            this.vars[$property] = $value;
            this.initTweenVals();
            if(this.ease != this.reverseEase && varsOld.ease is Function)
            {
               this.ease = varsOld.ease;
            }
            if($adjustStartValues && p != 0)
            {
               this.adjustStartValues();
            }
            this.vars = varsOld;
            this.tweens = tweensOld.concat(this.tweens);
            _subTweens = subTweensOld.concat(_subTweens);
         }
      }
      
      override public function initTweenVals($hrp:Boolean = false, $reservedProps:String = "") : void
      {
         var p:* = null;
         var i:int = 0;
         var curProp:Object = null;
         var props:Object = null;
         var b:Array = null;
         var dif:Number = NaN;
         $reservedProps = $reservedProps + " hexColors bezier bezierThrough shortRotation orientToBezier quaternions onCompleteAll onCompleteAllParams yoyo loop onCompleteListener onUpdateListener onStartListener ";
         if(!$hrp && TweenLite.overwriteManager.enabled)
         {
            TweenLite.overwriteManager.manageOverwrites(this,masterList[this.target]);
         }
         var bProxy:Function = bezierProxy;
         if(this.vars.orientToBezier == true)
         {
            this.vars.orientToBezier = [["x","y","rotation",0]];
            bProxy = bezierProxy2;
         }
         else if(this.vars.orientToBezier is Array)
         {
            bProxy = bezierProxy2;
         }
         if(this.vars.bezier != undefined && this.vars.bezier is Array)
         {
            props = {};
            b = this.vars.bezier;
            for(i = 0; i < b.length; i++)
            {
               for(p in b[i])
               {
                  if(props[p] == undefined)
                  {
                     props[p] = [this.target[p]];
                  }
                  if(typeof b[i][p] == "number")
                  {
                     props[p].push(b[i][p]);
                  }
                  else
                  {
                     props[p].push(this.target[p] + Number(b[i][p]));
                  }
               }
            }
            for(p in props)
            {
               if(typeof this.vars[p] == "number")
               {
                  props[p].push(this.vars[p]);
               }
               else
               {
                  props[p].push(this.target[p] + Number(this.vars[p]));
               }
               delete this.vars[p];
            }
            addSubTween("bezier",bProxy,{"t":0},{"t":1},{
               "props":parseBeziers(props,false),
               "target":this.target,
               "orientToBezier":this.vars.orientToBezier
            });
         }
         if(this.vars.bezierThrough != undefined && this.vars.bezierThrough is Array)
         {
            props = {};
            b = this.vars.bezierThrough;
            for(i = 0; i < b.length; i++)
            {
               for(p in b[i])
               {
                  if(props[p] == undefined)
                  {
                     props[p] = [this.target[p]];
                  }
                  if(typeof b[i][p] == "number")
                  {
                     props[p].push(b[i][p]);
                  }
                  else
                  {
                     props[p].push(this.target[p] + Number(b[i][p]));
                  }
               }
            }
            for(p in props)
            {
               if(typeof this.vars[p] == "number")
               {
                  props[p].push(this.vars[p]);
               }
               else
               {
                  props[p].push(this.target[p] + Number(this.vars[p]));
               }
               delete this.vars[p];
            }
            addSubTween("bezierThrough",bProxy,{"t":0},{"t":1},{
               "props":parseBeziers(props,true),
               "target":this.target,
               "orientToBezier":this.vars.orientToBezier
            });
         }
         if(!isNaN(this.vars.shortRotation))
         {
            dif = (this.vars.shortRotation - this.target.rotation) % 360;
            if(dif != dif % 180)
            {
               dif = dif < 0?Number(dif + 360):Number(dif - 360);
            }
            this.tweens[this.tweens.length] = [this.target,"rotation",this.target.rotation,dif,"rotation"];
         }
         if(this.vars.hexColors != undefined && typeof this.vars.hexColors == "object")
         {
            for(p in this.vars.hexColors)
            {
               addSubTween("hexColors",hexColorsProxy,{
                  "r":this.target[p] >> 16,
                  "g":this.target[p] >> 8 & 255,
                  "b":this.target[p] & 255
               },{
                  "r":this.vars.hexColors[p] >> 16,
                  "g":this.vars.hexColors[p] >> 8 & 255,
                  "b":this.vars.hexColors[p] & 255
               },{
                  "prop":p,
                  "target":this.target
               });
            }
         }
         super.initTweenVals(true,$reservedProps);
      }
      
      public function restart($includeDelay:Boolean = false) : void
      {
         if($includeDelay)
         {
            this.initTime = currentTime;
            this.startTime = currentTime + this.delay * (1000 / this.combinedTimeScale);
         }
         else
         {
            this.startTime = currentTime;
            this.initTime = currentTime - this.delay * (1000 / this.combinedTimeScale);
         }
         this._repeatCount = 0;
         if(this.target != this.vars.onComplete)
         {
            render(this.startTime);
         }
         this.pauseTime = NaN;
         this.enabled = true;
      }
      
      public function removeEventListener($type:String, $listener:Function, $useCapture:Boolean = false) : void
      {
         if(this._dispatcher != null)
         {
            this._dispatcher.removeEventListener($type,$listener,$useCapture);
         }
      }
      
      public function addEventListener($type:String, $listener:Function, $useCapture:Boolean = false, $priority:int = 0, $useWeakReference:Boolean = false) : void
      {
         if(this._dispatcher == null)
         {
            this.initDispatcher();
         }
         if($type == TweenEvent.UPDATE && this.vars.onUpdate != this.onUpdateDispatcher)
         {
            this.vars.onUpdate = this.onUpdateDispatcher;
            _hasUpdate = true;
         }
         this._dispatcher.addEventListener($type,$listener,$useCapture,$priority,$useWeakReference);
      }
      
      protected function adjustStartValues() : void
      {
         var factor:Number = NaN;
         var endValue:Number = NaN;
         var tp:Object = null;
         var i:int = 0;
         var p:Number = this.progress;
         if(p != 0)
         {
            factor = 1 / (1 - this.ease(p * this.duration,0,1,this.duration));
            for(i = this.tweens.length - 1; i > -1; i--)
            {
               tp = this.tweens[i];
               endValue = tp[2] + tp[3];
               tp[3] = (endValue - tp[0][tp[1]]) * factor;
               tp[2] = endValue - tp[3];
            }
         }
      }
      
      protected function onUpdateDispatcher(... $args) : void
      {
         if(this._callbacks.onUpdate != null)
         {
            this._callbacks.onUpdate.apply(null,this.vars.onUpdateParams);
         }
         this._dispatcher.dispatchEvent(new TweenEvent(TweenEvent.UPDATE));
      }
      
      protected function initDispatcher() : void
      {
         var v:Object = null;
         var p:* = null;
         if(this._dispatcher == null)
         {
            this._dispatcher = new EventDispatcher(this);
            this._callbacks = {
               "onStart":this.vars.onStart,
               "onUpdate":this.vars.onUpdate,
               "onComplete":this.vars.onComplete
            };
            v = {};
            for(p in this.vars)
            {
               v[p] = this.vars[p];
            }
            this.vars = v;
            this.vars.onStart = this.onStartDispatcher;
            this.vars.onComplete = this.onCompleteDispatcher;
            if(this.vars.onStartListener is Function)
            {
               this._dispatcher.addEventListener(TweenEvent.START,this.vars.onStartListener,false,0,true);
            }
            if(this.vars.onUpdateListener is Function)
            {
               this._dispatcher.addEventListener(TweenEvent.UPDATE,this.vars.onUpdateListener,false,0,true);
               this.vars.onUpdate = this.onUpdateDispatcher;
               _hasUpdate = true;
            }
            if(this.vars.onCompleteListener is Function)
            {
               this._dispatcher.addEventListener(TweenEvent.COMPLETE,this.vars.onCompleteListener,false,0,true);
            }
         }
      }
      
      public function willTrigger($type:String) : Boolean
      {
         if(this._dispatcher == null)
         {
            return false;
         }
         return this._dispatcher.willTrigger($type);
      }
      
      public function set progress($n:Number) : void
      {
         this.startTime = currentTime - this.duration * $n * 1000;
         this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
         if(!this.started)
         {
            activate();
         }
         render(currentTime);
         if(!isNaN(this.pauseTime))
         {
            this.pauseTime = currentTime;
            this.startTime = 999999999999999;
            this.active = false;
         }
      }
      
      public function reverse($adjustDuration:Boolean = true, $forcePlay:Boolean = true) : void
      {
         this.ease = this.vars.ease == this.ease?this.reverseEase:this.vars.ease;
         var p:Number = this.progress;
         if($adjustDuration && p > 0)
         {
            this.startTime = currentTime - (1 - p) * this.duration * 1000 / this.combinedTimeScale;
            this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
         }
         if($forcePlay != false)
         {
            if(p < 1)
            {
               this.resume();
            }
            else
            {
               this.restart();
            }
         }
      }
      
      public function set paused($b:Boolean) : void
      {
         if($b)
         {
            this.pause();
         }
         else
         {
            this.resume();
         }
      }
      
      public function resume() : void
      {
         this.enabled = true;
         if(!isNaN(this.pauseTime))
         {
            this.initTime = this.initTime + (currentTime - this.pauseTime);
            this.startTime = this.initTime + this.delay * (1000 / this.combinedTimeScale);
            this.pauseTime = NaN;
            if(!this.started && currentTime >= this.startTime)
            {
               activate();
            }
            else
            {
               this.active = this.started;
            }
            _pausedTweens[this] = null;
            delete _pausedTweens[this];
         }
      }
      
      public function get paused() : Boolean
      {
         return this.startTime == 999999999999999;
      }
      
      public function reverseEase($t:Number, $b:Number, $c:Number, $d:Number) : Number
      {
         return this.vars.ease($d - $t,$b,$c,$d);
      }
      
      public function killProperties($names:Array) : void
      {
         var i:int = 0;
         var v:Object = {};
         for(i = $names.length - 1; i > -1; i--)
         {
            if(this.vars[$names[i]] != null)
            {
               v[$names[i]] = 1;
            }
         }
         killVars(v);
      }
      
      public function hasEventListener($type:String) : Boolean
      {
         if(this._dispatcher == null)
         {
            return false;
         }
         return this._dispatcher.hasEventListener($type);
      }
      
      public function pause() : void
      {
         if(isNaN(this.pauseTime))
         {
            this.pauseTime = currentTime;
            this.startTime = 999999999999999;
            this.enabled = false;
            _pausedTweens[this] = this;
         }
      }
      
      override public function complete($skipRender:Boolean = false) : void
      {
         if(!isNaN(this.vars.yoyo) && (this._repeatCount < this.vars.yoyo || this.vars.yoyo == 0) || !isNaN(this.vars.loop) && (this._repeatCount < this.vars.loop || this.vars.loop == 0))
         {
            this._repeatCount++;
            if(!isNaN(this.vars.yoyo))
            {
               this.ease = this.vars.ease == this.ease?this.reverseEase:this.vars.ease;
            }
            this.startTime = !!$skipRender?Number(this.startTime + this.duration * (1000 / this.combinedTimeScale)):Number(currentTime);
            this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
         }
         else if(this.vars.persist == true)
         {
            this.pause();
         }
         super.complete($skipRender);
      }
      
      public function invalidate($adjustStartValues:Boolean = true) : void
      {
         var p:Number = NaN;
         if(this.initted)
         {
            p = this.progress;
            if(!$adjustStartValues && p != 0)
            {
               this.progress = 0;
            }
            this.tweens = [];
            _subTweens = [];
            _specialVars = this.vars.isTV == true?this.vars.exposedProps:this.vars;
            this.initTweenVals();
            _timeScale = Number(this.vars.timeScale) || Number(1);
            this.combinedTimeScale = _timeScale * _globalTimeScale;
            this.delay = Number(this.vars.delay) || Number(0);
            if(isNaN(this.pauseTime))
            {
               this.startTime = this.initTime + this.delay * 1000 / this.combinedTimeScale;
            }
            if(this.vars.onCompleteListener != null || this.vars.onUpdateListener != null || this.vars.onStartListener != null)
            {
               if(this._dispatcher != null)
               {
                  this.vars.onStart = this._callbacks.onStart;
                  this.vars.onUpdate = this._callbacks.onUpdate;
                  this.vars.onComplete = this._callbacks.onComplete;
                  this._dispatcher = null;
               }
               this.initDispatcher();
            }
            if(p != 0)
            {
               if($adjustStartValues)
               {
                  this.adjustStartValues();
               }
               else
               {
                  this.progress = p;
               }
            }
         }
      }
      
      public function get progress() : Number
      {
         var t:Number = !isNaN(this.pauseTime)?Number(this.pauseTime):Number(currentTime);
         var p:Number = ((t - this.initTime) * 0.001 - this.delay / this.combinedTimeScale) / this.duration * this.combinedTimeScale;
         if(p > 1)
         {
            return 1;
         }
         if(p < 0)
         {
            return 0;
         }
         return p;
      }
      
      protected function onCompleteDispatcher(... $args) : void
      {
         if(this._callbacks.onComplete != null)
         {
            this._callbacks.onComplete.apply(null,this.vars.onCompleteParams);
         }
         this._dispatcher.dispatchEvent(new TweenEvent(TweenEvent.COMPLETE));
      }
   }
}
