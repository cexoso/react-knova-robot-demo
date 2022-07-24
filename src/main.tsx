import { RobotController } from "./knova";
import "./base.css";

const width = window.innerWidth;
const height = 500;

const robotController = new RobotController({ width, height });

const randomNewPosition = () => {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
  };
};

const getData = async () => {
  return Array.from({ length: 10 }).map(randomNewPosition);
};

const createButton = (opts: { text: string; clickHandle: () => void }) => {
  const button = document.createElement("button");
  button.innerText = opts.text;
  button.className = "button";
  button.addEventListener("click", opts.clickHandle);
  return button;
};

const createOperateBar = () => {
  document.body.append(
    createButton({
      text: "放大",
      clickHandle: () => {
        robotController.setScale(robotController.getScale() + 0.2);
      },
    })
  );

  document.body.append(
    createButton({
      text: "缩小",
      clickHandle: () => {
        robotController.setScale(robotController.getScale() - 0.2);
      },
    })
  );

  document.body.append(
    createButton({
      text: "加载数据",
      clickHandle: () => {
        getData().then((positions) => {
          positions.map((position) => {
            robotController.insertPosition(position);
          });
        });
      },
    })
  );

  document.body.append(
    createButton({
      text: "插入一个新位置",
      clickHandle: () => {
        robotController.insertPosition({
          x: Math.random() * width,
          y: Math.random() * height,
        });
      },
    })
  );

  document.body.append(
    createButton({
      text: "reset",
      clickHandle: () => {
        robotController.reset();
      },
    })
  );
};

createOperateBar();
