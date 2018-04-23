module mochi {
	export class MochiBot extends egret.Sprite {

		public constructor()
		{
			super();
		}

		public static track(parent:egret.Sprite,tag:string):mochi.MochiBot
		{
			if(flash.Security["sandboxType"] == "localWithFile")
			{
				return null;
			}
			var self:mochi.MochiBot = new mochi.MochiBot();
			parent.addChild(self);
			flash.Security["allowDomain"]("*");
			flash.Security["allowInsecureDomain"]("*");
			var server:string = "http://core.mochibot.com/my/core.swf";
			var lv:egret.URLVariables = new egret.URLVariables();
			lv["sb"] = flash.Security["sandboxType"];
			lv["v"] = flash.Capabilities.version;
			lv["swfid"] = tag;
			lv["mv"] = "8";
			lv["fv"] = "9";
			var url:string = self.root["loaderInfo"].loaderURL;
			if(url.indexOf("http") == 0)
			{
				lv["url"] = url;
			}
			else
			{
				lv["url"] = "local";
			}
			var req:egret.URLRequest = new egret.URLRequest(server);
			req.contentType = "application/x-www-form-urlencoded";
			req.method = egret.URLRequestMethod.POST;
			req.data = lv;
			var loader:flash.Loader = new flash.Loader();
			self.addChild(loader);
			loader.load(req);
			return self;
		}

	}
}

flash.extendsClass("mochi.MochiBot","egret.Sprite")
