import React, { ChangeEvent, useMemo, useState } from "react";
import Input from "./Input";
import ImagesViewer from "./ImagesViewer";
import { formatImageUrl } from "../../utils/formatImageUrl";

type ImagesChoserProps = {
    images: FileList | string[] | null;
    setImages: (images: FileList | null) => void;
    className?: string;
};

const ImagesChoser = ({ images, setImages, className }: ImagesChoserProps) => {
    const [viewImage, setViewImage] = useState(false);

    return (
        <>
            <Input
                type="file"
                name="image"
                className={`w-full ${className}`}
                onChange={(e) => setImages(e.target.files)}
                accept=".png,.jpg,.jpeg,.gif"
                multiple
            />
            {images && images.length > 0 && (
                <div className="flex justify-end gap-3">
                    <button
                        className="text-sm hover:underline hover:text-orange-600"
                        onClick={() => setViewImage(true)}
                    >
                        {images ? "View Images" : "No Image Selected"}
                    </button>
                    <button
                        className="text-sm hover:underline hover:text-orange-600"
                        onClick={() => setImages(null)}
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
};

export default ImagesChoser;
