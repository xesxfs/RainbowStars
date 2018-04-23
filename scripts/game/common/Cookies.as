package game.common
{
   import flash.net.SharedObject;
   
   public class Cookies
   {
      
      private static var _soData:SharedObject = SharedObject.getLocal("data");
       
      
      public function Cookies()
      {
         super();
      }
      
      public static function addUserScore($name:String, $score:Number) : void
      {
         var o:Object = {
            "n":$name,
            "s":$score
         };
         var oExist:Object = {};
         playerName = $name;
         playerScore = String($score);
         if(_soData.data.leaders)
         {
            oExist = com.adobe.serialization.json.JSON.decode(_soData.data.leaders);
         }
         if(!oExist.leaderboard)
         {
            oExist.leaderboard = [];
         }
         oExist.leaderboard.push(o);
         _soData.data.leaders = com.adobe.serialization.json.JSON.encode(oExist);
         _soData.flush();
      }
      
      public static function set playerScore(value:String) : void
      {
         _soData.data.playerScore = value;
         _soData.flush();
      }
      
      public static function get playerName() : String
      {
         if(_soData.data.playerName)
         {
            return _soData.data.playerName;
         }
         return "Player";
      }
      
      public static function init() : void
      {
      }
      
      public static function get playerScore() : String
      {
         if(_soData.data.playerScore)
         {
            return _soData.data.playerScore;
         }
         return "";
      }
      
      public static function set mute(value:Boolean) : void
      {
         _soData.data.mute = value;
         _soData.flush();
      }
      
      public static function isDoSubmitScore($score:Number) : Boolean
      {
         var rezult:Array = [];
         var arr:Array = [];
         if($score == 0)
         {
            return false;
         }
         if(_soData.data.leaders)
         {
            arr = com.adobe.serialization.json.JSON.decode(_soData.data.leaders).leaderboard;
            arr.sortOn("s",Array.NUMERIC);
            arr.reverse();
            return true;
         }
         return true;
      }
      
      public static function set playerName(value:String) : void
      {
         _soData.data.playerName = value;
         _soData.flush();
      }
      
      public static function get mute() : Boolean
      {
         if(_soData.data.mute == true)
         {
            return true;
         }
         return false;
      }
      
      public static function set leaders(value:String) : void
      {
         _soData.data.leaders = value;
         _soData.flush();
      }
      
      public static function get leaderboard() : Array
      {
         var rezult:Array = [];
         if(_soData.data.leaders)
         {
            rezult = com.adobe.serialization.json.JSON.decode(_soData.data.leaders).leaderboard;
         }
         rezult.sortOn("s",Array.NUMERIC);
         rezult.reverse();
         return rezult;
      }
   }
}
