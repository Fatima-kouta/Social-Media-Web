import Post from "../post/Post";
import "./posts.scss";
import { makeRequest } from "../../Axios";
import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const Posts = ({userId}) => {
 

  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
    makeRequest.get("/posts?userId="+userId).then((res) => {
      return res.data;
    })
  });
//   const fetch = async () => {
//   try {
//     const res = await axios.get("http://localhost:8800/api/posts");
//     console.log(res.data);
//   } catch (err) {
//     // Handle the error if needed
//     console.error("Error fetching data:", err);
//   }
// };

// useEffect(() => {
//   fetch();
// }, []);
  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;