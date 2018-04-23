package game
{
   import com.gskinner.geom.ColorMatrix;
   import flash.display.Bitmap;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.filters.ColorMatrixFilter;
   import flash.geom.Point;
   import gs.TweenMax;
   
   public class Ball extends Sprite
   {
      
      public static const EXPAND:String = "expand";
      
      public static const REMOVE:String = "remove";
      
      public static var activated:int = 0;
      
      public static var explosionSpeed:Number = 1;
      
      public static const START_EXPAND:String = "startExpand";
      
      public static const END_ALL:String = "endAllBalls";
       
      
      protected var _isExpand:Boolean = false;
      
      protected var _radius:int;
      
      private var _expandScaleValue:Number = 4;
      
      private var _maxSpeed:Number = 1.5;
      
      private var _clockwizeRotation:int = -1;
      
      private var Star:Class;
      
      protected var _dx:Number;
      
      protected var _asset:Bitmap;
      
      protected var _dy:Number;
      
      public function Ball()
      {
         this.Star = Ball_Star;
         super();
         this._dx = 2 + Math.random() * this._maxSpeed;
         this._dy = 2 + Math.random() * this._maxSpeed;
         this._dx = this._dx * (Math.random() < 0.5?1:-1);
         this._dy = this._dy * (Math.random() < 0.5?1:-1);
         if(Math.random() < 0.5)
         {
            this._clockwizeRotation = 1;
         }
         x = Math.random() * Game.stageW;
         y = Math.random() * Game.stageH;
         addEventListener(Event.ENTER_FRAME,this.onEnterFrame);
         this.drawBall();
      }
      
      private function onExpandUpdate() : void
      {
         dispatchEvent(new Event(EXPAND));
      }
      
      public function stopAndDissappear() : void
      {
         removeEventListener(Event.ENTER_FRAME,this.onEnterFrame);
         TweenMax.to(this,2,{
            "scaleX":0,
            "scaleY":0,
            "onComplete":this.reportRemove
         });
      }
      
      public function set radius(value:int) : void
      {
         this._radius = value;
      }
      
      public function get radius() : int
      {
         return this._radius;
      }
      
      public function reportRemove() : void
      {
         if(activated > 0)
         {
            activated--;
         }
         removeEventListener(Event.ENTER_FRAME,this.onEnterFrame);
         dispatchEvent(new Event(REMOVE));
         if(activated == 0)
         {
            dispatchEvent(new Event(END_ALL));
         }
      }
      
      public function expand() : void
      {
         if(this._isExpand)
         {
            return;
         }
         dispatchEvent(new Event(START_EXPAND));
         activated++;
         TweenMax.to(this,1,{
            "scaleX":this._expandScaleValue,
            "scaleY":this._expandScaleValue,
            "onComplete":this.collapse,
            "onUpdate":this.changeRadius
         });
         this._isExpand = true;
      }
      
      protected function drawBall() : void
      {
         this._asset = new this.Star();
         this._asset.scaleX = this._asset.scaleY = 0.2;
         this._asset.x = -this._asset.width * 0.5;
         this._asset.y = -this._asset.height * 0.5;
         this._asset.smoothing = true;
         addChild(this._asset);
         var cm:ColorMatrix = new ColorMatrix();
         cm.adjustHue(Math.random() * 360 - 180);
         this.filters = [new ColorMatrixFilter(cm)];
      }
      
      public function get isExpand() : Boolean
      {
         return this._isExpand;
      }
      
      private function collapse() : void
      {
         TweenMax.to(this,0.3,{
            "delay":explosionSpeed,
            "scaleX":0,
            "scaleY":0,
            "onComplete":this.reportRemove,
            "onUpdate":this.changeRadius
         });
         this._isExpand = true;
      }
      
      private function changeRadius() : void
      {
         this._radius = width * 0.7;
      }
      
      protected function onEnterFrame(e:Event) : void
      {
         if(!this._isExpand)
         {
            x = x + this._dx;
            y = y + this._dy;
            if(x < 0 || x > Game.stageW)
            {
               this._dx = -this._dx;
            }
            if(y < 0 || y > Game.stageH)
            {
               this._dy = -this._dy;
            }
         }
         else
         {
            dispatchEvent(new Event(EXPAND));
         }
         rotation = rotation + this._dx * 2 * this._clockwizeRotation;
      }
      
      public function checkIntersectWithBall($ball:Ball) : Boolean
      {
         return Point.distance(new Point($ball.x,$ball.y),new Point(x,y)) < $ball.radius * 0.5 + this._radius * 0.5;
      }
   }
}
