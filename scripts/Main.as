package
{
   import flash.display.Sprite;
   import flash.display.Stage;
   import flash.events.Event;
   import flash.system.Security;
   import game.Game;
   
   public class Main extends Sprite
   {
      
      public static var MOCHI_BOT_ID:String = "905bbfbf";
      
      public static var MOCHI_ID:String = "af37b7db51f3cc0a";
      
      public static var MOCHI_LEADERBOARD_ID:String = "4932d4cce294441e";
      
      public static var STAGE:Stage;
       
      
      public function Main()
      {
         super();
         if(stage)
         {
            STAGE = stage;
            this.init();
         }
         else
         {
            addEventListener(Event.ADDED_TO_STAGE,this.init);
         }
      }
      
      private function init(e:Event = null) : void
      {
         removeEventListener(Event.ADDED_TO_STAGE,this.init);
         Security.allowDomain("*");
         addChild(new Game());
      }
   }
}
