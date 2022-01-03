import { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";


import { client } from "../../services/sanity.service";
import Spinner from "../core/spinner/Spinner";

import { categories } from "../../utils/category";

const CreatePin = ({ user })=>{

  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);


  const navigate = useNavigate();

  const uploadImage = event =>{
    const selectedFile  = event.target.files[0];
    const { name, type } = selectedFile;

    if (type === 'image/png' || type === 'image/jpeg' || type === 'image/gif' || type === 'image/svg' || type === 'image/tiff'){
      setWrongImageType(false);
      setLoading(true);

      client.assets.upload('image', selectedFile, {
        contentType:type, filename:name
      })
      .then( document =>{
        setImageAsset(document);
        setDestination(document?.url);
        setLoading(false);
      })
      .catch(error => alert("Failed to upload image"));
    }
    else{
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if(title && about && destination && imageAsset?._id && category) {
      const doc = {
        _type: 'pin',
        title, about, destination, 
        image:{
          _type: 'image',
          asset: {
            _type : 'reference',
            _ref: imageAsset?._id
          }
        },
        userId: user?._id,
        postedBy:{
          _type:'postedBy',
          _ref: user?._id
        },
        category
      } 

      client.create(doc)
      .then(() => {
        navigate('/');
      })
      .catch(()=>{
        alert("Failed to add pin");
      });
    }
    else{
      setFields(true);
      setTimeout(_ => setFields(false), 3000);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {
        fields && (
          <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in">Please fill in all the fields</p>
        ) 
      }
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className="bg-secondaryColor p-3 flex flex-0 7 w-full">
          <div className="flex-justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
            { loading && ( <Spinner />) }
            { !loading && !imageAsset ? (
              <label className="cursor-pointer">
                <div className="flex flex-col items-center justify-center h-full opacity-100 hover:opacity-70">
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">
                      Click to upload
                    </p>
                  </div>
                  { wrongImageType && ( <p className="mt-16">Wrong image type</p>) }
                  <p className="mt-10 text-gray-400">
                    Use high quality JPEG, SVG, PNG, GIF or TIFF less than 20MB
                  </p>
                </div>
                <input type="file" name="upload-image" className="w-0 h-0" onChange={uploadImage} />
              </label>
            ) : (
              <div className="relative h-full">
                <img src={imageAsset?.url} alt="uploaded" className="w-full h-full"/>
                <button 
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white hover:bg-gray-400 hover:text-white text-xl cursor-pointer hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null) }
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
          <input 
            type="text" 
            placeholder="Add your title"
            value={title}
            onChange={(event)=> setTitle(event.target.value)}
            className="font-bold border-b-2 border-gray-200 p-2"
          /> 
          {
            user && (
              <div className="flex gap-2 my-2 items-center bg-white rounded-lg">
                <img src={user.image} className="w-10 h-10 rounded-full" alt="user profile" />
                <p className="font-bold">{user.userName}</p>
              </div>
            )
          }
          <input 
            type="text" 
            placeholder="What is your pin about?"
            value={about}
            onChange={(event)=> setAbout(event.target.value)}
            className="text-base border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-3 font-semibold">Choose pin category</p>
              <select name="destination" id="destination" 
                onChange={event=> setCategory(event.target.value)}
                className="w-4/5 text-base border-b-2 border-gray-200 rounded-md p-2 cursor-pointer"
              >
                <option value="other" className="bg-white">Select category</option>
                {
                  categories.map( category => (
                    <option key={category.name} className="text-base border-0 capitalize bg-white text-black" value={category.name}>{category.name}</option>
                  ))
                }
              </select>
            </div>
            <div className="flex justify-center items-center mt-5">
              <button type="button" 
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28"
              >
                Save pin
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CreatePin;