import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Jb_common/ui/DialogComtnet';
import { GameUtil, PropType } from '../../GameUtil_Jb';
import { Button } from 'cc';
import { GameStorage } from '../../GameStorage_Jb';
import { ViewManager } from '../../manager/ViewManger_Jb';
import { CoinManger } from '../../manager/CoinManger_Jb';
import { adHelper, AdHelper } from '../../../Jb_common/native/AdHelper';
import { ActionEffect } from '../../../Jb_common/effects/ActionEffect';
import { tween } from 'cc';
import { v3 } from 'cc';
import { ButtonLock, GlobalButtonLock } from '../../../Jb_common/Decorator';
import { AudioManager } from '../../manager/AudioManager_Jb';
import { i18n } from '../../../Jb_common/i18n/I18nManager';
import { EventCode, EventTracking } from '../../../Jb_common/native/EventTracking';
const { ccclass, property } = _decorator;

@ccclass('PropDialog')
export class PropDialog extends DialogComponent {
    @property(Node)
    btnReceive: Node = null;
    @property(Node)
    btnCoin: Node = null;
    @property(Node)
    add: Node = null;
    @property(Node)
    shine: Node = null;
    @property([Node])
    icons: Node[] = [];
    @property([Node])
    strs: Node[] = [];
    type: PropType;
    cb: Function;
    show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.cb = args.cb;
        this.init(args.type);
        this.btnReceive.on(Button.EventType.CLICK, this.onReceive, this);
        this.btnCoin.on(Button.EventType.CLICK, this.onCoin, this);

    }
    @GlobalButtonLock(1)
    private onReceive() {
        adHelper.showRewardVideo("加道具弹窗",() => {
            this.addProp();
        },ViewManager.adNotReady)
    }
    @GlobalButtonLock(1)
    private onCoin() {
        const coin = GameStorage.getCoin();
        if (coin < GameUtil.PropCoins) {
            // ViewManager.showTips("No enough gold coin");
            ViewManager.showTips(i18n.string("str_nogold"));
            return;
        }
        CoinManger.instance.addCoin(-GameUtil.PropCoins);
        this.addProp();
    }
    init(type: PropType) {
        this.type = type;
        this.icons.forEach((v, i) => { v.active = i == type - 1 });
        this.strs.forEach((v, i) => { v.active = i == type - 1 });
    }
    addProp() {
        EventTracking.sendEventCode(this.type==1? EventCode.game_buy_return:EventCode.game_buy_rearrange);
        GameStorage.addPropNum(this.type, 1);
        this.cb?.();

        //动画
        this.add.y = 0;
        this.add.active = true;
        tween(this.add)
            .to(0.5, { y: 140 })
            .start();
        ActionEffect.fadeOut(this.add, 0.5);

        tween(this.shine)
        .to(0.4,{scale:v3(1.5,1.5)})
        .to(0.4,{scale:v3(1,1)})
        .start();
        AudioManager.playEffect("good");
    }
}


