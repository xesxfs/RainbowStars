module com {
	export module adobe {
		export module serialization {
			export module json {
				export class JSONDecoder extends egret.HashObject {
					private value:any;
					private tokenizer:com.adobe.serialization.json.JSONTokenizer;
					private token:com.adobe.serialization.json.JSONToken;

					public constructor(s:string)
					{
						super();
						super();
						this.tokenizer = new com.adobe.serialization.json.JSONTokenizer(s);
						this.nextToken();
						this.value = this.parseValue();
					}

					private parseObject():any
					{
						var key:string = <any>null;
						var o:any = new Object();
						this.nextToken();
						if(this.token.type == com.adobe.serialization.json.JSONTokenType.RIGHT_BRACE)
						{
							return o;
						}
						while(true)
						{
							if(this.token.type == com.adobe.serialization.json.JSONTokenType.STRING)
							{
								key = String(this.token.value);
								this.nextToken();
								if(this.token.type == com.adobe.serialization.json.JSONTokenType.COLON)
								{
									this.nextToken();
									o[key] = this.parseValue();
									this.nextToken();
									if(this.token.type == com.adobe.serialization.json.JSONTokenType.RIGHT_BRACE)
									{
										break;
									}
									if(this.token.type == com.adobe.serialization.json.JSONTokenType.COMMA)
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

					private parseValue():any
					{
						if(this.token == null)
						{
							this.tokenizer.parseError("Unexpected end of input");
						}
						switch(this.token.type)
						{
						case com.adobe.serialization.json.JSONTokenType.LEFT_BRACE :
							return this.parseObject();
						case com.adobe.serialization.json.JSONTokenType.LEFT_BRACKET :
							return this.parseArray();
						case com.adobe.serialization.json.JSONTokenType.STRING :
						case com.adobe.serialization.json.JSONTokenType.NUMBER :
						case com.adobe.serialization.json.JSONTokenType.TRUE :
						case com.adobe.serialization.json.JSONTokenType.FALSE :
						case com.adobe.serialization.json.JSONTokenType.NULL :
							return this.token.value;
						default :
							this.tokenizer.parseError("Unexpected " + this.token.value);
							return null;
						}
					}

					private nextToken():com.adobe.serialization.json.JSONToken
					{
						return this.token = this.tokenizer.getNextToken();
					}

					public getValue():any
					{
						return this.value;
					}

					private parseArray():Array<any>
					{
						var a:Array<any> = new Array();
						this.nextToken();
						if(this.token.type == com.adobe.serialization.json.JSONTokenType.RIGHT_BRACKET)
						{
							return a;
						}
						while(true)
						{
							a.push(this.parseValue());
							this.nextToken();
							if(this.token.type == com.adobe.serialization.json.JSONTokenType.RIGHT_BRACKET)
							{
								break;
							}
							if(this.token.type == com.adobe.serialization.json.JSONTokenType.COMMA)
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
		}
	}
}

