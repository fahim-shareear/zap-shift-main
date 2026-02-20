import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import Coverage from "../pages/shared/coverage/Coverage";

const routes = createBrowserRouter([
    {
        path: '/', Component: RootLayout,
        children: [
            {index: true, Component: Home},
            {path: "coverage", Component: Coverage}
        ]
    }
]);

export default routes;