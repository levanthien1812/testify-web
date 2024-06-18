import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GuessRoute from "./components/routes/GuessRoute";
import RegistePage from "./pages/authPage/RegistePage";
import { QueryClient, QueryClientProvider } from "react-query";
import MainLayout from "./components/layouts/MainLayout";
import LoginPage from "./pages/authPage/LoginPage";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { roles } from "./config/config";
import HomePage from "./pages/homePage/HomePage";
import CreateTestPage from "./pages/createTestPage.tsx/CreateTestPage";
import { GoogleOAuthProvider } from "@react-oauth/google";
import TakeTestPage from "./pages/takeTestPage/TakeTestPage";
import NotFound from "./pages/others/NotFound";
import { useSelector } from "react-redux";
import { RootState } from "./stores/rootState";
import ViewTestPage from "./pages/viewTestPage/ViewTestPage";

const queryClient = new QueryClient();

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
                    element: <ProtectedRoute allowedRoles={[roles.MAKER]} />,
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
                            allowedRoles={[roles.MAKER, roles.TAKER]}
                        />
                    ),
                    children: [
                        {
                            path: "/home",
                            element: <HomePage />,
                        },
                        {
                            path: "/tests/:testId",
                            element:
                                user?.role === roles.MAKER ? (
                                    <ViewTestPage />
                                ) : (
                                    <TakeTestPage />
                                ),
                        },
                    ],
                },
                {
                    element: <ProtectedRoute allowedRoles={[roles.TAKER]} />,
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
