import Submission from "./Submission";
import { useAppSelector } from "../../../hooks/hooks";

const Submissions = () => {
    const { submissions } = useAppSelector((state) => state.takeTest);

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
