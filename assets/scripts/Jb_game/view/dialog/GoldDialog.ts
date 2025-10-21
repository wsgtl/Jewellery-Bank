import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Jb_common/ui/DialogComtnet';
import { CoinManger } from '../../manager/CoinManger_Jb';
import { Button } from 'cc';
import { GameUtil, RewardType } from '../../GameUtil_Jb';
import { adHelper } from '../../../Jb_common/native/AdHelper';
import { ViewManager } from '../../manager/ViewManger_Jb';
import { GameStorage } from '../../GameStorage_Jb';
import { EventCode, EventTracking } from '../../../Jb_common/native/EventTracking';
const { ccclass, property } = _decorator;

@ccclass('GoldDialog')
export class GoldDialog extends DialogComponent {
    @property(Node)
    btnReceive: Node = null;
    protected onLoad(): void {
        CoinManger.instance.setDialog(this.node);
        this.btnReceive.on(Button.EventType.CLICK, this.onReceive, this);
    }
    protected onDestroy(): void {
        CoinManger.instance.setDialog(null);
    }
    onReceive() {
        EventTracking.sendEventCode(EventCode.home_buy_coins);
        EventTracking.sendEventCoin(GameStorage.getCoin());
        adHelper.showRewardVideo("看视频加金币弹窗",()=>{
            this.closeAni();
            CoinManger.instance.addCoin(GameUtil.ReceiveCoins);
            ViewManager.showRewardAni(RewardType.coin,GameUtil.ReceiveCoins,()=>{});
        },ViewManager.adNotReady)
      
    }
}


