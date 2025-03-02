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
import CreateTestPage from "./pages/createTestPage.tsx/CreateTestPage";
import TakeTestPage from "./pages/takeTestPage/TakeTestPage";
import NotFound from "./pages/others/NotFound";
import { useSelector } from "react-redux";
import { RootState } from "./stores/rootState";
import ViewTestPage from "./pages/viewTestPage/ViewTestPage";
import TestsPage from "./pages/testsPage/TestsPage";
import ChatPage from "./pages/chatPage/ChatPage";
import ChatSocketProvider from "./pages/chatPage/components/ChatSocketContext";
import queryClientConfig from "./config/queryClient";

const queryClient = new QueryClient(queryClientConfig);

function App() {
    const user = useSelector((state: RootState) => state.auth.user);

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
                            path: "/tests/create",
                            element: <CreateTestPage />,
                        },
                        {
                            path: "/tests/:testId/edit",
                            element: <CreateTestPage />,
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
                            path: "/home",
                            element: <HomePage />,
                        },
                        {
                            path: "/tests",
                            element: <TestsPage />,
                        },
                        {
                            path: "/tests/:testId",
                            element:
                                user?.role === ROLES.MAKER ? (
                                    <ViewTestPage />
                                ) : (
                                    <TakeTestPage />
                                ),
                        },
                        {
                            path: "/chat",
                            element: (
                                <ChatSocketProvider>
                                    <ChatPage />
                                </ChatSocketProvider>
                            ),
                        },
                    ],
                },
                {
                    element: <ProtectedRoute allowedRoles={[ROLES.TAKER]} />,
                    children: [],
                },
                {
                    path: "*",
                    element: <NotFound />,
                },
            ],
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
