import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
// import { Videos } from "../../libs/Videos";

function Icon({ id, open }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={`${
        id === open ? "rotate-180" : ""
      } h-5 w-5 transition-transform`}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 8.25l-7.5 7.5-7.5-7.5"
      />
    </svg>
  );
}

export function AccordionCustomIcon({
  handleSelectVideo,
  Videos,
  selectedVideo,
  setTab,
  setIndex,
  index,
  tab,
  videoObj,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Handle unit selection - update URL params and reset index to 0
  const handleUnitSelect = (unitIndex) => {
    setTab(unitIndex);
    setIndex(0);

    // Update URL search params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("tab", unitIndex.toString());
    newParams.set("index", "0");
    navigate(`?${newParams.toString()}`, { replace: true });
  };

  // Handle video selection - update URL params with new index
  const handleVideoSelect = (videoIndex, videoObj, video) => {
    setIndex(videoIndex);

    // Update URL search params
    const newParams = new URLSearchParams(searchParams);
    newParams.set("index", videoIndex.toString());
    navigate(`?${newParams.toString()}`, { replace: true });

    // Call the original handleSelectVideo function
    handleSelectVideo(
      videoObj.id,
      video.id,
      video.saved,
      videoObj.title,
      video.name,
      video.teacher_name
    );
  };

  return (
    <div className="accordion" style={{ direction: "rtl" }}>
      {Videos.map((videoObj, tindex) => {
        const isCurrentTab = tindex === tab;
        return (
          <div onClick={() => handleUnitSelect(tindex)} key={videoObj.id}>
            <Accordion
              open={tab === tindex}
              icon={<Icon id={tindex} open={tab === tindex} key={tindex} />}
            >
              <AccordionHeader
                onClick={() => handleUnitSelect(tindex)}
                className={
                  tindex === tab
                    ? " active text-black"
                    : "text-sm !text-[white]"
                }
              >
                <p
                  className={
                    tindex === tab
                      ? " p-0 m-0 text-[20px] text-black"
                      : "p-0 m-0 text-[20px] !text-[white]"
                  }
                >
                  {videoObj.title}
                </p>
              </AccordionHeader>
              <AccordionBody>
                {videoObj.videos.map((video, zindex) => {
                  const isCurrentVideo = isCurrentTab && zindex === index;
                  return (
                    <div
                      key={video.id}
                      className={
                        isCurrentVideo
                          ? "text-sm text-[#E94168]  flex gap-3 my-3 align-middle"
                          : "text-sm text-[#597B82] flex gap-3 my-3 align-middle"
                      }
                    >
                      <h4
                        className={
                          isCurrentVideo
                            ? "text-sm !text-[#ffd700]  font-normal !text-[25px] cursor-pointer"
                            : "text-sm text-[white] font-normal text-[15px] cursor-pointer"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoSelect(zindex, videoObj, video);
                        }}
                      >
                        {zindex + 1} . {video.name}
                      </h4>
                    </div>
                  );
                })}
              </AccordionBody>
            </Accordion>
          </div>
        );
      })}
    </div>
  );
}
