import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { app } from "../firebase";
import { useNavigate } from "react-router-dom";
import api from "../config/api";
import { useDispatch } from "react-redux";
import { login } from "../app/features/authSlice";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

export default function OAuth({ from = null }) {
  const auth = getAuth(app);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const googleInfo = await signInWithPopup(auth, provider);

      // Correct axios call
      const res = await api.post("/api/user/google", {
        name: googleInfo.user.displayName,
        email: googleInfo.user.email,
        from: from, // pass the from prop
      });

      const data = res.data;
      // destructure like login.js
      const { token, user } = data;

      // Save token
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // redux login
      dispatch(login({ token, user }));

      toast.success(data.message || "Logged in with Google");

      navigate("/home", { replace: true });
    } catch (error) {
      console.log("Google Authentication Error: ", error);
      toast.error(
        error?.response?.data?.message || error.message || "Google login failed"
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="flex items-center justify-center w-full text-white py-2 px-4 border border-red-300 rounded-2xl my-2 hover:border hover:border-orange-600 transition duration-300"
    >
      <FcGoogle className="mx-2 size-6" />
      Continue with Google
    </button>
  );
}
