import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Card from "../components/Card";
import axios from "axios";
const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  width: 100%;
  justify-content: flex-start;
  min-height: 100vh;
`;

const Home = ({type}) => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      const res = await axios.get(`/api/videos/${type}`);
      // Debug log to see what is returned
      console.log('Fetched videos:', res.data);
      setVideos(Array.isArray(res.data) ? res.data : []);
    };
    fetchVideos();
  }, [type]);

  return (
    <Container>
      {Array.isArray(videos) ? videos.map((video) => (
        <Card key={video._id} video={video}/>
      )) : null}
    </Container>
  );
};

export default Home;
