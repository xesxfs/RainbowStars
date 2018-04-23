package game.display.effects
{
   import com.gskinner.geom.ColorMatrix;
   import flash.display.Bitmap;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.filters.ColorMatrixFilter;
   import game.sound.SoundManager;
   import gs.TweenMax;
   
   public class Fireworks extends Sprite
   {
       
      
      private var _stars:Array;
      
      private var Star:Class;
      
      public function Fireworks()
      {
         this.Star = Fireworks_Star;
         this._stars = [];
         super();
         addEventListener(Event.REMOVED_FROM_STAGE,this.clearAll);
         this.createFirework();
      }
      
      private function runExplosionAgain($star:Sprite) : void
      {
         var scaleValue:Number = Math.random();
         $star.x = Math.random() * 600;
         $star.y = Math.random() * 400;
         $star.scaleX = $star.scaleY = 0;
         TweenMax.to($star,1 + Math.random(),{
            "onStart":this.playExplosionSound,
            "rotation":180 - Math.random() * 360,
            "delay":Math.random() * 3,
            "scaleX":scaleValue,
            "scaleY":scaleValue,
            "onComplete":this.collapseStar,
            "onCompleteParams":[$star]
         });
      }
      
      private function createFirework() : void
      {
         var star:Sprite = null;
         var scaleValue:Number = NaN;
         for(var i:int = 0; i < 20; i++)
         {
            star = this.createRandomColorStar();
            star.x = Math.random() * 600;
            star.y = Math.random() * 400;
            star.scaleX = star.scaleY = 0;
            scaleValue = Math.random();
            TweenMax.to(star,1 + Math.random(),{
               "onStart":this.playExplosionSound,
               "rotation":180 - Math.random() * 360,
               "delay":1 + Math.random() * 2,
               "scaleX":scaleValue,
               "scaleY":scaleValue,
               "onComplete":this.collapseStar,
               "onCompleteParams":[star]
            });
         }
      }
      
      private function clearAll(e:Event) : void
      {
         removeEventListener(Event.REMOVED_FROM_STAGE,this.clearAll);
         TweenMax.killAllTweens(false);
         TweenMax.killAllDelayedCalls(false);
         while(numChildren)
         {
            removeChildAt(0);
         }
         this._stars = [];
      }
      
      private function createRandomColorStar() : Sprite
      {
         var spr:Sprite = null;
         var _asset:Bitmap = null;
         spr = new Sprite();
         addChild(spr);
         _asset = new this.Star();
         _asset.x = -_asset.width * 0.5;
         _asset.y = -_asset.height * 0.5;
         _asset.smoothing = true;
         spr.addChild(_asset);
         var cm:ColorMatrix = new ColorMatrix();
         cm.adjustHue(Math.random() * 360 - 180);
         _asset.filters = [new ColorMatrixFilter(cm)];
         this._stars.push(_asset);
         return spr;
      }
      
      private function playExplosionSound() : void
      {
         if(Math.random() < 0.5)
         {
            SoundManager.playRandomExplodeSound();
         }
      }
      
      private function collapseStar($star:Sprite) : void
      {
         var scaleValue:Number = 0;
         TweenMax.to($star,0.6,{
            "scaleX":scaleValue,
            "scaleY":scaleValue,
            "rotation":50 - Math.random() * 100,
            "onComplete":this.runExplosionAgain,
            "onCompleteParams":[$star]
         });
      }
   }
}
