package
{
   import flash.display.DisplayObject;
   import flash.display.MovieClip;
   import flash.events.Event;
   import flash.events.ProgressEvent;
   import flash.utils.getDefinitionByName;
   import mochi.MochiAd;
   import mochi.MochiBot;
   import mochi.MochiScores;
   import mochi.MochiServices;
   
   public dynamic class Preloader extends MovieClip
   {
       
      
      private var _mainClass:Class;
      
      public function Preloader()
      {
         super();
         this.addMochi();
      }
      
      private function addMochi() : void
      {
         MochiAd.showPreGameAd({
            "clip":this,
            "ad_finished":this.closeMochiAd,
            "id":Main.MOCHI_ID,
            "res":"640x480",
            "background":16777161,
            "color":16747008,
            "outline":13994812,
            "no_bg":false
         });
         MochiServices.connect(Main.MOCHI_ID,this);
         MochiBot.track(this,Main.MOCHI_BOT_ID);
         MochiScores.setBoardID(Main.MOCHI_LEADERBOARD_ID);
      }
      
      private function closeMochiAd() : void
      {
         addEventListener(Event.ENTER_FRAME,this.checkFrame);
      }
      
      private function checkFrame(e:Event) : void
      {
         if(loaderInfo.bytesLoaded == loaderInfo.bytesTotal)
         {
            removeEventListener(Event.ENTER_FRAME,this.checkFrame);
            this.startup();
         }
      }
      
      private function startup() : void
      {
         Main.STAGE = stage;
         stop();
         loaderInfo.removeEventListener(ProgressEvent.PROGRESS,this.progress);
         if(!this._mainClass)
         {
            this._mainClass = getDefinitionByName("Main") as Class;
            addChild(new this._mainClass() as DisplayObject);
         }
      }
      
      private function progress(e:ProgressEvent) : void
      {
      }
   }
}
