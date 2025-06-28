import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GuessRoute from "./components/routes/GuessRoute";
import RegistePage from "./pages/authPage/RegistePage";
import { QueryClient, QueryClientProvider } from "react-query";
import MainLayout from "./components/layouts/MainLayout";
import LoginPage from "./pages/authPage/LoginPage";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { ROLES } from "./config/constants/tests";
import HomePage from "./pages/homePage/HomePage";
import CreateTestPage from "./pages/createTestPage/CreateTestPage";
import TakeTestPage from "./pages/takeTestPage/TakeTestPage";
import NotFound from "./pages/others/NotFound";
import ViewTestPage from "./pages/viewTestPage/ViewTestPage";
import TestsPage from "./pages/testsPage/TestsPage";
import ChatPage from "./pages/chatPage/ChatPage";
import ChatSocketProvider from "./pages/chatPage/components/ChatSocketContext";
import queryClientConfig from "./config/queryClient";
import { useAppSelector } from "./hooks/hooks";
import QuestionBanksPage from "./pages/questionBanksPage/QuestionBanksPage";
import QuestionBankPage from "./pages/questionBankDetailPage/QuestionBankPage";
import { BreadcrumbHandle } from "./types/types";

const queryClient = new QueryClient(queryClientConfig);

function App() {
    const user = useAppSelector((state) => state.auth.user);

    const router = createBrowserRouter([
        {
            element: <MainLayout />,
            children: [
                {
                    element: <GuessRoute />,
                    children: [
                        {
                            path: "/register",
                            element: <RegistePage />,
                        },
                        {
                            path: "/login",
                            element: <LoginPage />,
                        },
                    ],
                },
                {
                    element: <ProtectedRoute allowedRoles={[ROLES.MAKER]} />,
                    children: [
                        {
                            path: "/",
                            children: [
                                {
                                    index: true,
                                    element: <HomePage />,
                                },
                                {
                                    path: "tests",
                                    children: [
                                        {
                                            index: true,
                                            element: <TestsPage />,
                                        },
                                        {
                                            path: "create",
                                            element: <CreateTestPage />,
                                            handle: {
                                                crumb: "Create Test",
                                            } as BreadcrumbHandle,
                                        },
                                        {
                                            path: ":testId",
                                            children: [
                                                {
                                                    index: true,
                                                    element: <CreateTestPage />,
                                                },
                                                {
                                                    path: "edit",
                                                    element: <CreateTestPage />,
                                                    handle: {
                                                        crumb: "Edit Test",
                                                    } as BreadcrumbHandle,
                                                },
                                            ],
                                            handle: {
                                                crumb: (data) => {
                                                    if (!data || !data.test) {
                                                        return "Test Detail";
                                                    }
                                                    return `${data.test.name}`;
                                                },
                                            } as BreadcrumbHandle,
                                        },
                                    ],
                                    handle: {
                                        crumb: "Tests",
                                    } as BreadcrumbHandle,
                                },
                                {
                                    path: "question-banks",
                                    children: [
                                        {
                                            index: true,
                                            element: <QuestionBanksPage />,
                                        },
                                        {
                                            path: ":questionBankId",
                                            element: <QuestionBankPage />,
                                            handle: {
                                                crumb: (data) => {
                                                    if (
                                                        !data ||
                                                        !data.questionBank
                                                    ) {
                                                        return "Question Bank Detail";
                                                    }
                                                    return `${data.questionBank.name}`;
                                                },
                                            } as BreadcrumbHandle,
                                        },
                                    ],
                                    handle: {
                                        crumb: "Question Banks",
                                    } as BreadcrumbHandle,
                                },
                            ],
                            handle: {
                                crumb: "Home",
                            } as BreadcrumbHandle,
                        },
                    ],
                },
                {
                    element: <ProtectedRoute allowedRoles={[ROLES.TAKER]} />,
                    children: [
                        {
                            path: "/",
                            children: [
                                {
                                    index: true,
                                    element: <HomePage />,
                                },
                                {
                                    path: "/tests",
                                    children: [
                                        {
                                            index: true,
                                            element: <TestsPage />,
                                        },
                                        {
                                            path: ":testId",
                                            element: <TakeTestPage />,
                                            handle: {
                                                crumb: "Take Test",
                                            } as BreadcrumbHandle,
                                        },
                                    ],
                                    handle: {
                                        crumb: "Tests",
                                    } as BreadcrumbHandle,
                                },
                            ],
                        },
                    ],
                },
                {
                    element: (
                        <ProtectedRoute
                            allowedRoles={[ROLES.MAKER, ROLES.TAKER]}
                        />
                    ),
                    children: [
                        {
                            path: "/chat",
                            children: [
                                {
                                    index: true,
                                    element: (
                                        <ChatSocketProvider>
                                            <ChatPage />
                                        </ChatSocketProvider>
                                    ),
                                    handle: {
                                        crumb: "Chat",
                                    } as BreadcrumbHandle,
                                },
                                {
                                    path: ":chatId",
                                    element: (
                                        <ChatSocketProvider>
                                            <ChatPage />
                                        </ChatSocketProvider>
                                    ),
                                    handle: {
                                        crumb: "Chat",
                                    } as BreadcrumbHandle,
                                },
                            ],
                        },
                    ],
                    handle: {
                        crumb: "Home",
                    } as BreadcrumbHandle,
                },
            ],
        },
        {
            path: "*",
            element: <NotFound />,
        },
    ]);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ToastContainer
                position="top-center"
                autoClose={4000}
                bodyStyle={{ fontFamily: "Abhaya Libre" }}
            />
        </QueryClientProvider>
    );
}

export default App;
