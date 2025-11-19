import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { navlinks } from "../data/navlinks";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import api from "../config/api";
import { logout as logoutAction } from "../app/features/authSlice"; // adjust path if needed

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // get auth from redux store
  const user = useSelector((state) => state.auth?.user);
  const isLoggedIn = Boolean(user);

  // NOTE: we removed hiddenWhenLoggedIn filtering — always show navlinks
  const shownNavLinks = navlinks;

  // show logout button only when user is on /home (or subpaths)
  const showLogoutButton = isLoggedIn && location.pathname.startsWith("/home");

  const handleLogout = () => {
    // dispatch redux action to clear auth state
    dispatch(logoutAction());

    // clear storage / api header
    try {
      localStorage.removeItem("token");
      if (api?.defaults?.headers?.common) {
        delete api.defaults.headers.common["Authorization"];
      }
    } catch (err) {
      // ignore
    }

    // navigate to login and reload to ensure any in-memory state is cleared
    navigate("/login", { replace: true });
    setTimeout(() => {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      } else {
        window.location.reload();
      }
    }, 150);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 z-50 flex items-center justify-between w-full py-4 px-2 md:px-16 lg:px-24 xl:px-32 backdrop-blur"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
      >
        <Link to="/">
          <div className="flex items-center">
            <img
              className="h-8 md:h-10 w-auto mx-2"
              src="/assets/logoAi.png"
              alt="logo"
            />
            <h2 className="text-2xl text-purple-800 font-bold">Draftify</h2>
          </div>
        </Link>

        {/* If user is logged in and is on /home -> show Logout button */}
        {showLogoutButton ? (
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white"
          >
            Logout
          </button>
        ) : (
          <>
            {/* desktop nav links (hidden on mobile) */}
            <div className="hidden md:flex items-center gap-8 transition duration-500">
              {shownNavLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="hover:text-pink-500 transition"
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* show Login button only when not logged in */}
            {!isLoggedIn && (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:block px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full"
              >
                Login
              </button>
            )}

            {/* show Logout on desktop when logged in but not on /home (if desired) */}
            {isLoggedIn && !showLogoutButton && (
              <button
                onClick={handleLogout}
                className="hidden md:block px-4 py-2 rounded-full border"
              >
                Sign out
              </button>
            )}

            {/* mobile menu trigger */}
            <button onClick={() => setIsOpen(true)} className="md:hidden">
              <MenuIcon size={26} className="active:scale-90 transition" />
            </button>
          </>
        )}
      </motion.nav>

      {/* Mobile menu */}
      {!showLogoutButton && (
        <div
          className={`fixed inset-0 z-100 bg-black/40 backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-400 ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {shownNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className="text-white"
            >
              {link.name}
            </Link>
          ))}

          {/* If not logged in show Login in mobile menu */}
          {!isLoggedIn && (
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
              className="px-6 py-2.5 bg-pink-600 hover:bg-pink-700 active:scale-95 transition-all rounded-full text-white"
            >
              Login
            </button>
          )}

          {/* show logout in mobile menu when logged in */}
          {isLoggedIn && (
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 rounded-full text-white"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => setIsOpen(false)}
            className="active:ring-3 active:ring-white aspect-square size-10 p-1 items-center justify-center bg-pink-600 hover:bg-pink-700 transition text-white rounded-md flex"
          >
            <XIcon />
          </button>
        </div>
      )}
    </>
  );
}
