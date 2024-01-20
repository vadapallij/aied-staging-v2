/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import "./Dashboard.css";
import data from "../../data/modules";
// import Topics from "./Topics/Topics";
import { Route, Routes, useLocation, useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { setUser, setProgress } from "../../redux/actions/userActions";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  LinearProgress,
  Skeleton,
  Typography,
} from "@mui/material";
import Login from "../Login/Login";
import contents from "../../data/contents";
import Topics from "./Topics/Topics";
import Content from "./Topics/Content/Content";
import SubContent from "./Topics/Content/SubContent/SubContent";
import axios from "axios";
import Notification from "../../components/SnackBar/SnackBar";
import DBContent from "./DBContent/DBContent";
import NestedContent from "./Topics/Content/SubContent/NestedContent/NestedContent";
import { HashLink } from "react-router-hash-link";

function getLength(subTopics) {
  let lastData = subTopics[subTopics.length - 1];
  return lastData.contents[lastData.contents.length - 1].id;
}

function CircularProgressWithLabel(props) {
  return (
    <Box>
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress variant="determinate" {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
          >{`${Math.round(props.value)}%`}</Typography>
        </Box>
      </Box>
      <Box>
        <Typography variant="subtitle2">Your progress</Typography>
      </Box>
    </Box>
  );
}

function Dashboard({ user, role, progress, setUser, setProgress }) {
  const [isActive, setIsActive] = useState([]);
  const [isActive2, setIsActive2] = useState([]);
  const [content, setContent] = useState(localStorage.getItem("content") || "");
  const [roles, setRole] = useState(localStorage.getItem("role"));
  const [topic, setTopic] = useState("");
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationSeverity, setNotificationSeverity] = useState("success");

  console.log("role", role);

  const [users, setUsers] = useState(null);

  const location = useLocation();

  useEffect(() => {
    if (content) {
      setContent(content);
    }
  }, [content]);

  useEffect(() => {
    console.log(topic);
    if (topic) {
      setTopic(topic);
    }
  }, [topic]);

  console.log("Role: " + role);

  useEffect(() => {
    const updateRole = async (role) => {
      if (user) {
        setNotificationMessage(
          `Welcome ${user ? user : "user"}, you are logged in as a ${role}`
        );
      }
      setNotificationSeverity("success");
      setNotificationOpen(true);
    };
    updateRole(role);
  }, [user, role]);

  // useEffect(() => {
  //   // Parse the user data from the query parameter
  //   const searchParams = new URLSearchParams(location.search);
  //   const userData = searchParams.get("user");

  //   if (userData) {
  //     // Parse the user data if needed
  //     const parsedUser = JSON.parse(decodeURIComponent(userData));
  //     setUsers(parsedUser);
  //     setUser(users);
  //   }
  // }, [location, setUser, users]);

  const toggleDropdown = (index, length) => {
    setIsActive(Array(length).fill(false));
    const newIsActive = [...isActive];
    newIsActive[index] = !newIsActive[index];
    setIsActive(newIsActive);
    console.log(isActive[index]);
  };

  const toggleDropdown2 = (index, length) => {
    setIsActive2(Array(length).fill(false));
    const newIsActive2 = [...isActive2];
    newIsActive2[index] = !newIsActive2[index];
    setIsActive2(newIsActive2);
    console.log(isActive2[index]);
  };

  const handleNotificationClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setNotificationOpen(false);
  };

  return (
    <div className="dashboard">
      <div className="db-sidebar">
        {data.map((item) => {
          return (
            <div>
              <div className="db-unit">
                <Link to={`${item.id}`}>{item.topicName}</Link>
              </div>
              <div className="db-items">
                {item.subTopics.map((subTopic, index) => {
                  return (
                    <div className="db-item">
                      <HashLink
                        href="#"
                        onClick={() =>
                          toggleDropdown(index, item.subTopics.length)
                        }
                      >
                        {subTopic.name}
                        {"   "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="1em"
                          viewBox="0 0 320 512"
                        >
                          <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                        </svg>
                      </HashLink>
                      {isActive && (
                        <ul
                          class="dropdown-container"
                          style={{
                            display: isActive[index] ? "flex" : "none",
                            flexDirection: "column",
                            marginLeft: "30px",
                          }}
                        >
                          {subTopic.contents.map((subContent, idx) => {
                            return !subContent.contents ? (
                              <li style={{ fontWeight: "400" }}>
                                <Link
                                  to={`${item.id}/${index + 1}/${
                                    subContent.id
                                  }`}
                                >
                                  {subContent.topic}
                                </Link>

                                {/* {subContent.contents ? (
                                <div>{subContent.contents[0].topic}</div>
                              ) : null} */}
                              </li>
                            ) : (
                              <div className="db-item mod-1">
                                <HashLink
                                  to="#"
                                  onClick={() =>
                                    toggleDropdown2(
                                      idx,
                                      subContent.contents.length
                                    )
                                  }
                                >
                                  {subContent.topic}
                                  {"   "}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="1em"
                                    viewBox="0 0 320 512"
                                  >
                                    <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                                  </svg>
                                </HashLink>
                                {isActive2 && (
                                  <ul
                                    class="dropdown-container"
                                    style={{
                                      display: isActive2[idx] ? "flex" : "none",
                                      flexDirection: "column",
                                      marginLeft: "30px",
                                    }}
                                  >
                                    {subContent.contents.map(
                                      (nestedContent, idx) => {
                                        return (
                                          <li
                                            key={idx}
                                            className="db-nested-content"
                                            style={{ fontWeight: "400" }}
                                          >
                                            <Link
                                              to={`${item.id}/${index + 1}/${
                                                subContent.id
                                              }/${nestedContent.id}`}
                                            >
                                              {nestedContent.topic}
                                            </Link>
                                          </li>
                                        );
                                      }
                                    )}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {user ? (
        <div className="db-content">
          <Notification
            open={notificationOpen}
            handleClose={handleNotificationClose}
            message={notificationMessage}
            severity={notificationSeverity}
          />

          <Routes>
            <Route path="/" element={<DBContent />} />
            <Route path=":id" element={<Topics />} />
            <Route path=":id/:topicId" element={<Content />}>
              <Route path=":contentId" element={<SubContent />}></Route>
            </Route>
            <Route
              path=":id/:topicId/:contentId/:subContentId"
              element={<NestedContent />}
            />
          </Routes>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  progress: state.user.progress,
  role: state.user.role,
});

export default connect(mapStateToProps, { setUser, setProgress })(Dashboard);
