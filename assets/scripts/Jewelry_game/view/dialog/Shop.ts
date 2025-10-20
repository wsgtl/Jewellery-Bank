import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Jewelry_common/ui/ViewComponent';
import { Button } from 'cc';
import { GameStorage } from '../../GameStorage_Jewelry';
import { GameUtil, PropType } from '../../GameUtil_Jewelry';
import { ViewManager } from '../../manager/ViewManger_Jewelry';
import { ButtonLock } from '../../../Jewelry_common/Decorator';
import { tween } from 'cc';
import { ActionEffect } from '../../../Jewelry_common/effects/ActionEffect';
import { CoinManger } from '../../manager/CoinManger';
import { AudioManager } from '../../manager/AudioManager_Jewelry';
const { ccclass, property } = _decorator;

@ccclass('Shop')
export class Shop extends ViewComponent {
    @property([Node])
    items: Node[] = [];

    onLoad() {
        this.items.forEach((v, i) => {
            v.getChildByName("btn").on(Button.EventType.CLICK, () => {
                const coin = GameStorage.getCoin();
                if (coin < GameUtil.PropCoins) {
                    // ViewManager.showTips("No enough gold coin");
                    ViewManager.showGold();
                    return;
                }
                this.click(i + 1, v);
            }, this);
        })
    }
    @ButtonLock(1)
    private click(type: PropType, node: Node) {
        const add = node.getChildByName("add");
        const icon = node.getChildByName("icon");
        tween(icon)
            .by(0.2, { y: 30 })
            .by(0.2, { y: -30 })
            .start();
        add.y = 100;
        add.active = true;
        tween(add)
            .to(0.4, { y: 140 })
            .start();
        ActionEffect.fadeOut(add, 0.4);
        CoinManger.instance.addCoin(-GameUtil.PropCoins);
        GameStorage.addPropNum(type, 1);
        AudioManager.playEffect("good");
    }
}


