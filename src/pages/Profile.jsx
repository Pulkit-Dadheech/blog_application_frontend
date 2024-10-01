import React, { useState, useEffect, useContext } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProfilePosts from "../components/ProfilePosts";
import axios from "axios";
import { URL } from "../url";
import { UserContext } from "../context/UserContext";
import { useNavigate, useParams } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import PostComponent from "../components/PostComponent";
import { Link } from "react-router-dom";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const params = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axios.get(URL + "/api/users/" + params.id);
      console.log(res);
      setUsername(res.data.username || ""); // Ensure default value
      setEmail(res.data.email || "");
    } catch (e) {
      console.log("erorr");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [params]);

  const fetchUserPosts = async () => {
    try {
      const res = await axios.get(URL + "/api/posts/user/" + params.id);
      setPosts(res.data);
    } catch (e) {
      console.log("Error fetching post");
    }
  };

  useEffect(() => {
    fetchUserPosts();
  }, [params]);

  const handleUserUpdate = async () => {
    try {
      const res = await axios.put(
        URL + "/api/users/" + user._id,
        { username, email, password },
        { withCredentials: true }
      );
      console.log(res);
      setMessage("Profile updated successfully.");
    } catch (e) {
      console.log(e);
    }
  };

  const handleUserDelete = async () => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`${URL}/api/users/${user._id}`, {
            withCredentials: true,
          });

          await Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          });

          navigate("/login");
        } catch (e) {
          await Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting.",
            icon: "error",
          });
          console.error("Deletion error");
        }
      }
    } catch (e) {
      console.error("General error:");
      await Swal.fire({
        title: "Error!",
        text: "An unexpected error occurred.",
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="px-8 md:px-[200px] mt-8 flex md:flex-row flex-col-reverse md:items-start items-start">
        <div className="flex flex-col md:w-[70%] w-full mt-8 md:mt-0">
          <h1 className="text-xl font-bold my-4">Your posts:</h1>
          {posts.length === 0 ? (
            <h1 className="text-center">No posts found</h1>
          ) : (
            posts?.map((postData) => (
              <Link
                key={`link_${postData._id}`}
                to={user ? `/posts/post/${postData._id}` : "/login"}
              >
                <PostComponent key={postData._id} post={postData} />
              </Link>
            ))
          )}
        </div>
        <div className="md:sticky md:top-16 flex justify-start md:justify-end items-start md:w-[30%] w-full md:items-end">
          <div className="flex flex-col space-y-4 items-start ">
            <h1 className="text-xl font-bold mb-4">Profile</h1>
            <input
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              className="outline-none px-2 py-4 text-gray-500"
              placeholder="Your username"
              type="text"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="outline-none px-2 py-4 text-gray-500"
              placeholder="Your email"
              type="email"
            />
            <div className="flex items-center">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="outline-none px-2 py-4 text-gray-500"
                placeholder="Your new password"
                type={showPassword ? "text" : "password"}
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}{" "}
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-8">
              <button
                onClick={handleUserUpdate}
                className="text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400"
              >
                Update
              </button>
              <button
                onClick={handleUserDelete}
                className="text-white font-semibold bg-black px-4 py-2 hover:text-black hover:bg-gray-400"
              >
                Delete Profile
              </button>
            </div>
            {message !== "" && (
              <p className="text-black text-center">{message}</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
