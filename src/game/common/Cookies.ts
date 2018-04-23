module game {
	export module common {
		export class Cookies extends egret.HashObject {
			public static _soData:flash.SharedObject;

			public constructor()
			{
				super();
				super();
			}

			public static addUserScore($name:string,$score:number)
			{
				var o:any = {"n":$name,"s":$score};
				var oExist:any = {};
				game.common.Cookies.playerName = $name;
				game.common.Cookies.playerScore = String($score);
				if(game.common.Cookies._soData.data["leaders"])
				{
					oExist = com.adobe.serialization.json.JSON.decode(game.common.Cookies._soData.data["leaders"]);
				}
				if(<any>!oExist["leaderboard"])
				{
					oExist["leaderboard"] = [];
				}
				oExist["leaderboard"].push(o);
				game.common.Cookies._soData.data["leaders"] = com.adobe.serialization.json.JSON.encode(oExist);
				game.common.Cookies._soData.flush();
			}

			public static set playerScore(value:string)
			{
				game.common.Cookies._soData.data["playerScore"] = value;
				game.common.Cookies._soData.flush();
			}

			public static get playerName():string
			{
				if(game.common.Cookies._soData.data["playerName"])
				{
					return game.common.Cookies._soData.data["playerName"];
				}
				return "Player";
			}

			public static init()
			{
			}

			public static get playerScore():string
			{
				if(game.common.Cookies._soData.data["playerScore"])
				{
					return game.common.Cookies._soData.data["playerScore"];
				}
				return "";
			}

			public static set mute(value:boolean)
			{
				game.common.Cookies._soData.data["mute"] = value;
				game.common.Cookies._soData.flush();
			}

			public static isDoSubmitScore($score:number):boolean
			{
				var rezult:Array<any> = [];
				var arr:Array<any> = [];
				if($score == 0)
				{
					return false;
				}
				if(game.common.Cookies._soData.data["leaders"])
				{
					arr = com.adobe.serialization.json.JSON.decode(game.common.Cookies._soData.data["leaders"]).leaderboard;
					flash.sortOn(arr,"s",flash.AS3Array.NUMERIC);
					arr.reverse();
					return true;
				}
				return true;
			}

			public static set playerName(value:string)
			{
				game.common.Cookies._soData.data["playerName"] = value;
				game.common.Cookies._soData.flush();
			}

			public static get mute():boolean
			{
				if(game.common.Cookies._soData.data["mute"] == true)
				{
					return true;
				}
				return false;
			}

			public static set leaders(value:string)
			{
				game.common.Cookies._soData.data["leaders"] = value;
				game.common.Cookies._soData.flush();
			}

			public static get leaderboard():Array<any>
			{
				var rezult:Array<any> = [];
				if(game.common.Cookies._soData.data["leaders"])
				{
					rezult = com.adobe.serialization.json.JSON.decode(game.common.Cookies._soData.data["leaders"]).leaderboard;
				}
				flash.sortOn(rezult,"s",flash.AS3Array.NUMERIC);
				rezult.reverse();
				return rezult;
			}

		}
	}
}

game.common.Cookies._soData = flash.SharedObject.getLocal("data");
