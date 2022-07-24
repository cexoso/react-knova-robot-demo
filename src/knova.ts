import Konva from "konva";
import robotSrc from "./asserts/robot.png";

const createRobotImage = (opts: {
  robotWidth: number;
  robotHeight: number;
}) => {
  const img = new window.Image();
  img.src = robotSrc;
  return new Konva.Image({
    image: img,
    width: opts.robotWidth,
    height: opts.robotHeight,
  });
};

const createPath = (position: Position[]) => {
  let path = "M" + position[0].x + " " + position[0].y;
  for (var i = 1; i < position.length; i = i + 1) {
    path = path + " L" + position[i].x + " " + position[i].y;
  }
  return path;
};

interface RobotControllerParams {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

export class RobotController {
  private scale = 1;
  private robotWidth = 50;
  private robotHeight = 50;
  private robot: Konva.Image | null = null;
  private stage: Konva.Stage;
  private path: Konva.Path;
  private positions: Position[] = [];
  private animHandle: Konva.Animation | null = null;
  private robotLayer: Konva.Layer | null = null; // 机器人运动的那一层
  private fromIndex: number = -1;
  private pathLayer: Konva.Layer | null = null; // 路径层，为了动静分离
  public constructor(public params: RobotControllerParams) {
    this.stage = new Konva.Stage({
      container: "root",
      width: this.params.width,
      height: this.params.height,
    });
  }
  /**
   * @description 添加下一个位置, 如果首次添加，机器人会出来在该位置，之后再次添加，机器人会移动到下一个位置，在机器人移动的过程中添加点，机器人按顺序移动到各点
   */
  public insertPosition(position: Position) {
    this.positions.push(position);
    if (this.fromIndex === -1) {
      // 首先设置 position
      this.fromIndex = 0;
      this.createWalkingPaths();
      this.createRobot();
      return;
    }
    this.path.setAttrs({ data: createPath(this.positions) });
    this.tryWalkingToNext();
  }
  private createWalkingPaths() {
    this.pathLayer = new Konva.Layer({
      scaleX: this.scale,
      scaleY: this.scale,
    });

    this.path = new Konva.Path({
      x: 0,
      y: 0,
      strokeWidth: 5,
      stroke: "red",
      lineJoin: "round",
      data: createPath(this.positions),
    });
    this.pathLayer.add(this.path);
    this.stage.add(this.pathLayer);
  }
  private createRobot() {
    this.robotLayer = new Konva.Layer({
      scaleX: this.scale,
      scaleY: this.scale,
    });
    this.stage.add(this.robotLayer);
    const robotImage = createRobotImage({
      robotWidth: this.robotWidth,
      robotHeight: this.robotHeight,
    });
    this.robot = robotImage;
    this.robot.position({
      x: this.positions[0].x - this.robotWidth / 2,
      y: this.positions[0].y - this.robotHeight / 2,
    });
    this.robotLayer.add(robotImage);
  }
  private tryWalkingToNext() {
    if (this.animHandle && this.animHandle.isRunning()) {
      // 如果正在走
      return false;
    }
    const nextPosition = this.positions[this.fromIndex + 1];
    if (!nextPosition) {
      // 已经走到终点了
      return false;
    }
    const currentPosition = this.positions[this.fromIndex];
    this.animHandle = this.createWalkingAnimation(
      this.createWalkingPath(currentPosition, nextPosition),
      {
        onFinish: () => {
          this.fromIndex += 1;
          this.tryWalkingToNext(); // 动画完了，就走下一个点
        },
      }
    );
    this.animHandle.start();
    return true;
  }
  private createWalkingAnimation(
    path: Konva.Path,
    opts?: {
      totalTime?: number; // 移动耗时总时长，ms
      onFinish?: () => void;
    }
  ) {
    const totalTime = opts?.totalTime || 1000;
    const pathLen = path.getLength();
    const { robotWidth, robotHeight, robot } = this;
    let total = 0; // 自己计算的目的是为了可以支持到暂停运动
    const animation = new Konva.Animation(function (frame) {
      if (frame) {
        total += frame.timeDiff;
        const rate = total / totalTime;
        if (rate > 1) {
          animation.stop();
          opts?.onFinish?.apply(null);
        }
        let pt = path.getPointAtLength(rate * pathLen);
        robot!.position({
          x: pt.x - robotWidth / 2,
          y: pt.y - robotHeight / 2,
        });
      }
    }, this.robotLayer!);
    return animation;
  }
  private createWalkingPath(currentPosition: Position, nextPosition: Position) {
    return new Konva.Path({
      x: 0,
      y: 0,
      strokeWidth: 1,
      lineJoin: "round",
      data:
        "M" +
        currentPosition.x +
        " " +
        currentPosition.y +
        " L" +
        nextPosition.x +
        " " +
        nextPosition.y,
    });
  }
  public getScale() {
    return this.scale;
  }
  public setScale(scale: number) {
    this.scale = scale;
    if (this.robotLayer) {
      this.robotLayer.scale({ x: scale, y: scale });
    }
    if (this.pathLayer) {
      this.pathLayer.scale({ x: scale, y: scale });
    }
  }
  /**
   * @description 重置机器人
   */
  public reset() {
    if (this.robotLayer) {
      this.robotLayer.destroy();
    }

    if (this.pathLayer) {
      this.pathLayer.destroy();
    }

    if (this.animHandle) {
      this.animHandle.stop();
    }

    this.positions = [];
    this.fromIndex = -1;
    this.robot = null;
  }
}
