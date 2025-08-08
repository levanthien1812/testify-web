import Submission from "./Submission";
import { useAppSelector } from "../../../hooks/hooks";

const Submissions = () => {
    const { submissions } = useAppSelector((state) => state.takeTest);

    return (
        <div className="space-y-2 px-8 py-4 mt-4 border-t-2 border-dashed ">
            <p className="text-xl">{"Your submissions"}</p>
            <div className="space-y-2">
                {submissions.map((submission) => (
                    <Submission submission={submission} key={submission.id} />
                ))}
            </div>
        </div>
    );
};

export default Submissions;
