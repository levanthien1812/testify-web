import { Link, useNavigate } from "react-router-dom";
import RecentTestItem from "./RecentTestItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const RecentTests = () => {
    const navigate = useNavigate();
    return (
        <div>
            <div>
                <h2 className="text-2xl inline-block">Recent tests</h2>
                <button
                    className="ms-3 bg-orange-500 text-white px-3 py-0 hover:bg-orange-600 border-2 border-orange-600"
                    onClick={() => navigate("/tests/create")}
                >
                    Create test
                </button>
            </div>

            <div className="flex gap-6 mt-3">
                <RecentTestItem />
                <RecentTestItem />
                <RecentTestItem />
                <RecentTestItem />

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
