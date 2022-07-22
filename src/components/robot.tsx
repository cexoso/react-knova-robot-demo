import React, { useRef, useEffect } from "react";
import robot from "../asserts/robot.png";
import { Image } from "react-konva";
import { Image as ImageNode } from "konva/lib/shapes/Image";

function useConstant<T>(creator: () => T) {
  const ref = useRef<T>();
  if (!ref.current) {
    ref.current = creator();
  }
  return ref.current;
}

const useRobotImage = () =>
  useConstant(() => {
    const image = new window.Image();
    image.src = robot;
    return image;
  });

export const Robot: React.FC<{ size?: number; x: number; y: number }> = (
  props
) => {
  const ref = useRef<ImageNode>();
  const { size = 100, x, y } = props;
  const image = useRobotImage();
  useEffect(() => {
    const image = ref.current;
    if (image) {
      image.to({
        x,
        y,
        duration: 0.3,
        onFinish() {
          console.log("done");
        },
      });
    }
  }, [x, y]);
  return (
    <Image
      ref={(node) => {
        ref.current = node || undefined;
      }}
      height={size}
      width={size}
      image={image}
    />
  );
};
