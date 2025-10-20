import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Jewelry_common/ui/ViewComponent';
import { Button } from 'cc';
import { NumFont } from '../../../Jewelry_common/ui/NumFont';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { FormatUtil } from '../../../Jewelry_common/utils/FormatUtil';
import { GameStorage } from '../../GameStorage_Jewelry';
import { AudioManager } from '../../manager/AudioManager_Jewelry';
import { ActionEffect } from '../../../Jewelry_common/effects/ActionEffect';
import { tween } from 'cc';
import { ViewManager } from '../../manager/ViewManger_Jewelry';
import { delay } from '../../../Jewelry_common/utils/TimeUtil';
import { adHelper } from '../../../Jewelry_common/native/AdHelper';
import { MathUtil } from '../../../Jewelry_common/utils/MathUtil';
import { GameOverData } from '../../GameUtil_Jewelry';
import { DialogComponent } from '../../../Jewelry_common/ui/DialogComtnet';
const { ccclass, property } = _decorator;

@ccclass('GameOver')
export class GameOver extends DialogComponent {
    @property(Node)
    btnRevive: Node = null;
    @property(Node)
    btnCancel: Node = null;



    async show(parent: Node, args?: any) {
        parent.addChild(this.node);
        this.btnCancel.on(Button.EventType.CLICK, () => {
            this.setCanClick(false);
            // ViewManager.showHome();
            args.tryagainCb();
        })

        this.btnRevive.on(Button.EventType.CLICK, () => {
            AudioManager.playEffect("btn");
            this.setCanClick(false);
            adHelper.showRewardVideo(() => {
                this.node.destroy();
                args.reviveCb?.();
            },()=>{
                ViewManager.adNotReady();
                this.setCanClick(true);
            })
        })
       
        AudioManager.playEffect("failed");
        adHelper.showInterstitial();
    }
  

    private setCanClick(v: boolean) {
        this.btnRevive.getComponent(Button).interactable = v;
        this.btnCancel.getComponent(Button).interactable = v;
    }
    

}


