import PageLayout from "../components/layout/Layout";
import Button from "../components/ui/Button";

const HomePage = () => {
  return (
    <PageLayout center={true}>
      <div className="flex flex-col gap-8 w-64">
        <Button
          as="link"
          to="/upload"
          className="py-8 text-4xl w-full text-center"
        >
          Upload Photo
        </Button>

        <Button
          as="link"
          to="/equipment"
          className="py-8 text-4xl w-full text-center"
        >
          View Equipment
        </Button>

        <Button
          as="link"
          to="/photos"
          className="py-8 text-4xl w-full text-center"
        >
          View Photos
        </Button>
      </div>
    </PageLayout>
  );
};

export default HomePage;
