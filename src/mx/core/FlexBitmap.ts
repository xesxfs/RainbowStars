module mx {
	export module core {
		export class FlexBitmap extends flash.Bitmap {
			public static VERSION:string;

			public constructor(bitmapData:flash.BitmapData = null,pixelSnapping:string = "auto",smoothing:boolean = false)
			{
				super(bitmapData,pixelSnapping,smoothing);
				try 
				{
					this.name = mx.utils.NameUtil.createUniqueName(this);
				}
				catch(e)
				{}
			}

			public toString():string
			{
				return mx.utils.NameUtil.displayObjectToString(this);
			}

		}
	}
}

mx.core.FlexBitmap.VERSION = "3.4.0.9271";
flash.extendsClass("mx.core.FlexBitmap","flash.Bitmap")
