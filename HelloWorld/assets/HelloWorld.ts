import { _decorator, Component, director, instantiate, loader, Node, Prefab, resources, Sprite, SpriteFrame } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HelloWorld')
export class HelloWorld extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    // @property
    // serializableDummy = 0;

    // @property({ type: Prefab })
    // public pre: Prefab | null = null;

    start() {
        // Your initialization goes here.
        // console.info('Hello world');

        // let node = instantiate(this.pre);

        // this.node.addChild(node); // or node.setParent(this.node);

        // director.loadScene('scene2');

        // director.preloadScene("scene2", function () {
        //     director.loadScene('scene2');
        // });

        // director.addPersistRootNode(this.node);
        // director.removePersistRootNode(this.node);

        // director.loadScene("scene2", onSceneLaunched);

        // resources.load('test/king01/spriteFrame', SpriteFrame, (err, sp) => {
        //     this.node.getComponent(Sprite).spriteFrame = sp;
        // });

        // resources.load("test/Cube", Prefab, (err, pb) => {
        //     const newNode = instantiate(pb);
        //     this.node.addChild(newNode);
        // });
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }
}


