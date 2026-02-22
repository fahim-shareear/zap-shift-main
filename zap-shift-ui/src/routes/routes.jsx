import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import Coverage from "../pages/shared/coverage/Coverage";
import About from "../pages/about/About";

const routes = createBrowserRouter([
    {
        path: '/', Component: RootLayout,
        hydrateFallbackElement: <h2>Loading.....</h2>,
        children: [
            {index: true, Component: Home},
            {path: "coverage", Component: Coverage,
                loader: () => fetch("/serviceCenter.json").then(res => res.json())
            },
            {path: "about-us", Component: About}
        ]
    }
]);

export default routes;