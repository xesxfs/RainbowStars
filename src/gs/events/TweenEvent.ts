module gs {
	export module events {
		export class TweenEvent extends egret.Event {
			public static UPDATE:string;
			public static START:string;
			public static version:number;
			public static COMPLETE_static_gs_events_TweenEvent:string;
			public info:any;

			public constructor($type:string,$info:any = null,$bubbles:boolean = false,$cancelable:boolean = false)
			{
				super($type,$bubbles,$cancelable);
				this.info = $info;
			}

			public clone():egret.Event
			{
				return new gs.events.TweenEvent(this.type,this.info,this.bubbles,this.cancelable);
			}

		}
	}
}

gs.events.TweenEvent.UPDATE = "update";
gs.events.TweenEvent.START = "start";
gs.events.TweenEvent.version = 0.9;
gs.events.TweenEvent.COMPLETE_static_gs_events_TweenEvent = "complete";
flash.extendsClass("gs.events.TweenEvent","egret.Event")
