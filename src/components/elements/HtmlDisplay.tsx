import React from "react";
import truncate from "truncate-html";
import DOMPurify from "dompurify";

type Props = {
    htmlContent: string;
    maxLength?: number;
    className?: string;
};

const HtmlDisplay = ({ htmlContent, maxLength, className = "" }: Props) => {
    const htmlText = maxLength
        ? truncate(htmlContent, maxLength, {
              decodeEntities: true,
              ellipsis: "...",
          })
        : htmlContent;

    const sanitizedHtml = DOMPurify.sanitize(htmlText);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            className={className}
        />
    );
};

export default HtmlDisplay;
