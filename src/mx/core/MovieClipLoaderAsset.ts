module mx {
	export module core {
		export class MovieClipLoaderAsset extends mx.core.MovieClipAsset implements mx.core.IFlexAsset,mx.core.IFlexDisplayObject {
			public static VERSION_static_mx_core_MovieClipLoaderAsset:string;
			protected initialHeight:number = 0;
			private loader:flash.Loader = null;
			private initialized:boolean = false;
			protected initialWidth:number = 0;
			private requestedHeight:number = NaN;
			private requestedWidth:number = NaN;

			public constructor()
			{
				super();				var _self__:any = this;

				var loaderContext:flash.LoaderContext = new flash.LoaderContext();
				loaderContext.applicationDomain = new flash.ApplicationDomain(flash.ApplicationDomain.currentDomain);
				if("allowLoadBytesCodeExecution" in loaderContext)
				{
					loaderContext["allowLoadBytesCodeExecution"] = true;
				}
				this.loader = new flash.Loader();
				this.loader.contentLoaderInfo.addEventListener(egret.Event.COMPLETE,flash.bind(this.completeHandler,this),null);
				this.loader["loadBytes"](this.movieClipData,loaderContext);
				_self__.addChild(this.loader);
			}

			public get width():number
			{
				if(<any>!this.initialized)
				{
					return this.initialWidth;
				}
				return egret.superGetter(mx.core.MovieClipLoaderAsset,this,"width");
			}

			public set width(value:number)
			{
				if(<any>!this.initialized)
				{
					this.requestedWidth = value;
				}
				else
				{
					this.loader.width = value;
				}
			}

			public get measuredHeight():number
			{
				return this.initialHeight;
			}

			private completeHandler(event:egret.Event)
			{
				var _self__:any = this;
				this.initialized = true;
				this.initialWidth = this.loader.width;
				this.initialHeight = this.loader.height;
				if(<any>!isNaN(this.requestedWidth))
				{
					this.loader.width = this.requestedWidth;
				}
				if(<any>!isNaN(this.requestedHeight))
				{
					this.loader.height = this.requestedHeight;
				}
				_self__.dispatchEvent(event);
			}

			public set height(value:number)
			{
				if(<any>!this.initialized)
				{
					this.requestedHeight = value;
				}
				else
				{
					this.loader.height = value;
				}
			}

			public get measuredWidth():number
			{
				return this.initialWidth;
			}

			public get height():number
			{
				if(<any>!this.initialized)
				{
					return this.initialHeight;
				}
				return egret.superGetter(mx.core.MovieClipLoaderAsset,this,"height");
			}

			public get movieClipData():flash.ByteArray
			{
				return null;
			}

		}
	}
}

mx.core.MovieClipLoaderAsset.VERSION_static_mx_core_MovieClipLoaderAsset = "3.4.0.9271";
flash.extendsClass("mx.core.MovieClipLoaderAsset","mx.core.MovieClipAsset")
flash.implementsClass("mx.core.MovieClipLoaderAsset",["mx.core.IFlexAsset","mx.core.IFlexDisplayObject"]);