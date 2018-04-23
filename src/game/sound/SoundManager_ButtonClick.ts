module game {
	export module sound {
		export class SoundManager_ButtonClick extends mx.core.SoundAsset {

			public constructor()
			{
				super();
			}

		}
	}
}

flash.extendsClass("game.sound.SoundManager_ButtonClick","mx.core.SoundAsset")
