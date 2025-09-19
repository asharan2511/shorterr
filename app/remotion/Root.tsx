import React from "react";
import { Composition } from "remotion";
import MyComposition from "./MyComposition";

const RemotionRoot: React.FC = () => {
  return (
    <div>
      <Composition
        id="MyVideo"
        component={MyComposition}
        fps={30}
        width={1080}
        height={1920}
        calculateMetadata={async ({ props }) => {
          return {
            durationInFrames:
              typeof props.durationInFrames === "number"
                ? props.durationInFrames
                : 0,
          };
        }}
      />
    </div>
  );
};

export default RemotionRoot;
