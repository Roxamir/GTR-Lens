import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiWrenchScrewdriver,
  HiArrowUpTray,
  HiPhoto,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";

import Button from "../ui/Button";

const NavItem = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="flex flex-col items-center transition duration-200 ease-in-out hover:scale-120 text-white! hover:text-red-700!"
  >
    {children}
  </Link>
);

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 w-full h-16 flex items-center justify-between bg-slate-900 text-white px-8">
      <Link to="/" className="group" onClick={closeMenu}>
        <img
          src="/src/assets/gtr_logo.svg"
          width={50}
          height={50}
          alt="GTR Logo"
          className="transition-transform duration-200 ease-in-out group-hover:scale-110 active:scale-95"
        />
      </Link>

      {/*Desktop Navigation*/}
      <nav className="hidden md:flex items-center gap-8">
        <NavItem to="/equipment">
          <HiWrenchScrewdriver className="w-6 h-6" />
          <span className="text-xs">Equipment</span>
        </NavItem>

        <NavItem to="/upload">
          <HiArrowUpTray className="w-6 h-6" />
          <span className="text-xs">Upload</span>
        </NavItem>

        <NavItem to="/photos">
          <HiPhoto className="w-6 h-6" />
          <span className="text-xs">Photos</span>
        </NavItem>
      </nav>

      {/*Desktop Login Button*/}
      <div className="hidden md:block">
        <Button as="link" to="/login" onClick={closeMenu}>
          Login
        </Button>
      </div>

      {/*Hamburger Menu*/}
      <div className="md:hidden">
        <Button variant="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <HiOutlineXMark className="h-8 w-8" />
          ) : (
            <HiOutlineBars3 className="h-8 w-8" />
          )}
        </Button>
      </div>

      {/*Mobile Menu Dropdown*/}
      {isMenuOpen && (
        <div className="absolute left-0 top-16 w-full bg-slate-900 md:hidden">
          <nav className="flex flex-col items-center gap-6 py-8">
            <NavItem to="/equipment" onClick={() => setIsMenuOpen(false)}>
              <HiWrenchScrewdriver className="h-6 w-6" />
              <span className="text-xs">Equipment</span>
            </NavItem>
            <NavItem to="/upload" onClick={() => setIsMenuOpen(false)}>
              <HiArrowUpTray className="h-6 w-6" />
              <span className="text-xs">Upload</span>
            </NavItem>
            <NavItem to="/photos" onClick={() => setIsMenuOpen(false)}>
              <HiPhoto className="h-6 w-6" />
              <span className="text-xs">Photos</span>
            </NavItem>

            <Button as="link" to="/login" onClick={closeMenu}>
              Login
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
