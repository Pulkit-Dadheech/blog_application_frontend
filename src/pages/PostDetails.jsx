import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import { BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import Footer from "../components/Footer";
import Comment from "../components/Comment";
import { URL } from "../url";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";
import Loader from "../components/Loader";

const PostDetails = () => {
  const postId = useParams().id;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [postData, setPostData] = useState([]);
  const [comments, setComments] = useState([]);
  const [userComment, setUserComment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [postId]);

  const fetchPostComments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL + "/api/comments/post/" + postId);
      setComments(res.data);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(true);
    }
  };
  useEffect(() => {
    fetchPostComments();
  }, [postId]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(URL + "/api/posts/" + postId);
      setLoading(false);
      setPostData(res.data);
    } catch (e) {
      console.log(e);
      setLoading(true);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    if (postData?.publicId) {
      const publicId = postData.publicId;
      try {
        const response = await axios.delete(URL + "/api/delete-file", {
          data: { publicId }, // Send the publicId in the request body
        });

        if (response.status === 200) {
          console.log("File deleted successfully:");
          setLoading(false);
        } else {
          console.log("Failed to delete file:");
          setLoading(true);
        }
      } catch (error) {
        console.error("Error occurred during deletion:");
        setLoading(true);
      }
    }

    try {
      setLoading(true);
      const res = await axios.delete(URL + "/api/posts/" + postId, {
        withCredentials: true,
      });
      setLoading(false);
      navigate("/");
    } catch (e) {
      console.log("error while deleting post");
      setLoading(true);
    }
  };

  const postComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        URL + "/api/comments/create",
        {
          comment: userComment,
          author: user.username,
          postId: postId,
          userId: user._id,
        },
        { withCredentials: true }
      );
      setComments(comments=> [...comments,res.data]);
      console.log();
      setUserComment("");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <Navbar />
      {loading ? (
        <div className="h-[80vh] flex justify-center items-center w-full">
          <Loader />
        </div>
      ) : (
        <div className="px-8 md:px-[200px] mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-black md:text-3xl">
              {postData.title}
            </h1>
            {user?._id === postData.userId && (
              <div className="flex justify-center items-center space-x-2">
                <p
                  className="cursor-pointer"
                  onClick={() => navigate("/edit/" + postId)}
                >
                  <BiEdit />
                </p>
                <p
                  className="cursor-pointer"
                  onClick={() => handleDelete(postData)}
                >
                  <MdDelete />
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between mt-2 md:mt-4">
            <p>@{postData.username}</p>
            <div className="flex space-x-2">
              <p>{new Date(postData.updatedAt).toString().slice(0, 15)}</p>
              <p>{new Date(postData.updatedAt).toString().slice(16, 24)}</p>
            </div>
          </div>
          <img src={postData.photo} className="w-full mt-8 mx-auto" />
          <p className="mx-auto mt-8">{postData.description}</p>
          <div className="flex items-center mt-8 space-x-4 font-semibold">
            <p>Categories</p>
            <div className="flex justify-center items-center space-x-2">
              {postData?.categories?.map((category, i) => (
                <div key={i} className="bg-gray-300 rounded-lg px-3 py-1">
                  {category}
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-col mt-4">
            <h3 className="mt-6 mb-4 font-semibold">Comments:</h3>
            {comments?.map((comment) => (
              <Comment key={comment._id} comment={comment} post={postData} setComments = {setComments}/>
            ))}

            {/* write a comment */}
            <div className="w-full flex flex-col mt-4 md:flex-row">
              <input
                onChange={(e) => setUserComment(e.target.value)}
                value={userComment}
                className="md:w-[80%] outline-none px-4 mt-4 md:mt-0 "
                type="text"
                placeholder="Write a comment"
              />
              <button
                onClick={(e)=>postComment(e)}
                className="bg-black text-sm text-white px-4 py-2 md:w-[30%] mt-4 md:mt-0"
              >
                Add Commment
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default PostDetails;
