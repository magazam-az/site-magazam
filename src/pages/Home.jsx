import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import HomePage from '../components/Hero'
import FAQPage from '../components/FAQ'


const Home = () => {
  return (
    <div>
        <Navbar/>
        {/* <HomePage/> */}
        <FAQPage/>
        <Footer/>
    </div>
  )
}

export default Home