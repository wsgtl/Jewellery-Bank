import { _decorator, Component, Node } from 'cc';
import ViewComponent from '../../../Jb_common/ui/ViewComponent';
import { Button } from 'cc';
import { NumFont } from '../../../Jb_common/ui/NumFont';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { FormatUtil } from '../../../Jb_common/utils/FormatUtil';
import { GameStorage } from '../../GameStorage_Jb';
import { AudioManager } from '../../manager/AudioManager_Jb';
import { ActionEffect } from '../../../Jb_common/effects/ActionEffect';
import { tween } from 'cc';
import { ViewManager } from '../../manager/ViewManger_Jb';
import { delay } from '../../../Jb_common/utils/TimeUtil';
import { adHelper } from '../../../Jb_common/native/AdHelper';
import { MathUtil } from '../../../Jb_common/utils/MathUtil';
import { GameOverData } from '../../GameUtil_Jb';
import { DialogComponent } from '../../../Jb_common/ui/DialogComtnet';
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
            adHelper.showRewardVideo("游戏结束弹窗",() => {
                this.node.destroy();
                args.reviveCb?.();
            },()=>{
                ViewManager.adNotReady();
                this.setCanClick(true);
            })
        })
       
        AudioManager.playEffect("failed");
        adHelper.showInterstitial("游戏结束弹窗");
    }
  

    private setCanClick(v: boolean) {
        this.btnRevive.getComponent(Button).interactable = v;
        this.btnCancel.getComponent(Button).interactable = v;
    }
    

}


