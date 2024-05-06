import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import GuessRoute from "./components/routes/GuessRoute";
import RegistePage from "./pages/authPage/RegistePage";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
    const router = createBrowserRouter([
        {
            element: <GuessRoute />,
            children: [
                {
                    path: "/register",
                    element: <RegistePage />,
                },
            ],
        },
    ]);

    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            <ToastContainer position="top-center" autoClose={4000} />
        </QueryClientProvider>
    );
}

export default App;
