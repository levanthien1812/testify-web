import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GuessRoute from "./components/routes/GuessRoute";
import RegistePage from "./pages/authPage/RegistePage";
import { QueryClient, QueryClientProvider } from "react-query";
import MainLayout from "./components/layouts/MainLayout";
import LoginPage from "./pages/authPage/LoginPage";
import "react-toastify/dist/ReactToastify.css";

const queryClient = new QueryClient();

function App() {
    const router = createBrowserRouter([
        {
            element: <GuessRoute />,
            children: [
                {
                    element: <MainLayout />,
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
