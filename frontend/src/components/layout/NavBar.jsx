import { Link } from "react-router-dom";
import { HiWrenchScrewdriver, HiArrowUpTray, HiPhoto } from "react-icons/hi2";

const NavBar = () => {
    return (
        <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between bg-slate-900 text-white px-8">
            <Link to="/">
                <img src="/src/assets/gtr_logo.svg" width={50} height={50} alt="GTR Logo" />
            </Link>

            <nav className="flex items-center gap-8">
                <Link to="/equipment" className="flex flex-col items-center">
                    <HiWrenchScrewdriver className="w-6 h-6" />
                    <span className="text-xs">Equipment</span>
                </Link>

                <Link to="/upload" className="flex flex-col items-center">
                    <HiArrowUpTray className="w-6 h-6" />
                    <span className="text-xs">Upload</span>
                </Link>
                
                <Link to="/photos" className="flex flex-col items-center">
                    <HiPhoto className="w-6 h-6" />
                    <span className="text-xs">Photos</span>
                </Link>
            </nav>

            <Link to="/login" className="text-zinc-950 font-semibold py-2 px-4 rounded hover:bg-red-700">
                Login
            </Link>
        </header>
    );
};

export default NavBar;