import { native } from "cc";
import { sys } from "cc";

export enum EventCode {
    page_loading = "page_loading",//进入加载页
    page_welcome_click = "page_welcome_click",//欢迎页点击
    page_click_play = "page_click_play",//点击play
    game_click_merge = "game_click_merge",//点击合成现金
    game_reward = "game_reward",//领奖弹框弹出
    game_reward_video = "game_reward_video",//点击领取现金（看视频）
    game_click_cash = "game_click_cash",//点击现金get
    game_click_cash_close = "game_click_cash_close",//点击关闭钱包
    game_withdraw = "game_withdraw",//收集物品提现100弹框弹出
    game_withdraw_close = "game_withdraw_close",//点击关闭提现弹框
    game_buy_return = "game_buy_return",//点击看视频购买“回退”道具
    game_buy_rearrange = "game_buy_rearrange",//点击看视频购买“重排”道具
    game_buy_position = "game_buy_position",//点击看视频购买“格子”
    game_success = "game_success",//过关成功弹框弹出
    home_checkin = "home_checkin",//签到弹框弹出
    check_checkin = "check_checkin",//点击签到
    check_reward = "check_reward",//签到领奖
    check_close = "check_close",//关闭签到
    home_click_cash = "home_click_cash",//点击cash图标
    home_click_check = "home_click_check",//点击签到图标
    home_click_game = "home_click_game",//点击游戏more图标
    home_click_shop = "home_click_shop",//点击商店
    home_click_task = "home_click_task",//点击任务
    task_claim_reward = "task_claim_reward",//领取任务奖励
    home_buy_coins = "home_buy_coins",//点击购买金币
    home_click_play = "home_click_play",//点击首页play
}
export namespace EventTracking {
    /**上报事件 */
    export function sendEvent(data: Object) {
        const str = JSON.stringify(data);
        // console.log("上报",str);
        if (sys.platform === sys.Platform.ANDROID) {
            native.jsbBridgeWrapper.dispatchEventToNative("sendEvent", str);
        }
    }
    /**上报埋点 */
    export function sendEventCode(code: EventCode) {
        const data = { event_type: code };
        sendEvent(data);
    }
    /**上报通过第几关 */
    export function sendEventLevel(level: number) {
        const data = { event_type: "level_x", level };
        sendEvent(data);
    }
    /**计算钱数量并上报钱值事件 */
    export function sendEventCoin(num: number) {
        // const rateNum: number = num / LangStorage.getData().rate;//要除以汇率
        // const arr = getCoinEvent();
        // for (let i = 0; i < CoinEvent.length; i++) {
        //     const cn = CoinEvent[i];
        //     if (rateNum >= cn) {
        //         if (arr.indexOf(cn) == -1) {//超过数值了，发送事件并记录钱值
        //             const data = { event_type: "coin_" + cn };
        //             sendEvent(data);
        //             setCoinEvent(cn);
        //         }
        //     }
        // }

    }

    const key = "Jb_Event";
    // export function setCoinEvent(num: number) {
    //     const arr = getCoinEvent();
    //     arr.push(num);
    //     BaseStorageNS.setItem(key, JSON.stringify(arr));
    // }

    // export function getCoinEvent(): number[] {
    //     const item = BaseStorageNS.getItem(key);
    //     let arr: number[];
    //     if (item) {
    //         arr = JSON.parse(item);
    //     }
    //     return arr ?? [];
    // }

    // const CoinEvent = [100, 150, 200, 250, 300, 400, 550, 700, 880, 1000];


}