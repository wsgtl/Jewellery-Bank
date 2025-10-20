import { _decorator, Component, Node } from 'cc';
import { DialogComponent } from '../../../Jb_common/ui/DialogComtnet';
import { Button } from 'cc';
import { adHelper } from '../../../Jb_common/native/AdHelper';
import { ViewManager } from '../../manager/ViewManger_Jb';
import { GameStorage } from '../../GameStorage_Jb';
const { ccclass, property } = _decorator;

@ccclass('AddCell')
export class AddCell extends DialogComponent {
    @property(Node)
    btnFree: Node = null;

    private cb: Function;
    onLoad() {
        this.btnFree.on(Button.EventType.CLICK, this.onBtnFree, this);
    }
    show(parent: Node, args?: any): void {
        parent.addChild(this.node);
        this.cb = args.cb;
    }

    onBtnFree() {
        this.btnFree.getComponent(Button).interactable = false;
        adHelper.showRewardVideo(() => {
            GameStorage.setCellUnlock(GameStorage.getCurLevel());
            this.closeAni();
            this.cb?.();
        }, () => {
            ViewManager.adNotReady();
            this.btnFree.getComponent(Button).interactable = true;
        })
    }
}


