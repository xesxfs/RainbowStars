package game
{
   import flash.events.Event;
   
   public class Cursor extends Ball
   {
       
      
      private var Sta:Class;
      
      private var Star:Class;
      
      public function Cursor()
      {
         this.Star = Cursor_Star;
         this.Sta = Cursor_Sta;
         super();
      }
      
      override public function get radius() : int
      {
         return _radius * 1.5;
      }
      
      override protected function drawBall() : void
      {
         _asset = new this.Star();
         _asset.scaleX = _asset.scaleY = 0.2;
         _asset.x = -_asset.width * 0.5;
         _asset.y = -_asset.height * 0.5;
         _asset.smoothing = true;
         addChild(_asset);
      }
      
      override protected function onEnterFrame(e:Event) : void
      {
         dispatchEvent(new Event(EXPAND));
      }
   }
}
