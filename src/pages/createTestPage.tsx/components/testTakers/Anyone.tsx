import React from "react";
import CopyLink from "./CopyLink";
import { RootState } from "../../../../stores/rootState";
import { useSelector } from "react-redux";

const Anyone = () => {
    const { testLink } = useSelector((state: RootState) => state.createTest);

    return (
        <div className="p-2 bg-orange-100">
            <div className="border-2 border-orange-500 border-dashed">
                <CopyLink link={testLink} />
            </div>
        </div>
    );
};

export default Anyone;
