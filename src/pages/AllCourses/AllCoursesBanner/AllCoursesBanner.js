import React, { useEffect, useState } from 'react'
import './allcoursesbanner.css'
import { coursesTypesData } from '../../Home/Courses/data'
import { Link } from 'react-router-dom';
const AllCoursesBanner = () => {
  const [coursesType, setCoursesType] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const getCoursesType = () => {
    let allData = [...coursesTypesData];
    let pushedArr = [];
    setCoursesType(allData)
  }
  useEffect(() => {
    getCoursesType()
  }, [])
  return (
    <div className='allcourses_banner_comp'>
      <div className="allcourses-overlay"></div>
      <div className="page_name">
        <h4>Our Courses</h4>
        <p>
          <Link to='/'>Home</Link>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
          <span>Courses</span>
        </p>
      </div>
    </div>
  )
}

export default AllCoursesBanner
