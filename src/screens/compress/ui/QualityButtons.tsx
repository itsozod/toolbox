import { ActiveState, QualityLevels } from "@shared/types/quality-levels.types";
import { Button } from "tamagui";

const QualityButtons = ({
  activeState,
  handleStateAndCompress,
}: {
  activeState: ActiveState;
  handleStateAndCompress: (state: QualityLevels) => void;
}) => {
  return (
    <>
      <Button
        flex={1}
        borderColor={"$color02"}
        theme={activeState === "low" ? "green" : "dark"}
        onPress={() => handleStateAndCompress("low")}
      >
        Low
      </Button>
      <Button
        flex={1}
        borderColor={"$color02"}
        theme={activeState === "medium" ? "green" : "dark"}
        onPress={() => handleStateAndCompress("medium")}
      >
        Medium
      </Button>
      <Button
        flex={1}
        borderColor={"$color02"}
        theme={activeState === "high" ? "green" : "dark"}
        onPress={() => handleStateAndCompress("high")}
      >
        High
      </Button>
    </>
  );
};

export default QualityButtons;
