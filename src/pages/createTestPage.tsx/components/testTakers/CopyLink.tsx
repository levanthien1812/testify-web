import React, { useState } from "react";
import Input from "../../../../components/elements/Input";
import Button from "../../../../components/elements/Button";
import { toast } from "react-toastify";
import { DISABLE_COPY_TIMEOUT } from "../../../../config/constants/tests";
import { TOAST_MESSAGES } from "../../../../config/constants/toasts";

type CopyLinkProps = {
    link: string;
};

const CopyLink = ({ link }: CopyLinkProps) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = async () => {
        try {
            navigator.clipboard.writeText(link);
            setIsCopied(true);
            setTimeout(() => {
                setIsCopied(false);
            }, DISABLE_COPY_TIMEOUT);
        } catch (error) {
            toast.error(TOAST_MESSAGES.UNABLE_TO_COPY);
        }
    };

    return (
        <div className="flex gap-2 bg-orange-100 p-2">
            <Input
                value={link}
                disabled
                className="block grow disabled:bg-white"
            ></Input>
            <Button size="md" onClick={handleCopy} disabled={isCopied}>
                {isCopied ? "Link copied" : "Copy link"}
            </Button>
        </div>
    );
};

export default CopyLink;
