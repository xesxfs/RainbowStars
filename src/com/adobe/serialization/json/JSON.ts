module com {
	export module adobe {
		export module serialization {
			export module json {
				export class JSON extends egret.HashObject {

					public constructor()
					{
						super();
						super();
					}

					public static decode(s:string):any
					{
						var decoder:com.adobe.serialization.json.JSONDecoder = new com.adobe.serialization.json.JSONDecoder(s);
						return decoder.getValue();
					}

					public static encode(o:any):string
					{
						var encoder:com.adobe.serialization.json.JSONEncoder = new com.adobe.serialization.json.JSONEncoder(o);
						return encoder.getString();
					}

				}
			}
		}
	}
}

