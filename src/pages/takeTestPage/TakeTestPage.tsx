import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router";
import { getSubmissions, getTest, getTestByCode } from "../../services/test";
import { PasscodeItf, SubmissionItf } from "../../types/types";
import DoingTest from "./DoingTest";
import {
    DEFAULT_SCREENSHOT_INTERVAL,
    RECORD_MODE,
    RECORDING_FPS,
    RECORDING_RESOLUTION_WIDTH,
    TEST_STATUS,
} from "../../config/constants/tests";
import TestInfo from "./components/TestInfo";
import Button from "../../components/elements/Button";
import { QUERY_KEYS } from "../../config/constants/queryMutationKeys";
import { useDispatch } from "react-redux";
import { takeTestActions } from "../../stores/takeTest";
import Loading from "../../components/loadings/Loading";
import { useEffect, useMemo, useRef, useState } from "react";
import Error from "../../components/errors/Error";
import PasscodeLink from "../createTestPage/components/testTakers/PasscodeLink";
import Submissions from "./components/Submissions";
import { useAppSelector } from "../../hooks/hooks";
import { ERROR_CODE } from "../../config/constants/errorCode";
import MessageAction from "../others/MessageAction";
import Recorder from "./components/Recorder";
import AskPermissions from "./components/AskPermissions";
import { toast } from "react-toastify";
import ResetPermissionsInstruction from "./components/ResetPermissionsInstruction";
import useFirebaseUpload from "../../hooks/useFirebaseUpload";
import UploadProcess from "./components/UploadProcess";
import { format } from "date-fns";
import { textToSlug } from "../../utils/text";

