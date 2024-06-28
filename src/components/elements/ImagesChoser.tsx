import React, { ChangeEvent, useMemo, useState } from "react";
import Input from "./Input";
import ImagesViewer from "./ImagesViewer";

type ImagesChoserProps = {
    images: FileList | string[] | null;
    setImages: (images: FileList | null) => void;
    className?: string;
};

const ImagesChoser = ({ images, setImages, className }: ImagesChoserProps) => {
    const [viewImage, setViewImage] = useState(false);

    const formattedImages = useMemo(() => {
        if (images && !(images instanceof FileList)) {
            let copiedImages = [...images];

            copiedImages = copiedImages.map((image) => {
                let updatedImage = image.replace(
                    "public",
                    process.env.REACT_APP_API_HOST!
                );
                updatedImage.replaceAll("\\", "/");
                return updatedImage;
            });
            return copiedImages;
        }
        return images;
    }, [images]);

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
            {viewImage && formattedImages && formattedImages.length > 0 && (
                <ImagesViewer
                    images={formattedImages}
                    onClose={() => setViewImage(false)}
                />
            )}
        </>
    );
};

export default ImagesChoser;
