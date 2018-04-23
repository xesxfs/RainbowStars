package gs
{
   import flash.display.DisplayObject;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.TimerEvent;
   import flash.geom.ColorTransform;
   import flash.utils.Dictionary;
   import flash.utils.Timer;
   import flash.utils.getTimer;
   
   public class TweenLite
   {
      
      private static var _timer:Timer = new Timer(2000);
      
      private static var _classInitted:Boolean;
      
      public static var defaultEase:Function = TweenLite.easeOut;
      
      public static var version:Number = 9.29;
      
      public static var masterList:Dictionary = new Dictionary(false);
      
      public static var currentTime:uint;
      
      public static var overwriteManager:Object;
      
      public static var killDelayedCallsTo:Function = TweenLite.killTweensOf;
      
      public static var timingSprite:Sprite = new Sprite();
       
      
      public var started:Boolean;
      
      public var delay:Number;
      
      protected var _hasUpdate:Boolean;
      
      protected var _subTweens:Array;
      
      public var initted:Boolean;
      
      public var active:Boolean;
      
      public var startTime:Number;
      
      public var target:Object;
      
      public var duration:Number;
      
      protected var _hst:Boolean;
      
      public var gc:Boolean;
      
      protected var _isDisplayObject:Boolean;
      
      public var tweens:Array;
      
      public var vars:Object;
      
      public var ease:Function;
      
      protected var _specialVars:Object;
      
      public var initTime:Number;
      
      public var combinedTimeScale:Number;
      
      public function TweenLite($target:Object, $duration:Number, $vars:Object)
      {
         super();
         if($target == null)
         {
            return;
         }
         if(!_classInitted)
         {
            currentTime = getTimer();
            timingSprite.addEventListener(Event.ENTER_FRAME,updateAll,false,0,true);
            if(overwriteManager == null)
            {
               overwriteManager = {
                  "mode":1,
                  "enabled":false
               };
            }
            _timer.addEventListener("timer",killGarbage,false,0,true);
            _timer.start();
            _classInitted = true;
         }
         this.vars = $vars;
         this.duration = Number($duration) || Number(0.001);
         this.delay = Number($vars.delay) || Number(0);
         this.combinedTimeScale = Number($vars.timeScale) || Number(1);
         this.active = Boolean($duration == 0 && this.delay == 0);
         this.target = $target;
         this._isDisplayObject = Boolean($target is DisplayObject);
         if(!(this.vars.ease is Function))
         {
            this.vars.ease = defaultEase;
         }
         if(this.vars.easeParams != null)
         {
            this.vars.proxiedEase = this.vars.ease;
            this.vars.ease = this.easeProxy;
         }
         this.ease = this.vars.ease;
         if(!isNaN(Number(this.vars.autoAlpha)))
         {
            this.vars.alpha = Number(this.vars.autoAlpha);
            this.vars.visible = Boolean(this.vars.alpha > 0);
         }
         this._specialVars = this.vars.isTV == true?this.vars.exposedProps:this.vars;
         this.tweens = [];
         this._subTweens = [];
         this._hst = this.initted = false;
         this.initTime = currentTime;
         this.startTime = this.initTime + this.delay * 1000;
         var mode:int = $vars.overwrite == undefined || !overwriteManager.enabled && $vars.overwrite > 1?int(overwriteManager.mode):int(int($vars.overwrite));
         if(masterList[$target] == undefined || $target != null && mode == 1)
         {
            masterList[$target] = [];
         }
         masterList[$target].push(this);
         if(this.vars.runBackwards == true && this.vars.renderOnStart != true || this.active)
         {
            this.initTweenVals();
            if(this.active)
            {
               this.render(this.startTime + 1);
            }
            else
            {
               this.render(this.startTime);
            }
            if(this._specialVars.visible != null && this.vars.runBackwards == true && this._isDisplayObject)
            {
               this.target.visible = this._specialVars.visible;
            }
         }
      }
      
      public static function frameProxy($o:Object, $time:Number = 0) : void
      {
         $o.info.target.gotoAndStop(Math.round($o.target.frame));
      }
      
      public static function removeTween($t:TweenLite, $clear:Boolean = true) : void
      {
         if($t != null)
         {
            if($clear)
            {
               $t.clear();
            }
            $t.enabled = false;
         }
      }
      
      public static function visibleProxy($o:Object, $time:Number) : void
      {
         var t:TweenLite = $o.info.tween;
         if(t.duration == $time)
         {
            if(t.vars.runBackwards != true && t.ease == t.vars.ease)
            {
               t.target.visible = t.vars.visible;
            }
         }
         else if(t.target.visible != true)
         {
            t.target.visible = true;
         }
      }
      
      public static function killTweensOf($target:Object = null, $complete:Boolean = false) : void
      {
         var a:Array = null;
         var i:int = 0;
         var tween:TweenLite = null;
         if($target != null && masterList[$target] != undefined)
         {
            a = masterList[$target];
            for(i = a.length - 1; i > -1; i--)
            {
               tween = a[i];
               if($complete && !tween.gc)
               {
                  tween.complete(false);
               }
               tween.clear();
            }
            delete masterList[$target];
         }
      }
      
      public static function updateAll($e:Event = null) : void
      {
         var a:Array = null;
         var i:int = 0;
         var tween:TweenLite = null;
         var t:uint = currentTime = getTimer();
         var ml:Dictionary = masterList;
         for each(a in ml)
         {
            for(i = a.length - 1; i > -1; i--)
            {
               tween = a[i];
               if(tween != null)
               {
                  if(tween.active)
                  {
                     tween.render(t);
                  }
                  else if(tween.gc)
                  {
                     a.splice(i,1);
                  }
                  else if(t >= tween.startTime)
                  {
                     tween.activate();
                     tween.render(t);
                  }
               }
            }
         }
      }
      
      public static function delayedCall($delay:Number, $onComplete:Function, $onCompleteParams:Array = null) : TweenLite
      {
         return new TweenLite($onComplete,0,{
            "delay":$delay,
            "onComplete":$onComplete,
            "onCompleteParams":$onCompleteParams,
            "overwrite":0
         });
      }
      
      public static function from($target:Object, $duration:Number, $vars:Object) : TweenLite
      {
         $vars.runBackwards = true;
         return new TweenLite($target,$duration,$vars);
      }
      
      public static function easeOut($t:Number, $b:Number, $c:Number, $d:Number) : Number
      {
         return -$c * ($t = $t / $d) * ($t - 2) + $b;
      }
      
      public static function tintProxy($o:Object, $time:Number = 0) : void
      {
         var n:Number = $o.target.progress;
         var r:Number = 1 - n;
         var sc:Object = $o.info.color;
         var ec:Object = $o.info.endColor;
         $o.info.target.transform.colorTransform = new ColorTransform(sc.redMultiplier * r + ec.redMultiplier * n,sc.greenMultiplier * r + ec.greenMultiplier * n,sc.blueMultiplier * r + ec.blueMultiplier * n,sc.alphaMultiplier * r + ec.alphaMultiplier * n,sc.redOffset * r + ec.redOffset * n,sc.greenOffset * r + ec.greenOffset * n,sc.blueOffset * r + ec.blueOffset * n,sc.alphaOffset * r + ec.alphaOffset * n);
      }
      
      public static function volumeProxy($o:Object, $time:Number = 0) : void
      {
         $o.info.target.soundTransform = $o.target;
      }
      
      protected static function killGarbage($e:TimerEvent) : void
      {
         var tgt:* = null;
         var a:Array = null;
         var ml:Dictionary = masterList;
         for(tgt in ml)
         {
            if(ml[tgt].length == 0)
            {
               delete ml[tgt];
            }
         }
      }
      
      public static function to($target:Object, $duration:Number, $vars:Object) : TweenLite
      {
         return new TweenLite($target,$duration,$vars);
      }
      
      public function get enabled() : Boolean
      {
         return !!this.gc?false:true;
      }
      
      public function render($t:uint) : void
      {
         var factor:Number = NaN;
         var tp:Object = null;
         var i:int = 0;
         var time:Number = ($t - this.startTime) * 0.001;
         if(time >= this.duration)
         {
            time = this.duration;
            factor = this.ease == this.vars.ease || this.duration == 0.001?Number(1):Number(0);
         }
         else
         {
            factor = this.ease(time,0,1,this.duration);
         }
         for(i = this.tweens.length - 1; i > -1; i--)
         {
            tp = this.tweens[i];
            tp[0][tp[1]] = tp[2] + factor * tp[3];
         }
         if(this._hst)
         {
            for(i = this._subTweens.length - 1; i > -1; i--)
            {
               this._subTweens[i].proxy(this._subTweens[i],time);
            }
         }
         if(this._hasUpdate)
         {
            this.vars.onUpdate.apply(null,this.vars.onUpdateParams);
         }
         if(time == this.duration)
         {
            this.complete(true);
         }
      }
      
      public function set enabled($b:Boolean) : void
      {
         var a:Array = null;
         var found:Boolean = false;
         var i:int = 0;
         if($b)
         {
            if(masterList[this.target] == undefined)
            {
               masterList[this.target] = [this];
            }
            else
            {
               a = masterList[this.target];
               for(i = a.length - 1; i > -1; i--)
               {
                  if(a[i] == this)
                  {
                     found = true;
                     break;
                  }
               }
               if(!found)
               {
                  masterList[this.target].push(this);
               }
            }
         }
         this.gc = !!$b?false:true;
         if(this.gc)
         {
            this.active = false;
         }
         else
         {
            this.active = this.started;
         }
      }
      
      public function activate() : void
      {
         this.started = this.active = true;
         if(!this.initted)
         {
            this.initTweenVals();
         }
         if(this.vars.onStart != null)
         {
            this.vars.onStart.apply(null,this.vars.onStartParams);
         }
         if(this.duration == 0.001)
         {
            this.startTime = this.startTime - 1;
         }
      }
      
      public function clear() : void
      {
         this.tweens = [];
         this._subTweens = [];
         this.vars = {};
         this._hst = this._hasUpdate = false;
      }
      
      protected function addSubTween($name:String, $proxy:Function, $target:Object, $props:Object, $info:Object = null) : void
      {
         var p:* = null;
         this._subTweens[this._subTweens.length] = {
            "name":$name,
            "proxy":$proxy,
            "target":$target,
            "info":$info
         };
         for(p in $props)
         {
            if(typeof $props[p] == "number")
            {
               this.tweens[this.tweens.length] = [$target,p,$target[p],$props[p] - $target[p],$name];
            }
            else
            {
               this.tweens[this.tweens.length] = [$target,p,$target[p],Number($props[p]),$name];
            }
         }
         this._hst = true;
      }
      
      public function initTweenVals($hrp:Boolean = false, $reservedProps:String = "") : void
      {
         var p:* = null;
         var i:int = 0;
         var endArray:Array = null;
         var clr:ColorTransform = null;
         var endClr:ColorTransform = null;
         var tp:Object = null;
         if(!$hrp && overwriteManager.enabled)
         {
            overwriteManager.manageOverwrites(this,masterList[this.target]);
         }
         if(this.target is Array)
         {
            endArray = this.vars.endArray || [];
            for(i = 0; i < endArray.length; i++)
            {
               if(this.target[i] != endArray[i] && this.target[i] != undefined)
               {
                  this.tweens[this.tweens.length] = [this.target,i.toString(),this.target[i],endArray[i] - this.target[i],i.toString()];
               }
            }
         }
         else
         {
            if((typeof this._specialVars.tint != "undefined" || this.vars.removeTint == true) && this._isDisplayObject)
            {
               clr = this.target.transform.colorTransform;
               endClr = new ColorTransform();
               if(this._specialVars.alpha != undefined)
               {
                  endClr.alphaMultiplier = this._specialVars.alpha;
                  delete this._specialVars.alpha;
               }
               else
               {
                  endClr.alphaMultiplier = this.target.alpha;
               }
               if(this.vars.removeTint != true && (this._specialVars.tint != null && this._specialVars.tint != "" || this._specialVars.tint == 0))
               {
                  endClr.color = this._specialVars.tint;
               }
               this.addSubTween("tint",tintProxy,{"progress":0},{"progress":1},{
                  "target":this.target,
                  "color":clr,
                  "endColor":endClr
               });
            }
            if(this._specialVars.frame != null && this._isDisplayObject)
            {
               this.addSubTween("frame",frameProxy,{"frame":this.target.currentFrame},{"frame":this._specialVars.frame},{"target":this.target});
            }
            if(!isNaN(this.vars.volume) && this.target.hasOwnProperty("soundTransform"))
            {
               this.addSubTween("volume",volumeProxy,this.target.soundTransform,{"volume":this.vars.volume},{"target":this.target});
            }
            if(this._specialVars.visible != null && this._isDisplayObject)
            {
               this.addSubTween("visible",visibleProxy,{},{},{"tween":this});
            }
            for(p in this._specialVars)
            {
               if(!(p == "ease" || p == "delay" || p == "overwrite" || p == "onComplete" || p == "onCompleteParams" || p == "runBackwards" || p == "visible" || p == "autoOverwrite" || p == "persist" || p == "onUpdate" || p == "onUpdateParams" || p == "autoAlpha" || p == "timeScale" && !(this.target is TweenLite) || p == "onStart" || p == "onStartParams" || p == "renderOnStart" || p == "proxiedEase" || p == "easeParams" || $hrp && $reservedProps.indexOf(" " + p + " ") != -1))
               {
                  if(!(this._isDisplayObject && (p == "tint" || p == "removeTint" || p == "frame")) && !(p == "volume" && this.target.hasOwnProperty("soundTransform")))
                  {
                     if(typeof this._specialVars[p] == "number")
                     {
                        this.tweens[this.tweens.length] = [this.target,p,this.target[p],this._specialVars[p] - this.target[p],p];
                     }
                     else
                     {
                        this.tweens[this.tweens.length] = [this.target,p,this.target[p],Number(this._specialVars[p]),p];
                     }
                  }
               }
            }
         }
         if(this.vars.runBackwards == true)
         {
            for(i = this.tweens.length - 1; i > -1; i--)
            {
               tp = this.tweens[i];
               tp[2] = tp[2] + tp[3];
               tp[3] = tp[3] * -1;
            }
         }
         if(this.vars.onUpdate != null)
         {
            this._hasUpdate = true;
         }
         this.initted = true;
      }
      
      protected function easeProxy($t:Number, $b:Number, $c:Number, $d:Number) : Number
      {
         return this.vars.proxiedEase.apply(null,arguments.concat(this.vars.easeParams));
      }
      
      public function killVars($vars:Object) : void
      {
         if(overwriteManager.enabled)
         {
            overwriteManager.killVars($vars,this.vars,this.tweens,this._subTweens,[]);
         }
      }
      
      public function complete($skipRender:Boolean = false) : void
      {
         if(!$skipRender)
         {
            if(!this.initted)
            {
               this.initTweenVals();
            }
            this.startTime = currentTime - this.duration * 1000 / this.combinedTimeScale;
            this.render(currentTime);
            return;
         }
         if(this.vars.persist != true)
         {
            this.enabled = false;
         }
         if(this.vars.onComplete != null)
         {
            this.vars.onComplete.apply(null,this.vars.onCompleteParams);
         }
      }
   }
}
