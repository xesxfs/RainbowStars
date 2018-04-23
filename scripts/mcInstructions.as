package
{
   import flash.display.MovieClip;
   import flash.display.SimpleButton;
   
   public dynamic class mcInstructions extends MovieClip
   {
       
      
      public var btnMainMenu:SimpleButton;
      
      public var btnBlocker:SimpleButton;
      
      public function mcInstructions()
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
