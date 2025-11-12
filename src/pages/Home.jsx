import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HomePage from "../components/Hero";
import FAQPage from "../components/FAQ";
import IpadSection from "../components/IpadSection";
import PopularCategories from "../components/PopularCategories";
import TheBestOffers from "../components/TheBestOffers";
import Container from "../ui/Container";
import HomeAppliance from "../components/HomeAppliance";
import NewGoods from "../components/NewGoods";

const Home = () => {
  return (
    <div>
      {/* <Container> */}
        <Navbar />
        <HomePage />
        <TheBestOffers />
        <IpadSection />
        <PopularCategories />
        <HomeAppliance />
        <NewGoods/>
        <FAQPage />
        <Footer />
      {/* </Container> */}
    </div>
  );
};

export default Home;
