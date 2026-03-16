import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-[3px]">
              <span className="w-5 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600"></span>
              <span className="w-5 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600"></span>
              <span className="w-5 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-600"></span>
            </div>

            <Link
              to="/"
              className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
            >
              Planexa
            </Link>
          </div>

          {/* Menu */}
          <div className="flex items-center gap-6 font-medium">

            <Link
              to="/"
              className="relative text-gray-700 hover:text-blue-600 transition duration-300 after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              Home
            </Link>

            <Link
              to="/about"
              className="relative text-gray-700 hover:text-blue-600 transition duration-300 after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              About
            </Link>

            <Link
              to="/events"
              className="relative text-gray-700 hover:text-blue-600 transition duration-300 after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              Events
            </Link>

            <Link
              to="/contact"
              className="relative text-gray-700 hover:text-blue-600 transition duration-300 after:block after:h-[2px] after:bg-blue-600 after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
            >
              Contact
            </Link>

            {user ? (
              <>
                {user.role !== "admin" && (
                  <Link
                    to="/my-bookings"
                    className="text-gray-700 hover:text-blue-600 transition"
                  >
                    My Bookings
                  </Link>
                )}

                <span className="text-gray-500">
                  Hi, <span className="font-semibold">{user.name}</span>
                </span>

                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="bg-indigo-100 text-indigo-600 px-4 py-1 rounded-lg hover:bg-indigo-200 transition"
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-1.5 rounded-lg hover:opacity-90 transition shadow-md"
                >
                  Register
                </Link>
              </>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;