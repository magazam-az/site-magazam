import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MainSlider from "../components/MainSlider";
import FAQPage from "../components/FAQ";
import IpadSection from "../components/IpadSection";
import PopularCategories from "../components/PopularCategories";
import TheBestOffers from "../components/TheBestOffers";
import Container from "../ui/Container";
import HomeAppliance from "../components/HomeAppliance";
import NewGoods from "../components/NewGoods";
import ProductShowcase from "../components/Thumbnail.Jsx";
import ArticleSection from "../components/BlogCards";
import ContentCard from "../components/Text";

const Home = () => {
  return (
    <div>
      {/* <Container> */}
      <Navbar />
      <MainSlider />
      <PopularCategories />
      <TheBestOffers />
      <NewGoods />
      <IpadSection />
      <HomeAppliance />
      <ProductShowcase />
      <FAQPage />
      <ArticleSection/>
      <ContentCard/>
     
      <Footer />

      {/* </Container> */}
    </div>
  );
};

export default Home;
