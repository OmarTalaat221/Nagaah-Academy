import React from 'react'
import './banner.css'
import { Slide } from 'react-awesome-reveal';
const Banner = () => {
  return (
    <div className='banner'>
      <Slide className='left' direction='left'>
        <div>
          <h4>Security - Privacy - friendly</h4>
          <h5>Welcome To Our Future Doctors</h5>
          <p>
            <span>here you will be an excellant doctor</span>
            <br />
            <span>Be Like US Distinguished</span>
          </p>
          <div className="actions">
            <button>Profile</button>
            <button>books</button>
          </div>
        </div>
      </Slide>
      <Slide className='right' direction='right'>
        <div >
          <img src={require("../../../assets/doctors.png")} alt="" />
        </div>
      </Slide>
    </div>
  )
}

export default Banner;
