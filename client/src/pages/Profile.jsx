import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logout } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 40px;
`;
const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 20px;
`;
const Name = styled.h2`
  margin-bottom: 10px;
  color: ${({ theme }) => theme.text};
`;
const Email = styled.p`
  margin-bottom: 20px;
  color: ${({ theme }) => theme.text};
`;
const Button = styled.button`
  padding: 10px 20px;
  background: #3ea6ff;
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  margin-bottom: 10px;
`;
const DangerButton = styled(Button)`
  background: #ff4d4f;
`;
const FileInput = styled.input`
  margin-bottom: 10px;
`;

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const defaultAvatar = require("../img/logo.png");
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const API_BASE_URL = "https://clipverse-backend-1r09.onrender.com";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/signin");
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("img", selectedFile);
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${currentUser._id}/avatar`, {
        method: "PUT",
        body: formData,
        credentials: "include",
      });
      if (res.ok) {
        window.location.reload();
      } else {
        alert("Failed to update profile picture");
      }
    } catch (err) {
      alert("Error uploading image");
    }
    setUploading(false);
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/${currentUser._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        dispatch(logout());
        navigate("/signin");
      } else {
        alert("Failed to delete account");
      }
    } catch (err) {
      alert("Error deleting account");
    }
  };

  if (!currentUser) return <Container>Not signed in.</Container>;

  return (
    <Container>
      <picture>
        <source srcSet={(currentUser.img || defaultAvatar)?.replace(/\.(jpg|jpeg|png)$/i, ".webp")} type="image/webp" />
        <Avatar src={currentUser.img || defaultAvatar} alt="avatar" width={100} height={100} loading="lazy" onError={e => e.target.src = defaultAvatar} />
      </picture>
      <Name>{currentUser.name}</Name>
      <Email>{currentUser.email}</Email>
      <Button onClick={handleLogout}>Logout</Button>
      <DangerButton onClick={handleDeleteAccount}>Delete Account</DangerButton>
    </Container>
  );
};

export default Profile;
