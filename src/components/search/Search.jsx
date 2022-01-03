import { useState, useEffect } from "react";

import MasonryLayout from "../core/masonry-layout/MasonryLayout";
import { client } from "../../services/sanity.service";

import { searchQuery, feedQuery } from "../../utils/category";

import Spinner from "../core/spinner/Spinner";

const Search = ({ searchTerm })=>{

  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    setLoading(true);
    if(searchTerm){
      const query = searchQuery(searchTerm.toLowerCase());

      client.fetch(query)
      .then(response=>{
        console.log(response);
        setPins(response);
        setLoading(false);
      })
      .catch((error)=>{
        alert("Unable to load posts");
      })
    }
    else {
      client.fetch(feedQuery)
      .then(response=>{
        setPins(response);
        setLoading(false);
      })
      .catch((error)=>{
        alert("Unable to load posts");
      });
    }
  }, [searchTerm]);

  if(loading) return <Spinner message="Searching for pins..." />;

  return (
    <div>
      { pins?.length > 0 && <MasonryLayout pins={pins} /> }
      { pins?.length === 0 && searchTerm !== '' && (
        <h2 className="flex font-bold justify-center items-center">No posts found</h2>
      )}
    </div>
  );
}

export default Search;