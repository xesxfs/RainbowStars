module gs {
	export class TweenFilterLite extends gs.TweenLite {
		public static removeTween_static_gs_TweenFilterLite:Function;
		public static _idMatrix:Array<any>;
		public static _lumB:number;
		public static delayedCall_static_gs_TweenFilterLite:Function;
		public static killTweensOf_static_gs_TweenFilterLite:Function;
		public static version_static_gs_TweenFilterLite:number;
		public static _lumG:number;
		public static killDelayedCallsTo_static_gs_TweenFilterLite:Function;
		public static _lumR:number;
		public static _globalTimeScale:number;
		protected _matrix:Array<any>;
		protected _hf:boolean = false;
		protected _roundProps:boolean = false;
		protected _cmf:flash.ColorMatrixFilter;
		protected _filters:Array<any>;
		protected _endMatrix:Array<any>;
		protected _timeScale:number = NaN;
		protected _clrsa:Array<any>;

		public constructor($target:any,$duration:number,$vars:any)
		{
			super($target,$duration,$vars);
			this._filters = [];
			if(this.combinedTimeScale != 1 && flash.As3is(this.target,gs.TweenFilterLite))
			{
				this._timeScale = 1;
				this.combinedTimeScale = gs.TweenFilterLite._globalTimeScale;
			}
			else
			{
				this._timeScale = this.combinedTimeScale;
				this.combinedTimeScale = this.combinedTimeScale * gs.TweenFilterLite._globalTimeScale;
			}
			if(this.combinedTimeScale != 1 && this.delay != 0)
			{
				this.startTime = this.initTime + this.delay * (1000 / this.combinedTimeScale);
			}
			if(gs.TweenLite.version < 9.29)
			{
				console.log("TweenFilterLite error! Please update your TweenLite class or try deleting your ASO files. TweenFilterLite requires a more recent version. Download updates at http://www.TweenLite.com.");
			}
		}

		public static setHue($m:Array<any>,$n:number):Array<any>
		{
			if(isNaN($n))
			{
				return $m;
			}
			$n = $n * (Math.PI / 180);
			var c:number = Math.cos($n);
			var s:number = Math.sin($n);
			var temp:Array<any> = [gs.TweenFilterLite._lumR + c * (1 - gs.TweenFilterLite._lumR) + s * -gs.TweenFilterLite._lumR,gs.TweenFilterLite._lumG + c * -gs.TweenFilterLite._lumG + s * -gs.TweenFilterLite._lumG,gs.TweenFilterLite._lumB + c * -gs.TweenFilterLite._lumB + s * (1 - gs.TweenFilterLite._lumB),0,0,gs.TweenFilterLite._lumR + c * -gs.TweenFilterLite._lumR + s * 0.143,gs.TweenFilterLite._lumG + c * (1 - gs.TweenFilterLite._lumG) + s * 0.14,gs.TweenFilterLite._lumB + c * -gs.TweenFilterLite._lumB + s * -0.283,0,0,gs.TweenFilterLite._lumR + c * -gs.TweenFilterLite._lumR + s * -(1 - gs.TweenFilterLite._lumR),gs.TweenFilterLite._lumG + c * -gs.TweenFilterLite._lumG + s * gs.TweenFilterLite._lumG,gs.TweenFilterLite._lumB + c * (1 - gs.TweenFilterLite._lumB) + s * gs.TweenFilterLite._lumB,0,0,0,0,0,1,0,0,0,0,0,1];
			return gs.TweenFilterLite.applyMatrix(temp,$m);
		}

		public static setContrast($m:Array<any>,$n:number):Array<any>
		{
			if(isNaN($n))
			{
				return $m;
			}
			$n = $n + 0.01;
			var temp:Array<any> = [$n,0,0,0,128 * (1 - $n),0,$n,0,0,128 * (1 - $n),0,0,$n,0,128 * (1 - $n),0,0,0,1,0];
			return gs.TweenFilterLite.applyMatrix(temp,$m);
		}

		public static applyMatrix($m:Array<any>,$m2:Array<any>):Array<any>
		{
			var y:number = flash.checkInt(0);
			var x:number = flash.checkInt(0);
			if(<any>!(flash.As3is($m,Array)) || <any>!(flash.As3is($m2,Array)))
			{
				return $m2;
			}
			var temp:Array<any> = [];
			var i:number = flash.checkInt(0);
			var z:number = flash.checkInt(0);
			for(y = flash.checkInt(0); y < 4; y++)
			{
				for(x = flash.checkInt(0); x < 5; x++)
				{
					if(x == 4)
					{
						z = flash.checkInt($m[i + 4]);
					}
					else
					{
						z = flash.checkInt(0);
					}
					temp[i + x] = $m[i] * $m2[x] + $m[i + 1] * $m2[x + 5] + $m[i + 2] * $m2[x + 10] + $m[i + 3] * $m2[x + 15] + z;
				}
				i = flash.checkInt(i + 5);
			}
			return temp;
		}

		public static colorize($m:Array<any>,$color:number,$amount:number = 1):Array<any>
		{
			if(isNaN($color))
			{
				return $m;
			}
			if(isNaN($amount))
			{
				$amount = 1;
			}
			var r:number = ($color >> 16 & 255) / 255;
			var g:number = ($color >> 8 & 255) / 255;
			var b:number = ($color & 255) / 255;
			var inv:number = 1 - $amount;
			var temp:Array<any> = [inv + $amount * r * gs.TweenFilterLite._lumR,$amount * r * gs.TweenFilterLite._lumG,$amount * r * gs.TweenFilterLite._lumB,0,0,$amount * g * gs.TweenFilterLite._lumR,inv + $amount * g * gs.TweenFilterLite._lumG,$amount * g * gs.TweenFilterLite._lumB,0,0,$amount * b * gs.TweenFilterLite._lumR,$amount * b * gs.TweenFilterLite._lumG,inv + $amount * b * gs.TweenFilterLite._lumB,0,0,0,0,0,1,0];
			return gs.TweenFilterLite.applyMatrix(temp,$m);
		}

		public static setBrightness($m:Array<any>,$n:number):Array<any>
		{
			if(isNaN($n))
			{
				return $m;
			}
			$n = $n * 100 - 100;
			return gs.TweenFilterLite.applyMatrix([1,0,0,0,$n,0,1,0,0,$n,0,0,1,0,$n,0,0,0,1,0,0,0,0,0,1],$m);
		}

		public static setSaturation($m:Array<any>,$n:number):Array<any>
		{
			if(isNaN($n))
			{
				return $m;
			}
			var inv:number = 1 - $n;
			var r:number = inv * gs.TweenFilterLite._lumR;
			var g:number = inv * gs.TweenFilterLite._lumG;
			var b:number = inv * gs.TweenFilterLite._lumB;
			var temp:Array<any> = [r + $n,g,b,0,0,r,g + $n,b,0,0,r,g,b + $n,0,0,0,0,0,1,0];
			return gs.TweenFilterLite.applyMatrix(temp,$m);
		}

		public static setGlobalTimeScale($scale:number)
		{
			var i:number = flash.checkInt(0);
			var a:Array<any> = <any>null;
			if($scale < 0.00001)
			{
				$scale = 0.00001;
			}
			var ml:flash.Dictionary = gs.TweenLite.masterList;
			gs.TweenFilterLite._globalTimeScale = $scale;
			var a_key_a;
			for(a_key_a in ml.map)
			{
				a = ml.map[a_key_a][1];
				for(i = flash.checkInt(a.length - 1); i > -1; i--)
				{
					if(flash.As3is(a[i],gs.TweenFilterLite))
					{
						a[i].timeScale = a[i].timeScale * 1;
					}
				}
			}
		}

		public static get globalTimeScale():number
		{
			return gs.TweenFilterLite._globalTimeScale;
		}

		public static from_static_gs_TweenFilterLite($target:any,$duration:number,$vars:any):gs.TweenFilterLite
		{
			$vars["runBackwards"] = true;
			return new gs.TweenFilterLite($target,$duration,$vars);
		}

		public static set globalTimeScale($n:number)
		{
			gs.TweenFilterLite.setGlobalTimeScale($n);
		}

		public static HEXtoRGB($n:number):any
		{
			return {"rb":$n >> 16,"gb":$n >> 8 & 255,"bb":$n & 255};
		}

		public static setThreshold($m:Array<any>,$n:number):Array<any>
		{
			if(isNaN($n))
			{
				return $m;
			}
			var temp:Array<any> = [gs.TweenFilterLite._lumR * 256,gs.TweenFilterLite._lumG * 256,gs.TweenFilterLite._lumB * 256,0,-256 * $n,gs.TweenFilterLite._lumR * 256,gs.TweenFilterLite._lumG * 256,gs.TweenFilterLite._lumB * 256,0,-256 * $n,gs.TweenFilterLite._lumR * 256,gs.TweenFilterLite._lumG * 256,gs.TweenFilterLite._lumB * 256,0,-256 * $n,0,0,0,1,0];
			return gs.TweenFilterLite.applyMatrix(temp,$m);
		}

		public static to_static_gs_TweenFilterLite($target:any,$duration:number,$vars:any):gs.TweenFilterLite
		{
			return new gs.TweenFilterLite($target,$duration,$vars);
		}

		public killVars($vars:any)
		{
			if(gs.TweenLite.overwriteManager["enabled"])
			{
				gs.TweenLite.overwriteManager["killVars"]($vars,this.vars,this.tweens,this._subTweens,this._filters || []);
			}
		}

		public initTweenVals($hrp:boolean = false,$reservedProps:string = "")
		{
			var i:number = flash.checkInt(0);
			var fv:any = <any>null;
			var cmf:any = <any>null;
			var tp:any = <any>null;
			var j:number = flash.checkInt(0);
			var prop:string = <any>null;
			if(<any>!$hrp && gs.TweenLite.overwriteManager["enabled"])
			{
				gs.TweenLite.overwriteManager["manageOverwrites"](this,gs.TweenLite.masterList.getItem(this.target));
			}
			this._clrsa = [];
			this._filters = [];
			this._matrix = gs.TweenFilterLite._idMatrix.slice();
			$reservedProps = $reservedProps + " blurFilter glowFilter colorMatrixFilter dropShadowFilter bevelFilter roundProps ";
			this._roundProps = flash.Boolean(flash.As3is(this.vars["roundProps"],Array));
			if(this._isDisplayObject)
			{
				if(this.vars["blurFilter"] != null)
				{
					fv = this.vars["blurFilter"];
					this.addFilter("blurFilter",fv,flash.BlurFilter,["blurX","blurY","quality"],new flash.BlurFilter(0,0,flash.tranint(fv["quality"]) || 2));
				}
				if(this.vars["glowFilter"] != null)
				{
					fv = this.vars["glowFilter"];
					this.addFilter("glowFilter",fv,flash.GlowFilter,["alpha","blurX","blurY","color","quality","strength","inner","knockout"],new flash.GlowFilter(16777215,0,0,0,flash.trannumber(fv["strength"]) || flash.trannumber(1),flash.tranint(fv["quality"]) || 2,fv["inner"],fv["knockout"]));
				}
				if(this.vars["colorMatrixFilter"] != null)
				{
					fv = this.vars["colorMatrixFilter"];
					cmf = this.addFilter("colorMatrixFilter",fv,flash.ColorMatrixFilter,[],new flash.ColorMatrixFilter(this._matrix));
					this._cmf = cmf["filter"];
					this._matrix = (<flash.ColorMatrixFilter>(this._cmf)).matrix;
					if(fv["matrix"] != null && flash.As3is(fv["matrix"],Array))
					{
						this._endMatrix = fv["matrix"];
					}
					else
					{
						if(fv["relative"] == true)
						{
							this._endMatrix = this._matrix.slice();
						}
						else
						{
							this._endMatrix = gs.TweenFilterLite._idMatrix.slice();
						}
						this._endMatrix = gs.TweenFilterLite.setBrightness(this._endMatrix,fv["brightness"]);
						this._endMatrix = gs.TweenFilterLite.setContrast(this._endMatrix,fv["contrast"]);
						this._endMatrix = gs.TweenFilterLite.setHue(this._endMatrix,fv["hue"]);
						this._endMatrix = gs.TweenFilterLite.setSaturation(this._endMatrix,fv["saturation"]);
						this._endMatrix = gs.TweenFilterLite.setThreshold(this._endMatrix,fv["threshold"]);
						if(<any>!isNaN(fv["colorize"]))
						{
							this._endMatrix = gs.TweenFilterLite.colorize(this._endMatrix,fv["colorize"],fv["amount"]);
						}
						else if(<any>!isNaN(fv["color"]))
						{
							this._endMatrix = gs.TweenFilterLite.colorize(this._endMatrix,fv["color"],fv["amount"]);
						}
					}
					for(i = flash.checkInt(0); i < this._endMatrix.length; i++)
					{
						if(this._matrix[i] != this._endMatrix[i] && this._matrix[i] != undefined)
						{
							this.tweens[this.tweens.length] = [this._matrix,i.toString(),this._matrix[i],this._endMatrix[i] - this._matrix[i],"colorMatrixFilter"];
						}
					}
				}
				if(this.vars["dropShadowFilter"] != null)
				{
					fv = this.vars["dropShadowFilter"];
					this.addFilter("dropShadowFilter",fv,flash.DropShadowFilter,["alpha","angle","blurX","blurY","color","distance","quality","strength","inner","knockout","hideObject"],new flash.DropShadowFilter(0,45,0,0,0,0,1,flash.tranint(fv["quality"]) || 2,fv["inner"],fv["knockout"],fv["hideObject"]));
				}
				if(this.vars["bevelFilter"] != null)
				{
					fv = this.vars["bevelFilter"];
					this.addFilter("bevelFilter",fv,flash.BevelFilter,["angle","blurX","blurY","distance","highlightAlpha","highlightColor","quality","shadowAlpha","shadowColor","strength"],new flash.BevelFilter(0,0,16777215,0.5,0,0.5,2,2,0,flash.tranint(fv["quality"]) || 2));
				}
				if(this.vars["runBackwards"] == true)
				{
					for(i = flash.checkInt(this._clrsa.length - 1); i > -1; i--)
					{
						tp = this._clrsa[i];
						tp["sr"] = tp["sr"] + tp["cr"];
						tp["cr"] = tp["cr"] * -1;
						tp["sg"] = tp["sg"] + tp["cg"];
						tp["cg"] = tp["cg"] * -1;
						tp["sb"] = tp["sb"] + tp["cb"];
						tp["cb"] = tp["cb"] * -1;
						tp["f"][tp["p"]] = tp["sr"] << 16 | tp["sg"] << 8 | tp["sb"];
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
				for(i = flash.checkInt(this.vars["roundProps"].length - 1); i > -1; i--)
				{
					prop = this.vars["roundProps"][i];
					for(j = flash.checkInt(this.tweens.length - 1); j > -1; j--)
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

		public set enabled($b:boolean)
		{
			egret.superSetter(gs.TweenFilterLite,this,"enabled",$b);
			if($b)
			{
				this.combinedTimeScale = this._timeScale * gs.TweenFilterLite._globalTimeScale;
			}
		}

		public get enabled():boolean{
			return egret.superGetter(gs.TweenFilterLite,this, "enabled");
		}
	
 		public set timeScale($n:number)
		{
			if($n < 0.00001)
			{
				$n = this._timeScale = 0.00001;
			}
			else
			{
				this._timeScale = $n;
				$n = $n * gs.TweenFilterLite._globalTimeScale;
			}
			this.initTime = gs.TweenLite.currentTime - (gs.TweenLite.currentTime - this.initTime - this.delay * (1000 / this.combinedTimeScale)) * this.combinedTimeScale * (1 / $n) - this.delay * (1000 / $n);
			if(this.startTime != 999999999999999)
			{
				this.startTime = this.initTime + this.delay * (1000 / $n);
			}
			this.combinedTimeScale = $n;
		}

		public get timeScale():number
		{
			return this._timeScale;
		}

		public render($t:number)
		{
			$t = flash.checkUint($t);
			var factor:number = <any>NaN;
			var tp:any = <any>null;
			var i:number = flash.checkInt(0);
			var val:number = <any>NaN;
			var neg:number = flash.checkInt(0);
			var f:Array<any> = <any>null;
			var j:number = flash.checkInt(0);
			var time:number = ($t - this.startTime) * 0.001 * this.combinedTimeScale;
			if(time >= this.duration)
			{
				time = this.duration;
				factor = this.ease == this.vars["ease"] || this.duration == 0.001?flash.trannumber(1):flash.trannumber(0);
			}
			else
			{
				factor = this.ease(time,0,1,this.duration);
			}
			if(<any>!this._roundProps)
			{
				for(i = flash.checkInt(this.tweens.length - 1); i > -1; i--)
				{
					tp = this.tweens[i];
					tp[0][tp[1]] = tp[2] + factor * tp[3];
				}
			}
			else
			{
				for(i = flash.checkInt(this.tweens.length - 1); i > -1; i--)
				{
					tp = this.tweens[i];
					if(tp[5])
					{
						val = tp[2] + factor * tp[3];
						neg = flash.checkInt(val < 0?-1:1);
						tp[0][tp[1]] = val % 1 * neg > 0.5?flash.tranint(val) + neg:flash.tranint(val);
					}
					else
					{
						tp[0][tp[1]] = tp[2] + factor * tp[3];
					}
				}
			}
			if(this._hf)
			{
				for(i = flash.checkInt(this._clrsa.length - 1); i > -1; i--)
				{
					tp = this._clrsa[i];
					tp["f"][tp["p"]] = tp["sr"] + factor * tp["cr"] << 16 | tp["sg"] + factor * tp["cg"] << 8 | tp["sb"] + factor * tp["cb"];
				}
				if(this._cmf != null)
				{
					(<flash.ColorMatrixFilter>(this._cmf)).matrix = this._matrix;
				}
				f = this.target["filters"];
				for(i = flash.checkInt(0); i < this._filters.length; i++)
				{
					for(j = flash.checkInt(f.length - 1); j > -1; j--)
					{
						if(flash.As3is(f[j],null,"this._filters[i].type"))
						{
							f.splice(j,1,this._filters[i].filter);
							break;
						}
					}
				}
				this.target["filters"] = f;
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

		private addFilter($name:string,$fv:any,$filterType:any,$props:Array<any>,$defaultFilter:flash.BitmapFilter):any
		{
			var i:number = flash.checkInt(0);
			var prop:string = <any>null;
			var valChange:number = <any>NaN;
			var begin:any = <any>null;
			var end:any = <any>null;
			var f:any = {"type":$filterType,"name":$name};
			var fltrs:Array<any> = <any>this.target["filters"];
			for(i = flash.checkInt(0); i < fltrs.length; i++)
			{
				if(flash.As3is(fltrs[i],null,"$filterType"))
				{
					f["filter"] = fltrs[i];
					break;
				}
			}
			if(f["filter"] == undefined)
			{
				f["filter"] = $defaultFilter;
				fltrs[fltrs.length] = f["filter"];
				this.target["filters"] = fltrs;
			}
			for(i = flash.checkInt(0); i < $props.length; i++)
			{
				prop = $props[i];
				if($fv[prop] != undefined)
				{
					if(prop == "color" || prop == "highlightColor" || prop == "shadowColor")
					{
						begin = gs.TweenFilterLite.HEXtoRGB(f["filter"][prop]);
						end = gs.TweenFilterLite.HEXtoRGB($fv[prop]);
						this._clrsa[this._clrsa.length] = {"f":f["filter"],"p":prop,"sr":begin["rb"],"cr":end["rb"] - begin["rb"],"sg":begin["gb"],"cg":end["gb"] - begin["gb"],"sb":begin["bb"],"cb":end["bb"] - begin["bb"]};
					}
					else if(prop == "quality" || prop == "inner" || prop == "knockout" || prop == "hideObject")
					{
						f["filter"][prop] = $fv[prop];
					}
					else
					{
						if(typeof $fv[prop] == "number")
						{
							valChange = $fv[prop] - f["filter"][prop];
						}
						else
						{
							valChange = flash.trannumber($fv[prop]);
						}
						this.tweens[this.tweens.length] = [f["filter"],prop,f["filter"][prop],valChange,$name];
					}
				}
			}
			this._filters[this._filters.length] = f;
			this._hf = true;
			return f;
		}

	}
}

gs.TweenFilterLite.removeTween_static_gs_TweenFilterLite = gs.TweenLite.removeTween;
gs.TweenFilterLite._idMatrix = [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0];
gs.TweenFilterLite._lumB = 0.072169;
gs.TweenFilterLite.delayedCall_static_gs_TweenFilterLite = gs.TweenLite.delayedCall;
gs.TweenFilterLite.killTweensOf_static_gs_TweenFilterLite = gs.TweenLite.killTweensOf;
gs.TweenFilterLite.version_static_gs_TweenFilterLite = 9.29;
gs.TweenFilterLite._lumG = 0.71516;
gs.TweenFilterLite.killDelayedCallsTo_static_gs_TweenFilterLite = gs.TweenLite.killTweensOf;
gs.TweenFilterLite._lumR = 0.212671;
gs.TweenFilterLite._globalTimeScale = 1;
flash.extendsClass("gs.TweenFilterLite","gs.TweenLite")
