package game.display.effects
{
   import com.gskinner.geom.ColorMatrix;
   import flash.display.Bitmap;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.filters.ColorMatrixFilter;
   
   public class Waterfall extends Sprite
   {
       
      
      private var stars:Array;
      
      private var starsSpeed:Array;
      
      private var starsRotat:Array;
      
      private var Star:Class;
      
      public function Waterfall()
      {
         this.Star = Waterfall_Star;
         this.stars = [];
         this.starsSpeed = [];
         this.starsRotat = [];
         super();
         addEventListener(Event.REMOVED_FROM_STAGE,this.clearAll);
         addEventListener(Event.ENTER_FRAME,this.enterFrame);
         this.createWaterFall();
      }
      
      private function clearAll(e:Event) : void
      {
         removeEventListener(Event.REMOVED_FROM_STAGE,this.clearAll);
         while(numChildren)
         {
            removeChildAt(0);
         }
      }
      
      private function enterFrame(e:Event) : void
      {
         for(var i:int = 0; i < this.stars.length; i++)
         {
            this.stars[i].y = this.stars[i].y + this.starsSpeed[i];
            this.stars[i].rotation = this.stars[i].rotation + this.starsSpeed[i] * this.starsRotat[i];
            if(this.stars[i].y > 650)
            {
               this.stars[i].y = -50;
               this.stars[i].x = Math.random() * 600;
            }
         }
      }
      
      private function createWaterFall() : void
      {
         for(var i:int = 0; i < 20; i++)
         {
            this.starsSpeed.push(1 + Math.random() * 7);
            this.createRandomColorStar().x = Math.random() * 600;
            this.starsRotat.push(Math.random() > 0.5?-1:1);
         }
      }
      
      private function createRandomColorStar() : Bitmap
      {
         var _asset:Bitmap = new this.Star();
         _asset.scaleX = _asset.scaleY = Math.random() < 0.5?Number(0.2):Number(-0.2);
         _asset.x = -_asset.width * 0.5;
         _asset.y = -100;
         _asset.smoothing = true;
         addChild(_asset);
         var cm:ColorMatrix = new ColorMatrix();
         cm.adjustHue(Math.random() * 360 - 180);
         _asset.filters = [new ColorMatrixFilter(cm)];
         this.stars.push(_asset);
         return _asset;
      }
   }
}
