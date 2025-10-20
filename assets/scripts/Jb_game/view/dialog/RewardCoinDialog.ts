import { _decorator, Component, Node } from 'cc';
import { ViewManager } from '../../manager/ViewManger_Jb';
import { CoinManger } from '../../manager/CoinManger_Jb';
import { adHelper } from '../../../Jb_common/native/AdHelper';
import { Button } from 'cc';
import { ActionEffect } from '../../../Jb_common/effects/ActionEffect';
import { DialogComponent } from '../../../Jb_common/ui/DialogComtnet';
import { NumFont } from '../../../Jb_common/ui/NumFont';
import { MathUtil } from '../../../Jb_common/utils/MathUtil';
import { delay } from '../../../Jb_common/utils/TimeUtil';
import { isVaild } from '../../../Jb_common/utils/ViewUtil';
import { GameStorage } from '../../GameStorage_Jb';
import { RewardType } from '../../GameUtil_Jb';
import { AudioManager } from '../../manager/AudioManager_Jb';
const { ccclass, property } = _decorator;

@ccclass('RewardCoinDialog')
export class RewardCoinDialog extends DialogComponent {
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnNo: Node = null;
    @property(NumFont)
    num: NumFont = null;


    type: RewardType;
    cb: Function;
    private rewardNum: number = 1;//奖励数量
    private reciveNum: number = 1;//看广告领取倍率
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.init(args.num);
        this.cb = args.cb;
    }
    init(num: number) {
        AudioManager.playEffect("reward", 2);

        this.showReciveNum(2);
        this.rewardNum = num;
        this.num.num = num;

        this.btnNo.once(Button.EventType.CLICK, this.onBtnNo, this);
        this.btnReceive.on(Button.EventType.CLICK, this.onBtnReceive, this);

        this.btnNo.active = false;
        delay(1.5, this.btnNo).then(() => {
            if (!isVaild(this.btnNo)) return;
            this.btnNo.active = true;
            ActionEffect.fadeIn(this.btnNo, 0.5);
        })

    }

    onBtnNo() {
        this.closeAni();
        if (this.type != RewardType.cash)
            this.addReward(this.rewardNum);
        if (GameStorage.getCurLevel() > 1) {//第二局后有概率弹插屏广告
            adHelper.timesToShowInterstitial();
        }
    }
    onBtnReceive() {
        adHelper.showRewardVideo(() => {
            this.closeAni();
            this.addReward(this.rewardNum * this.reciveNum);
        }, ViewManager.adNotReady)
    }
    private addReward(num: number) {
        this.cb?.();
        CoinManger.instance.addCoin(num, false);
        ViewManager.showRewardAni(RewardType.coin, num, () => { });
    }

    private showReciveNum(n: number) {
        this.reciveNum = n;
        this.btnReceive.getChildByName("r1").active = n == 1;
        this.btnReceive.getChildByName("r2").active = n == 2;
    }


}


