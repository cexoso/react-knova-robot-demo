import { FC, useState } from "react";
import { Stage, Layer } from "react-konva";
import { Robot } from "./robot";

export const WindowStage: FC<{ width: number; height: number }> = (props) => {
  const { width, height } = props;
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const insertNewPosition = () => {
    setPosition({
      x: Math.random() * width,
      y: Math.random() * height,
    });
  };
  return (
    <div className="App">
      <button
        onClick={() => {
          insertNewPosition();
        }}
      >
        点击插入一个新的位置点
      </button>
      <Stage width={props.width} height={props.height}>
        <Layer>
          <Robot y={position.y} x={position.x} />
        </Layer>
      </Stage>
    </div>
  );
};
