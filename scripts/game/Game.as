package game
{
   import flash.display.Bitmap;
   import flash.display.DisplayObject;
   import flash.display.Sprite;
   import flash.events.Event;
   import flash.events.MouseEvent;
   import flash.utils.Dictionary;
   import game.common.GameData;
   import game.display.EndLevelPanel;
   import game.display.GameOverPanel;
   import game.display.Gui;
   import game.display.LevelSuccessPanel;
   import game.display.StartupPanel;
   import game.sound.SoundManager;
   import gs.TweenMax;
   
   public class Game extends Sprite
   {
      
      public static const stageW:int = 640;
      
      public static const stageH:int = 480;
       
      
      private var _gui:Gui;
      
      private var _background:Sprite;
      
      private var _levelScreen:mcLevel;
      
      private const _totalLevels:int = 10;
      
      private var _balls:Dictionary;
      
      private var _endLevelPanel:EndLevelPanel;
      
      private var _ballsHolder:Sprite;
      
      private var _startupPanel:StartupPanel;
      
      private var _successLevelScreen:LevelSuccessPanel;
      
      private var _mcGameOver:GameOverPanel;
      
      private var _levelSuccess:Boolean;
      
      public function Game()
      {
         this._balls = new Dictionary(true);
         super();
         this.addBackground();
         this.addStartupPanel();
      }
      
      private function addEndLevelPanel() : void
      {
         trace("## addEndLevelPanel");
         this._endLevelPanel = new EndLevelPanel();
         this.centerMovie(this._endLevelPanel);
         this._endLevelPanel.lives = this._gui.lives;
         addChild(this._endLevelPanel);
         this._endLevelPanel.addEventListener(EndLevelPanel.PLAY_AGAIN,this.replayLevel);
      }
      
      private function subscribeBallToEvents($ball:Ball) : void
      {
         $ball.addEventListener(Ball.EXPAND,this.checkNearBalls);
         $ball.addEventListener(Ball.REMOVE,this.removeBall);
         $ball.addEventListener(Ball.END_ALL,this.endLevel);
         $ball.addEventListener(Ball.START_EXPAND,this.onStartExpand);
      }
      
      private function addStartupPanel(e:Event = null) : void
      {
         this.clearPanel(this._mcGameOver);
         this._startupPanel = new StartupPanel();
         addChild(this._startupPanel);
         this._startupPanel.addEventListener(StartupPanel.PLAY,this.onClickPlay,false,0,true);
         this._levelSuccess = false;
      }
      
      private function endLevel(e:Event) : void
      {
         var ball:Ball = null;
         for each(ball in this._balls)
         {
            ball.removeEventListener(Ball.END_ALL,this.endLevel);
            ball.stopAndDissappear();
         }
         this._gui.alpha = 0;
         this._levelSuccess = this._gui.explosed >= GameData.GOAL_BALLS[this._gui.level - 1];
         trace("endLevel",this._levelSuccess);
         if(this._levelSuccess)
         {
            this.showSuccessLevelScreen();
         }
         else
         {
            this._gui.lives--;
            if(this._gui.lives == 0)
            {
               this.gameOver();
            }
            else
            {
               this.addEndLevelPanel();
            }
         }
      }
      
      private function removeAllBalls() : void
      {
         var ball:Ball = null;
         for each(ball in this._balls)
         {
            ball.reportRemove();
         }
         this._balls = new Dictionary(true);
      }
      
      private function centerMovie($mc:DisplayObject) : void
      {
         $mc.x = stageW / 2 - $mc.width / 2;
         $mc.y = stageH / 2 - $mc.height / 2;
      }
      
      private function replayLevel(e:Event = null) : void
      {
         trace("## replayLevel");
         if(this._endLevelPanel)
         {
            this._endLevelPanel.removeEventListener(EndLevelPanel.PLAY_AGAIN,this.replayLevel);
            removeChild(this._endLevelPanel);
            this._endLevelPanel = null;
         }
         this.showStartLevel();
      }
      
      private function removeMe($sprite:DisplayObject) : void
      {
         try
         {
            removeChild($sprite);
            var $sprite:DisplayObject = null;
         }
         catch(e:*)
         {
         }
      }
      
      private function showStartLevel(e:Event = null) : void
      {
         trace("## showStartLevel");
         this.clearPanel(this._successLevelScreen);
         if(!this._gui)
         {
            this._gui = new Gui();
         }
         trace("LevelSuccessPanel success ",this._levelSuccess);
         if(this._levelSuccess)
         {
            this._gui.level++;
         }
         this._levelScreen = new mcLevel();
         addChild(this._levelScreen);
         this._gui.alpha = 0;
         this._levelScreen.gotoAndStop(this._gui.level);
         TweenMax.from(this._levelScreen,2,{"alpha":0.1});
         this._levelScreen.btnPlay.addEventListener(MouseEvent.CLICK,this.startGameLevel);
         this._levelScreen.txtCollect.text = "Explode " + GameData.GOAL_BALLS[this._gui.level - 1] + " stars out of a total of " + GameData.TOTAL_BALLS[this._gui.level - 1] + " stars";
         this._levelScreen.txtCollect.autoSize = "center";
         this.centerMovie(this._levelScreen);
      }
      
      private function onStartExpand(e:Event) : void
      {
         if(!(e.target is Cursor))
         {
            this.addExplodeText(e.target.x,e.target.y);
            this._gui.explosed++;
            this._gui.score = this._gui.score + Ball.activated * 1000;
            SoundManager.playRandomExplodeSound();
         }
         this._gui.explosedSuccess = this._gui.explosed >= GameData.GOAL_BALLS[this._gui.level - 1];
      }
      
      private function removeBall(e:Event) : void
      {
         var ball:Ball = e.target as Ball;
         delete this._balls[ball];
         try
         {
            this._ballsHolder.removeChild(ball);
         }
         catch(e:*)
         {
         }
      }
      
      private function checkNearBalls(e:Event) : void
      {
         var ball:Ball = null;
         for each(ball in this._balls)
         {
            if(ball.checkIntersectWithBall(e.target as Ball))
            {
               ball.expand();
            }
         }
      }
      
      private function addExplodeText($x:int, $y:int) : void
      {
         var mcExplode:mcExplodeStarText = new mcExplodeStarText();
         addChild(mcExplode);
         mcExplode.x = $x;
         mcExplode.y = $y;
         mcExplode.txt.text = String((this._gui.explosed + 1) * 1000);
         mcExplode.alpha = 0;
         TweenMax.to(mcExplode,0.3,{
            "delay":2,
            "alpha":1
         });
         TweenMax.to(mcExplode,0.3,{
            "delay":2.5,
            "alpha":0,
            "onComplete":this.removeMe,
            "onCompleteParams":[mcExplode]
         });
      }
      
      private function addGui() : void
      {
         addChild(this._gui);
      }
      
      private function gameOver(e:Event = null) : void
      {
         trace("## gameOver");
         this.removeAllBalls();
         this.clearPanel(this._successLevelScreen);
         this._mcGameOver = new GameOverPanel();
         this._mcGameOver.addEventListener(GameOverPanel.PLAY_AGAIN,this.onPlayAgain);
         this._mcGameOver.addEventListener(GameOverPanel.GO_TO_MAIN,this.addStartupPanel,true);
         this._mcGameOver.score = this._gui.score;
         this.centerMovie(this._mcGameOver);
         addChild(this._mcGameOver);
         if(this._gui.level == this._totalLevels && this._levelSuccess)
         {
            this._mcGameOver.winGame();
         }
         removeChild(this._gui);
         this._gui = null;
      }
      
      private function addChargedBall(e:Event) : void
      {
         if(this._gui.alpha <= 0.7)
         {
            return;
         }
         var ball:Cursor = new Cursor();
         this._ballsHolder.addChildAt(ball,0);
         this.subscribeBallToEvents(ball);
         ball.expand();
         ball.x = mouseX;
         ball.y = mouseY;
         removeEventListener(MouseEvent.MOUSE_DOWN,this.addChargedBall);
      }
      
      private function addBackground() : void
      {
         this._background = new Sprite();
         this._background.graphics.beginFill(0);
         this._background.graphics.drawRect(0,0,stageW,stageH);
         addChild(new Bitmap(new imgBackground(1,1)));
      }
      
      private function startGameLevel(e:Event = null) : void
      {
         trace("## startGameLevel");
         SoundManager.play(SoundManager.BUTTON_CLICK);
         this.addGui();
         this._gui.alpha = 1;
         removeChild(this._levelScreen);
         this._ballsHolder = new Sprite();
         addChild(this._ballsHolder);
         this.addBalls(GameData.TOTAL_BALLS[this._gui.level - 1]);
         addEventListener(MouseEvent.MOUSE_DOWN,this.addChargedBall);
         this._gui.totalExplosed = GameData.GOAL_BALLS[this._gui.level - 1];
         this._gui.explosed = 0;
         this._gui.startLevel();
      }
      
      private function showSuccessLevelScreen() : void
      {
         trace("## showSuccessLevelScreen");
         this._successLevelScreen = new LevelSuccessPanel();
         this.centerMovie(this._successLevelScreen);
         this._successLevelScreen.levelBonus = this._gui.level * 1000;
         this._successLevelScreen.livesBonus = this._gui.lives * 10000;
         this._successLevelScreen.extraBonus = (this._gui.explosed - GameData.GOAL_BALLS[this._gui.level - 1]) * 10000;
         this._gui.score = this._gui.score + this._successLevelScreen.calculateScore();
         this._successLevelScreen.totalScore = this._gui.score;
         if(this._gui.level != this._totalLevels)
         {
            this._successLevelScreen.addEventListener(LevelSuccessPanel.PLAY_NEXT_ROUND,this.showStartLevel);
         }
         else
         {
            this._successLevelScreen.addEventListener(LevelSuccessPanel.PLAY_NEXT_ROUND,this.gameOver);
         }
         addChild(this._successLevelScreen);
      }
      
      private function onPlayAgain(e:Event) : void
      {
         trace("## onPlayAgain");
         this.clearPanel(this._mcGameOver);
         this._levelSuccess = false;
         this.showStartLevel();
      }
      
      private function clearPanel($do:DisplayObject) : void
      {
         trace("clear " + $do);
         if($do)
         {
            try
            {
               $do.parent.removeChild($do);
            }
            catch(e:*)
            {
            }
            var $do:DisplayObject = null;
         }
      }
      
      private function addBalls($numBalls:int) : void
      {
         var ball:Ball = null;
         for(var i:int = 0; i < $numBalls; i++)
         {
            ball = new Ball();
            this._ballsHolder.addChild(ball);
            this._balls[ball] = ball;
            this.subscribeBallToEvents(ball);
         }
      }
      
      private function onClickPlay(e:Event) : void
      {
         removeChild(this._startupPanel);
         this.showStartLevel();
      }
   }
}
