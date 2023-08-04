import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import SearchInput from "../Form/SearchInput";
import useCategory from "../../hooks/useCategory";
import { useCart } from "../../context/cart";
import { Badge } from "antd";
import { BsFillBagFill, BsChevronDown, BsList } from "react-icons/bs";

const Header = () => {
  const [auth, setAuth] = useAuth();
  const [cart] = useCart();
  const categories = useCategory();
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    localStorage.removeItem("auth");
    toast.success("Logout Successfully");
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <div
        style={{ height: "7vh" }}
        className="header-address-section fixed top-0 left-0 right-0 z-50 flex items-center justify-between shadow-md bg-white"
      >
        <ul style={{ fontSize: "1.2em" }} className="text-black ml-5">
          Swabi, KPK, Pakistan, 23430
        </ul>
        <ul style={{ fontSize: "1.2em" }} className="text-black mr-5">
          For any queries, contact@codewithadnan.com
        </ul>
      </div>
      <header className="main-header bg-body-tertiary fixed top-8 left-0 right-0 z-50 flex items-center justify-between shadow-md">
        <div className="container px-4 py-3 md:flex md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <button
              className={`md:hidden text-black ${
                isMenuOpen ? "absolute top-0 right-0 mt-3 mr-3" : ""
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <BsList size={24} />
            </button>
            <Link
              to="/"
              style={{
                width: "18em",
              }}
              className="font-bold text-black"
            >
              <img src="http://localhost:3000/assets/logo.png" alt="" />
            </Link>
          </div>
          <ul
            className={`${
              isMenuOpen
                ? "flex flex-col items-center mt-6 md:mt-0 md:flex-row md:space-x-4 lg:flex-row lg:space-x-4"
                : "hidden"
            } md:flex lg:flex md:items-center md:space-x-4 lg:space-x-4`}
          >
            <SearchInput />
            <li className={isMenuOpen ? "my-3 md:my-0" : ""}>
              <NavLink to="/" className="text-black">
                Home
              </NavLink>
            </li>
            <li className="group">
              <button className="text-black group-hover:bg-body-primary px-4 py-2 rounded-lg flex items-center space-x-1">
                Categories <BsChevronDown className="text-black" />
              </button>
              <ul className="dropdown-menu absolute hidden z-10 group-hover:block bg-black text-body-primary py-2 space-y-2">
                <li>
                  <Link to="/categories" className="text-white block px-4 py-2">
                    All Categories
                  </Link>
                </li>
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
              </ul>
            </li>
            {!auth?.user ? (
              <>
                <li className={isMenuOpen ? "my-3 md:my-0" : ""}>
                  <NavLink to="/register" className="text-black">
                    Register
                  </NavLink>
                </li>
                <li className={isMenuOpen ? "my-3 md:my-0" : ""}>
                  <NavLink to="/login" className="text-black">
                    Login
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="group">
                  <button className="text-black group-hover:bg-body-primary px-4 py-2 rounded-lg flex items-center space-x-1">
                    {auth?.user?.name} <BsChevronDown className="text-black" />
                  </button>
                  <ul className="dropdown-menu absolute hidden z-10 group-hover:block bg-black text-body-primary py-2 space-y-2">
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
            <li className={isMenuOpen ? "my-3 md:my-0" : ""}>
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
