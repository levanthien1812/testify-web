import { Link, useNavigate } from "react-router-dom";
import RecentTestItem from "./RecentTestItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { useMutation, useQuery } from "react-query";
import { getTests } from "../../../services/test";
import { TestItf } from "../../../types/types";
import Button from "../../authPage/components/Button";

const RecentTests = () => {
    const navigate = useNavigate();

    const { data: tests } = useQuery({
        queryKey: ["tests"],
        queryFn: async () => {
            const data = await getTests();
            return data.tests;
        },
    });

    return (
        <div>
            <div>
                <h2 className="text-2xl inline-block">Recent tests</h2>
                <Button
                    size="sm"
                    className="ms-3"
                    onClick={() => navigate("/tests/create")}
                >
                    Create test
                </Button>
            </div>

            <div className="flex gap-6 mt-3 overflow-x-scroll scrollbar-thin pb-1">
                {tests &&
                    tests.map((test: TestItf) => {
                        return <RecentTestItem test={test} key={test._id} />;
                    })}

                <Link
                    to={"/tests"}
                    className="bg-gradient-to-br from-orange-200 to-orange-50 flex justify-center items-center px-3 hover:from-orange-300 hover:to-orange-100"
                >
                    <button className="w-44">
                        <p className="text-xl">
                            View all{" "}
                            <FontAwesomeIcon
                                className="text-[16px] ms-1"
                                icon={faChevronRight}
                            />
                        </p>
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default RecentTests;
