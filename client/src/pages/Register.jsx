import React from "react";
import { useDispatch } from "react-redux";
import api from "../config/api";
import toast from "react-hot-toast";
import { login } from "../app/features/authSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      };
      const { data } = await api.post("/api/user/register", payload);
      const { token, user } = data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      dispatch(login(user));
      navigate("/home", { replace: true });

      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
      console.error("Register error:", error?.response?.data || error);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 xl:gap-16">
        {/* Left Side Image */}
        <div className="hidden lg:flex w-full lg:w-full h-[500px] xl:h-[600px] rounded-2xl overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src="/assets/registerr.png"
            alt="leftSideImage"
          />
        </div>

        {/* Right Side Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-0 hover:border rounded-2xl border-green-200 transition-all m-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md px-4 sm:px-6 flex flex-col"
          >
            <h2 className="text-3xl sm:text-4xl text-gray-100 font-semibold text-center">
              Sign up
            </h2>

            <p className="text-sm text-gray-400/90 mt-3 text-center">
              Create your account to get started
            </p>

            <button
              type="button"
              className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full text-gray-50 hover:bg-gray-500/20 transition-colors gap-3 border border-gray-700/50"
            >
              <img
                src="https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"
                alt="googleLogo"
                className="w-7"
              />
              <span className="text-sm sm:text-base">Sign up with Google</span>
            </button>

            <div className="flex items-center gap-4 w-full my-6">
              <div className="w-full h-px bg-gray-700"></div>
              <p className="text-nowrap text-xs sm:text-sm text-gray-500">
                or sign up with email
              </p>
              <div className="w-full h-px bg-gray-700"></div>
            </div>

            {/* Full Name Input */}
            <div className="flex items-center w-full bg-transparent border border-gray-700 focus-within:border-indigo-500 h-12 rounded-full overflow-hidden pl-4 sm:pl-6 gap-2 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <circle cx="12" cy="8" r="5" />
                <path d="M20 21a8 8 0 0 0-16 0" />
              </svg>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm w-full h-full pr-4"
                required
              />
            </div>

            {/* Email Input */}
            <div className="flex items-center w-full mt-4 bg-transparent border border-gray-700 focus-within:border-indigo-500 h-12 rounded-full overflow-hidden pl-4 sm:pl-6 gap-2 transition-colors">
              <svg
                width="16"
                height="11"
                viewBox="0 0 16 11"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                  fill="#9CA3AF"
                />
              </svg>
              <input
                type="email"
                name="email"
                placeholder="Email id"
                value={formData.email}
                onChange={handleChange}
                className="bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm w-full h-full pr-4"
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center mt-4 w-full bg-transparent border border-gray-700 focus-within:border-indigo-500 h-12 rounded-full overflow-hidden pl-4 sm:pl-6 gap-2 transition-colors">
              <svg
                width="13"
                height="17"
                viewBox="0 0 13 17"
                fill="none"
                className="flex-shrink-0"
              >
                <path
                  d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                  fill="#9CA3AF"
                />
              </svg>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="bg-transparent text-gray-200 placeholder-gray-500 outline-none text-sm w-full h-full pr-4"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="mt-8 w-full h-12 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition-all text-sm sm:text-base font-medium shadow-lg shadow-indigo-500/30"
            >
              Sign up
            </button>

            {/* Login Link */}
            <p className="text-gray-400 text-xs sm:text-sm mt-5 text-center">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-indigo-400 hover:text-indigo-300 hover:underline transition-colors font-medium"
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
