import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomePage from '../components/Hero'
import FAQPage from '../components/FAQ'
import ProductBanners from '../components/Heros'
import IpadSection from '../components/IpadSection'


const Home = () => {
  return (
    <div>
        <Navbar/>
        <HomePage/>
        <IpadSection/>
        <FAQPage/>
        <Footer/>
        <ProductBanners/>
    </div>
  )
}

export default Home