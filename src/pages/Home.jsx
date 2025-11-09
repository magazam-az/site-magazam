import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomePage from '../components/Hero'
import FAQPage from '../components/FAQ'
import ProductBanners from '../components/Heros'


const Home = () => {
  return (
    <div>
        <Navbar/>
        {/* <HomePage/> */}
        <FAQPage/>
        <Footer/>
        <ProductBanners/>
    </div>
  )
}

export default Home