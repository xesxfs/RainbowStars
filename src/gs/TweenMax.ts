module gs {
	export class TweenMax extends gs.TweenFilterLite implements egret.IEventDispatcher {
		public static removeTween_static_gs_TweenMax:Function;
		public static _overwriteMode:number;
		public static _pausedTweens:flash.Dictionary;
		public static setGlobalTimeScale_static_gs_TweenMax:Function;
		public static killTweensOf_static_gs_TweenMax:Function;
		public static version_static_gs_TweenMax:number;
		public static _RAD2DEG:number;
		public static killDelayedCallsTo_static_gs_TweenMax:Function;
		protected _dispatcher:egret.EventDispatcher;
		public pauseTime:number = NaN;
		protected _callbacks:any;
		protected _repeatCount:number = NaN;

		public constructor($target:any,$duration:number,$vars:any)
		{
			super($target,$duration,$vars);
			if(this.vars["onCompleteListener"] != null || this.vars["onUpdateListener"] != null || this.vars["onStartListener"] != null)
			{
				this.initDispatcher();
				if($duration == 0 && this.delay == 0)
				{
					this.onUpdateDispatcher();
					this.onCompleteDispatcher();
				}
			}
			this._repeatCount = 0;
			if(<any>!isNaN(this.vars["yoyo"]) || <any>!isNaN(this.vars["loop"]))
			{
				this.vars["persist"] = true;
			}
			if(gs.TweenFilterLite.version_static_gs_TweenFilterLite < 9.29)
			{
				console.log("TweenMax error! Please update your TweenFilterLite class or try deleting your ASO files. TweenMax requires a more recent version. Download updates at http://www.TweenMax.com.");
			}
		}

		public static sequence($target:any,$tweens:Array<any>):Array<any>
		{
			for(var i:number = flash.checkUint(0);i < $tweens.length; i++)
			{
				$tweens[i].target = $target;
			}
			return gs.TweenMax.multiSequence($tweens);
		}

		public static bezierProxy($o:any,$time:number = 0)
		{
			var i:number = flash.checkInt(0);
			var p:any = null;
			var b:any = <any>null;
			var t:number = <any>NaN;
			var segments:number = flash.checkUint(0);
			var factor:number = <any>$o["target"].t;
			var props:any = <any>$o["info"].props;
			var tg:any = <any>$o["info"].target;
			if(factor == 1)
			{
				for(p in props)
				{
					i = flash.checkInt(props[p].length - 1);
					tg[p] = props[p][i].e;
				}
			}
			else
			{
				for(p in props)
				{
					segments = flash.checkUint(props[p].length);
					if(factor < 0)
					{
						i = flash.checkInt(0);
					}
					else if(factor >= 1)
					{
						i = flash.checkInt(segments - 1);
					}
					else
					{
						i = flash.checkInt(flash.tranint(segments * factor));
					}
					t = (factor - i * (1 / segments)) * segments;
					b = props[p][i];
					tg[p] = b["s"] + t * (2 * (1 - t) * (b["cp"] - b["s"]) + t * (b["e"] - b["s"]));
				}
			}
		}

		public static hexColorsProxy($o:any,$time:number = 0)
		{
			$o["info"].target[$o["info"].prop] = flash.tranint($o["target"].r << 16 | $o["target"].g << 8 | $o["target"].b);
		}

		public static parseBeziers($props:any,$through:boolean = false):any
		{
			var i:number = flash.checkInt(0);
			var a:Array<any> = <any>null;
			var b:any = <any>null;
			var p:any = null;
			var all:any = {};
			if($through)
			{
				for(p in $props)
				{
					a = $props[p];
					all[p] = b = [];
					if(a.length > 2)
					{
						b[b["length"]] = {"s":a[0],"cp":a[1] - (a[2] - a[0]) / 4,"e":a[1]};
						for(i = flash.checkInt(1); i < a.length - 1; i++)
						{
							b[b["length"]] = {"s":a[i],"cp":a[i] + (a[i] - b[i - 1].cp),"e":a[i + 1]};
						}
					}
					else
					{
						b[b["length"]] = {"s":a[0],"cp":(a[0] + a[1]) / 2,"e":a[1]};
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
						b[b["length"]] = {"s":a[0],"cp":a[1],"e":(a[1] + a[2]) / 2};
						for(i = flash.checkInt(2); i < a.length - 2; i++)
						{
							b[b["length"]] = {"s":b[i - 2].e,"cp":a[i],"e":(a[i] + a[i + 1]) / 2};
						}
						b[b["length"]] = {"s":b[b["length"] - 1].e,"cp":a[a.length - 2],"e":a[a.length - 1]};
					}
					else if(a.length == 3)
					{
						b[b["length"]] = {"s":a[0],"cp":a[1],"e":a[2]};
					}
					else if(a.length == 2)
					{
						b[b["length"]] = {"s":a[0],"cp":(a[0] + a[1]) / 2,"e":a[1]};
					}
				}
			}
			return all;
		}

		public static bezierProxy2($o:any,$time:number = 0)
		{
			var a:number = <any>NaN;
			var dx:number = <any>NaN;
			var dy:number = <any>NaN;
			var cotb:Array<any> = <any>null;
			var toAdd:number = <any>NaN;
			gs.TweenMax.bezierProxy($o,$time);
			var future:any = {};
			var tg:any = <any>$o["info"].target;
			$o["info"].target = future;
			$o["target"].t = $o["target"].t + 0.01;
			gs.TweenMax.bezierProxy($o);
			var otb:Array<any> = <any>$o["info"].orientToBezier;
			for(var i:number = flash.checkUint(0);i < otb.length; i++)
			{
				cotb = otb[i];
				toAdd = flash.trannumber(cotb[3]) || flash.trannumber(0);
				dx = future[cotb[0]] - tg[cotb[0]];
				dy = future[cotb[1]] - tg[cotb[1]];
				tg[cotb[2]] = Math.atan2(dy,dx) * gs.TweenMax._RAD2DEG + toAdd;
			}
			$o["info"].target = tg;
			$o["target"].t = $o["target"].t - 0.01;
		}

		public static pauseAll($tweens:boolean = true,$delayedCalls:boolean = false)
		{
			gs.TweenMax.changePause(true,$tweens,$delayedCalls);
		}

		public static set globalTimeScale_static_gs_TweenMax($n:number)
		{
			gs.TweenMax.setGlobalTimeScale_static_gs_TweenMax($n);
		}

		public static get globalTimeScale_static_gs_TweenMax():number
		{
			return gs.TweenFilterLite._globalTimeScale;
		}

		public static killAllDelayedCalls($complete:boolean = false)
		{
			gs.TweenMax.killAll($complete,false,true);
		}

		public static multiSequence($tweens:Array<any>):Array<any>
		{
			var tw:any = <any>null;
			var tgt:any = <any>null;
			var dl:number = <any>NaN;
			var t:number = <any>NaN;
			var i:number = flash.checkUint(0);
			var o:any = <any>null;
			var p:any = null;
			console.log("WARNING: TweenMax.multiSequence() and TweenMax.sequence() have been deprecated in favor of the much more powerful and flexible TweenGroup class. See http://blog.greensock.com/tweengroup/ for more details. Future versions of TweenMax may not include sequence() and multiSequence() (to conserve file size).");
			var dict:flash.Dictionary = new flash.Dictionary();
			var a:Array<any> = [];
			var overwriteMode:number = flash.checkInt(gs.TweenLite.overwriteManager["mode"]);
			var totalDelay:number = <any>0;
			for(i = flash.checkUint(0); i < $tweens.length; i++)
			{
				tw = $tweens[i];
				t = flash.trannumber(tw["time"]) || flash.trannumber(0);
				o = {};
				for(p in tw)
				{
					o[p] = tw[p];
				}
				delete o["time"];
				dl = flash.trannumber(o["delay"]) || flash.trannumber(0);
				o["delay"] = totalDelay + dl;
				tgt = o["target"];
				delete o["target"];
				if(overwriteMode == 1)
				{
					if(dict.getItem(tgt) == undefined)
					{
						dict.setItem(tgt,o);
					}
					else
					{
						o["overwrite"] = 2;
					}
				}
				a[a.length] = new gs.TweenMax(tgt,t,o);
				totalDelay = totalDelay + (t + dl);
			}
			return a;
		}

		public static getTweensOf($target:any):Array<any>
		{
			var i:number = flash.checkInt(0);
			var a:Array<any> = <any>gs.TweenLite.masterList.getItem($target);
			var toReturn:Array<any> = [];
			if(a != null)
			{
				for(i = flash.checkInt(a.length - 1); i > -1; i--)
				{
					if(<any>!a[i].gc)
					{
						toReturn[toReturn.length] = a[i];
					}
				}
			}
			return toReturn;
		}

		public static delayedCall_static_gs_TweenMax($delay:number,$onComplete:Function,$onCompleteParams:Array<any> = null,$persist:boolean = false):gs.TweenMax
		{
			return new gs.TweenMax($onComplete,0,{"delay":$delay,"onComplete":$onComplete,"onCompleteParams":$onCompleteParams,"persist":$persist,"overwrite":0});
		}

		public static isTweening($target:any):boolean
		{
			var a:Array<any> = gs.TweenMax.getTweensOf($target);
			for(var i:number = flash.checkInt(a.length - 1);i > -1; i--)
			{
				if(a[i].active && <any>!a[i].gc)
				{
					return true;
				}
			}
			return false;
		}

		public static killAll($complete:boolean = false,$tweens:boolean = true,$delayedCalls:boolean = true)
		{
			var isDC:any = false;
			var a:Array<any> = gs.TweenMax.getAllTweens();
			for(var i:number = flash.checkInt(a.length - 1);i > -1; i--)
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
						gs.TweenLite.removeTween(a[i],true);
					}
				}
			}
		}

		public static changePause($pause:boolean,$tweens:boolean = true,$delayedCalls:boolean = false)
		{
			var isDC:any = false;
			var a:Array<any> = gs.TweenMax.getAllTweens();
			for(var i:number = flash.checkInt(a.length - 1);i > -1; i--)
			{
				isDC = a[i].target == a[i].vars.onComplete;
				if(flash.As3is(a[i],gs.TweenMax) && (isDC == $delayedCalls || isDC != $tweens))
				{
					a[i].paused = $pause;
				}
			}
		}

		public static callbackProxy($functions:Array<any>,$params:Array<any> = null)
		{
			for(var i:number = flash.checkUint(0);i < $functions.length; i++)
			{
				if($functions[i] != undefined)
				{
					$functions[i].apply(null,$params[i]);
				}
			}
		}

		public static allFrom($targets:Array<any>,$duration:number,$vars:any):Array<any>
		{
			$vars["runBackwards"] = true;
			return gs.TweenMax.allTo($targets,$duration,$vars);
		}

		public static killAllTweens($complete:boolean = false)
		{
			gs.TweenMax.killAll($complete,true,false);
		}

		public static getAllTweens():Array<any>
		{
			var a:Array<any> = <any>null;
			var i:number = flash.checkInt(0);
			var tween:gs.TweenLite = <any>null;
			var ml:flash.Dictionary = gs.TweenLite.masterList;
			var toReturn:Array<any> = [];
			var a_key_a;
			for(a_key_a in ml.map)
			{
				a = ml.map[a_key_a][1];
				for(i = flash.checkInt(a.length - 1); i > -1; i--)
				{
					if(<any>!a[i].gc)
					{
						toReturn[toReturn.length] = a[i];
					}
				}
			}
			var tween_key_a;
			for(tween_key_a in gs.TweenMax._pausedTweens.map)
			{
				tween = gs.TweenMax._pausedTweens.map[tween_key_a][1];
				toReturn[toReturn.length] = tween;
			}
			return toReturn;
		}

		public static resumeAll($tweens:boolean = true,$delayedCalls:boolean = false)
		{
			gs.TweenMax.changePause(false,$tweens,$delayedCalls);
		}

		public static from_static_gs_TweenMax($target:any,$duration:number,$vars:any):gs.TweenMax
		{
			$vars["runBackwards"] = true;
			return new gs.TweenMax($target,$duration,$vars);
		}

		public static to_static_gs_TweenMax($target:any,$duration:number,$vars:any):gs.TweenMax
		{
			return new gs.TweenMax($target,$duration,$vars);
		}

		public static allTo($targets:Array<any>,$duration:number,$vars:any):Array<any>
		{
			var i:number = flash.checkInt(0);
			var v:any = <any>null;
			var p:any = null;
			var dl:number = <any>NaN;
			var lastVars:any = <any>null;
			console.log("WARNING: TweenMax.allTo() and TweenMax.allFrom() have been deprecated in favor of the much more powerful and flexible TweenGroup class. See http://blog.greensock.com/tweengroup/ for more details. Future versions of TweenMax may not include allTo() and allFrom() (to conserve file size).");
			if($targets.length == 0)
			{
				return [];
			}
			var a:Array<any> = [];
			var dli:number = <any>flash.trannumber($vars["delayIncrement"]) || flash.trannumber(0);
			delete $vars["delayIncrement"];
			if($vars["onCompleteAll"] == undefined)
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
				lastVars["onCompleteParams"] = [[$vars["onComplete"],$vars["onCompleteAll"]],[$vars["onCompleteParams"],$vars["onCompleteAllParams"]]];
				lastVars["onComplete"] = gs.TweenMax.callbackProxy;
				delete $vars["onCompleteAll"];
			}
			delete $vars["onCompleteAllParams"];
			if(dli == 0)
			{
				for(i = flash.checkInt(0); i < $targets.length - 1; i++)
				{
					v = {};
					for(p in $vars)
					{
						v[p] = $vars[p];
					}
					a[a.length] = new gs.TweenMax($targets[i],$duration,v);
				}
			}
			else
			{
				dl = flash.trannumber($vars["delay"]) || flash.trannumber(0);
				for(i = flash.checkInt(0); i < $targets.length - 1; i++)
				{
					v = {};
					for(p in $vars)
					{
						v[p] = $vars[p];
					}
					v["delay"] = dl + i * dli;
					a[a.length] = new gs.TweenMax($targets[i],$duration,v);
				}
				lastVars["delay"] = dl + ($targets.length - 1) * dli;
			}
			a[a.length] = new gs.TweenMax($targets[$targets.length - 1],$duration,lastVars);
			if(flash.As3is($vars["onCompleteAllListener"],Function))
			{
				a[a.length - 1].addEventListener(gs.events.TweenEvent.COMPLETE_static_gs_events_TweenEvent,$vars["onCompleteAllListener"]);
			}
			return a;
		}

		public dispatchEvent($e:egret.Event):boolean
		{
			if(this._dispatcher == null)
			{
				return false;
			}
			return this._dispatcher.dispatchEvent($e);
		}

		public get reversed():boolean
		{
			return this.ease == flash.bind(this.reverseEase,this);
		}

		public set reversed($b:boolean)
		{
			if(this.reversed != $b)
			{
				this.reverse();
			}
		}

		protected onStartDispatcher(...$args)
		{
			if(this._callbacks["onStart"] != null)
			{
				this._callbacks["onStart"].apply(null,this.vars["onStartParams"]);
			}
			this._dispatcher.dispatchEvent(new gs.events.TweenEvent(gs.events.TweenEvent.START));
		}

		public setDestination($property:string,$value:any,$adjustStartValues:boolean = true)
		{
			var v:any = <any>null;
			var i:number = flash.checkInt(0);
			var varsOld:any = <any>null;
			var tweensOld:Array<any> = <any>null;
			var subTweensOld:Array<any> = <any>null;
			var p:number = <any>this.progress;
			if(this.vars[$property] != undefined && this.initted)
			{
				if(<any>!$adjustStartValues && p != 0)
				{
					for(i = flash.checkInt(this.tweens.length - 1); i > -1; i--)
					{
						if(this.tweens[i][4] == $property)
						{
							this.tweens[i][0][this.tweens[i][1]] = this.tweens[i][2];
						}
					}
				}
				v = {};
				v[$property] = 1;
				this.killVars(v);
			}
			this.vars[$property] = $value;
			if(this.initted)
			{
				varsOld = this.vars;
				tweensOld = this.tweens;
				subTweensOld = this._subTweens;
				this.vars = {};
				this.tweens = [];
				this._subTweens = [];
				this.vars[$property] = $value;
				this.initTweenVals();
				if(this.ease != flash.bind(this.reverseEase,this) && flash.As3is(varsOld["ease"],Function))
				{
					this.ease = varsOld["ease"];
				}
				if($adjustStartValues && p != 0)
				{
					this.adjustStartValues();
				}
				this.vars = varsOld;
				this.tweens = tweensOld.concat(this.tweens);
				this._subTweens = subTweensOld.concat(this._subTweens);
			}
		}

		public initTweenVals($hrp:boolean = false,$reservedProps:string = "")
		{
			var p:any = null;
			var i:number = flash.checkInt(0);
			var curProp:any = <any>null;
			var props:any = <any>null;
			var b:Array<any> = <any>null;
			var dif:number = <any>NaN;
			$reservedProps = $reservedProps + " hexColors bezier bezierThrough shortRotation orientToBezier quaternions onCompleteAll onCompleteAllParams yoyo loop onCompleteListener onUpdateListener onStartListener ";
			if(<any>!$hrp && gs.TweenLite.overwriteManager["enabled"])
			{
				gs.TweenLite.overwriteManager["manageOverwrites"](this,gs.TweenLite.masterList.getItem(this.target));
			}
			var bProxy:Function = gs.TweenMax.bezierProxy;
			if(this.vars["orientToBezier"] == true)
			{
				this.vars["orientToBezier"] = [["x","y","rotation",0]];
				bProxy = gs.TweenMax.bezierProxy2;
			}
			else if(flash.As3is(this.vars["orientToBezier"],Array))
			{
				bProxy = gs.TweenMax.bezierProxy2;
			}
			if(this.vars["bezier"] != undefined && flash.As3is(this.vars["bezier"],Array))
			{
				props = {};
				b = this.vars["bezier"];
				for(i = flash.checkInt(0); i < b.length; i++)
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
							props[p].push(this.target[p] + flash.trannumber(b[i][p]));
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
						props[p].push(this.target[p] + flash.trannumber(this.vars[p]));
					}
					delete this.vars[p];
				}
				this.addSubTween("bezier",bProxy,{"t":0},{"t":1},{"props":gs.TweenMax.parseBeziers(props,false),"target":this.target,"orientToBezier":this.vars["orientToBezier"]});
			}
			if(this.vars["bezierThrough"] != undefined && flash.As3is(this.vars["bezierThrough"],Array))
			{
				props = {};
				b = this.vars["bezierThrough"];
				for(i = flash.checkInt(0); i < b.length; i++)
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
							props[p].push(this.target[p] + flash.trannumber(b[i][p]));
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
						props[p].push(this.target[p] + flash.trannumber(this.vars[p]));
					}
					delete this.vars[p];
				}
				this.addSubTween("bezierThrough",bProxy,{"t":0},{"t":1},{"props":gs.TweenMax.parseBeziers(props,true),"target":this.target,"orientToBezier":this.vars["orientToBezier"]});
			}
			if(<any>!isNaN(this.vars["shortRotation"]))
			{
				dif = (this.vars["shortRotation"] - this.target["rotation"]) % 360;
				if(dif != dif % 180)
				{
					dif = dif < 0?flash.trannumber(dif + 360):flash.trannumber(dif - 360);
				}
				this.tweens[this.tweens.length] = [this.target,"rotation",this.target["rotation"],dif,"rotation"];
			}
			if(this.vars["hexColors"] != undefined && typeof this.vars["hexColors"] == "object")
			{
				for(p in this.vars["hexColors"])
				{
					this.addSubTween("hexColors",gs.TweenMax.hexColorsProxy,{"r":this.target[p] >> 16,"g":this.target[p] >> 8 & 255,"b":this.target[p] & 255},{"r":this.vars["hexColors"][p] >> 16,"g":this.vars["hexColors"][p] >> 8 & 255,"b":this.vars["hexColors"][p] & 255},{"prop":p,"target":this.target});
				}
			}
			super.initTweenVals(true,$reservedProps);
		}

		public restart($includeDelay:boolean = false)
		{
			if($includeDelay)
			{
				this.initTime = gs.TweenLite.currentTime;
				this.startTime = gs.TweenLite.currentTime + this.delay * (1000 / this.combinedTimeScale);
			}
			else
			{
				this.startTime = gs.TweenLite.currentTime;
				this.initTime = gs.TweenLite.currentTime - this.delay * (1000 / this.combinedTimeScale);
			}
			this._repeatCount = 0;
			if(this.target != this.vars["onComplete"])
			{
				this.render(this.startTime);
			}
			this.pauseTime = NaN;
			this.enabled = true;
		}

		public removeEventListener($type:string,$listener:Function,thisObject:any,$useCapture:boolean = false)
		{
			if(this._dispatcher != null)
			{
				this._dispatcher.removeEventListener($type,$listener,null,$useCapture);
			}
		}

		public addEventListener($type:string,$listener:Function,thisObject:any,$useCapture:boolean = false,$priority:number = 0,$useWeakReference:boolean = false)
		{
			if(this._dispatcher == null)
			{
				this.initDispatcher();
			}
			if($type == gs.events.TweenEvent.UPDATE && this.vars["onUpdate"] != flash.bind(this.onUpdateDispatcher,this))
			{
				this.vars["onUpdate"] = flash.bind(this.onUpdateDispatcher,this);
				this._hasUpdate = true;
			}
			this._dispatcher.addEventListener($type,$listener,null,$useCapture,$priority);
		}

		protected adjustStartValues()
		{
			var factor:number = <any>NaN;
			var endValue:number = <any>NaN;
			var tp:any = <any>null;
			var i:number = flash.checkInt(0);
			var p:number = <any>this.progress;
			if(p != 0)
			{
				factor = 1 / (1 - this.ease(p * this.duration,0,1,this.duration));
				for(i = flash.checkInt(this.tweens.length - 1); i > -1; i--)
				{
					tp = this.tweens[i];
					endValue = tp[2] + tp[3];
					tp[3] = (endValue - tp[0][tp[1]]) * factor;
					tp[2] = endValue - tp[3];
				}
			}
		}

		protected onUpdateDispatcher(...$args)
		{
			if(this._callbacks["onUpdate"] != null)
			{
				this._callbacks["onUpdate"].apply(null,this.vars["onUpdateParams"]);
			}
			this._dispatcher.dispatchEvent(new gs.events.TweenEvent(gs.events.TweenEvent.UPDATE));
		}

		protected initDispatcher()
		{
			var v:any = <any>null;
			var p:any = null;
			if(this._dispatcher == null)
			{
				this._dispatcher = new egret.EventDispatcher(<any>this);
				this._callbacks = {"onStart":this.vars["onStart"],"onUpdate":this.vars["onUpdate"],"onComplete":this.vars["onComplete"]};
				v = {};
				for(p in this.vars)
				{
					v[p] = this.vars[p];
				}
				this.vars = v;
				this.vars["onStart"] = flash.bind(this.onStartDispatcher,this);
				this.vars["onComplete"] = flash.bind(this.onCompleteDispatcher,this);
				if(flash.As3is(this.vars["onStartListener"],Function))
				{
					this._dispatcher.addEventListener(gs.events.TweenEvent.START,this.vars["onStartListener"],null,false,0);
				}
				if(flash.As3is(this.vars["onUpdateListener"],Function))
				{
					this._dispatcher.addEventListener(gs.events.TweenEvent.UPDATE,this.vars["onUpdateListener"],null,false,0);
					this.vars["onUpdate"] = flash.bind(this.onUpdateDispatcher,this);
					this._hasUpdate = true;
				}
				if(flash.As3is(this.vars["onCompleteListener"],Function))
				{
					this._dispatcher.addEventListener(gs.events.TweenEvent.COMPLETE_static_gs_events_TweenEvent,this.vars["onCompleteListener"],null,false,0);
				}
			}
		}

		public willTrigger($type:string):boolean
		{
			if(this._dispatcher == null)
			{
				return false;
			}
			return this._dispatcher.willTrigger($type);
		}

		public set progress($n:number)
		{
			this.startTime = gs.TweenLite.currentTime - this.duration * $n * 1000;
			this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
			if(<any>!this.started)
			{
				this.activate();
			}
			this.render(gs.TweenLite.currentTime);
			if(<any>!isNaN(this.pauseTime))
			{
				this.pauseTime = gs.TweenLite.currentTime;
				this.startTime = 999999999999999;
				this.active = false;
			}
		}

		public reverse($adjustDuration:boolean = true,$forcePlay:boolean = true)
		{
			this.ease = this.vars["ease"] == this.ease?flash.bind(this.reverseEase,this):this.vars["ease"];
			var p:number = <any>this.progress;
			if($adjustDuration && p > 0)
			{
				this.startTime = gs.TweenLite.currentTime - (1 - p) * this.duration * 1000 / this.combinedTimeScale;
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

		public set paused($b:boolean)
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

		public resume()
		{
			this.enabled = true;
			if(<any>!isNaN(this.pauseTime))
			{
				this.initTime = this.initTime + (gs.TweenLite.currentTime - this.pauseTime);
				this.startTime = this.initTime + this.delay * (1000 / this.combinedTimeScale);
				this.pauseTime = NaN;
				if(<any>!this.started && gs.TweenLite.currentTime >= this.startTime)
				{
					this.activate();
				}
				else
				{
					this.active = this.started;
				}
				gs.TweenMax._pausedTweens.setItem(this,null);
				gs.TweenMax._pausedTweens.delItem(this);
			}
		}

		public get paused():boolean
		{
			return this.startTime == 999999999999999;
		}

		public reverseEase($t:number,$b:number,$c:number,$d:number):number
		{
			return this.vars["ease"]($d - $t,$b,$c,$d);
		}

		public killProperties($names:Array<any>)
		{
			var i:number = flash.checkInt(0);
			var v:any = {};
			for(i = flash.checkInt($names.length - 1); i > -1; i--)
			{
				if(this.vars[$names[i]] != null)
				{
					v[$names[i]] = 1;
				}
			}
			this.killVars(v);
		}

		public hasEventListener($type:string):boolean
		{
			if(this._dispatcher == null)
			{
				return false;
			}
			return this._dispatcher.hasEventListener($type);
		}

		public pause()
		{
			if(isNaN(this.pauseTime))
			{
				this.pauseTime = gs.TweenLite.currentTime;
				this.startTime = 999999999999999;
				this.enabled = false;
				gs.TweenMax._pausedTweens.setItem(this,this);
			}
		}

		public complete($skipRender:boolean = false)
		{
			if(<any>!isNaN(this.vars["yoyo"]) && (this._repeatCount < this.vars["yoyo"] || this.vars["yoyo"] == 0) || <any>!isNaN(this.vars["loop"]) && (this._repeatCount < this.vars["loop"] || this.vars["loop"] == 0))
			{
				this._repeatCount++;
				if(<any>!isNaN(this.vars["yoyo"]))
				{
					this.ease = this.vars["ease"] == this.ease?flash.bind(this.reverseEase,this):this.vars["ease"];
				}
				this.startTime = <any>!<any>!$skipRender?flash.trannumber(this.startTime + this.duration * (1000 / this.combinedTimeScale)):flash.trannumber(gs.TweenLite.currentTime);
				this.initTime = this.startTime - this.delay * (1000 / this.combinedTimeScale);
			}
			else if(this.vars["persist"] == true)
			{
				this.pause();
			}
			super.complete($skipRender);
		}

		public invalidate($adjustStartValues:boolean = true)
		{
			var p:number = <any>NaN;
			if(this.initted)
			{
				p = this.progress;
				if(<any>!$adjustStartValues && p != 0)
				{
					this.progress = 0;
				}
				this.tweens = [];
				this._subTweens = [];
				this._specialVars = this.vars["isTV"] == true?this.vars["exposedProps"]:this.vars;
				this.initTweenVals();
				this._timeScale = flash.trannumber(this.vars["timeScale"]) || flash.trannumber(1);
				this.combinedTimeScale = this._timeScale * gs.TweenFilterLite._globalTimeScale;
				this.delay = flash.trannumber(this.vars["delay"]) || flash.trannumber(0);
				if(isNaN(this.pauseTime))
				{
					this.startTime = this.initTime + this.delay * 1000 / this.combinedTimeScale;
				}
				if(this.vars["onCompleteListener"] != null || this.vars["onUpdateListener"] != null || this.vars["onStartListener"] != null)
				{
					if(this._dispatcher != null)
					{
						this.vars["onStart"] = this._callbacks["onStart"];
						this.vars["onUpdate"] = this._callbacks["onUpdate"];
						this.vars["onComplete"] = this._callbacks["onComplete"];
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

		public get progress():number
		{
			var t:number = <any><any>!isNaN(this.pauseTime)?flash.trannumber(this.pauseTime):flash.trannumber(gs.TweenLite.currentTime);
			var p:number = ((t - this.initTime) * 0.001 - this.delay / this.combinedTimeScale) / this.duration * this.combinedTimeScale;
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

		protected onCompleteDispatcher(...$args)
		{
			if(this._callbacks["onComplete"] != null)
			{
				this._callbacks["onComplete"].apply(null,this.vars["onCompleteParams"]);
			}
			this._dispatcher.dispatchEvent(new gs.events.TweenEvent(gs.events.TweenEvent.COMPLETE_static_gs_events_TweenEvent));
		}

	public once(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number): void{
	}
	}
}

gs.TweenMax.removeTween_static_gs_TweenMax = gs.TweenLite.removeTween;
gs.TweenMax._overwriteMode = <any>!<any>!gs.OverwriteManager.enabled?flash.tranint(gs.OverwriteManager.mode):flash.tranint(gs.OverwriteManager.init());
gs.TweenMax._pausedTweens = new flash.Dictionary(false);
gs.TweenMax.setGlobalTimeScale_static_gs_TweenMax = gs.TweenFilterLite.setGlobalTimeScale;
gs.TweenMax.killTweensOf_static_gs_TweenMax = gs.TweenLite.killTweensOf;
gs.TweenMax.version_static_gs_TweenMax = 3.5;
gs.TweenMax._RAD2DEG = 180 / Math.PI;
gs.TweenMax.killDelayedCallsTo_static_gs_TweenMax = gs.TweenLite.killTweensOf;
flash.extendsClass("gs.TweenMax","gs.TweenFilterLite")
flash.implementsClass("gs.TweenMax",["egret.IEventDispatcher"]);