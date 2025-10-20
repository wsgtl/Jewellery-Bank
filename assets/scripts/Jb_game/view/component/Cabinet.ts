import { _decorator, Component, Node } from 'cc';
import { UIUtils } from '../../../Jb_common/utils/UIUtils';
import { CabinetData, CellData, ColletType, GameUtil } from '../../GameUtil_Jb';
import { EventTouch } from 'cc';
import { Vec3 } from 'cc';
import { v3 } from 'cc';
import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { Colletion } from './Colletion';
import { CellContent } from './CellContent';
import { GameManger } from '../../manager/GameManager_Jb';
import { isVaild } from '../../../Jb_common/utils/ViewUtil';
import { ActionEffect } from '../../../Jb_common/effects/ActionEffect';
import { tween } from 'cc';
const { ccclass, property } = _decorator;

/**柜子 */
@ccclass('Cabinet')
export class Cabinet extends Component {
    @property(Node)
    cabinet: Node = null;
    @property(Node)
    content: Node = null;
    @property(Prefab)
    colletionPrefab: Prefab = null;

    data: CabinetData;
    /**宽度 */
    private contentW: number;
    public isClear: boolean = false;
    public collects: Colletion[] = [];
    init(len: number, x: number, y: number, index: number) {
        this.data = { x, y, len: len, index };
        UIUtils.setWidth(this.cabinet, GameUtil.CellW * len);
        this.content.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.contentW = GameUtil.CellW * len - 20;
        UIUtils.setWidth(this.content, this.contentW);
    }

    public createCollection(cd: CellData) {
        if (!cd) return;
        const pos = this.getPos(cd.index);
        const c = instantiate(this.colletionPrefab);
        this.content.addChild(c);
        c.position = pos;
        const colletion = c.getComponent(Colletion);
        colletion.init(cd);
        colletion.setParent(this);
        this.collects[cd.index] = colletion;
    }

    private onTouchStart(e: EventTouch) {
        if (GameManger.instance.isAni || GameManger.instance.isGameOver) return;
        const pos = UIUtils.touchNodeChildLocation(this.content, e);
        const cw = this.contentW / this.data.len;
        const index = Math.floor(pos.x / cw);
        // console.log("点击x:" + (index + this.data.x), "y:" + this.data.y);
        const co = this.collects[index];
        if (co && co.inCabinet) {
            GameManger.instance.moveToCell(co);
        }
    }

    /**检查柜子是否清空 */
    public async checkClear() {
        let num = 0;
        this.collects.forEach(v => {
            if (isVaild(v) && v.inCabinet) {
                num++;
            }
        })
        if (num > 0) {
            return false;
        } else {
            this.isClear = true;
            await ActionEffect.fadeOut(this.node, 0.2);
            this.node.destroy();
            GameManger.instance.clearCabinet();
        }
    }
    /**根据收集物的排序计算位置 */
    public getPos(x: number): Vec3 {
        const cw = this.contentW / this.data.len;
        return v3(cw * (x + 0.5), 30);
    }
    public setY(y: number) {
        this.data.y = y;
    }
    /**返回所有还在的收集物 */
    public getShowCollet() {
        const re: Colletion[] = this.collects.filter(c => c?.inCabinet);
        return re;
    }
    public findCollet(type: ColletType) {
        for (let c of this.collects) {
            if (c && c.inCabinet && c.data.type == type) {
                return c;
            }
        }
    }
    /**坠落 */
    public dropTo(y: number, duration: number = 0.2) {
        return new Promise<void>(res => {
            this.data.y = y;
            const pos = GameUtil.getCabinetPos(this.data.x, y);
            tween(this.node)
                .to(0.2, { position: pos })
                .call(() => { res() })
                .start();
        })

    }
    public backCollet(colletion: Colletion) {
        this.collects[colletion.data.index] = colletion;
    }

}


