package game.display
{
   import flash.display.SimpleButton;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   import game.common.Cookies;
   import game.sound.SoundManager;
   import mochi.MochiScores;
   
   public dynamic class Highscores extends Sprite
   {
       
      
      private var _score:Number;
      
      private var txtS2:TextField;
      
      private var txtS4:TextField;
      
      private var txtS6:TextField;
      
      private var btnMainMenu:SimpleButton;
      
      private var txtS1:TextField;
      
      private var txtS9:TextField;
      
      private var txtS3:TextField;
      
      private var txtS5:TextField;
      
      private var btnOnlineLeaders:SimpleButton;
      
      private var txtS8:TextField;
      
      private var txtS10:TextField;
      
      private var txtS7:TextField;
      
      private var txtP1:TextField;
      
      private var txtP2:TextField;
      
      private var txtP3:TextField;
      
      private var txtP4:TextField;
      
      private var txtP5:TextField;
      
      private var txtP6:TextField;
      
      private var txtP7:TextField;
      
      private var txtP8:TextField;
      
      private var txtP9:TextField;
      
      private var _name:String;
      
      private var txtP10:TextField;
      
      public function Highscores($score:Number = 0, $name:String = "")
      {
         super();
         var _asset:mcHighscores = new mcHighscores();
         addChild(_asset);
         this.fillContent(_asset);
         this.btnMainMenu.addEventListener(MouseEvent.CLICK,this.closeHighscores);
         this.btnOnlineLeaders.addEventListener(MouseEvent.CLICK,this.showOnline);
         this.showLocalLeaders();
         this._score = $score;
         this._name = $name;
      }
      
      private function onCloseOnline() : void
      {
         this.btnMainMenu.enabled = true;
         this.btnOnlineLeaders.enabled = true;
      }
      
      private function showOnline(e:Event) : void
      {
         if(!this.btnOnlineLeaders.enabled)
         {
            return;
         }
         SoundManager.play(SoundManager.BUTTON_CLICK);
         this.btnMainMenu.enabled = false;
         this.btnOnlineLeaders.enabled = false;
         if(Cookies.isDoSubmitScore(this._score))
         {
            MochiScores.showLeaderboard({
               "boardID":Main.MOCHI_LEADERBOARD_ID,
               "score":this._score,
               "name":this._name,
               "onClose":this.onCloseOnline
            });
         }
         else
         {
            MochiScores.showLeaderboard({
               "boardID":Main.MOCHI_LEADERBOARD_ID,
               "onClose":this.onCloseOnline
            });
         }
      }
      
      private function showLocalLeaders() : void
      {
         var arrLeaders:Array = Cookies.leaderboard;
         var length:int = arrLeaders.length;
         var i:int = 1;
         while(i < length + 1 && i < 11)
         {
            this["txtP" + i].text = arrLeaders[i - 1].n;
            this["txtS" + i].text = arrLeaders[i - 1].s;
            if(arrLeaders[i - 1].n == Cookies.playerName && arrLeaders[i - 1].s == Cookies.playerScore)
            {
               this["txtP" + i].textColor = 14276864;
               this["txtS" + i].textColor = 14276864;
            }
            i++;
         }
      }
      
      private function closeHighscores(e:Event) : void
      {
         dispatchEvent(new Event(GameOverPanel.GO_TO_MAIN,true));
         if(!this.btnOnlineLeaders.enabled)
         {
            return;
         }
         SoundManager.play(SoundManager.BUTTON_CLICK);
         parent.removeChild(this);
      }
      
      private function fillContent($asset:Sprite) : void
      {
         for(var i:int = 0; i < $asset.numChildren; i++)
         {
            try
            {
               this[$asset.getChildAt(i).name] = $asset.getChildAt(i);
            }
            catch(e:*)
            {
            }
         }
      }
   }
}
