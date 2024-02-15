import { _decorator, Component, Vec3, input, Input, EventMouse, SkelAnimDataHub, SkeletalAnimation } from 'cc';
import { Animation } from "cc";
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    // 引用角色動畫
    @property({ type: Animation })
    public BodyAnim: Animation | null = null;
    // 引用角色動畫
    @property({ type: SkeletalAnimation })
    public CocosAnim: SkeletalAnimation | null = null;

    // 是否接收到跳躍指令
    private _startJump: boolean = false;

    // 跳躍步數
    private _jumpStep: number = 0;
    // 當前跳躍時間
    private _curJumpTime: number = 0;
    // 每次跳躍時間
    private _jumpTime: number = 0.3;
    // 當前跳躍速度
    private _curJumpSpeed: number = 0;

    // 當前角色位置
    private _curPos: Vec3 = new Vec3();
    // 每次跳躍，幀數位移量
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    // 角色目標位置
    private _targetPos: Vec3 = new Vec3();
    // 當前總移動步數
    private _curMoveIndex: number = 0;

    start() {
        // 監聽滑鼠彈起事件，當接收到滑鼠彈起事件時onMouseUp會被調用
        // input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    reset() {
        this._curMoveIndex = 0;
    }

    setInputActive(active: boolean) {
        // 在 Playing 的狀態下，才監聽滑鼠彈起事件
        if (active) {
            input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
        else {
            input.off(Input.EventType.MOUSE_UP, this.onMouseUp, this);
        }
    }

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) { // 左鍵為0
            this.jumpByStep(1);
        }
        else if (event.getButton() === 2) { // 右鍵為2
            this.jumpByStep(2);
        }
    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }

        this._startJump = true; // 開始跳躍
        this._jumpStep = step; // 設置本次跳躍步數
        this._curJumpTime = 0; // 重置跳躍時間
        this._curJumpSpeed = this._jumpStep / this._jumpTime; // 計算跳躍速度
        this.node.getPosition(this._curPos); // 獲取角色當前位置
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0)); // 目標位置 = 當前位置 + 跳躍步數

        if (this.CocosAnim) {
            this.CocosAnim.getState('cocos_anim_jump').speed = 3.5; // 設置跳躍動畫速度
            this.CocosAnim.play('cocos_anim_jump'); // 播放跳躍動畫
        }

        // 用動畫編輯器做動畫
        // if (this.BodyAnim) {
        //     if (step == 1) {
        //         this.BodyAnim.play("oneStep");
        //     }
        //     else if (step == 2) {
        //         this.BodyAnim.play("twoStep");
        //     }
        // }

        this._curMoveIndex += step; // 紀錄跳躍步數
    }

    onOnceJumpEnd() {
        if (this.CocosAnim) {
            this.CocosAnim.play('cocos_anim_idle');
        }

        this.node.emit("JumpEnd", this._curMoveIndex);
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) { // 跳躍結束
                this.node.setPosition(this._targetPos); // 強制位移至目標位置
                this._startJump = false; // 標記跳躍結束
                this.onOnceJumpEnd(); // 觸發跳躍結束事件
            } else { // 跳躍中
                this.node.getPosition(this._curPos); // 獲取角色當前位置
                this._deltaPos.x = this._curJumpSpeed * deltaTime; // 計算當前幀數位移量
                Vec3.add(this._curPos, this._curPos, this._deltaPos); // 當前位置 = 當前位置 + 當前幀數位移量 
                this.node.setPosition(this._curPos); // 設置位移後的位置
            }
        }
    }
}
