import React, { useState } from "react";
import Input from "../../../../components/elements/Input";
import Button from "../../../../components/elements/Button";
import { toast } from "react-toastify";

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
            }, 3000);
        } catch (error) {
            toast.error("Unable to copy link! Try again later.");
        }
    };

    return (
        <div className="flex gap-2">
            <Input value={link} disabled className="block grow"></Input>
            <Button size="md" onClick={handleCopy}>
                {isCopied ? "Copied" : "Copy"}
            </Button>
        </div>
    );
};

export default CopyLink;
