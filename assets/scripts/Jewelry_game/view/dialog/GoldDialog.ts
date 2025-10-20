import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Jewelry_common/ui/DialogComtnet';
import { CoinManger } from '../../manager/CoinManger';
import { Button } from 'cc';
import { GameUtil, RewardType } from '../../GameUtil_Jewelry';
import { adHelper } from '../../../Jewelry_common/native/AdHelper';
import { ViewManager } from '../../manager/ViewManger_Jewelry';
import { GameStorage } from '../../GameStorage_Jewelry';
import { EventTracking } from '../../../Jewelry_common/native/EventTracking';
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
        EventTracking.sendEventCoin(GameStorage.getCoin());
        adHelper.showRewardVideo(()=>{
            this.closeAni();
            CoinManger.instance.addCoin(GameUtil.ReceiveCoins);
            ViewManager.showRewardAni(RewardType.coin,GameUtil.ReceiveCoins,()=>{});
        },ViewManager.adNotReady)
      
    }
}


