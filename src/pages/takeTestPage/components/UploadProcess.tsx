import { UploadState } from "../../../hooks/useFirebaseUpload";

type Props = {
    status: UploadState["status"] | "saving-to-db";
    progress: UploadState["progress"];
};

const UploadProcess = ({ status, progress }: Props) => {
    return (
        <>
            {status === "uploading" && (
                <div className="bg-orange-50 border border-orange-500">
                    <div className="flex justify-between p-2">
                        <p>Your recording media is being uploaded...</p>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-orange-100">
                        <div
                            style={{ width: `${Math.round(progress)}%` }}
                            className="bg-orange-500 h-2 transition-all ease-in-out"
                        ></div>
                    </div>
                </div>
            )}
            {status === "saving-to-db" && (
                <div className="bg-blue-50 border border-orange-500 p-2">
                    <p>Saving to database...</p>
                </div>
            )}
            {status === "completed" && (
                <div className="bg-green-50 border border-green-500 p-2">
                    <p>Your recording media has been uploaded!</p>
                </div>
            )}
        </>
    );
};

export default UploadProcess;
