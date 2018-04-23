package
{
   import flash.display.MovieClip;
   import flash.display.SimpleButton;
   
   public dynamic class mcCredits extends MovieClip
   {
       
      
      public var btnMainMenu:SimpleButton;
      
      public var btnBlocker:SimpleButton;
      
      public var btnMFNW:SimpleButton;
      
      public var btnGlowingEye:SimpleButton;
      
      public function mcCredits()
      {
         super();
         addFrameScript(0,frame1);
      }
      
      function frame1() : *
      {
         btnBlocker.useHandCursor = false;
      }
   }
}
