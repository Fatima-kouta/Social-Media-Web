import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../Axios";
import Update from "../../components/update/Update";

const Profile = () => {
  const { id } = useParams();
  const [data, setData] = useState("");
  const [followuser, setFollowuser] = useState("");
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:8800/api/users/find/${id}`, {
        withCredentials: true,
      });

      // Log the response data
      setData(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err.response.data);
    }
  };

  const fetchRelationShips = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/relationships?followedUser=${id}`,
        {
          withCredentials: true,
        }
      );
      setFollowuser(response.data);
      console.log(response.data);
    } catch (err) {
      console.error("Error fetching user data:", err.response.data);
    }
  };

  const handleFollow = async () => {
    try {
      if (!followuser.includes(currentUser.id)) {
        await axios.post(
          "http://localhost:8800/api/relationships",
          { followedUser: id },
          { withCredentials: true }
        );
      } else {
        await axios.delete("http://localhost:8800/api/relationships", {
          params: { followedUser: id },
          withCredentials: true,
        });
      }

      // Fetch updated relationships after following/unfollowing
      fetchRelationShips();
    } catch (err) {
      console.log(err.response.data);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRelationShips();
  }, [id,openUpdate]);


  return !data ? (
    "loading..."
  ) : (
    <div className="profile">
      <div className="images">
        <img src={"/upload/" + data.coverPic} alt="" className="cover" />

        <img src={"/upload/" + data.profilePic} alt="" className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data.webiste}</span>
              </div>
            </div>
           
            {currentUser.id === data.id ? (
              <button onClick={() => setOpenUpdate(true)}>update</button>
            ) : (
              <button onClick={() => handleFollow(data.id)}>
                {" "}
                {followuser.includes(currentUser.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={data.id} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data}  />}
    </div>
  );
};

export default Profile;
