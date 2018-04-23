package game.display
{
   import flash.display.DisplayObject;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.text.TextField;
   import game.sound.SoundManager;
   import gs.TweenMax;
   import gs.easing.Elastic;
   
   public class LevelSuccessPanel extends Sprite
   {
      
      public static const PLAY_NEXT_ROUND:String = "playNextRound";
       
      
      private var _txtExtraStarsExploded:TextField;
      
      private var _totalScore:Number;
      
      private var _extraBonus:Number;
      
      private var _levelBonus:Number;
      
      private var _t1:TextField;
      
      private var _t2:TextField;
      
      private var _t3:TextField;
      
      private var _t4:TextField;
      
      private var _txtLivesBonus:TextField;
      
      private var _asset:mcSuccessLevel;
      
      private var _appearSpeed:Number = 0.3;
      
      private var _livesBonus:Number;
      
      private var _txtRoundNumberBonus:TextField;
      
      private var _txtTotalScore:TextField;
      
      public function LevelSuccessPanel()
      {
         super();
         this._asset = new mcSuccessLevel();
         this._asset.btnPlay.addEventListener(MouseEvent.CLICK,this.onPlayClick);
         this._txtExtraStarsExploded = this._asset.txtExtraStarsExploded;
         this._txtLivesBonus = this._asset.txtLivesBonus;
         this._txtRoundNumberBonus = this._asset.txtRoundNumberBonus;
         this._txtTotalScore = this._asset.txtTotalScore;
         this._t1 = this._asset.t1;
         this._t2 = this._asset.t2;
         this._t3 = this._asset.t3;
         this._t4 = this._asset.t4;
         addChild(this._asset);
         this._asset.alpha = 0;
         TweenMax.to(this._asset,2,{
            "alpha":1,
            "delay":0
         });
         this.appearTextField(this._t1,1 * this._appearSpeed);
         this.appearTextField(this._txtRoundNumberBonus,2 * this._appearSpeed);
         this.appearTextField(this._t2,3 * this._appearSpeed);
         this.appearTextField(this._txtLivesBonus,4 * this._appearSpeed);
         this.appearTextField(this._t3,5 * this._appearSpeed);
         this.appearTextField(this._txtExtraStarsExploded,6 * this._appearSpeed);
         this.appearTextField(this._t4,7 * this._appearSpeed);
         this.appearTextField(this._txtTotalScore,8 * this._appearSpeed);
         this.appearTextField(this._asset.btnPlay,10 * this._appearSpeed);
         SoundManager.play(SoundManager.STAR_EXPLODE_1);
      }
      
      private function appearTextField($tf:DisplayObject, $delay:Number) : void
      {
         $tf.alpha = 0;
         TweenMax.to($tf,1,{
            "delay":$delay,
            "y":$tf.y + 10,
            "alpha":1,
            "ease":Elastic.easeOut,
            "onStart":this.onStartAppearing,
            "onStartParams":[$tf]
         });
      }
      
      public function calculateScore() : Number
      {
         var result:Number = this.levelBonus + this.livesBonus + this.extraBonus;
         this._levelBonus = this._livesBonus = this._extraBonus = 0;
         return result;
      }
      
      private function onPlayClick(e:MouseEvent) : void
      {
         if(this._asset.btnPlay.alpha < 1)
         {
            return;
         }
         SoundManager.play(SoundManager.BUTTON_CLICK);
         dispatchEvent(new Event(PLAY_NEXT_ROUND));
      }
      
      public function get livesBonus() : Number
      {
         return this._livesBonus;
      }
      
      public function set extraBonus(value:Number) : void
      {
         if(value < 0)
         {
            value = 0;
         }
         this._txtExtraStarsExploded.text = String(value);
         this._extraBonus = value;
      }
      
      private function onStartAppearing($tf:DisplayObject) : void
      {
         if($tf == this._txtRoundNumberBonus)
         {
            SoundManager.play(SoundManager.STAR_EXPLODE_2);
         }
         else if($tf == this._txtLivesBonus)
         {
            SoundManager.play(SoundManager.STAR_EXPLODE_3);
         }
         else if($tf == this._txtExtraStarsExploded)
         {
            SoundManager.play(SoundManager.STAR_EXPLODE_4);
         }
         else if($tf == this._txtTotalScore)
         {
            SoundManager.play(SoundManager.STAR_EXPLODE_5);
         }
         else if($tf == this._asset.btnPlay)
         {
            SoundManager.play(SoundManager.STAR_EXPLODE_5);
         }
      }
      
      public function set totalScore(value:Number) : void
      {
         this._txtTotalScore.text = String(value);
         this._totalScore = value;
      }
      
      public function get extraBonus() : Number
      {
         return this._extraBonus;
      }
      
      public function set livesBonus(value:Number) : void
      {
         this._txtLivesBonus.text = String(value);
         this._livesBonus = value;
      }
      
      public function get totalScore() : Number
      {
         return this._totalScore;
      }
      
      public function set levelBonus(value:Number) : void
      {
         this._txtRoundNumberBonus.text = String(value);
         this._levelBonus = value;
      }
      
      public function get levelBonus() : Number
      {
         return this._levelBonus;
      }
   }
}
