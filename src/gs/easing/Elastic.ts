module gs {
	export module easing {
		export class Elastic extends egret.HashObject {
			public static _2PI:number;

			public constructor()
			{
				super();
				super();
			}

			public static easeIn(t:number,b:number,c:number,d:number,a:number = 0,p:number = 0):number
			{
				var s:number = <any>NaN;
				if(t == 0)
				{
					return b;
				}
				if((t = t / d) == 1)
				{
					return b + c;
				}
				if(<any>!p)
				{
					p = d * 0.3;
				}
				if(<any>!a || a < Math.abs(c))
				{
					a = c;
					s = p / 4;
				}
				else
				{
					s = p / gs.easing.Elastic._2PI * Math.asin(c / a);
				}
				return -(a * Math.pow(2,10 * t--) * Math.sin((t * d - s) * gs.easing.Elastic._2PI / p)) + b;
			}

			public static easeInOut(t:number,b:number,c:number,d:number,a:number = 0,p:number = 0):number
			{
				var s:number = <any>NaN;
				if(t == 0)
				{
					return b;
				}
				if((t = t / (d / 2)) == 2)
				{
					return b + c;
				}
				if(<any>!p)
				{
					p = d * (0.3 * 1.5);
				}
				if(<any>!a || a < Math.abs(c))
				{
					a = c;
					s = p / 4;
				}
				else
				{
					s = p / gs.easing.Elastic._2PI * Math.asin(c / a);
				}
				if(t < 1)
				{
					return -0.5 * (a * Math.pow(2,10 * t--) * Math.sin((t * d - s) * gs.easing.Elastic._2PI / p)) + b;
				}
				return a * Math.pow(2,-10 * t--) * Math.sin((t * d - s) * gs.easing.Elastic._2PI / p) * 0.5 + c + b;
			}

			public static easeOut(t:number,b:number,c:number,d:number,a:number = 0,p:number = 0):number
			{
				var s:number = <any>NaN;
				if(t == 0)
				{
					return b;
				}
				if((t = t / d) == 1)
				{
					return b + c;
				}
				if(<any>!p)
				{
					p = d * 0.3;
				}
				if(<any>!a || a < Math.abs(c))
				{
					a = c;
					s = p / 4;
				}
				else
				{
					s = p / gs.easing.Elastic._2PI * Math.asin(c / a);
				}
				return a * Math.pow(2,-10 * t) * Math.sin((t * d - s) * gs.easing.Elastic._2PI / p) + c + b;
			}

		}
	}
}

gs.easing.Elastic._2PI = Math.PI * 2;
