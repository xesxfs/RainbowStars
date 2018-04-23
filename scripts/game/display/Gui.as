package game.display
{
   import flash.display.MovieClip;
   import flash.display.Sprite;
   import flash.text.TextField;
   import gs.TweenMax;
   import gs.easing.Quad;
   
   public class Gui extends Sprite
   {
       
      
      private var _txtTotalBalls:TextField;
      
      private var _level:int = 1;
      
      private var _txtExplosedBalls:TextField;
      
      private var _mcLives:MovieClip;
      
      private var _txtLevel:TextField;
      
      private var _totalExplosed:int;
      
      private var _explosed:int;
      
      private var _score:int;
      
      private var _txtScore:TextField;
      
      private var _numLife:int;
      
      private var _asset:mcGui;
      
      public function Gui()
      {
         super();
         this._asset = new mcGui();
         addChild(this._asset);
         this._mcLives = this._asset.mcLife;
         this._txtScore = this._asset.txtScore;
         this._txtLevel = this._asset.txtLevel;
         this._txtExplosedBalls = this._asset.txtExplosedBalls;
         this._txtTotalBalls = this._asset.txtTotalBalls;
         this._mcLives.stop();
         this.lives = 3;
         this.score = 0;
      }
      
      public function startLevel() : void
      {
         TweenMax.from(this,1,{
            "alpha":0,
            "ease":Quad.easeInOut
         });
      }
      
      public function get level() : int
      {
         return this._level;
      }
      
      public function get lives() : int
      {
         return this._numLife;
      }
      
      public function set level(value:int) : void
      {
         this._level = value;
         this._txtLevel.text = String(value);
      }
      
      public function set lives(value:int) : void
      {
         trace("lives " + value);
         this._numLife = value;
         this._mcLives.gotoAndStop(value + 1);
      }
      
      public function get totalExplosed() : int
      {
         return this._totalExplosed;
      }
      
      public function get score() : int
      {
         return this._score;
      }
      
      public function set score(value:int) : void
      {
         this._score = value;
         this._txtScore.text = String(value);
      }
      
      public function set totalExplosed(value:int) : void
      {
         this._totalExplosed = value;
         this._txtTotalBalls.text = "/" + String(value);
      }
      
      public function get explosed() : int
      {
         return this._explosed;
      }
      
      public function set explosedSuccess(value:Boolean) : void
      {
         if(value)
         {
            this._txtExplosedBalls.textColor = 56576;
         }
         else
         {
            this._txtExplosedBalls.textColor = 14483456;
         }
      }
      
      public function set explosed(value:int) : void
      {
         if(value == 0)
         {
            this.explosedSuccess = false;
         }
         this._explosed = value;
         this._txtExplosedBalls.text = String(value);
      }
   }
}
