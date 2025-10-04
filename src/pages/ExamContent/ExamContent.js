import React from 'react'
import { useNavigate, useParams } from 'react-router'
import './ExamContent.css';

export default function ExamContent() {
    const  {examId} = useParams();
    const navigate = useNavigate();
  return (
    <div style={{padding :'20px' , margin:"20px 0px"}}>
        <div className='examcontent_container'>
        <div className='examcontent_header'> 
            <h2>3rd general mock</h2>
            <p>Time:  60 Mins</p>
            <p>Deadline: Mon, Apr 8, 2024 12:00 AM.</p>
        </div>
        <button onClick={() => {
            navigate('/examQuestion')
        }}>Start Exam</button>
        </div>

    </div>
  )
}
