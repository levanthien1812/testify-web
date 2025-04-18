import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../stores/rootState";
import Submission from "./Submission";

const Submissions = () => {
    const { submissions } = useSelector((state: RootState) => state.takeTest);

    return (
        <div className="space-y-2 px-8 mt-8">
            <p className="text-lg">Your submissions</p>
            {submissions.map((submission) => (
                <Submission submission={submission} key={submission.id} />
            ))}
        </div>
    );
};

export default Submissions;
