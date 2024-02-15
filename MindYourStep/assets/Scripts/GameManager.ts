import { _decorator, CCInteger, Component, instantiate, Label, Node, Prefab, Vec3 } from 'cc';
import { PlayerController } from './PlayerController';
const { ccclass, property } = _decorator;

// 遊戲狀態 : INIT: 初始化, PLAYING: 遊戲中, END: 遊戲結束
enum Game_State {
    GS_INIT,
    GS_PLAYING,
    GS_END,
};

// 地面類型 : NONE: 空格, STONE: 石頭
enum Block_Type {
    BT_NONE,
    BT_STONE,
};

@ccclass('GameManager')
export class GameManager extends Component {

    // 引用預設體
    @property({ type: Prefab })
    public cubePrfb: Prefab | null = null;

    // 跑道長度
    @property({ type: CCInteger })
    public roadLength = 50;
    private _road: Block_Type[] = [];

    // 引用 Player 上的 PlayerController
    @property({ type: PlayerController })
    public playerCtrl: PlayerController | null = null;

    // 引用開始選單
    @property({ type: Node })
    public startMenu: Node | null = null;

    // 引用步數標籤
    @property({ type: Label })
    public stepsLabel: Label | null = null;

    start() {
        this.curState = Game_State.GS_INIT;
        // 監聽玩家跳躍結束事件
        // if(this.playerCtrl != null) this.playerCtrl.node.on('JumpEnd', this.onPlayerJumpEnd, this);
        this.playerCtrl?.node.on('JumpEnd', this.onPlayerJumpEnd, this);
    }

    init() {
        // 產生開始選單
        if (this.startMenu) {
            this.startMenu.active = true;
        }
        // 產生跑道
        this.generateRoad();
        if (this.playerCtrl) {
            // 禁止接收玩家操作人物指令
            this.playerCtrl.setInputActive(false);
            // 重置人物位置
            this.playerCtrl.node.setPosition(Vec3.ZERO);
        }
        // 重置人物總移動步數
        this.playerCtrl.reset();
    }

    set curState(value: Game_State) {
        switch (value) {
            case Game_State.GS_INIT:
                this.init();
                break;
            case Game_State.GS_PLAYING:
                // 關閉開始選單
                if (this.startMenu) {
                    this.startMenu.active = false;
                }
                // 重置步數標籤
                if (this.stepsLabel) {
                    this.stepsLabel.string = "0";
                }
                // 原因是因為開始選單的按鈕會觸發 onMouseUp 事件
                // 這樣會導致玩家在開始選單按鈕按下去後, 人物會跳一下
                // 所以延遲 0.1 秒後, 才允許接收玩家操作人物指令
                setTimeout(() => {
                    if (this.playerCtrl) {
                        // 允許接收玩家操作人物指令
                        this.playerCtrl.setInputActive(true);
                    }
                }, 0.1);
                break;
            case Game_State.GS_END:
                break;
        }
    }

    generateRoad() {
        // 移除舊的跑道
        this.node.removeAllChildren();
        this._road = [];
        // 人物一開始的位置是石頭
        this._road.push(Block_Type.BT_STONE);

        for (let i = 1; i < this.roadLength; i++) {
            if (this._road[i - 1] == Block_Type.BT_NONE) {
                // 上一個是空格, 這一個只能是石頭
                this._road.push(Block_Type.BT_STONE);
            }
            else {
                // 上一個是石頭, 這一個隨機是空格(0)或石頭(1)
                this._road.push(Math.floor(Math.random() * 2));
            }
        }

        for (let j = 0; j < this._road.length; j++) {
            // 交給 spawnBlockType 來產生跑到
            let block: Node = this.spawnBlockType(this._road[j])

            // 如果 block 不是空格, 就加到場景中
            if (block) {
                this.node.addChild(block);
                block.setPosition(j, -1.5, 0);
            }
        }
    }

    spawnBlockType(type: Block_Type) {
        if (!this.cubePrfb) {
            return null;
        }

        let block: Node | null = null;
        switch (type) {
            case Block_Type.BT_STONE:
                // 複製預設體產生新的石頭
                block = instantiate(this.cubePrfb);
                break;
        }
        return block;
    }

    onStartButtonClicked() {
        this.curState = Game_State.GS_PLAYING;
    }

    checkResult(moveIndex: number) {
        if (moveIndex < this.roadLength) {
            if (this._road[moveIndex] == Block_Type.BT_NONE) {
                // 跳到空格, 遊戲結束
                this.curState = Game_State.GS_INIT;
            }
        }
        else { // 跳到終點, 遊戲結束
            this.curState = Game_State.GS_INIT;
        }
    }

    onPlayerJumpEnd(moveIndex: number) {
        if (this.stepsLabel) {
            // 在最後一格時就算跳到終點, 也不要顯示超過跑道長度的步數
            this.stepsLabel.string = ' ' + (moveIndex >= this.roadLength ? this.roadLength : moveIndex);
        }
        // 檢查遊戲結束狀態
        this.checkResult(moveIndex);
    }
}


