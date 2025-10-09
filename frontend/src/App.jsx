import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

// Components
import Root from "./routes/Root";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PhotosPage from "./pages/PhotosPage";
import UploadPage from "./pages/UploadPage";
import EquipmentListPage from "./pages/EquipmentPage";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "equipment",
        element: <EquipmentListPage />,
      },
      {
        path: "equipment/:id",
        element: <EquipmentDetailPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "photos",
        element: <PhotosPage />,
      },
      {
        path: "upload",
        element: <UploadPage />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
