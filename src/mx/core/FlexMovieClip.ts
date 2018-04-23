module mx {
	export module core {
		export class FlexMovieClip extends egret.SwfMovie {
			public static VERSION:string;

			public constructor()
			{
				super();
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

mx.core.FlexMovieClip.VERSION = "3.4.0.9271";
flash.extendsClass("mx.core.FlexMovieClip","egret.SwfMovie")
