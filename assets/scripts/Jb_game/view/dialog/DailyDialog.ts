import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Jb_common/ui/ViewComponent';
import { Button } from 'cc';
import { DialogComponent } from '../../../Jb_common/ui/DialogComtnet';
import { GameStorage } from '../../GameStorage_Jb';
import { GameUtil, RewardType } from '../../GameUtil_Jb';
import { ViewManager } from '../../manager/ViewManger_Jb';
import { CoinManger } from '../../manager/CoinManger_Jb';
import { MoneyManger } from '../../manager/MoneyManger';
import { ReddotManager } from '../../manager/ReddotManager';
import { i18n } from '../../../Jb_common/i18n/I18nManager';
import { EventCode, EventTracking } from '../../../Jb_common/native/EventTracking';
const { ccclass, property } = _decorator;

@ccclass('DailyDialog')
export class DailyDialog extends DialogComponent {
    @property([Node])
    days: Node[] = [];

    onLoad(): void {
        EventTracking.sendEventCode(EventCode.home_checkin);
        this.init();
        for (let i = 0; i < 7; i++) {
            const dayNode = this.days[i];
            dayNode.on(Button.EventType.CLICK, () => {
                this.touch(dayNode, i + 1);
            }, this);
        }
    }
    private touch(node: Node, day: number) {
        const daily = GameStorage.getDaily();

        if (daily.isReceive) {
            // ViewManager.showTips("Already received it today");
            ViewManager.showTips(i18n.string("str_aritoday"));
        } else {
            if (daily.weekDay == day) {
                EventTracking.sendEventCode(EventCode.check_checkin);
                const num = GameUtil.SigninCoins[day - 1];
                
                // CoinManger.instance.addCoin(num, false);
                // ViewManager.showRewardAni(RewardType.coin, num, () => { })
               
               
                ViewManager.showRewardCoin(num,()=>{ 
                    EventTracking.sendEventCode(EventCode.check_reward);
                    GameStorage.signin(GameUtil.getCurDay());
                    this.showReceive(node, true);
                    ReddotManager.instance.showSigninDot();
                });
            }
        }



    }
    onDestroy(): void {
        EventTracking.sendEventCode(EventCode.check_close);
    }
    private init() {
        const daily = GameStorage.getDaily();
        if (daily.isReceive) {
            const ld = daily.lastDay;
            const curDay = GameUtil.getCurDay();
            if (curDay - ld > 0) {//刷新新一天
                GameStorage.nextDay(curDay);
            }
        }
        this.showDaily();
    }
    private showDaily() {
        const daily = GameStorage.getDaily();
        for (let i = 0; i < 7; i++) {
            const dayNode = this.days[i];
            const active = (i + 1) < daily.weekDay || ((i + 1) == daily.weekDay && daily.isReceive);
            this.showReceive(dayNode, active);
        }
    }
    private showReceive(node: Node, v: boolean) {
        const mask = node.getChildByName("mask");
        const gou = node.getChildByName("gou");
        mask.active = v;
        gou.active = v;
    }
    private getCurDay() {
        const ct = Date.now();
        // 转换为天数（1天 = 24小时 × 60分钟 × 60秒 × 1000毫秒）
        return Math.floor(ct / (24 * 60 * 60 * 1000));
        // return GameStorage.getDaily().testDay;//测试
    }
}


