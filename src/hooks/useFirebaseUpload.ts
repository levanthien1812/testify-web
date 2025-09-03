// src/hooks/useFirebaseUpload.ts
import { useState, useCallback } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

// Define the shape of our upload state
export interface UploadState {
    progress: number;
    status: "idle" | "uploading" | "paused" | "completed" | "error";
    error: Error | null;
    downloadURL: string | null;
}

// Initial state for the upload
const initialState: UploadState = {
    progress: 0,
    status: "idle",
    error: null,
    downloadURL: null,
};

const useFirebaseUpload = () => {
    const [uploadState, setUploadState] = useState<UploadState>(initialState);

    // This function will be called to start an upload
    const uploadBlob = useCallback(
        (blob: Blob, fileName: string): Promise<string> => {
            return new Promise((resolve, reject) => {
                if (!blob) {
                    const err = new Error("No blob provided for upload.");
                    setUploadState((prev) => ({
                        ...prev,
                        status: "error",
                        error: err,
                    }));
                    reject(err);
                    return;
                }

                setUploadState((prev) => ({
                    ...prev,
                    status: "uploading",
                    progress: 0,
                    error: null,
                    downloadURL: null,
                }));

                const storageRef = ref(storage, "recorded_media/" + fileName);
                const uploadTask = uploadBytesResumable(storageRef, blob);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        // Calculate and update progress
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        setUploadState((prev) => ({
                            ...prev,
                            progress: progress,
                            status: "uploading",
                        }));
                    },
                    (error) => {
                        // Handle upload errors
                        console.error("Upload failed:", error);
                        setUploadState((prev) => ({
                            ...prev,
                            status: "error",
                            error: error,
                        }));
                        reject(error);
                    },
                    async () => {
                        // Upload complete, now get the download URL
                        try {
                            const downloadURL = await getDownloadURL(
                                uploadTask.snapshot.ref
                            );
                            setUploadState((prev) => ({
                                ...prev,
                                status: "completed",
                                downloadURL: downloadURL,
                            }));
                            resolve(downloadURL);
                        } catch (urlError) {
                            console.error(
                                "Error getting download URL:",
                                urlError
                            );
                            setUploadState((prev) => ({
                                ...prev,
                                status: "error",
                                error: urlError as Error,
                            }));
                            reject(urlError);
                        }
                    }
                );
            });
        },
        []
    ); // Dependencies are stable, so empty array is fine

    // Return the current state and the upload function
    return { ...uploadState, uploadBlob };
};

export default useFirebaseUpload;
