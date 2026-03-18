import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import Coverage from "../pages/shared/coverage/Coverage";
import About from "../pages/about/About";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Auth/login/Login";
import Register from "../pages/Auth/register/Register";
import ErrorElement from "../pages/shared/ErrorElement";
import SendAParcel from "../pages/sendAparcel/SendAParcel";
import PrivateRoutes from "./PrivateRoutes";

const routes = createBrowserRouter([
    {
        path: '/', Component: RootLayout,
        errorElement: <ErrorElement></ErrorElement>,
        hydrateFallbackElement: <h2>Loading.....</h2>,
        children: [
            {index: true, Component: Home},
            {path: "coverage", Component: Coverage,
                loader: () => fetch("/serviceCenter.json").then(res => res.json())
            },
            {path: "about-us", Component: About},
            {path: "send-a-parcel", element: <PrivateRoutes><SendAParcel></SendAParcel></PrivateRoutes>}
        ]
    },
    {
        path: "/", Component: AuthLayout,
        children: [
            {path: "login", Component: Login},
            {path: "register", Component: Register}
        ]
    }
]);

export default routes;