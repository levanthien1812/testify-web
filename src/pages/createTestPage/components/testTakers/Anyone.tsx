import CopyLink from "./CopyLink";
import { useAppSelector } from "../../../../hooks/hooks";

const Anyone = () => {
    const { testLink } = useAppSelector((state) => state.createTest);

    return (
        <div className="p-2 bg-orange-100">
            <div className="border-2 border-orange-500 border-dashed">
                <CopyLink link={testLink} />
            </div>
        </div>
    );
};

export default Anyone;
