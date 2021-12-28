import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';

import { client } from '../../services/sanity.service';
import { categorySearchQuery, feedQuery } from "../../utils/category";

import MasonryLayout from "../core/masonry-layout/MasonryLayout";
import Spinner from "../core/spinner/Spinner";

const Feed = ()=>{

  const [loading, setLoading] = useState(false);
  const [pins, setPins] = useState([]);

  const { categoryId } = useParams();

  useEffect(()=>{
    setLoading(true);

    if(categoryId){
      const query = categorySearchQuery(categoryId);

      client.fetch(query)
      .then((res)=> setPins(res))
      .catch(error => alert("Could not retrieve pins"))
      .finally(()=> setLoading(false));
    }
    else{
      client.fetch(feedQuery)
      .then((res)=> setPins(res))
      .catch(error => alert("Could not retrieve pins"))
      .finally(()=> setLoading(false));
    }
  }, []);

  if(loading) return <Spinner message="Loading new content for you" />

  return (
    (pins && <MasonryLayout pins={pins} />)
  );
}

export default Feed;