import { useNavigate, useRouteError } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import Button from "../components/ui/Button";
import { HiExclamationTriangle } from "react-icons/hi2";

const ErrorPage = () => {
  const navigate = useNavigate();
  const error = useRouteError();

  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <HiExclamationTriangle className="size-24 text-red-400 mb-6" />

        <h1 className="text-4xl font-bold mb-4">Oops!</h1>

        <p className="text-xl text-gray-300 mb-2">Something went wrong.</p>

        {error && (
          <p className="text-sm text-gray-400 mb-8">
            {error.statusText || error.message || "Page not found"}
          </p>
        )}

        <div className="flex gap-4">
          <Button onClick={() => navigate(-1)}>Go Back</Button>
          <Button variant="secondary" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default ErrorPage;
