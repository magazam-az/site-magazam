import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomePage from '../components/Hero'
import FAQPage from '../components/FAQ'
import IpadSection from '../components/IpadSection'
import PopularCategories from '../components/PopularCategories'
// import Container from '../ui/Container'


const Home = () => {
  return (
    <div>
      {/* <Container> */}
        <Navbar/>
        <HomePage/>
        <IpadSection/>
        <PopularCategories/>
        <FAQPage/>
        <Footer/>
        {/* </Container> */}
    </div>
  )
}

export default Home