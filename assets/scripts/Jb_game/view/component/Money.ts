import { _decorator, Component, Node } from 'cc';
import { NumFont } from '../../../Jb_common/ui/NumFont';
import { GameStorage } from '../../GameStorage_Jb';
import { Button } from 'cc';
import { FormatUtil } from '../../../Jb_common/utils/FormatUtil';
import { ButtonLock } from '../../../Jb_common/Decorator';
import { MoneyManger } from '../../manager/MoneyManger';
import { ActionEffect } from '../../../Jb_common/effects/ActionEffect';
import { delay } from '../../../Jb_common/utils/TimeUtil';
import { Tween } from 'cc';
import { UIUtils } from '../../../Jb_common/utils/UIUtils';
import { LangStorage } from '../../../Jb_common/localStorage/LangStorage';
import { v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Money')
export class Money extends Component {
    @property(NumFont)
    num: NumFont = null;
    @property(Node)
    btnGet: Node = null;
    @property(Node)
    tip: Node = null;

    protected onLoad(): void {
        this.num.aligning = 1;
        this.showCurMoney();
        this.btnGet.on(Button.EventType.CLICK, this.onGet, this);
        MoneyManger.instance.setMoneyNode(this);
    }
    showNum(num: number) {
        let n: string;
        if (num >= 1000) {
            n = Math.floor(num).toString();
        } else {
            n = FormatUtil.toXX_XX(num);
        }
        const str = LangStorage.getData().symbol + n
        this.num.num = str;
        const sc = str.length > 7 ? (7 / str.length) : 1;
        this.num.node.scale = v3(sc, sc);
    }
    showCurMoney() {
        this.showNum(GameStorage.getMoney());
    }
    @ButtonLock(1)
    onGet() {
        MoneyManger.instance.showDialog();
    }

    showTips() {
        Tween.stopAllByTarget(this.tip);
        UIUtils.setAlpha(this.tip, 1);
        this.tip.active = true;
        ActionEffect.scale(this.tip, 0.3, 1, 0, "backOut");
        delay(4, this.tip).then(() => {
            ActionEffect.fadeOut(this.tip);
        })
    }
    /**设置按钮是否可点击 */
    setBtnInter(v: boolean) {
        this.btnGet.getComponent(Button).interactable = v;
    }
}


