package game.display
{
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import gs.TweenMax;
   
   public class EndLevelPanel extends Sprite
   {
      
      public static const PLAY_AGAIN:String = "playAgain";
       
      
      private var _asset:mcEndLevelPanel;
      
      private var _lives:int;
      
      public function EndLevelPanel()
      {
         super();
         this._asset = new mcEndLevelPanel();
         addEventListener(Event.ADDED_TO_STAGE,this.onAdded);
         addChild(this._asset);
         alpha = 0;
         TweenMax.to(this,4,{
            "alpha":3,
            "onComplete":this.onClickPlayAgain
         });
      }
      
      private function onAdded(e:Event) : void
      {
         removeEventListener(Event.ADDED_TO_STAGE,this.onAdded);
         stage.addEventListener(MouseEvent.MOUSE_DOWN,this.onClickPlayAgain);
      }
      
      private function onClickPlayAgain(e:MouseEvent = null) : void
      {
         if(stage)
         {
            stage.removeEventListener(MouseEvent.CLICK,this.onClickPlayAgain);
            TweenMax.killTweensOf(this);
            dispatchEvent(new Event(PLAY_AGAIN));
         }
      }
      
      public function set lives(value:int) : void
      {
         this._asset.txtLives.text = value + " lives left";
         if(value == 1)
         {
            this._asset.txtLives.text = value + " life left";
         }
         this._lives = value;
      }
   }
}
