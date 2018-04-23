module com {
	export module adobe {
		export module serialization {
			export module json {
				export class JSONTokenizer extends egret.HashObject {
					private loc:number = 0;
					private ch:string;
					private obj:any;
					private jsonString:string;

					public constructor(s:string)
					{
						super();
						super();
						this.jsonString = s;
						this.loc = flash.checkInt(0);
						this.nextChar();
					}

					private skipComments()
					{
						if(this.ch == "/")
						{
							this.nextChar();
							switch(this.ch)
							{
							case "/" :
								do
								{
									this.nextChar();
								}
								while(this.ch != "\n" && this.ch != "")
								this.nextChar();
								break;
							case "*" :
								this.nextChar();
								while(true)
								{
									if(this.ch == "*")
									{
										this.nextChar();
										if(this.ch == "/")
										{
											break;
										}
									}
									else
									{
										this.nextChar();
									}
									if(this.ch == "")
									{
										this.parseError("Multi-line comment not closed");
									}
								}
								this.nextChar();
								break;
							default :
								this.parseError("Unexpected " + this.ch + " encountered (expecting \'/\' or \'*\' )");
							}
						}
					}

					private isDigit(ch:string):boolean
					{
						return ch >= "0" && ch <= "9";
					}

					private readString():com.adobe.serialization.json.JSONToken
					{
						var hexValue:string = <any>null;
						var i:number = flash.checkInt(0);
						var token:com.adobe.serialization.json.JSONToken = new com.adobe.serialization.json.JSONToken();
						token.type = com.adobe.serialization.json.JSONTokenType.STRING;
						var string:any = <any>"";
						this.nextChar();
						while(this.ch != "\"" && this.ch != "")
						{
							if(this.ch == "\\")
							{
								this.nextChar();
								switch(this.ch)
								{
								case "\"" :
									string = string + "\"";
									break;
								case "/" :
									string = string + "/";
									break;
								case "\\" :
									string = string + "\\";
									break;
								case "b" :
									string = string + "\b";
									break;
								case "f" :
									string = string + "\f";
									break;
								case "n" :
									string = string + "\n";
									break;
								case "r" :
									string = string + "\r";
									break;
								case "t" :
									string = string + "\t";
									break;
								case "u" :
									hexValue = "";
									for(i = flash.checkInt(0); i < 4; i++)
									{
										if(<any>!this.isHexDigit(this.nextChar()))
										{
											this.parseError(" Excepted a hex digit, but found: " + this.ch);
										}
										hexValue = hexValue + this.ch;
									}
									string = string + String.fromCharCode(flash.tranint(hexValue,16));
									break;
								default :
									string = string + ("\\" + this.ch);
								}
							}
							else
							{
								string = string + this.ch;
							}
							this.nextChar();
						}
						if(this.ch == "")
						{
							this.parseError("Unterminated string literal");
						}
						this.nextChar();
						token.value = string;
						return token;
					}

					private nextChar():string
					{
						return this.ch = this.jsonString.charAt(this.loc++);
					}

					public getNextToken():com.adobe.serialization.json.JSONToken
					{
						var possibleTrue:string = <any>null;
						var possibleFalse:string = <any>null;
						var possibleNull:string = <any>null;
						var token:com.adobe.serialization.json.JSONToken = new com.adobe.serialization.json.JSONToken();
						this.skipIgnored();
						switch(this.ch)
						{
						case "{" :
							token.type = com.adobe.serialization.json.JSONTokenType.LEFT_BRACE;
							token.value = "{";
							this.nextChar();
							break;
						case "}" :
							token.type = com.adobe.serialization.json.JSONTokenType.RIGHT_BRACE;
							token.value = "}";
							this.nextChar();
							break;
						case "[" :
							token.type = com.adobe.serialization.json.JSONTokenType.LEFT_BRACKET;
							token.value = "[";
							this.nextChar();
							break;
						case "]" :
							token.type = com.adobe.serialization.json.JSONTokenType.RIGHT_BRACKET;
							token.value = "]";
							this.nextChar();
							break;
						case "," :
							token.type = com.adobe.serialization.json.JSONTokenType.COMMA;
							token.value = ",";
							this.nextChar();
							break;
						case ":" :
							token.type = com.adobe.serialization.json.JSONTokenType.COLON;
							token.value = ":";
							this.nextChar();
							break;
						case "t" :
							possibleTrue = "t" + this.nextChar() + this.nextChar() + this.nextChar();
							if(possibleTrue == "true")
							{
								token.type = com.adobe.serialization.json.JSONTokenType.TRUE;
								token.value = true;
								this.nextChar();
							}
							else
							{
								this.parseError("Expecting \'true\' but found " + possibleTrue);
							}
							break;
						case "f" :
							possibleFalse = "f" + this.nextChar() + this.nextChar() + this.nextChar() + this.nextChar();
							if(possibleFalse == "false")
							{
								token.type = com.adobe.serialization.json.JSONTokenType.FALSE;
								token.value = false;
								this.nextChar();
							}
							else
							{
								this.parseError("Expecting \'false\' but found " + possibleFalse);
							}
							break;
						case "n" :
							possibleNull = "n" + this.nextChar() + this.nextChar() + this.nextChar();
							if(possibleNull == "null")
							{
								token.type = com.adobe.serialization.json.JSONTokenType.NULL;
								token.value = null;
								this.nextChar();
							}
							else
							{
								this.parseError("Expecting \'null\' but found " + possibleNull);
							}
							break;
						case "\"" :
							token = this.readString();
							break;
						default :
							if(this.isDigit(this.ch) || this.ch == "-")
							{
								token = this.readNumber();
							}
							else
							{
								if(this.ch == "")
								{
									return null;
								}
								this.parseError("Unexpected " + this.ch + " encountered");
							}
						}
						return token;
					}

					private skipWhite()
					{
						while(this.isWhiteSpace(this.ch))
						{
							this.nextChar();
						}
					}

					public parseError(message:string)
					{
						throw new com.adobe.serialization.json.JSONParseError(message,this.loc,this.jsonString).message;
					}

					private isWhiteSpace(ch:string):boolean
					{
						return ch == " " || ch == "\t" || ch == "\n" || ch == "\r";
					}

					private skipIgnored()
					{
						var originalLoc:number = flash.checkInt(0);
						do
						{
							originalLoc = flash.checkInt(this.loc);
							this.skipWhite();
							this.skipComments();
						}
						while(originalLoc != this.loc)
					}

					private isHexDigit(ch:string):boolean
					{
						var uc:string = ch.toUpperCase();
						return this.isDigit(ch) || uc >= "A" && uc <= "F";
					}

					private readNumber():com.adobe.serialization.json.JSONToken
					{
						var token:com.adobe.serialization.json.JSONToken = new com.adobe.serialization.json.JSONToken();
						token.type = com.adobe.serialization.json.JSONTokenType.NUMBER;
						var input:any = <any>"";
						if(this.ch == "-")
						{
							input = input + "-";
							this.nextChar();
						}
						if(<any>!this.isDigit(this.ch))
						{
							this.parseError("Expecting a digit");
						}
						if(this.ch == "0")
						{
							input = input + this.ch;
							this.nextChar();
							if(this.isDigit(this.ch))
							{
								this.parseError("A digit cannot immediately follow 0");
							}
						}
						else
						{
							while(this.isDigit(this.ch))
							{
								input = input + this.ch;
								this.nextChar();
							}
						}
						if(this.ch == ".")
						{
							input = input + ".";
							this.nextChar();
							if(<any>!this.isDigit(this.ch))
							{
								this.parseError("Expecting a digit");
							}
							while(this.isDigit(this.ch))
							{
								input = input + this.ch;
								this.nextChar();
							}
						}
						if(this.ch == "e" || this.ch == "E")
						{
							input = input + "e";
							this.nextChar();
							if(this.ch == "+" || this.ch == "-")
							{
								input = input + this.ch;
								this.nextChar();
							}
							if(<any>!this.isDigit(this.ch))
							{
								this.parseError("Scientific notation number needs exponent value");
							}
							while(this.isDigit(this.ch))
							{
								input = input + this.ch;
								this.nextChar();
							}
						}
						var num:number = flash.trannumber(input);
						if(isFinite(num) && <any>!isNaN(num))
						{
							token.value = num;
							return token;
						}
						this.parseError("Number " + num + " is not valid!");
						return null;
					}

				}
			}
		}
	}
}

