import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { URL } from "../url";
import axios from "axios";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import PostComponent from "../components/PostComponent";
import { UserContext } from "../context/UserContext";

const MyBlogs = () => {
  const params = useParams();
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loader, setLoader] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const fetchUserPosts = async () => {
    setLoader(true);
    try {
      const res = await axios.get(URL + "/api/posts/user/" + params.id);
      setPosts(res.data);
      setLoader(false);
      setNoResult(false);
    } catch (e) {
      console.log("failed to load posts");
      setLoader(true);
      setNoResult(true);
    }
  };
  useEffect(() => {
    fetchUserPosts();
  }, [params]);

  return (
    <div>
      <Navbar />
      <div className="px-4 md:px-[200px] ">
        {loader ? (
          <div className="h-[40vh] flex justify-center items-center">
            <Loader />
          </div>
        ) : !noResult ? (
          <>
            <h1 className="text-xl font-bold my-4 text-center">Your Blogs:</h1>
            {posts.map((post) => (
            <Link
              key={`link_${post._id}`}
              to={user ? `/posts/post/${post._id}` : "/login"}
            >
              <PostComponent key={post._id} post={post} />
            </Link>
            ))}
          </>
        ) : (
          <h3 className="text-center font-bold mt-16">No posts available</h3>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default MyBlogs;
