export const formatImageUrl = (imageUrl: string) => {
    let updatedImage = imageUrl.replace(
        "public",
        `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`
    );
    updatedImage.replaceAll("\\", "/");
    return updatedImage;
};
