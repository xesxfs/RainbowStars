module gs {
	export module easing {
		export class Quad extends egret.HashObject {

			public constructor()
			{
				super();
				super();
			}

			public static easeOut(t:number,b:number,c:number,d:number):number
			{
				return -c * (t = t / d) * (t - 2) + b;
			}

			public static easeIn(t:number,b:number,c:number,d:number):number
			{
				return c * (t = t / d) * t + b;
			}

			public static easeInOut(t:number,b:number,c:number,d:number):number
			{
				if((t = t / (d / 2)) < 1)
				{
					return c / 2 * t * t + b;
				}
				return -c / 2 * (--t * (t - 2) - 1) + b;
			}

		}
	}
}

