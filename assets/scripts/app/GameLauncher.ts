import { _decorator, Component } from 'cc';
import { GameFieldController } from '../entities/game-field/GameFieldController.ts';

const { ccclass } = _decorator;

@ccclass('GameLauncher')
export class GameLauncher extends Component {
  start() {
    const controller = this.getComponent(GameFieldController);
    if (controller) {
      controller.setup({
        rows: 9,
        cols: 9,
        uniqueChipsCount: 5,
      });

      console.log('Children count:', this.node.children.length);
      console.log('First child pos:', this.node.children[0]?.position);
      console.log('ChipContainer children:', this.node.children[0]?.children.length);
    }
  }
}
