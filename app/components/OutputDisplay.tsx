import {GlobalData} from "@/types/global";
import React from "react";

interface OutputDisplayProps {
    data: GlobalData;
}

const OutputDisplay = React.memo(({ data }: OutputDisplayProps) => {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
});

OutputDisplay.displayName = "OutputDisplay";

export default OutputDisplay;