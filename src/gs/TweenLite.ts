module gs {
	export class TweenLite extends egret.HashObject {
		public static _timer:egret.Timer;
		public static _classInitted:boolean = false;
		public static defaultEase:Function;
		public static version:number;
		public static masterList:flash.Dictionary;
		public static currentTime:number = 0;
		public static overwriteManager:any;
		public static killDelayedCallsTo:Function;
		public static timingSprite:egret.Sprite;
		public started:boolean = false;
		public delay:number = NaN;
		protected _hasUpdate:boolean = false;
		protected _subTweens:Array<any>;
		public initted:boolean = false;
		public active:boolean = false;
		public startTime:number = NaN;
		public target:any;
		public duration:number = NaN;
		protected _hst:boolean = false;
		public gc:boolean = false;
		protected _isDisplayObject:boolean = false;
		public tweens:Array<any>;
		public vars:any;
		public ease:Function;
		protected _specialVars:any;
		public initTime:number = NaN;
		public combinedTimeScale:number = NaN;

		public constructor($target:any,$duration:number,$vars:any)
		{
			super();
			super();
			if($target == null)
			{
				return ;
			}
			if(<any>!gs.TweenLite._classInitted)
			{
				gs.TweenLite.currentTime = flash.checkUint(egret.getTimer());
				gs.TweenLite.timingSprite.addEventListener(egret.Event.ENTER_FRAME,gs.TweenLite.updateAll,null,false,0);
				if(gs.TweenLite.overwriteManager == null)
				{
					gs.TweenLite.overwriteManager = {"mode":1,"enabled":false};
				}
				gs.TweenLite._timer.addEventListener("timer",gs.TweenLite.killGarbage,null,false,0);
				gs.TweenLite._timer.start();
				gs.TweenLite._classInitted = true;
			}
			this.vars = $vars;
			this.duration = flash.trannumber($duration) || flash.trannumber(0.001);
			this.delay = flash.trannumber($vars["delay"]) || flash.trannumber(0);
			this.combinedTimeScale = flash.trannumber($vars["timeScale"]) || flash.trannumber(1);
			this.active = flash.Boolean($duration == 0 && this.delay == 0);
			this.target = $target;
			this._isDisplayObject = flash.Boolean(flash.As3is($target,egret.DisplayObject));
			if(<any>!(flash.As3is(this.vars["ease"],Function)))
			{
				this.vars["ease"] = gs.TweenLite.defaultEase;
			}
			if(this.vars["easeParams"] != null)
			{
				this.vars["proxiedEase"] = this.vars["ease"];
				this.vars["ease"] = flash.bind(this.easeProxy,this);
			}
			this.ease = this.vars["ease"];
			if(<any>!isNaN(flash.trannumber(this.vars["autoAlpha"])))
			{
				this.vars["alpha"] = flash.trannumber(this.vars["autoAlpha"]);
				this.vars["visible"] = flash.Boolean(this.vars["alpha"] > 0);
			}
			this._specialVars = this.vars["isTV"] == true?this.vars["exposedProps"]:this.vars;
			this.tweens = [];
			this._subTweens = [];
			this._hst = this.initted = false;
			this.initTime = gs.TweenLite.currentTime;
			this.startTime = this.initTime + this.delay * 1000;
			var mode:number = flash.checkInt($vars["overwrite"] == undefined || <any>!gs.TweenLite.overwriteManager["enabled"] && $vars["overwrite"] > 1?flash.tranint(gs.TweenLite.overwriteManager["mode"]):flash.tranint(flash.tranint($vars["overwrite"])));
			if(gs.TweenLite.masterList.getItem($target) == undefined || $target != null && mode == 1)
			{
				gs.TweenLite.masterList.setItem($target,[]);
			}
			gs.TweenLite.masterList.getItem($target).push(this);
			if(this.vars["runBackwards"] == true && this.vars["renderOnStart"] != true || this.active)
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
				if(this._specialVars["visible"] != null && this.vars["runBackwards"] == true && this._isDisplayObject)
				{
					this.target["visible"] = this._specialVars["visible"];
				}
			}
		}

		public static frameProxy($o:any,$time:number = 0)
		{
			$o["info"].target.gotoAndStop(Math.round($o["target"].frame));
		}

		public static removeTween($t:gs.TweenLite,$clear:boolean = true)
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

		public static visibleProxy($o:any,$time:number)
		{
			var t:gs.TweenLite = <any>$o["info"].tween;
			if(t.duration == $time)
			{
				if(t.vars["runBackwards"] != true && t.ease == t.vars["ease"])
				{
					t.target["visible"] = t.vars["visible"];
				}
			}
			else if(t.target["visible"] != true)
			{
				t.target["visible"] = true;
			}
		}

		public static killTweensOf($target:any = null,$complete:boolean = false)
		{
			var a:Array<any> = <any>null;
			var i:number = flash.checkInt(0);
			var tween:gs.TweenLite = <any>null;
			if($target != null && gs.TweenLite.masterList.getItem($target) != undefined)
			{
				a = gs.TweenLite.masterList.getItem($target);
				for(i = flash.checkInt(a.length - 1); i > -1; i--)
				{
					tween = a[i];
					if($complete && <any>!tween.gc)
					{
						tween.complete(false);
					}
					tween.clear();
				}
				gs.TweenLite.masterList.delItem($target);
			}
		}

		public static updateAll($e:egret.Event = null)
		{
			var a:Array<any> = <any>null;
			var i:number = flash.checkInt(0);
			var tween:gs.TweenLite = <any>null;
			var t:number = flash.checkUint(gs.TweenLite.currentTime = flash.checkUint(egret.getTimer()));
			var ml:flash.Dictionary = gs.TweenLite.masterList;
			var a_key_a;
			for(a_key_a in ml.map)
			{
				a = ml.map[a_key_a][1];
				for(i = flash.checkInt(a.length - 1); i > -1; i--)
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

		public static delayedCall($delay:number,$onComplete:Function,$onCompleteParams:Array<any> = null):gs.TweenLite
		{
			return new gs.TweenLite($onComplete,0,{"delay":$delay,"onComplete":$onComplete,"onCompleteParams":$onCompleteParams,"overwrite":0});
		}

		public static from($target:any,$duration:number,$vars:any):gs.TweenLite
		{
			$vars["runBackwards"] = true;
			return new gs.TweenLite($target,$duration,$vars);
		}

		public static easeOut($t:number,$b:number,$c:number,$d:number):number
		{
			return -$c * ($t = $t / $d) * ($t - 2) + $b;
		}

		public static tintProxy($o:any,$time:number = 0)
		{
			var n:number = <any>$o["target"].progress;
			var r:number = 1 - n;
			var sc:any = <any>$o["info"].color;
			var ec:any = <any>$o["info"].endColor;
			$o["info"].target.transform.colorTransform = new flash.ColorTransform(sc["redMultiplier"] * r + ec["redMultiplier"] * n,sc["greenMultiplier"] * r + ec["greenMultiplier"] * n,sc["blueMultiplier"] * r + ec["blueMultiplier"] * n,sc["alphaMultiplier"] * r + ec["alphaMultiplier"] * n,sc["redOffset"] * r + ec["redOffset"] * n,sc["greenOffset"] * r + ec["greenOffset"] * n,sc["blueOffset"] * r + ec["blueOffset"] * n,sc["alphaOffset"] * r + ec["alphaOffset"] * n);
		}

		public static volumeProxy($o:any,$time:number = 0)
		{
			$o["info"].target.soundTransform = $o["target"];
		}

		protected static killGarbage($e:egret.TimerEvent)
		{
			var tgt:any = null;
			var a:Array<any> = <any>null;
			var ml:flash.Dictionary = gs.TweenLite.masterList;
			for(var forinvar__ in ml.map)
			{
				tgt = ml.map[forinvar__][0];
				if(ml.getItem(tgt).length == 0)
				{
					ml.delItem(tgt);
				}
			}
		}

		public static to($target:any,$duration:number,$vars:any):gs.TweenLite
		{
			return new gs.TweenLite($target,$duration,$vars);
		}

		public get enabled():boolean
		{
			return <any>!<any>!this.gc?false:true;
		}

		public render($t:number)
		{
			$t = flash.checkUint($t);
			var factor:number = <any>NaN;
			var tp:any = <any>null;
			var i:number = flash.checkInt(0);
			var time:number = ($t - this.startTime) * 0.001;
			if(time >= this.duration)
			{
				time = this.duration;
				factor = this.ease == this.vars["ease"] || this.duration == 0.001?flash.trannumber(1):flash.trannumber(0);
			}
			else
			{
				factor = this.ease(time,0,1,this.duration);
			}
			for(i = flash.checkInt(this.tweens.length - 1); i > -1; i--)
			{
				tp = this.tweens[i];
				tp[0][tp[1]] = tp[2] + factor * tp[3];
			}
			if(this._hst)
			{
				for(i = flash.checkInt(this._subTweens.length - 1); i > -1; i--)
				{
					this._subTweens[i].proxy(this._subTweens[i],time);
				}
			}
			if(this._hasUpdate)
			{
				this.vars["onUpdate"].apply(null,this.vars["onUpdateParams"]);
			}
			if(time == this.duration)
			{
				this.complete(true);
			}
		}

		public set enabled($b:boolean)
		{
			var a:Array<any> = <any>null;
			var found:boolean = <any>false;
			var i:number = flash.checkInt(0);
			if($b)
			{
				if(gs.TweenLite.masterList.getItem(this.target) == undefined)
				{
					gs.TweenLite.masterList.setItem(this.target,[this]);
				}
				else
				{
					a = gs.TweenLite.masterList.getItem(this.target);
					for(i = flash.checkInt(a.length - 1); i > -1; i--)
					{
						if(a[i] == this)
						{
							found = true;
							break;
						}
					}
					if(<any>!found)
					{
						gs.TweenLite.masterList.getItem(this.target).push(this);
					}
				}
			}
			this.gc = <any>!<any>!$b?false:true;
			if(this.gc)
			{
				this.active = false;
			}
			else
			{
				this.active = this.started;
			}
		}

		public activate()
		{
			this.started = this.active = true;
			if(<any>!this.initted)
			{
				this.initTweenVals();
			}
			if(this.vars["onStart"] != null)
			{
				this.vars["onStart"].apply(null,this.vars["onStartParams"]);
			}
			if(this.duration == 0.001)
			{
				this.startTime = this.startTime - 1;
			}
		}

		public clear()
		{
			this.tweens = [];
			this._subTweens = [];
			this.vars = {};
			this._hst = this._hasUpdate = false;
		}

		protected addSubTween($name:string,$proxy:Function,$target:any,$props:any,$info:any = null)
		{
			var p:any = null;
			this._subTweens[this._subTweens.length] = {"name":$name,"proxy":$proxy,"target":$target,"info":$info};
			for(p in $props)
			{
				if(typeof $props[p] == "number")
				{
					this.tweens[this.tweens.length] = [$target,p,$target[p],$props[p] - $target[p],$name];
				}
				else
				{
					this.tweens[this.tweens.length] = [$target,p,$target[p],flash.trannumber($props[p]),$name];
				}
			}
			this._hst = true;
		}

		public initTweenVals($hrp:boolean = false,$reservedProps:string = "")
		{
			var p:any = null;
			var i:number = flash.checkInt(0);
			var endArray:Array<any> = <any>null;
			var clr:flash.ColorTransform = <any>null;
			var endClr:flash.ColorTransform = <any>null;
			var tp:any = <any>null;
			if(<any>!$hrp && gs.TweenLite.overwriteManager["enabled"])
			{
				gs.TweenLite.overwriteManager["manageOverwrites"](this,gs.TweenLite.masterList.getItem(this.target));
			}
			if(flash.As3is(this.target,Array))
			{
				endArray = this.vars["endArray"] || [];
				for(i = flash.checkInt(0); i < endArray.length; i++)
				{
					if(this.target[i] != endArray[i] && this.target[i] != undefined)
					{
						this.tweens[this.tweens.length] = [this.target,i.toString(),this.target[i],endArray[i] - this.target[i],i.toString()];
					}
				}
			}
			else
			{
				if((typeof this._specialVars["tint"] != "undefined" || this.vars["removeTint"] == true) && this._isDisplayObject)
				{
					clr = this.target["transform"].colorTransform;
					endClr = new flash.ColorTransform();
					if(this._specialVars["alpha"] != undefined)
					{
						endClr.alphaMultiplier = this._specialVars["alpha"];
						delete this._specialVars["alpha"];
					}
					else
					{
						endClr.alphaMultiplier = this.target["alpha"];
					}
					if(this.vars["removeTint"] != true && (this._specialVars["tint"] != null && this._specialVars["tint"] != "" || this._specialVars["tint"] == 0))
					{
						endClr.color = this._specialVars["tint"];
					}
					this.addSubTween("tint",gs.TweenLite.tintProxy,{"progress":0},{"progress":1},{"target":this.target,"color":clr,"endColor":endClr});
				}
				if(this._specialVars["frame"] != null && this._isDisplayObject)
				{
					this.addSubTween("frame",gs.TweenLite.frameProxy,{"frame":this.target["currentFrame"]},{"frame":this._specialVars["frame"]},{"target":this.target});
				}
				if(<any>!isNaN(this.vars["volume"]) && this.target.hasOwnProperty("soundTransform"))
				{
					this.addSubTween("volume",gs.TweenLite.volumeProxy,this.target["soundTransform"],{"volume":this.vars["volume"]},{"target":this.target});
				}
				if(this._specialVars["visible"] != null && this._isDisplayObject)
				{
					this.addSubTween("visible",gs.TweenLite.visibleProxy,{},{},{"tween":this});
				}
				for(p in this._specialVars)
				{
					if(<any>!(p == "ease" || p == "delay" || p == "overwrite" || p == "onComplete" || p == "onCompleteParams" || p == "runBackwards" || p == "visible" || p == "autoOverwrite" || p == "persist" || p == "onUpdate" || p == "onUpdateParams" || p == "autoAlpha" || p == "timeScale" && <any>!(flash.As3is(this.target,gs.TweenLite)) || p == "onStart" || p == "onStartParams" || p == "renderOnStart" || p == "proxiedEase" || p == "easeParams" || $hrp && $reservedProps.indexOf(" " + p + " ") != -1))
					{
						if(<any>!(this._isDisplayObject && (p == "tint" || p == "removeTint" || p == "frame")) && <any>!(p == "volume" && this.target.hasOwnProperty("soundTransform")))
						{
							if(typeof this._specialVars[p] == "number")
							{
								this.tweens[this.tweens.length] = [this.target,p,this.target[p],this._specialVars[p] - this.target[p],p];
							}
							else
							{
								this.tweens[this.tweens.length] = [this.target,p,this.target[p],flash.trannumber(this._specialVars[p]),p];
							}
						}
					}
				}
			}
			if(this.vars["runBackwards"] == true)
			{
				for(i = flash.checkInt(this.tweens.length - 1); i > -1; i--)
				{
					tp = this.tweens[i];
					tp[2] = tp[2] + tp[3];
					tp[3] = tp[3] * -1;
				}
			}
			if(this.vars["onUpdate"] != null)
			{
				this._hasUpdate = true;
			}
			this.initted = true;
		}

		protected easeProxy($t:number,$b:number,$c:number,$d:number):number
		{
			var _arguments__ = [];
			for(var _arguments__key in arguments)
			{
				_arguments__ = arguments[_arguments__key];
			}
			return this.vars["proxiedEase"].apply(null,_arguments__.concat(this.vars["easeParams"]));
		}

		public killVars($vars:any)
		{
			if(gs.TweenLite.overwriteManager["enabled"])
			{
				gs.TweenLite.overwriteManager["killVars"]($vars,this.vars,this.tweens,this._subTweens,[]);
			}
		}

		public complete($skipRender:boolean = false)
		{
			if(<any>!$skipRender)
			{
				if(<any>!this.initted)
				{
					this.initTweenVals();
				}
				this.startTime = gs.TweenLite.currentTime - this.duration * 1000 / this.combinedTimeScale;
				this.render(gs.TweenLite.currentTime);
				return ;
			}
			if(this.vars["persist"] != true)
			{
				this.enabled = false;
			}
			if(this.vars["onComplete"] != null)
			{
				this.vars["onComplete"].apply(null,this.vars["onCompleteParams"]);
			}
		}

	}
}

gs.TweenLite._timer = new egret.Timer(2000);
gs.TweenLite.defaultEase = gs.TweenLite.easeOut;
gs.TweenLite.version = 9.29;
gs.TweenLite.masterList = new flash.Dictionary(false);
gs.TweenLite.killDelayedCallsTo = gs.TweenLite.killTweensOf;
gs.TweenLite.timingSprite = new egret.Sprite();
