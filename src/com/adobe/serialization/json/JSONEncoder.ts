module com {
	export module adobe {
		export module serialization {
			export module json {
				export class JSONEncoder extends egret.HashObject {
					private jsonString:string;

					public constructor(value:any)
					{
						super();
						super();
						this.jsonString = this.convertToString(value);
					}

					private escapeString(str:string):string
					{
						var ch:string = <any>null;
						var hexCode:string = <any>null;
						var zeroPad:string = <any>null;
						var s:any = <any>"";
						var len:number = str.length;
						for(var i:number = flash.checkInt(0);i < len; i++)
						{
							ch = str.charAt(i);
							switch(ch)
							{
							case "\"" :
								s = s + "\\\"";
								break;
							case "\\" :
								s = s + "\\\\";
								break;
							case "\b" :
								s = s + "\\b";
								break;
							case "\f" :
								s = s + "\\f";
								break;
							case "\n" :
								s = s + "\\n";
								break;
							case "\r" :
								s = s + "\\r";
								break;
							case "\t" :
								s = s + "\\t";
								break;
							default :
								if(ch < " ")
								{
									hexCode = ch.charCodeAt(0).toString(16);
									zeroPad = hexCode.length == 2?"00":"000";
									s = s + ("\\u" + zeroPad + hexCode);
								}
								else
								{
									s = s + ch;
								}
							}
						}
						return "\"" + s + "\"";
					}

					private arrayToString(a:Array<any>):string
					{
						var s:any = <any>"";
						for(var i:number = flash.checkInt(0);i < a.length; i++)
						{
							if(s.length > 0)
							{
								s = s + ",";
							}
							s = s + this.convertToString(a[i]);
						}
						return "[" + s + "]";
					}

					public getString():string
					{
						return this.jsonString;
					}

					private objectToString(o:any):string
					{
						var value:any = <any>null;
						var key:string = <any>null;
						var v:flash.XML = <any>null;
						var s:string = "";
						var classInfo:flash.XML = <any>flash.describeType(o);
						if(classInfo.dotAlt("name").toString() == "Object")
						{
							for(key in o)
							{
								value = o[key];
								if(<any>!(flash.As3is(value,Function)))
								{
									if(s.length > 0)
									{
										s = s + ",";
									}
									s = s + (this.escapeString(key) + ":" + this.convertToString(value));
								}
							}
						}
						else
						{
							var v_key_a;
							for(v_key_a in classInfo.dotDoubleStar().dotExpr(name() == "variable",name() == "accessor","||"))
							{
								v = classInfo.dotDoubleStar().dotExpr(name() == "variable",name() == "accessor","||")[v_key_a];
								if(s.length > 0)
								{
									s = s + ",";
								}
								s = s + (this.escapeString(v.dotAlt("name").toString()) + ":" + this.convertToString(o[v.dotAlt("name")]));
							}
						}
						return "{" + s + "}";
					}

					private convertToString(value:any):string
					{
						if(flash.As3is(value,"string"))
						{
							return this.escapeString(<string>value);
						}
						if(flash.As3is(value,"number"))
						{
							return <any>!<any>!isFinite(<number>value)?value.toString():"null";
						}
						if(flash.As3is(value,"boolean"))
						{
							return <any>!<any>!value?"true":"false";
						}
						if(flash.As3is(value,Array))
						{
							return this.arrayToString(flash.As3As(value,Array));
						}
						if(flash.As3is(value,Object) && value != null)
						{
							return this.objectToString(value);
						}
						return "null";
					}

				}
			}
		}
	}
}

