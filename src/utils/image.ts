export const getPreviewLink = async (images: FileList | null) => {
    if (!images) return [];

    const filePromises: Promise<string>[] = [];
    for (let i = 0; i < images.length; i++) {
        const file = images[i];

        const promise = new Promise<string>((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (event) => {
                if (typeof event.target?.result === "string") {
                    resolve(event.target.result);
                } else {
                    reject("Failed to read file as data URL.");
                }
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });

        filePromises.push(promise);
    }

    const result = await Promise.all(filePromises);
    return result;
};

export const checkImageUrl = (url: string | undefined) => {
    if (!url) return false;
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true); // Image loaded successfully
        img.onerror = () => resolve(false); // Image failed to load (e.g., 404, invalid URL)
        img.src = url;
    });
};
