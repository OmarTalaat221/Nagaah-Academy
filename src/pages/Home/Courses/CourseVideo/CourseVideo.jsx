import React, { useEffect, useState } from 'react'
import './CourseVideo.css'
import Footer from '../../../../components/Footer/Footer'
import { useLocation, useParams } from 'react-router'
import CourseContent from '../../../CourseDetails/CourseContent/CourseContent'
import CourseInfo from '../../../CourseDetails/CourseInfo/CourseInfo'
import Courses from '../Courses'

export default function CourseVideo() {
    const location = useLocation()

    const [showVids, setShowVids] = useState(false)
    const [itemID, setItemID] = useState(null)
    const [videoID, setVideoID] = useState(location?.state?.course[0]?.videos[0]?.youtube_id?.split('be/'))
    const [activeVideo, setActiveVideo] = useState(location?.state?.course[0]?.videos[0]?.youtube_id)

    function handleShownItem(item) {
        setItemID(item?.unit_id)
        if (item?.unit_id === itemID) {
            setShowVids(!showVids)
        } else {
            setShowVids(true)
        }
    }

    function handleVideoShow(video) {
        setVideoID(video?.youtube_id?.split('be/'))
        setActiveVideo(video?.youtube_id)
        console.log(videoID)
    }

    useEffect(() => {
        // console.log(location?.state?.course);
    }, [])

    return <>
        {location?.state == null ? <Courses /> : <>
            <div className='CoursesContainer row gx-0'>
                <div className='videoContain col-md-9'>
                    <iframe width="560" height="315" src={`https://www.youtube-nocookie.com/embed/${videoID&&videoID[1]}?rel=0&showinfo=0&controls=1&fs=1`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen;" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
                </div>
                <div className='courseContent col-md-3'>
                    <div className='bg-dark fs-4 fw-bold text-center text-white py-3'>{location?.state?.title}</div>
                    {location?.state?.course&&location?.state?.course?.length&&location?.state?.course?.map((item) => <>
                        <div className={`collapseItem py-3 fs-5 fw-semibold px-2 text-capitalize ${item?.unit_id == itemID && showVids ? 'bg-secondary-subtle' : null}`} type="button"
                            onClick={() => {
                                handleShownItem(item);
                            }}
                        >
                            {item.unit_name}
                        </div>
                        {item?.unit_id === itemID && showVids ? <>
                            <div className='collapsedItem bg-secondary-subtle'>
                                {item?.videos?.map((video) => <>
                                    <div type='button' className={` contentCard d-flex gap-2 p-3 ${video?.youtube_id == activeVideo ? `bg-success-subtle` : 'bg-body'}`}
                                        onClick={() => handleVideoShow(video)}>
                                        <span>{video.order_no}</span>
                                        <div>{video.video_title}</div>
                                    </div>
                                </>)}
                            </div>
                        </> : null}
                    </>)}
                </div>
            </div >
        </>}
        <Footer />
    </>
}
