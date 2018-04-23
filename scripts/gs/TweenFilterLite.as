package gs
{
   import flash.filters.BevelFilter;
   import flash.filters.BitmapFilter;
   import flash.filters.BlurFilter;
   import flash.filters.ColorMatrixFilter;
   import flash.filters.DropShadowFilter;
   import flash.filters.GlowFilter;
   import flash.utils.Dictionary;
   
   public class TweenFilterLite extends TweenLite
   {
      
      public static var removeTween:Function = TweenLite.removeTween;
      
      private static var _idMatrix:Array = [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];
      
      private static var _lumB:Number = 0.072169;
      
      public static var delayedCall:Function = TweenLite.delayedCall;
      
      public static var killTweensOf:Function = TweenLite.killTweensOf;
      
      public static var version:Number = 9.29;
      
      private static var _lumG:Number = 0.71516;
      
      public static var killDelayedCallsTo:Function = TweenLite.killTweensOf;
      
      private static var _lumR:Number = 0.212671;
      
      protected static var _globalTimeScale:Number = 1;
       
      
      protected var _matrix:Array;
      
      protected var _hf:Boolean = false;
      
      protected var _roundProps:Boolean;
      
      protected var _cmf:ColorMatrixFilter;
      
      protected var _filters:Array;
      
      protected var _endMatrix:Array;
      
      protected var _timeScale:Number;
      
      protected var _clrsa:Array;
      
      public function TweenFilterLite($target:Object, $duration:Number, $vars:Object)
      {
         this._filters = [];
         super($target,$duration,$vars);
         if(this.combinedTimeScale != 1 && this.target is TweenFilterLite)
         {
            this._timeScale = 1;
            this.combinedTimeScale = _globalTimeScale;
         }
         else
         {
            this._timeScale = this.combinedTimeScale;
            this.combinedTimeScale = this.combinedTimeScale * _globalTimeScale;
         }
         if(this.combinedTimeScale != 1 && this.delay != 0)
         {
            this.startTime = this.initTime + this.delay * (1000 / this.combinedTimeScale);
         }
         if(TweenLite.version < 9.29)
         {
            trace("TweenFilterLite error! Please update your TweenLite class or try deleting your ASO files. TweenFilterLite requires a more recent version. Download updates at http://www.TweenLite.com.");
         }
      }
      
      public static function setHue($m:Array, $n:Number) : Array
      {
         if(isNaN($n))
         {
            return $m;
         }
         $n = $n * (Math.PI / 180);
         var c:Number = Math.cos($n);
         var s:Number = Math.sin($n);
         var temp:Array = [_lumR + c * (1 - _lumR) + s * -_lumR,_lumG + c * -_lumG + s * -_lumG,_lumB + c * -_lumB + s * (1 - _lumB),0,0,_lumR + c * -_lumR + s * 0.143,_lumG + c * (1 - _lumG) + s * 0.14,_lumB + c * -_lumB + s * -0.283,0,0,_lumR + c * -_lumR + s * -(1 - _lumR),_lumG + c * -_lumG + s * _lumG,_lumB + c * (1 - _lumB) + s * _lumB,0,0,0,0,0,1,0,0,0,0,0,1];
         return applyMatrix(temp,$m);
      }
      
      public static function setContrast($m:Array, $n:Number) : Array
      {
         if(isNaN($n))
         {
            return $m;
         }
         $n = $n + 0.01;
         var temp:Array = [$n,0,0,0,128 * (1 - $n),0,$n,0,0,128 * (1 - $n),0,0,$n,0,128 * (1 - $n),0,0,0,1,0];
         return applyMatrix(temp,$m);
      }
      
      public static function applyMatrix($m:Array, $m2:Array) : Array
      {
         var y:int = 0;
         var x:int = 0;
         if(!($m is Array) || !($m2 is Array))
         {
            return $m2;
         }
         var temp:Array = [];
         var i:int = 0;
         var z:int = 0;
         for(y = 0; y < 4; y++)
         {
            for(x = 0; x < 5; x++)
            {
               if(x == 4)
               {
                  z = $m[i + 4];
               }
               else
               {
                  z = 0;
               }
               temp[i + x] = $m[i] * $m2[x] + $m[i + 1] * $m2[x + 5] + $m[i + 2] * $m2[x + 10] + $m[i + 3] * $m2[x + 15] + z;
            }
            i = i + 5;
         }
         return temp;
      }
      
      public static function colorize($m:Array, $color:Number, $amount:Number = 1) : Array
      {
         if(isNaN($color))
         {
            return $m;
         }
         if(isNaN($amount))
         {
            $amount = 1;
         }
         var r:Number = ($color >> 16 & 255) / 255;
         var g:Number = ($color >> 8 & 255) / 255;
         var b:Number = ($color & 255) / 255;
         var inv:Number = 1 - $amount;
         var temp:Array = [inv + $amount * r * _lumR,$amount * r * _lumG,$amount * r * _lumB,0,0,$amount * g * _lumR,inv + $amount * g * _lumG,$amount * g * _lumB,0,0,$amount * b * _lumR,$amount * b * _lumG,inv + $amount * b * _lumB,0,0,0,0,0,1,0];
         return applyMatrix(temp,$m);
      }
      
      public static function setBrightness($m:Array, $n:Number) : Array
      {
         if(isNaN($n))
         {
            return $m;
         }
         $n = $n * 100 - 100;
         return applyMatrix([1,0,0,0,$n,0,1,0,0,$n,0,0,1,0,$n,0,0,0,1,0,0,0,0,0,1],$m);
      }
      
      public static function setSaturation($m:Array, $n:Number) : Array
      {
         if(isNaN($n))
         {
            return $m;
         }
         var inv:Number = 1 - $n;
         var r:Number = inv * _lumR;
         var g:Number = inv * _lumG;
         var b:Number = inv * _lumB;
         var temp:Array = [r + $n,g,b,0,0,r,g + $n,b,0,0,r,g,b + $n,0,0,0,0,0,1,0];
         return applyMatrix(temp,$m);
      }
      
      public static function setGlobalTimeScale($scale:Number) : void
      {
         var i:int = 0;
         var a:Array = null;
         if($scale < 0.00001)
         {
            $scale = 0.00001;
         }
         var ml:Dictionary = masterList;
         _globalTimeScale = $scale;
         for each(a in ml)
         {
            for(i = a.length - 1; i > -1; i--)
            {
               if(a[i] is TweenFilterLite)
               {
                  a[i].timeScale = a[i].timeScale * 1;
               }
            }
         }
      }
      
      public static function get globalTimeScale() : Number
      {
         return _globalTimeScale;
      }
      
      public static function from($target:Object, $duration:Number, $vars:Object) : TweenFilterLite
      {
         $vars.runBackwards = true;
         return new TweenFilterLite($target,$duration,$vars);
      }
      
      public static function set globalTimeScale($n:Number) : void
      {
         setGlobalTimeScale($n);
      }
      
      public static function HEXtoRGB($n:Number) : Object
      {
         return {
            "rb":$n >> 16,
            "gb":$n >> 8 & 255,
            "bb":$n & 255
         };
      }
      
      public static function setThreshold($m:Array, $n:Number) : Array
      {
         if(isNaN($n))
         {
            return $m;
         }
         var temp:Array = [_lumR * 256,_lumG * 256,_lumB * 256,0,-256 * $n,_lumR * 256,_lumG * 256,_lumB * 256,0,-256 * $n,_lumR * 256,_lumG * 256,_lumB * 256,0,-256 * $n,0,0,0,1,0];
         return applyMatrix(temp,$m);
      }
      
      public static function to($target:Object, $duration:Number, $vars:Object) : TweenFilterLite
      {
         return new TweenFilterLite($target,$duration,$vars);
      }
      
      override public function killVars($vars:Object) : void
      {
         if(TweenLite.overwriteManager.enabled)
         {
            TweenLite.overwriteManager.killVars($vars,this.vars,this.tweens,_subTweens,this._filters || []);
         }
      }
      
      override public function initTweenVals($hrp:Boolean = false, $reservedProps:String = "") : void
      {
         var i:int = 0;
         var fv:Object = null;
         var cmf:Object = null;
         var tp:Object = null;
         var j:int = 0;
         var prop:String = null;
         if(!$hrp && TweenLite.overwriteManager.enabled)
         {
            TweenLite.overwriteManager.manageOverwrites(this,masterList[this.target]);
         }
         this._clrsa = [];
         this._filters = [];
         this._matrix = _idMatrix.slice();
         $reservedProps = $reservedProps + " blurFilter glowFilter colorMatrixFilter dropShadowFilter bevelFilter roundProps ";
         this._roundProps = Boolean(this.vars.roundProps is Array);
         if(_isDisplayObject)
         {
            if(this.vars.blurFilter != null)
            {
               fv = this.vars.blurFilter;
               this.addFilter("blurFilter",fv,BlurFilter,["blurX","blurY","quality"],new BlurFilter(0,0,int(fv.quality) || 2));
            }
            if(this.vars.glowFilter != null)
            {
               fv = this.vars.glowFilter;
               this.addFilter("glowFilter",fv,GlowFilter,["alpha","blurX","blurY","color","quality","strength","inner","knockout"],new GlowFilter(16777215,0,0,0,Number(fv.strength) || Number(1),int(fv.quality) || 2,fv.inner,fv.knockout));
            }
            if(this.vars.colorMatrixFilter != null)
            {
               fv = this.vars.colorMatrixFilter;
               cmf = this.addFilter("colorMatrixFilter",fv,ColorMatrixFilter,[],new ColorMatrixFilter(this._matrix));
               this._cmf = cmf.filter;
               this._matrix = ColorMatrixFilter(this._cmf).matrix;
               if(fv.matrix != null && fv.matrix is Array)
               {
                  this._endMatrix = fv.matrix;
               }
               else
               {
                  if(fv.relative == true)
                  {
                     this._endMatrix = this._matrix.slice();
                  }
                  else
                  {
                     this._endMatrix = _idMatrix.slice();
                  }
                  this._endMatrix = setBrightness(this._endMatrix,fv.brightness);
                  this._endMatrix = setContrast(this._endMatrix,fv.contrast);
                  this._endMatrix = setHue(this._endMatrix,fv.hue);
                  this._endMatrix = setSaturation(this._endMatrix,fv.saturation);
                  this._endMatrix = setThreshold(this._endMatrix,fv.threshold);
                  if(!isNaN(fv.colorize))
                  {
                     this._endMatrix = colorize(this._endMatrix,fv.colorize,fv.amount);
                  }
                  else if(!isNaN(fv.color))
                  {
                     this._endMatrix = colorize(this._endMatrix,fv.color,fv.amount);
                  }
               }
               for(i = 0; i < this._endMatrix.length; i++)
               {
                  if(this._matrix[i] != this._endMatrix[i] && this._matrix[i] != undefined)
                  {
                     this.tweens[this.tweens.length] = [this._matrix,i.toString(),this._matrix[i],this._endMatrix[i] - this._matrix[i],"colorMatrixFilter"];
                  }
               }
            }
            if(this.vars.dropShadowFilter != null)
            {
               fv = this.vars.dropShadowFilter;
               this.addFilter("dropShadowFilter",fv,DropShadowFilter,["alpha","angle","blurX","blurY","color","distance","quality","strength","inner","knockout","hideObject"],new DropShadowFilter(0,45,0,0,0,0,1,int(fv.quality) || 2,fv.inner,fv.knockout,fv.hideObject));
            }
            if(this.vars.bevelFilter != null)
            {
               fv = this.vars.bevelFilter;
               this.addFilter("bevelFilter",fv,BevelFilter,["angle","blurX","blurY","distance","highlightAlpha","highlightColor","quality","shadowAlpha","shadowColor","strength"],new BevelFilter(0,0,16777215,0.5,0,0.5,2,2,0,int(fv.quality) || 2));
            }
            if(this.vars.runBackwards == true)
            {
               for(i = this._clrsa.length - 1; i > -1; i--)
               {
                  tp = this._clrsa[i];
                  tp.sr = tp.sr + tp.cr;
                  tp.cr = tp.cr * -1;
                  tp.sg = tp.sg + tp.cg;
                  tp.cg = tp.cg * -1;
                  tp.sb = tp.sb + tp.cb;
                  tp.cb = tp.cb * -1;
                  tp.f[tp.p] = tp.sr << 16 | tp.sg << 8 | tp.sb;
               }
            }
            super.initTweenVals(true,$reservedProps);
         }
         else
         {
            super.initTweenVals($hrp,$reservedProps);
         }
         if(this._roundProps)
         {
            for(i = this.vars.roundProps.length - 1; i > -1; i--)
            {
               prop = this.vars.roundProps[i];
               for(j = this.tweens.length - 1; j > -1; j--)
               {
                  if(this.tweens[j][1] == prop && this.tweens[j][0] == this.target)
                  {
                     this.tweens[j][5] = true;
                     break;
                  }
               }
            }
         }
      }
      
      override public function set enabled($b:Boolean) : void
      {
         super.enabled = $b;
         if($b)
         {
            this.combinedTimeScale = this._timeScale * _globalTimeScale;
         }
      }
      
      public function set timeScale($n:Number) : void
      {
         if($n < 0.00001)
         {
            $n = this._timeScale = 0.00001;
         }
         else
         {
            this._timeScale = $n;
            $n = $n * _globalTimeScale;
         }
         this.initTime = currentTime - (currentTime - this.initTime - this.delay * (1000 / this.combinedTimeScale)) * this.combinedTimeScale * (1 / $n) - this.delay * (1000 / $n);
         if(this.startTime != 999999999999999)
         {
            this.startTime = this.initTime + this.delay * (1000 / $n);
         }
         this.combinedTimeScale = $n;
      }
      
      public function get timeScale() : Number
      {
         return this._timeScale;
      }
      
      override public function render($t:uint) : void
      {
         var factor:Number = NaN;
         var tp:Object = null;
         var i:int = 0;
         var val:Number = NaN;
         var neg:int = 0;
         var f:Array = null;
         var j:int = 0;
         var time:Number = ($t - this.startTime) * 0.001 * this.combinedTimeScale;
         if(time >= this.duration)
         {
            time = this.duration;
            factor = this.ease == this.vars.ease || this.duration == 0.001?Number(1):Number(0);
         }
         else
         {
            factor = this.ease(time,0,1,this.duration);
         }
         if(!this._roundProps)
         {
            for(i = this.tweens.length - 1; i > -1; i--)
            {
               tp = this.tweens[i];
               tp[0][tp[1]] = tp[2] + factor * tp[3];
            }
         }
         else
         {
            for(i = this.tweens.length - 1; i > -1; i--)
            {
               tp = this.tweens[i];
               if(tp[5])
               {
                  val = tp[2] + factor * tp[3];
                  neg = val < 0?-1:1;
                  tp[0][tp[1]] = val % 1 * neg > 0.5?int(val) + neg:int(val);
               }
               else
               {
                  tp[0][tp[1]] = tp[2] + factor * tp[3];
               }
            }
         }
         if(this._hf)
         {
            for(i = this._clrsa.length - 1; i > -1; i--)
            {
               tp = this._clrsa[i];
               tp.f[tp.p] = tp.sr + factor * tp.cr << 16 | tp.sg + factor * tp.cg << 8 | tp.sb + factor * tp.cb;
            }
            if(this._cmf != null)
            {
               ColorMatrixFilter(this._cmf).matrix = this._matrix;
            }
            f = this.target.filters;
            for(i = 0; i < this._filters.length; i++)
            {
               for(j = f.length - 1; j > -1; j--)
               {
                  if(f[j] is this._filters[i].type)
                  {
                     f.splice(j,1,this._filters[i].filter);
                     break;
                  }
               }
            }
            this.target.filters = f;
         }
         if(_hst)
         {
            for(i = _subTweens.length - 1; i > -1; i--)
            {
               _subTweens[i].proxy(_subTweens[i],time);
            }
         }
         if(_hasUpdate)
         {
            this.vars.onUpdate.apply(null,this.vars.onUpdateParams);
         }
         if(time == this.duration)
         {
            complete(true);
         }
      }
      
      private function addFilter($name:String, $fv:Object, $filterType:Class, $props:Array, $defaultFilter:BitmapFilter) : Object
      {
         var i:int = 0;
         var prop:String = null;
         var valChange:Number = NaN;
         var begin:Object = null;
         var end:Object = null;
         var f:Object = {
            "type":$filterType,
            "name":$name
         };
         var fltrs:Array = this.target.filters;
         for(i = 0; i < fltrs.length; i++)
         {
            if(fltrs[i] is $filterType)
            {
               f.filter = fltrs[i];
               break;
            }
         }
         if(f.filter == undefined)
         {
            f.filter = $defaultFilter;
            fltrs[fltrs.length] = f.filter;
            this.target.filters = fltrs;
         }
         for(i = 0; i < $props.length; i++)
         {
            prop = $props[i];
            if($fv[prop] != undefined)
            {
               if(prop == "color" || prop == "highlightColor" || prop == "shadowColor")
               {
                  begin = HEXtoRGB(f.filter[prop]);
                  end = HEXtoRGB($fv[prop]);
                  this._clrsa[this._clrsa.length] = {
                     "f":f.filter,
                     "p":prop,
                     "sr":begin.rb,
                     "cr":end.rb - begin.rb,
                     "sg":begin.gb,
                     "cg":end.gb - begin.gb,
                     "sb":begin.bb,
                     "cb":end.bb - begin.bb
                  };
               }
               else if(prop == "quality" || prop == "inner" || prop == "knockout" || prop == "hideObject")
               {
                  f.filter[prop] = $fv[prop];
               }
               else
               {
                  if(typeof $fv[prop] == "number")
                  {
                     valChange = $fv[prop] - f.filter[prop];
                  }
                  else
                  {
                     valChange = Number($fv[prop]);
                  }
                  this.tweens[this.tweens.length] = [f.filter,prop,f.filter[prop],valChange,$name];
               }
            }
         }
         this._filters[this._filters.length] = f;
         this._hf = true;
         return f;
      }
   }
}
