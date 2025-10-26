import { ActiveState, QualityLevels } from "@shared/types/qualityLevels";
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
        borderTopEndRadius={"$0"}
        borderBottomEndRadius={"$0"}
        borderColor={"$color02"}
        theme={activeState === "low" ? "green" : "dark"}
        onPress={() => handleStateAndCompress("low")}
      >
        Low
      </Button>
      <Button
        flex={1}
        borderColor={"$color02"}
        borderTopLeftRadius={"$0"}
        borderBottomLeftRadius={"$0"}
        borderTopEndRadius={"$0"}
        borderBottomEndRadius={"$0"}
        theme={activeState === "medium" ? "green" : "dark"}
        onPress={() => handleStateAndCompress("medium")}
      >
        Medium
      </Button>
      <Button
        borderColor={"$color02"}
        flex={1}
        borderTopLeftRadius={"$0"}
        borderBottomLeftRadius={"$0"}
        theme={activeState === "high" ? "green" : "dark"}
        onPress={() => handleStateAndCompress("high")}
      >
        High
      </Button>
    </>
  );
};

export default QualityButtons;
