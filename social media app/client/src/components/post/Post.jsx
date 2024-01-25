import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../Axios";
import moment from "moment";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);

const { currentUser } = useContext(AuthContext);
  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: () =>
    makeRequest.get("/likes?likePostId="+post.id).then((res) => {
      return res.data;
    })
  });

  
  const handleLike = async (id) => {
    try {
      console.log('data.includes(currentUser.id)',data.includes(currentUser.id))
      if (!data.includes(currentUser.id)) {
        await axios.post(
          "http://localhost:8800/api/likes",
          
          { likePostId: id ,
            likeUserId:currentUser.id
          },
          { withCredentials: true }
        );
        queryClient.invalidateQueries(['likes']);
      } else {
        await axios.delete("http://localhost:8800/api/likes", {
          data: { likePostId: id },
          withCredentials: true,
        });
        queryClient.invalidateQueries(['likes']);
      }
    } catch (err) {
      console.log(err.response.data);
    }
  };

 


  const handleDelete = async (id) => { 
    try {
    
      await axios.delete(`http://localhost:8800/api/posts/${id}`, {
        
        withCredentials: true,
      });
     
    
  } catch (err) {
    console.log(err.response.data);
  }

}
  
  return (
    <div className="post">
     
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"/upload/" + post.profilePic} alt="" />

            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post.createdAt).fromNow()}</span>
            </div>
          </div>
          {post.userId === currentUser.id&&
          <>
           <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
          {menuOpen && post.userId === currentUser.id && (
            <button onClick={()=>handleDelete(post.id)}>delete</button>
          )}
          </>
        
}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          
          <img src={"/upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
     

          {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={()=>handleLike(post.id)}
              />
            ) : (
              <FavoriteBorderOutlinedIcon  onClick={()=>handleLike(post.id)}  />
            )}
           {data&&data.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post.id} userId={post.userId} />}
      </div>
    </div>
  );
};

export default Post;
