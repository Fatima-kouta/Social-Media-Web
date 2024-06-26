import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../Axios";
import moment from "moment";
import axios from "axios";

const Comments = ({ postId ,userId}) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);


  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () =>
    makeRequest.get("/comments?postId="+postId).then((res) => {
      console.log('data',res.data)
      return res.data;
    })
  });
  const queryClient = useQueryClient();

  // const mutation = useMutation(
  //   (newComment) => {
  //     return makeRequest.post("/comments", newComment);
  //   },
  //   {
  //     onSuccess: () => {
  //       // Invalidate and refetch
  //       queryClient.invalidateQueries(["comments"]);
  //     },
  //   }
  // );

  // const handleClick = async (e) => {
  //   e.preventDefault();
  //   mutation.mutate({ desc, postId });
  //   setDesc("");
  // };
  const handleClick = async (e) => {
    e.preventDefault();
  
    
    const newComment = {
      
      desc,
      postId,
    };
    try {
      await axios.post("http://localhost:8800/api/comments", newComment,{
        withCredentials: true,
      });
      queryClient.invalidateQueries(['comments']);
    } catch (err) {
      console.log(err.response.data);
    }
   
  
    setDesc('');
  };
  return (
    <div className="comments">
      <div className="write">
  
        <img src={"/upload/" + currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Something went wrong"
        : isLoading
        ? "loading"
        : data.map((comment) => (
            <div className="comment">
              {/* <img src={"/upload/" + comment.profilePic} alt="" /> */}
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;