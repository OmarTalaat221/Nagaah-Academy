import React, { useEffect, useState } from 'react'
import { FaArrowRight, FaFacebook, FaWhatsapp } from 'react-icons/fa6'
import './helpcenter.css'
import { getSups } from './functions/getSup';
const HelpCenter = () => {
  const [pageLoading,setPageLoading]=useState(false);
  const [sups,setSups]=useState([]);
  useEffect(()=>{
    getSups(setPageLoading,setSups)
  },[])
  return (
    <a target='_blank' href='' className='help_center'>
      <div className='help_app'>
        <div className="right">
          <FaFacebook/>
          <h4>FaceBook</h4>
        </div>
        <FaArrowRight/>
      </div>
      <div className='help_app'>
        <div className="right">
          <FaWhatsapp/>
          <h4>WhatsApp</h4>
        </div>
        <FaArrowRight/>
      </div>
    </a>
  )
}

export default HelpCenter
