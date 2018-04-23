module game {
	export module sound {
		export class SoundManager extends egret.HashObject {
			public static StarExplode1:any;
			public static StarExplode2:any;
			public static StarExplode4:any;
			public static STAR_EXPLODE_1:string;
			public static STAR_EXPLODE_2:string;
			public static STAR_EXPLODE_3:string;
			public static STAR_EXPLODE_4:string;
			public static StarExplode3:any;
			public static STAR_EXPLODE_5:string;
			public static StarExplode5:any;
			public static ButtonClick:any;
			public static _isMute:boolean;
			public static BUTTON_CLICK:string;
			public static _dictSounds:flash.Dictionary;

			public constructor()
			{
				super();
				super();
			}

			public static set mute(value:boolean)
			{
				game.sound.SoundManager._isMute = value;
				game.common.Cookies.mute = value;
			}

			public static get mute():boolean
			{
				return game.sound.SoundManager._isMute;
			}

			public static playRandomExplodeSound()
			{
				var index:number = flash.checkInt(1 + Math.random() * 5);
				game.sound.SoundManager.play("StarExplode" + index);
			}

			public static play($soundName:string)
			{
				var snd:flash.Sound = <any>null;
				if(game.sound.SoundManager._isMute)
				{
					return ;
				}
				var cls:any = <any>game.sound.SoundManager[$soundName];
				if(<any>!game.sound.SoundManager["SoundManager_" + $soundName])
				{
					game.sound.SoundManager["SoundManager_" + $soundName] = new cls();
					snd = game.sound.SoundManager["SoundManager_" + $soundName];
					game.sound.SoundManager._dictSounds.setItem("SoundManager_" + $soundName,snd);
				}
				var sc:flash.SoundChannel = new flash.SoundChannel();
				game.sound.SoundManager._dictSounds.getItem("SoundManager_" + $soundName).play();
			}

		}
	}
}

game.sound.SoundManager.StarExplode1 = game.sound.SoundManager_StarExplode1;
game.sound.SoundManager.StarExplode2 = game.sound.SoundManager_StarExplode2;
game.sound.SoundManager.StarExplode4 = game.sound.SoundManager_StarExplode4;
game.sound.SoundManager.STAR_EXPLODE_1 = "StarExplode1";
game.sound.SoundManager.STAR_EXPLODE_2 = "StarExplode2";
game.sound.SoundManager.STAR_EXPLODE_3 = "StarExplode3";
game.sound.SoundManager.STAR_EXPLODE_4 = "StarExplode4";
game.sound.SoundManager.StarExplode3 = game.sound.SoundManager_StarExplode3;
game.sound.SoundManager.STAR_EXPLODE_5 = "StarExplode5";
game.sound.SoundManager.StarExplode5 = game.sound.SoundManager_StarExplode5;
game.sound.SoundManager.ButtonClick = game.sound.SoundManager_ButtonClick;
game.sound.SoundManager._isMute = false;
game.sound.SoundManager.BUTTON_CLICK = "ButtonClick";
game.sound.SoundManager._dictSounds = new flash.Dictionary();
