import { useState } from "react";
import Navbar from "../components/Navbar";
import Banner from "../components/Banner";
import Row from "../components/Row";
import ContinueRow from "../components/ContinueRow";
import AIRecommendations from "../components/AIRecommendations";

function Home({ setPage, setProfile, setUser, setSelectedMovie }) {
  const [search, setSearch] = useState("");

  return (
    <>
      <Navbar
        setPage={setPage}
        setSearch={setSearch}
        setProfile={setProfile}
        setUser={setUser}
      />

      <div style={{ paddingTop: "70px", background: "#141414", minHeight: "100vh" }}>
        <Banner />
       

        {/* 🤖 AI RECOMMENDATIONS */}
        <AIRecommendations setSelectedMovie={setSelectedMovie} />

        {/* ✅ CORRECT POSITION */}
        <ContinueRow setSelectedMovie={setSelectedMovie} />

        <Row
          title="Action"
          fetchUrl="/discover/movie?with_genres=28"
          search={search}
          setSelectedMovie={setSelectedMovie}
        />

        <Row
          title="Comedy"
          fetchUrl="/discover/movie?with_genres=35"
          search={search}
          setSelectedMovie={setSelectedMovie}
        />

        <Row
          title="Horror"
          fetchUrl="/discover/movie?with_genres=27"
          search={search}
          setSelectedMovie={setSelectedMovie}
        />
        <Row
          title="Romance"
          fetchUrl="/discover/movie?with_genres=10749"
          search={search}
          setSelectedMovie={setSelectedMovie}
        />
      </div>
    </>
  );
}

export default Home;