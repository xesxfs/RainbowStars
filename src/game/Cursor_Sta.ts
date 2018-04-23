module game {
	export class Cursor_Sta extends mx.core.MovieClipLoaderAsset {
		public static bytes:flash.ByteArray;
		public dataClass:any;

		public constructor()
		{
			super();
			this.dataClass = game.Cursor_Sta_dataClass;
			this.initialWidth = 12800 / 20;
			this.initialHeight = 9600 / 20;
		}

		public get movieClipData():flash.ByteArray
		{
			if(game.Cursor_Sta.bytes == null)
			{
				game.Cursor_Sta.bytes = (<flash.ByteArray>(new this.dataClass()));
			}
			return game.Cursor_Sta.bytes;
		}

	}
}

game.Cursor_Sta.bytes = null;
flash.extendsClass("game.Cursor_Sta","mx.core.MovieClipLoaderAsset")
