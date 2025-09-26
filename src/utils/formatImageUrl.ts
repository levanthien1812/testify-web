import defaultUserPhoto from "../assets/images/default-user-photo.png";

export const formatImageUrl = (imageUrl: string | undefined) => {
    if (!imageUrl || imageUrl === "") return defaultUserPhoto;
    let updatedImage = imageUrl.replace(
        "public",
        `${process.env.REACT_APP_API_HOST}:${process.env.REACT_APP_API_PORT}`
    );
    updatedImage.replaceAll("\\", "/");
    return updatedImage;
};
