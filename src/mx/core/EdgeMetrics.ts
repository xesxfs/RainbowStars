module mx {
	export module core {
		export class EdgeMetrics extends egret.HashObject {
			public static VERSION:string;
			public static EMPTY:mx.core.EdgeMetrics;
			public top:number = NaN;
			public left:number = NaN;
			public bottom:number = NaN;
			public right:number = NaN;

			public constructor(left:number = 0,top:number = 0,right:number = 0,bottom:number = 0)
			{
				super();
				super();
				this.left = left;
				this.top = top;
				this.right = right;
				this.bottom = bottom;
			}

			public clone():mx.core.EdgeMetrics
			{
				return new mx.core.EdgeMetrics(this.left,this.top,this.right,this.bottom);
			}

		}
	}
}

mx.core.EdgeMetrics.VERSION = "3.4.0.9271";
mx.core.EdgeMetrics.EMPTY = new mx.core.EdgeMetrics(0,0,0,0);
