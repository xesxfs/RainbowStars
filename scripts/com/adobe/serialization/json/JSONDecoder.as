package com.adobe.serialization.json
{
   public class JSONDecoder
   {
       
      
      private var value;
      
      private var tokenizer:JSONTokenizer;
      
      private var token:JSONToken;
      
      public function JSONDecoder(s:String)
      {
         super();
         this.tokenizer = new JSONTokenizer(s);
         this.nextToken();
         this.value = this.parseValue();
      }
      
      private function parseObject() : Object
      {
         var key:String = null;
         var o:Object = new Object();
         this.nextToken();
         if(this.token.type == JSONTokenType.RIGHT_BRACE)
         {
            return o;
         }
         while(true)
         {
            if(this.token.type == JSONTokenType.STRING)
            {
               key = String(this.token.value);
               this.nextToken();
               if(this.token.type == JSONTokenType.COLON)
               {
                  this.nextToken();
                  o[key] = this.parseValue();
                  this.nextToken();
                  if(this.token.type == JSONTokenType.RIGHT_BRACE)
                  {
                     break;
                  }
                  if(this.token.type == JSONTokenType.COMMA)
                  {
                     this.nextToken();
                  }
                  else
                  {
                     this.tokenizer.parseError("Expecting } or , but found " + this.token.value);
                  }
               }
               else
               {
                  this.tokenizer.parseError("Expecting : but found " + this.token.value);
               }
            }
            else
            {
               this.tokenizer.parseError("Expecting string but found " + this.token.value);
            }
         }
         return o;
      }
      
      private function parseValue() : Object
      {
         if(this.token == null)
         {
            this.tokenizer.parseError("Unexpected end of input");
         }
         switch(this.token.type)
         {
            case JSONTokenType.LEFT_BRACE:
               return this.parseObject();
            case JSONTokenType.LEFT_BRACKET:
               return this.parseArray();
            case JSONTokenType.STRING:
            case JSONTokenType.NUMBER:
            case JSONTokenType.TRUE:
            case JSONTokenType.FALSE:
            case JSONTokenType.NULL:
               return this.token.value;
            default:
               this.tokenizer.parseError("Unexpected " + this.token.value);
               return null;
         }
      }
      
      private function nextToken() : JSONToken
      {
         return this.token = this.tokenizer.getNextToken();
      }
      
      public function getValue() : *
      {
         return this.value;
      }
      
      private function parseArray() : Array
      {
         var a:Array = new Array();
         this.nextToken();
         if(this.token.type == JSONTokenType.RIGHT_BRACKET)
         {
            return a;
         }
         while(true)
         {
            a.push(this.parseValue());
            this.nextToken();
            if(this.token.type == JSONTokenType.RIGHT_BRACKET)
            {
               break;
            }
            if(this.token.type == JSONTokenType.COMMA)
            {
               this.nextToken();
            }
            else
            {
               this.tokenizer.parseError("Expecting ] or , but found " + this.token.value);
            }
         }
         return a;
      }
   }
}
