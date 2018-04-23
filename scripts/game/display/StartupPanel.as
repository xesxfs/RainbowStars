package game.display
{
   import flash.display.DisplayObject;
   import flash.display.SimpleButton;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.net.URLRequest;
   import flash.net.navigateToURL;
   import game.common.Cookies;
   import game.display.effects.Waterfall;
   import game.sound.SoundManager;
   
   public class StartupPanel extends Sprite
   {
      
      public static const HIGHSCORES:String = "highscores";
      
      public static const PLAY:String = "play";
      
      public static const INSTRUCTIONS:String = "instructions";
       
      
      private var highscores:Highscores;
      
      private var btnSoundOn:SimpleButton;
      
      private var btnSoundOff:SimpleButton;
      
      private var btnCredits:SimpleButton;
      
      private var btnHighScores:SimpleButton;
      
      private var btnInstructions:SimpleButton;
      
      private var btnPlayMoreGames:SimpleButton;
      
      private var _mcCredits:DisplayObject;
      
      private var btnPlay:SimpleButton;
      
      private var _mcStartScreen:mcStartScreen;
      
      public function StartupPanel()
      {
         this._mcStartScreen = new mcStartScreen();
         super();
         addChild(this._mcStartScreen);
         this.fillContent();
         var waterFall:Waterfall = new Waterfall();
         addChildAt(waterFall,0);
         this.mute(Cookies.mute);
      }
      
      private function closeModalScreens(e:Event) : void
      {
         if(this._mcCredits)
         {
            removeChild(this._mcCredits);
            this._mcCredits = null;
         }
         if(this.highscores)
         {
            removeChild(this.highscores);
            this.highscores = null;
         }
      }
      
      private function mute($isMute:Boolean) : void
      {
         SoundManager.mute = $isMute;
         this.btnSoundOn.visible = !$isMute;
         this.btnSoundOff.visible = $isMute;
      }
      
      private function navigateToGlowingEye(e:MouseEvent) : void
      {
         navigateToURL(new URLRequest("http://www.glowingeyegames.com"));
      }
      
      private function navigateToMFNW(e:Event) : void
      {
         navigateToURL(new URLRequest("http://www.makeflashnotwar.com"));
      }
      
      private function fillContent() : void
      {
         for(var i:int = 0; i < this._mcStartScreen.numChildren; i++)
         {
            if(this._mcStartScreen.getChildAt(i) is SimpleButton)
            {
               this[this._mcStartScreen.getChildAt(i).name] = this._mcStartScreen.getChildAt(i);
            }
            this._mcStartScreen.getChildAt(i).addEventListener(MouseEvent.CLICK,this.onClickButton);
         }
      }
      
      private function onClickButton(e:MouseEvent) : void
      {
         var urlReq:URLRequest = null;
         SoundManager.play(SoundManager.BUTTON_CLICK);
         switch(e.target)
         {
            case this.btnPlayMoreGames:
               urlReq = new URLRequest("http://www.match3.com");
               navigateToURL(urlReq,"_blank");
               break;
            case this.btnCredits:
               this._mcCredits = new mcCredits();
               this._mcCredits["btnMainMenu"].addEventListener(MouseEvent.CLICK,this.closeModalScreens,false,0,true);
               this._mcCredits["btnGlowingEye"].addEventListener(MouseEvent.CLICK,this.navigateToGlowingEye,false,0,true);
               this._mcCredits["btnMFNW"].addEventListener(MouseEvent.CLICK,this.navigateToMFNW,false,0,true);
               addChild(this._mcCredits);
               break;
            case this.btnPlay:
               dispatchEvent(new Event(PLAY));
               break;
            case this.btnHighScores:
               this.highscores = new Highscores();
               addChild(this.highscores);
               dispatchEvent(new Event(HIGHSCORES));
               break;
            case this.btnInstructions:
               this._mcCredits = new mcInstructions();
               this._mcCredits["btnMainMenu"].addEventListener(MouseEvent.CLICK,this.closeModalScreens,false,0,true);
               addChild(this._mcCredits);
               break;
            case this.btnSoundOn:
               this.mute(true);
               break;
            case this.btnSoundOff:
               this.mute(false);
         }
      }
   }
}
