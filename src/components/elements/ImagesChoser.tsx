import React, { ChangeEvent, forwardRef, useMemo, useState } from "react";
import Input from "./Input";
import ImagesViewer from "./ImagesViewer";
import { formatImageUrl } from "../../utils/formatImageUrl";

interface ImagesChoserProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    images: FileList | string[] | null;
    className?: string;
}

const ImagesChoser = forwardRef<HTMLInputElement, ImagesChoserProps>(
    (props, ref) => {
        const { className, images, ...rest } = props;
        const [viewImage, setViewImage] = useState(false);

        return (
            <>
                <Input
                    type="file"
                    className={`w-full ${className}`}
                    accept=".png,.jpg,.jpeg,.gif"
                    multiple
                    ref={ref}
                    {...rest}
                />
                {images && images.length > 0 && (
                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            className="text-sm hover:underline hover:text-orange-600"
                            onClick={() => setViewImage(true)}
                        >
                            {images ? "View Images" : "No Image Selected"}
                        </button>
                        <button
                            type="button"
                            className="text-sm hover:underline hover:text-orange-600"
                            // onClick={() => setImages(null)}
                        >
                            Delete Images
                        </button>
                    </div>
                )}
                {viewImage && images && images.length > 0 && (
                    <ImagesViewer
                        images={
                            images instanceof FileList
                                ? images
                                : images.map((image) => formatImageUrl(image))
                        }
                        onClose={() => setViewImage(false)}
                    />
                )}
            </>
        );
    }
);

export default ImagesChoser;
