import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { BsFillBagFill, BsChevronDown, BsList } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import "../../styles/Header.css";
import CloseIcon from "@mui/icons-material/Close";
import PlaceIcon from "@mui/icons-material/Place";
import MailIcon from "@mui/icons-material/Mail";
const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [isAuthMenuOpen, setIsAuthMenuOpen] = useState(false);
  const [isToggle, setIsToggle] = useState(false);

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const toggleCategoryMenu = event => {
    event.stopPropagation(); // Prevent click event from propagating to the header
    setIsCategoryMenuOpen(!isCategoryMenuOpen);
    setIsAuthMenuOpen(false); // Close the user menu if it's open
  };

  const toggleAuthMenu = event => {
    event.stopPropagation(); // Prevent click event from propagating to the header
    setIsAuthMenuOpen(!isAuthMenuOpen);
    setIsCategoryMenuOpen(false); // Close the category menu if it's open
  };

  // Create a ref for the header container
  const headerRef = useRef();

  // Function to close both menus
  const closeMenus = () => {
    setIsCategoryMenuOpen(false);
    setIsAuthMenuOpen(false);
  };

  // Function to handle click events on the window
  useEffect(() => {
    const handleWindowClick = event => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target) &&
        !event.target.closest(".dropdown-menu") &&
        !event.target.closest(".custom-responsiveness-header")
      ) {
        closeMenus();
      }
    };

    window.addEventListener("click", handleWindowClick);

    return () => {
      window.removeEventListener("click", handleWindowClick);
    };
  }, []);

  return (
    <>
      <div
        style={{ height: "5vh", paddingTop: "1em" }}
        className="header-address-section fixed top-0 left-0 right-0 z-50 flex items-center justify-between shadow-md bg-white"
      >
        <ul style={{ fontSize: "1.02em" }} className="text-black ml-5">
          <PlaceIcon className="-mt-1" /> Swabi, KPK, Pakistan, 23430
        </ul>
        <ul style={{ fontSize: "1.02em" }} className="text-black mr-5">
          <MailIcon className="mr-2 -mt-1" color="blue" />
          For any queries, contact@codewithadnan.com
        </ul>
      </div>
      <header
        ref={headerRef}
        className="main-header bg-body-tertiary fixed top-6 left-0 right-0 z-50 flex items-center justify-between shadow-md"
        onClick={closeMenus} // Close menus when someone clicks on the header but besides the categories and auth.name item
      >
        <div className="container px-4 py-3 md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            {/* Hamburger Menu for Smartphone */}
            <button
              className={`md:hidden text-black ${
                isToggle
                  ? "absolute top-1/2 -translate-y-full right-12 mt-3"
                  : "absolute translate-y-3 right-12 mt-3"
              }`}
              onClick={() => setIsToggle(!isToggle)}
            >
              {isToggle ? <BsList size={30} /> : <CloseIcon fontSize="large" />}
            </button>
            <Link to="/" className="font-bold text-black">
              {isToggle ? (
                <img
                  style={{
                    width: "18em",
                  }}
                  src="http://localhost:3000/assets/logo.png"
                  alt="Logo"
                />
              ) : (
                <img
                  style={{
                    width: "12em",
                  }}
                  src="http://localhost:3000/assets/logo.png"
                  alt="Logo"
                />
              )}
            </Link>
          </div>
          <ul
            className={`${
              isToggle
                ? "md:hidden sm:hidden custom-responsiveness-header"
                : "flex flex-col items-center mt-8 md:mt-0 gap-4 md:flex-row md:space-x-4 lg:flex-row lg:space-x-4"
            } md:flex lg:flex md:items-center md:space-x-4 lg:space-x-4`}
          >
            <SearchInput />
            <li className={isCategoryMenuOpen ? "my-3 md:my-0" : ""}>
              <NavLink to="/" className="text-black">
                Home
              </NavLink>
            </li>
            <li className="relative group">
              <button
                className="text-black px-4 py-2 rounded-lg flex items-center space-x-1 group-hover:bg-body-primary"
                onClick={toggleCategoryMenu}
              >
                Categories <FiChevronDown className="text-black" />
              </button>
              <ul
                className={`dropdown-menu absolute ${
                  isCategoryMenuOpen ? "block" : "hidden"
                } z-10 bg-black text-body-primary py-2 space-y-2`}
              >
                <li>
                  <Link to="/categories" className="text-white block px-4 py-2">
                    All Categories
                  </Link>
                  {categories?.map(c => (
                    <li key={c.slug}>
                      <Link
                        to={`/category/${c.slug}`}
                        className="text-white block px-4 py-2"
                      >
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </li>
              </ul>
            </li>

            {!auth?.user ? (
              <>
                <li className={isAuthMenuOpen ? "my-3 md:my-0" : ""}>
                  <NavLink to="/register" className="text-black">
                    Register
                  </NavLink>
                </li>
                <li className={isAuthMenuOpen ? "my-3 md:my-0" : ""}>
                  <NavLink to="/login" className="text-black">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="relative group">
                  <span
                    className="text-black px-4 py-2 rounded-lg flex items-center space-x-1 group-hover:bg-body-primary cursor-pointer"
                    onClick={toggleAuthMenu}
                  >
                    {auth?.user?.name} <BsChevronDown className="text-black" />
                  </span>
                  <ul
                    className={`dropdown-menu absolute ${
                      isAuthMenuOpen ? "block" : "hidden"
                    } z-10 bg-black text-body-primary py-2 space-y-2 group-hover:block`}
                  >
                    <li>
                      <NavLink
                        to={`/dashboard/${
                          auth?.user?.role === 1 ? "admin" : "user"
                        }`}
                        className="text-white block px-4 py-2"
                      >
                        Dashboard
                      </NavLink>
                    </li>
                    <li>
                      <NavLink
                        onClick={handleLogout}
                        to="/login"
                        className="text-white block px-4 py-2"
                      >
                        Logout
                      </NavLink>
                    </li>
                  </ul>
                </li>
              </>
            )}
            <li className={isCategoryMenuOpen ? "my-3 md:my-0" : ""}>
              <NavLink to="/cart" className="text-white">
                <Badge count={cart?.length} showZero offset={[10, -5]}>
                  <BsFillBagFill size={25} />
                </Badge>
              </NavLink>
            </li>
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
