export const formatImageUrl = (imageUrl: string) => {
    let updatedImage = imageUrl.replace(
        "public",
        process.env.REACT_APP_API_HOST!
    );
    updatedImage.replaceAll("\\", "/");
    return updatedImage;
};
