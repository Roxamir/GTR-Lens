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
import DamageReportPage from "./pages/DamageReportPage";
import Protected from "./routes/Protected";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Protected>
            <HomePage />
          </Protected>
        ),
      },
      {
        path: "equipment",
        element: (
          <Protected>
            <EquipmentListPage />
          </Protected>
        ),
      },
      {
        path: "equipment/:id",
        element: (
          <Protected>
            <EquipmentDetailPage />
          </Protected>
        ),
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "photos",
        element: (
          <Protected>
            <PhotosPage />
          </Protected>
        ),
      },
      {
        path: "upload",
        element: (
          <Protected>
            <UploadPage />
          </Protected>
        ),
      },
      {
        path: "damage-report",
        element: (
          <Protected>
            <DamageReportPage />
          </Protected>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
