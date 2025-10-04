import React from 'react'
import Footer from '../../components/Footer/Footer'
import './style.css'
import F_panner from '../../components/AboutNagah/F_panner'
import { OurStory } from '../../components/AboutNagah/OurStory'
import OurServices from '../../components/AboutNagah/OurServices'
import ContactUs from '../../components/AboutNagah/ContactUs'

const AboutNagah = () => {
  return (
    <>
    <div className='about_us'>
        <F_panner/>
        <OurStory/>
        <OurServices/>
        <ContactUs/>

    </div>
      <Footer />
    </>
  )
}

export default AboutNagah