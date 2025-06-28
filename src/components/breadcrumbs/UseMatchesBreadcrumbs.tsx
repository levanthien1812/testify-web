import React from "react";
import { useMatches } from "react-router";
import { BreadcrumbHandle } from "../../types/types";
import { Link } from "react-router-dom";

const UseMatchesBreadcrumbs = () => {
    let matches = useMatches() as {
        id: string;
        pathname: string;
        params: Record<string, string>;
        handle?: BreadcrumbHandle;
        data: any;
    }[];

    let crumbs = matches
        .filter((m) => m.handle?.crumb)
        .map((m, index) => {
            const crumb = m.handle?.crumb;
            const displayCrumb = typeof crumb === "function" ? crumb(m) : crumb;

            const isLast = matches.indexOf(m) === matches.length - 1;
            return (
                <li key={m.id} className="flex items-center">
                    {index > 0 && <span className="mx-2 text-gray-400">/</span>}
                    {isLast ? (
                        <span className="font-bold text-white">
                            {displayCrumb}
                        </span>
                    ) : (
                        <Link
                            to={m.pathname}
                            className="text-white hover:underline"
                        >
                            {displayCrumb}
                        </Link>
                    )}
                </li>
            );
        });

    return (
        <nav
            aria-label="Breadcrumb"
            className="text-sm text-gray-600 mb-2 px-4 py-1 bg-orange-600"
        >
            <ol className="flex space-x-2">{crumbs}</ol>
        </nav>
    );
};

export default UseMatchesBreadcrumbs;
