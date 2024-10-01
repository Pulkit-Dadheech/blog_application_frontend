import React, { useContext, useState,useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import {ImCross} from 'react-icons/im';
import { useParams } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { URL } from '../url';

const EditPost = () => {
  const [title,setTitle] = useState("");
  const [desc,setDesc] = useState('');
  const [file,setFile] = useState(null);
  const [cat, setCat] = useState("");
  const [cats, setCats] = useState([]);
  const [photoUrl,setPhotoUrl] = useState("");
  const [publicId,setPublicId] = useState(null);
  const postId = useParams().id;
  const user = useContext(UserContext);
  const navigate = useNavigate();

  const fetchPosts = async()=>{
    try{
      const res= await axios.get(URL+'/api/posts/'+postId,{withCredentials: true});
      setTitle(res.data.title);
      setDesc(res.data.description);
      setCats(res.data.categories);
      setPhotoUrl(res.data.photo);
      res.data.publicId && setPublicId(res.data.publicId);
    }catch(e){
      console.log(e);
    }
  }


  useEffect(()=>{
    fetchPosts()
  },[postId]);

  const deleteCategory = (i) => {
    let updatedCats = [...cats];
    updatedCats.splice(i);
    setCats(updatedCats);
  };

  const addCategory = () => {
    let updatedCats = [...cats];
    updatedCats.push(cat);
    setCat("");
    setCats(updatedCats);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const post = {
      title,
      description: desc,
      username: user.username,
      userId: user._id,
      categories: cats,
    };

    if (file) {
      const data = new FormData();
      const fileExtension = file.name.split('.').pop();
      const filename = Date.now() +"."+ fileExtension;
      data.append("uploadedFile", filename);
      data.append("file", file);
      data.append("oldPublicId",publicId);

      try {
        const res = await axios.put(URL+"/api/update", data);
        post.photo = res.data.cloudinaryUrl;
        post.publicId = res.data.publicId;
        setPublicId(post.publicId);
      } catch (e) {
        console.log(e);
      }
    }
    //post upload
    try {
      const res = await axios.put(URL + "/api/posts/"+postId, post, {
        withCredentials: true,
      });
      navigate("/posts/post/"+res.data._id);
    } catch (e) {
      console.log("error while creating the post");
    }
  };

  const handleChangeFile = (e) =>{
    setFile(e.target.files[0]);
    setPhotoUrl("");
  }

  return (
    <div>
      <Navbar />
      <div className="px-6 md:px-[200px] mt-8">
        <h1 className="font-bold md:text-2xl text-xl">Update a Post</h1>
        <form className="w-full flex flex-col space-y-4 md:space-y-8 mt-4">
          <input 
            onChange={(e)=>setTitle(e.target.value)}
            value={title}
            type="text"
            placeholder="Enter post title"
            className="px-4 py-2 outline-none"
          />
          <input onChange={(e)=>handleChangeFile(e)} type="file" className="px-4" />
          {photoUrl && photoUrl!=="" &&  <div className='h-[50%] w-[50%]'><img className="w-full mx-4" src={photoUrl} alt="Uploaded from Cloudinary" /></div>}
          <div className="flex items-center space-x-4 md:space-x-8">
            <input
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="px-2 py-4 outline-none"
              placeholder="Enter post category"
              type="text"
            />
            <div
              onClick={addCategory}
              className="bg-black text-white px-4 py-2 font-semibold cursor-pointer"
            >
              Add
            </div>
          </div>
          {/* Categories */}
          <div className="flex px-4 mt-3">
            {cats?.map((c, i) => (
              <div
                key={i}
                className="flex justify-center items-center space-x-2 mr-4 bg-gray-200 px-2 py-1 rounded-md"
              >
                <p>{c}</p>
                <p
                  onClick={() => deleteCategory(i)}
                  className="text-white bg-black rounded-full cursor-pointer p-1 text-sm"
                >
                  <ImCross />
                </p>
              </div>
            ))}
          </div>
          <textarea
            onChange={(e)=>setDesc(e.target.value)}
            value={desc}
            className="px-4 py-2 outline-none"
            placeholder="Enter post description"
            rows={15}
            cols={30}
          />
          <button onClick={(e)=>handleUpdate(e)} className="bg-black w-full md:w-[20%] mx-auto text-white font-semibold px-4 py-2 md:text-ellipsis">
            Update
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditPost;
