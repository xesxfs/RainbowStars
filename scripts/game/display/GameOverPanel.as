package game.display
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.net.URLRequest;
   import flash.net.navigateToURL;
   import flash.text.TextField;
   import game.common.Cookies;
   import game.display.effects.Fireworks;
   import game.sound.SoundManager;
   
   public class GameOverPanel extends Sprite
   {
      
      public static const PLAY_AGAIN:String = "playAgain";
      
      public static const GO_TO_MAIN:String = "goToMain";
       
      
      private var _firework:Fireworks;
      
      private var _asset:mcGameOver;
      
      private var _score:Number;
      
      private var _txtPlayerName:TextField;
      
      public function GameOverPanel()
      {
         super();
         this._asset = new mcGameOver();
         addChild(this._asset);
         this._asset.btnPlayMoreGames.addEventListener(MouseEvent.CLICK,this.onClickGoToSite);
         this._asset.btnHighScores.addEventListener(MouseEvent.CLICK,this.onClickHighScores);
         this._txtPlayerName = this._asset.txtPlayerName;
         Main.STAGE.focus = this._txtPlayerName;
         this._txtPlayerName.text = Cookies.playerName;
         this._firework = new Fireworks();
         addChildAt(this._firework,0);
         this._asset.mcGraphics.stop();
      }
      
      private function onClickPlayAgain(e:Event) : void
      {
         removeChild(this._firework);
         this._firework = null;
         SoundManager.play(SoundManager.BUTTON_CLICK);
         dispatchEvent(new Event(PLAY_AGAIN));
      }
      
      public function set score(value:Number) : void
      {
         this._asset.txtScore.text = String(value);
         this._score = value;
      }
      
      private function onClickGoToMain(e:Event) : void
      {
         SoundManager.play(SoundManager.BUTTON_CLICK);
         dispatchEvent(new Event(GO_TO_MAIN));
      }
      
      private function onClickHighScores(e:Event) : void
      {
         Cookies.playerName = this._txtPlayerName.text;
         SoundManager.play(SoundManager.BUTTON_CLICK);
         Cookies.addUserScore(this._txtPlayerName.text,this._score);
         var highscores:Highscores = new Highscores(this._score,this._txtPlayerName.text);
         addChild(highscores);
      }
      
      public function winGame() : void
      {
         this._asset.mcGraphics.gotoAndStop(2);
      }
      
      public function get score() : Number
      {
         return this._score;
      }
      
      private function onClickGoToSite(e:Event) : void
      {
         SoundManager.play(SoundManager.BUTTON_CLICK);
         var urlReq:URLRequest = new URLRequest("http://www.match3.com");
         navigateToURL(urlReq,"_blank");
      }
   }
}
