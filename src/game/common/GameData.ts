module game {
	export module common {
		export class GameData extends egret.HashObject {
			public static GOAL_BALLS:Array<any>;
			public static TOTAL_BALLS:Array<any>;

			public constructor()
			{
				super();
				super();
			}

		}
	}
}

game.common.GameData.GOAL_BALLS = [3,7,12,18,23,30,37,45,53,64];
game.common.GameData.TOTAL_BALLS = [20,25,30,35,40,45,50,55,60,70];