const TakeTestPage = () => {
    const { testId } = useParams();
    const {
        testStatus,
        test,
        startable,
        isStarted,
        isEnded,
        isForbidden,
        includeTakerAnswers,
        isEnteringPasscode,
        isPasscodeValidated,
        submissions,
        submissionsCount,
        passcode,
        canAccessCamera,
        canAccessScreen,
    } = useAppSelector((state) => state.takeTest);
    const { user } = useAppSelector((state) => state.auth);
    const { setCanAccessCamera, setCanAccessScreen, setIsUploadingMedia } =
        takeTestActions;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isAskingForPermissions, setIsAskingForPermissions] = useState(false);
    const [showResetPermissionsMessage, setShowReSetPermissionMessage] =
        useState(false);
    const [accepted, setAccepted] = useState(false);

    const screenVideoRef = useRef<HTMLVideoElement>(null);
    const webcamVideoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const videoCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const screenShotCanvasRef = useRef<HTMLCanvasElement | null>(null);
    const screenShotIntervalRef = useRef<NodeJS.Timer | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { uploadBlob, progress, status } = useFirebaseUpload();

    const { isLoading: isLoadingTest, refetch: refetchTest } = useQuery({
        queryKey: [
            QUERY_KEYS.GET_TEST,
            testId,
            { with_user_answers: includeTakerAnswers, started: isStarted },
        ],
        queryFn: async () => {
            let responseData;
            let options = {
                with_user_answers: includeTakerAnswers,
                ...(passcode.code ? { passcode: passcode.code } : {}),
                ...(isStarted ? { started: true } : {}),
            };

            if (passcode.code) {
                responseData = await getTestByCode(passcode.code, options);
            } else {
                responseData = await getTest(testId!, options);
            }

            return responseData;
        },
        onError: (error: any) => {
            if (
                error.response?.data?.errorCode === ERROR_CODE.PASSCODE_REQUIRED
            ) {
                dispatch(takeTestActions.setIsEnteringPasscode(true));
            }
            if (
                error.response?.data?.errorCode ===
                ERROR_CODE.TEST_ACCESS_DENIED
            ) {
                dispatch(takeTestActions.setForbidden(true));
            }
        },
        onSuccess: (data: any) => {
            dispatch(takeTestActions.setTest(data));
            if (data?.test.options.allow_view_submission_after_test.enable) {
                refetchSubmissions();
            }
        },
        retry: false,
        refetchOnWindowFocus: false,
    });

    const { isLoading: isLoadingSubmissions, refetch: refetchSubmissions } =
        useQuery<SubmissionItf[]>({
            queryFn: async () => {
                const responseData = await getSubmissions(testId!);
                return responseData.submissions;
            },
            queryKey: [QUERY_KEYS.GET_TEST_SUBMISSION, { test_id: testId }],
            enabled: false,
            onSuccess: (data) => {
                dispatch(takeTestActions.setSubmissions(data));
            },
            onError: () => {},
        });

    const handleRecord = async () => {
        try {
            let webcamStream = null;
            let captureStream = null;
            let combinedAudioTracks: MediaStreamTrack[] = [];
            let combinedVideoTracks: MediaStreamTrack[] = [];

            if (test && test.options.require_camera_on.enable) {
                webcamStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: test.options.require_camera_on.include_audio,
                });
                if (webcamStream) {
                    dispatch(setCanAccessCamera(true));
                }
                if (webcamVideoRef.current) {
                    webcamVideoRef.current.srcObject = webcamStream;
                }
                combinedAudioTracks = combinedAudioTracks.concat(
                    webcamStream.getAudioTracks()
                );

                combinedVideoTracks = combinedVideoTracks.concat(
                    webcamStream.getVideoTracks()
                );

                webcamStream.getVideoTracks().forEach((track) => {
                    track.onended = () => {
                        dispatch(setCanAccessCamera(false));
                    };
                });
            }

            if (test && test.options.require_screen_recorder.enable) {
                captureStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: test.options.require_screen_recorder.include_audio,
                });
                if (captureStream) {
                    dispatch(setCanAccessScreen(true));
                }
                if (screenVideoRef.current) {
                    screenVideoRef.current.srcObject = captureStream;
                }

                combinedAudioTracks = combinedAudioTracks.concat(
                    captureStream.getAudioTracks()
                );

                combinedVideoTracks = combinedVideoTracks.concat(
                    captureStream.getVideoTracks()
                );

                captureStream.getVideoTracks().forEach((track) => {
                    track.onended = () => {
                        console.log("ended");
                        dispatch(setCanAccessScreen(false));
                    };
                });
            }

            const combinedStream = new MediaStream(
                combinedAudioTracks.concat(combinedVideoTracks)
            );

            streamRef.current = combinedStream;
        } catch (error: any) {
            setAccepted(false);
            dispatch(setCanAccessCamera(false));
            dispatch(setCanAccessScreen(false));
            setShowReSetPermissionMessage(true);
            toast.error(error.message);
        }
    };

    const startTakingScreenshot = () => {
        if (!screenShotCanvasRef.current || !webcamVideoRef.current) return;

        const video = webcamVideoRef.current;
        const canvas = screenShotCanvasRef.current;
        const context = screenShotCanvasRef.current.getContext("2d");
        if (!context) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                const timestamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
                const filename = `${textToSlug(user!.name)} ${timestamp}`;

                uploadBlob(blob, filename).then((url) => {
                    console.log({ url });
                });
            }
        });
    };

    const startRecording = async () => {
        if (
            !videoCanvasRef.current ||
            !webcamVideoRef.current ||
            !screenVideoRef.current
        )
            return;

        let animationFrameId: number;
        const video = screenVideoRef.current;
        const canvas = videoCanvasRef.current;
        const context = videoCanvasRef.current.getContext("2d");
        if (!context) return;

        const scale = Math.min(
            RECORDING_RESOLUTION_WIDTH / video.videoWidth,
            1
        );
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;

        const drawFrame = () => {
            if (!screenVideoRef.current || !webcamVideoRef.current) return;

            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(
                screenVideoRef.current!,
                0,
                0,
                canvas.width,
                canvas.height
            );
            const smallWidth = canvas.width / 4;
            const smallHeight =
                (webcamVideoRef.current!.videoHeight /
                    webcamVideoRef.current!?.videoWidth) *
                smallWidth;
            context.drawImage(
                webcamVideoRef.current!,
                canvas.width - smallWidth - 10,
                canvas.height - smallHeight - 10,
                smallWidth,
                smallHeight
            );
            animationFrameId = requestAnimationFrame(drawFrame);
        };
        drawFrame();

        const canvasStream = canvas.captureStream(RECORDING_FPS);
        recorderRef.current = new MediaRecorder(canvasStream, {
            mimeType: "video/webm",
        });

        setTimeout(() => {
            recorderRef.current!.start();
        }, 200);

        const chunks: Blob[] = [];
        recorderRef.current.ondataavailable = (event) => {
            chunks.push(event.data);
        };

        recorderRef.current.onstop = () => {
            cancelAnimationFrame(animationFrameId);
            const blob = new Blob(chunks, { type: "video/webm" });
            const filename = textToSlug(user!.name);

            dispatch(setIsUploadingMedia(true));
            uploadBlob(blob, filename).then((url) => {
                console.log({ url });
            });
        };
    };

    const stopStream = () => {
        if (videoCanvasRef.current) {
            videoCanvasRef.current.width = 0;
            videoCanvasRef.current.height = 0;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
        }
    };

    const stopRecording = () => {
        if (!recorderRef.current) return;

        if (recorderRef.current.state === "recording") {
            recorderRef.current.stop();
        }
    };

    const stopTakingScreenshot = () => {
        if (!screenShotIntervalRef.current) return;

        clearInterval(screenShotIntervalRef.current);
        screenShotIntervalRef.current = null;
    };

    const handleStartTest = async () => {
        if (!test) return;
        if (
            (test.options.require_screen_recorder.enable && !canAccessScreen) ||
            (test.options.require_camera_on.enable && !canAccessCamera) ||
            !accepted
        ) {
            setIsAskingForPermissions(true);
            return;
        }
        if (canAccessCamera && canAccessScreen) {
            if (
                test.options.require_camera_on.record_mode ===
                RECORD_MODE.SCREEN_SHOTS
            ) {
                screenShotIntervalRef.current = setInterval(() => {
                    startTakingScreenshot();
                }, (test.options.require_camera_on.interval_in_seconds || DEFAULT_SCREENSHOT_INTERVAL) * 1000);
            } else {
                startRecording();
            }
        }
        dispatch(takeTestActions.setIsStarted(true));
        setTimeout(() => {
            refetchTest();
        }, 0);
    };

    const handleStopTest = async () => {
        stopRecording();
        stopTakingScreenshot();
        stopStream();
        setAccepted(false);
        dispatch(takeTestActions.setIsStarted(false));
        setTimeout(() => {
            refetchTest();
        }, 0);
    };

    useEffect(() => {
        if (!test || !test.datetime) return;

        const timer = setInterval(() => {
            if (new Date(test.datetime).getTime() - Date.now() >= 0) {
                dispatch(takeTestActions.setStartable(false));
            } else {
                dispatch(takeTestActions.setStartable(true));
                clearInterval(timer);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
            // dispatch(takeTestActions.reset());
        };
    }, [test, dispatch]);

    useEffect(() => {
        return () => {
            if (screenShotIntervalRef.current) {
                clearInterval(screenShotIntervalRef.current);
            }
            if (recorderRef.current) {
                recorderRef.current.stop();
            }
        };
    }, []);

    useEffect(() => {
        if (isPasscodeValidated && passcode.code.length > 0) {
            refetchTest();
        }
    }, [passcode.code, isPasscodeValidated, refetchSubmissions, refetchTest]);

    const handleEnterCorrectPasscode = (data: PasscodeItf) => {
        dispatch(takeTestActions.setEnteredPasscode(data.code));
        dispatch(takeTestActions.setIsPasscodeValidated(true));
        dispatch(takeTestActions.setIsEnteringPasscode(false));
    };

    const canEnterDoingTest = useMemo(() => {
        if (!test) return false;

        const isValidParts =
            test && test.num_parts > 1 && test.parts.length > 1;
        const isValidQuestions =
            test &&
            test.num_parts === 0 &&
            test.questions &&
            test.questions.length > 0;
        return isStarted && !isEnded && (isValidParts || isValidQuestions);
    }, [test, isStarted, isEnded]);

    return (
        <div className="w-[840px] mx-auto mt-6 bg-white shadow-lg">
            {isEnteringPasscode && (
                <PasscodeLink
                    passCodeOnly={true}
                    onClose={() =>
                        dispatch(takeTestActions.setIsEnteringPasscode(false))
                    }
                    onSuccess={handleEnterCorrectPasscode}
                />
            )}
            {errorMessage && (
                <Error
                    errorMessage={{ text: errorMessage }}
                    actionButton={{
                        text: "Back to home",
                        onClick: () => {
                            navigate("/");
                        },
                    }}
                />
            )}
            {!isStarted && test && (
                <div className="py-8 px-8">
                    <UploadProcess progress={progress} status={status} />
                    <TestInfo />
                    {isAskingForPermissions && (
                        <AskPermissions
                            onClose={() => setIsAskingForPermissions(false)}
                            onAccept={() => {
                                setAccepted(true);
                                handleRecord();
                                setIsAskingForPermissions(false);
                            }}
                        />
                    )}
                    {showResetPermissionsMessage && (
                        <ResetPermissionsInstruction
                            onClose={() => setShowReSetPermissionMessage(false)}
                        />
                    )}

                    {(test.status === TEST_STATUS.PUBLISHED ||
                        test.status === TEST_STATUS.OPENED) &&
                        (test.options.allow_multiple_submissions.enable
                            ? submissions.length <
                              test.options.allow_multiple_submissions
                                  .maximum_submissions!
                            : submissionsCount === 0) && (
                            <div className="flex justify-center mt-4">
                                <Button
                                    size="lg"
                                    disabled={!startable}
                                    onClick={handleStartTest}
                                >
                                    Start test
                                </Button>
                            </div>
                        )}
                    {testStatus === TEST_STATUS.CLOSED && (
                        <div className="flex justify-center mt-2">
                            <p className="text-xl">Test is closed</p>
                        </div>
                    )}
                    {/* {testStatus === TEST_STATUS.ENDED && (
                        <div className="flex justify-center mt-2">
                            <p className="text-xl">Test is ended</p>
                        </div>
                    )} */}
                </div>
            )}
            <Loading
                isLoading={isLoadingTest}
                loadingText={{ text: "Loading test's information..." }}
            />
            {!isLoadingTest && isForbidden && (
                <MessageAction
                    message={{
                        text: "You are not allowed to access this test.",
                    }}
                    actions={{
                        primary: {
                            text: "Back to home",
                            onClick: () => navigate("/"),
                        },
                    }}
                />
            )}
            {canEnterDoingTest && <DoingTest onAfterSubmit={handleStopTest} />}

            <Loading
                isLoading={isLoadingSubmissions}
                loadingText={{ text: "Loading submissions..." }}
            />
            {submissions.length > 0 &&
                !isStarted &&
                test?.options.allow_view_submission_after_test.enable && (
                    <Submissions />
                )}

            {accepted && (
                <Recorder
                    webcamVideoRef={webcamVideoRef}
                    screenVideoRef={screenVideoRef}
                />
            )}

            <canvas ref={videoCanvasRef} className="hidden"></canvas>
            <canvas ref={screenShotCanvasRef} className="hidden"></canvas>
        </div>
    );
};

export default TakeTestPage;
