package game.sound
{
   import flash.media.Sound;
   import flash.media.SoundChannel;
   import flash.utils.Dictionary;
   import game.common.Cookies;
   
   public dynamic class SoundManager
   {
      
      private static var StarExplode1:Class = SoundManager_StarExplode1;
      
      private static var StarExplode2:Class = SoundManager_StarExplode2;
      
      private static var StarExplode4:Class = SoundManager_StarExplode4;
      
      public static const STAR_EXPLODE_1:String = "StarExplode1";
      
      public static const STAR_EXPLODE_2:String = "StarExplode2";
      
      public static const STAR_EXPLODE_3:String = "StarExplode3";
      
      public static const STAR_EXPLODE_4:String = "StarExplode4";
      
      private static var StarExplode3:Class = SoundManager_StarExplode3;
      
      public static const STAR_EXPLODE_5:String = "StarExplode5";
      
      private static var StarExplode5:Class = SoundManager_StarExplode5;
      
      private static var ButtonClick:Class = SoundManager_ButtonClick;
      
      private static var _isMute:Boolean = false;
      
      public static const BUTTON_CLICK:String = "ButtonClick";
      
      private static var _dictSounds:Dictionary = new Dictionary();
       
      
      public function SoundManager()
      {
         super();
      }
      
      public static function set mute(value:Boolean) : void
      {
         _isMute = value;
         Cookies.mute = value;
      }
      
      public static function get mute() : Boolean
      {
         return _isMute;
      }
      
      public static function playRandomExplodeSound() : void
      {
         var index:int = 1 + Math.random() * 5;
         play("StarExplode" + index);
      }
      
      public static function play($soundName:String) : void
      {
         var snd:Sound = null;
         if(_isMute)
         {
            return;
         }
         var cls:Class = SoundManager[$soundName] as Class;
         if(!SoundManager["SoundManager_" + $soundName])
         {
            SoundManager["SoundManager_" + $soundName] = new cls();
            snd = SoundManager["SoundManager_" + $soundName];
            _dictSounds["SoundManager_" + $soundName] = snd;
         }
         var sc:SoundChannel = new SoundChannel();
         _dictSounds["SoundManager_" + $soundName].play();
      }
   }
}
