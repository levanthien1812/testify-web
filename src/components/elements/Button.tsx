import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    primary?: boolean;
    secondary?: boolean;
    size?: "sm" | "md" | "lg";
    className?: string;
    outlined?: boolean;
    link?: boolean;
}

const Button = ({
    children,
    primary,
    secondary,
    size = "md",
    className,
    type = "button",
    outlined,
    link,
    ...props
}: ButtonProps) => {
    let variant = "primary";
    if (secondary) variant = "secondary";
    if (outlined) variant = "outlined";
    if (link) variant = "link";

    return (
        <button
            type={type}
            className={
                variant !== "link"
                    ? `shadow-sm ${
                          primary || (!secondary && !outlined && !link)
                              ? "bg-orange-600 shadow-orange-200 text-white hover:bg-orange-700 active:bg-orange-500"
                              : ""
                      } ${
                          secondary
                              ? "bg-gray-200 shadow-gray-200 text-gray-500 hover:bg-gray-300 active:bg-gray-300"
                              : ""
                      } ${
                          outlined
                              ? "border border-orange-600 bg-white text-orange-600 hover:bg-orange-100 active:bg-orange-200"
                              : ""
                      } ${link ? "text-orange-600 hover:underline" : ""} ${
                          size === "sm" ? "px-4 py-0.5 text-sm" : ""
                      }${size === "md" ? "px-8 py-1" : ""}${
                          size === "lg" ? "px-12 py-1.5" : ""
                      } disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-gray-200 transition-colors duration-150 text-nowrap ${className}`
                    : `bg-white text-orange-600 hover:underline hover:text-orange-700`
            }
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
