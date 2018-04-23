module mx {
	export module core {
		export class MovieClipAsset extends mx.core.FlexMovieClip implements mx.core.IFlexAsset,mx.core.IFlexDisplayObject,mx.core.IBorder {
			public static VERSION_static_mx_core_MovieClipAsset:string;
			private _measuredHeight:number = NaN;
			private _measuredWidth:number = NaN;

			public constructor()
			{
				super();
				this._measuredWidth = this.width;
				this._measuredHeight = this.height;
			}

			public get measuredWidth():number
			{
				return this._measuredWidth;
			}

			public get measuredHeight():number
			{
				return this._measuredHeight;
			}

			public setActualSize(newWidth:number,newHeight:number)
			{
				this.width = newWidth;
				this.height = newHeight;
			}

			public move(x:number,y:number)
			{
				this.x = x;
				this.y = y;
			}

			public get borderMetrics():mx.core.EdgeMetrics
			{
				if(this["scale9Grid"] == null)
				{
					return mx.core.EdgeMetrics.EMPTY;
				}
				return new mx.core.EdgeMetrics(this["scale9Grid"].left,this["scale9Grid"].top,Math.ceil(this.measuredWidth - this["scale9Grid"].right),Math.ceil(this.measuredHeight - this["scale9Grid"].bottom));
			}

		}
	}
}

mx.core.MovieClipAsset.VERSION_static_mx_core_MovieClipAsset = "3.4.0.9271";
flash.extendsClass("mx.core.MovieClipAsset","mx.core.FlexMovieClip")
flash.implementsClass("mx.core.MovieClipAsset",["mx.core.IFlexAsset","mx.core.IFlexDisplayObject","mx.core.IBorder"]);