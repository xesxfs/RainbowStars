package game
{
   import flash.utils.ByteArray;
   import mx.core.MovieClipLoaderAsset;
   
   public class Cursor_Sta extends MovieClipLoaderAsset
   {
      
      private static var bytes:ByteArray = null;
       
      
      public var dataClass:Class;
      
      public function Cursor_Sta()
      {
         this.dataClass = Cursor_Sta_dataClass;
         super();
         initialWidth = 12800 / 20;
         initialHeight = 9600 / 20;
      }
      
      override public function get movieClipData() : ByteArray
      {
         if(bytes == null)
         {
            bytes = ByteArray(new this.dataClass());
         }
         return bytes;
      }
   }
}
