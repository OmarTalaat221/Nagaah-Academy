import { useEffect, useRef, useState, useCallback, useMemo } from "react";

export default function VimeoPlayer({
  videoId,
  startTime = 0,
  onReady,
  onPlay,
  onPause,
  onEnded,
  onTimeUpdate,
  onError,
}) {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimerRef = useRef(null);
  const settingsRef = useRef(null);
  const controlsRef = useRef(null);

  const [player, setPlayer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startTime);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [isContainerFocused, setIsContainerFocused] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const maxRetries = 3;

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Enhanced Vimeo URL validation and ID extraction
  const extractVimeoId = useCallback((url) => {
    if (!url) return null;

    if (/^\d+$/.test(url.toString())) {
      return url.toString();
    }

    const patterns = [
      /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|))(\d+)(?:\?|&|$)/,
      /(?:vimeo\.com\/)(\d+)/,
      /(?:player\.vimeo\.com\/video\/)(\d+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }, []);

  // Validate Vimeo ID
  const validatedVideoId = useMemo(() => {
    const id = extractVimeoId(videoId);
    if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
      return null;
    }
    return parseInt(id);
  }, [videoId, extractVimeoId]);

  // Enhanced error handling
  const handleError = useCallback(
    (errorData, context = "") => {
      console.error(`Vimeo Player Error ${context}:`, errorData);

      let errorMessage = "حدث خطأ غير متوقع";

      if (typeof errorData === "object" && errorData !== null) {
        switch (errorData.name) {
          case "Error":
            if (errorData.message?.includes("password")) {
              errorMessage = "هذا الفيديو محمي بكلمة مرور";
            } else if (errorData.message?.includes("private")) {
              errorMessage = "هذا الفيديو خاص ولا يمكن تشغيله";
            } else if (errorData.message?.includes("not found")) {
              errorMessage = "الفيديو غير موجود أو تم حذفه";
            } else if (errorData.message?.includes("embed")) {
              errorMessage = "تم تعطيل التضمين لهذا الفيديو";
            } else {
              errorMessage = errorData.message || "حدث خطأ في تحميل الفيديو";
            }
            break;
          case "TypeError":
            errorMessage = "تعذر الاتصال بخادم Vimeo";
            break;
          default:
            errorMessage = errorData.message || "خطأ في تشغيل الفيديو";
        }
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      }

      setError({
        message: errorMessage,
        canRetry:
          retryCount < maxRetries &&
          !errorMessage.includes("محمي") &&
          !errorMessage.includes("خاص"),
        originalError: errorData,
      });
      setIsLoading(false);

      if (onError) {
        onError({ message: errorMessage, originalError: errorData });
      }
    },
    [retryCount, onError]
  );

  // Retry mechanism
  const retryLoad = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount((prev) => prev + 1);
      setError(null);
      setIsLoading(true);
    }
  }, [retryCount]);

  // Handle control visibility
  const showControlsWithTimer = useCallback(() => {
    setShowControls(true);
    if (isFullscreen) {
      document.body.style.cursor = "auto";
    }

    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    if (isPlaying) {
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
        setShowVolumeSlider(false);
        // setShowSettings(false);
        if (isFullscreen && containerRef.current?.matches(":hover")) {
          document.body.style.cursor = "none";
        }
      }, 3000);
    }
  }, [isPlaying, isFullscreen]);

  // Handle outside clicks for settings and volume
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        // setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [showSettings]);

  // Handle activity for both desktop and mobile
  useEffect(() => {
    const handleActivity = (e) => {
      e.stopPropagation();
      showControlsWithTimer();
    };

    const handleMouseLeave = () => {
      if (isFullscreen) {
        document.body.style.cursor = "auto";
      }
      setShowVolumeSlider(false);
    };

    const handleMouseEnter = () => {
      if (!showControls && isPlaying && isFullscreen) {
        document.body.style.cursor = "none";
      }
    };

    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleActivity);
    container.addEventListener("touchstart", handleActivity, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      container.removeEventListener("mousemove", handleActivity);
      container.removeEventListener("touchstart", handleActivity);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      document.body.style.cursor = "auto";
    };
  }, [isPlaying, showControls, isFullscreen, showControlsWithTimer]);

  // Handle controls visibility on play/pause changes
  useEffect(() => {
    if (!isPlaying) {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
      setShowControls(true);
      if (isFullscreen) {
        document.body.style.cursor = "auto";
      }
    } else {
      showControlsWithTimer();
    }
  }, [isPlaying, isFullscreen, showControlsWithTimer]);

  // Enhanced keyboard shortcuts with focus check
  const handleKeydown = useCallback(
    (e) => {
      if (!player || !isContainerFocused) return;

      switch (e.key.toLowerCase()) {
        case " ":
        case "enter":
          handlePlayPause();
          e.preventDefault();
          break;
        case "arrowright":
          seek(10);
          e.preventDefault();
          break;
        case "arrowleft":
          seek(-10);
          e.preventDefault();
          break;
        case "arrowup":
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.min(volume + 0.1, 1) } });
          break;
        case "arrowdown":
          e.preventDefault();
          handleVolumeChange({ target: { value: Math.max(volume - 0.1, 0) } });
          break;
        case "f":
          handleFullscreen();
          e.preventDefault();
          break;
        case "m":
          handleMuteToggle();
          e.preventDefault();
          break;
        case "escape":
          if (showSettings) {
            setShowSettings(false);
          } else if (isFullscreen) {
            handleFullscreen();
          }
          break;
        default:
          break;
      }
    },
    [player, volume, isPlaying, isContainerFocused, showSettings]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  // Load Vimeo script and initialize player
  useEffect(() => {
    if (!validatedVideoId) {
      handleError("معرف فيديو Vimeo غير صحيح أو مفقود");
      return;
    }

    const loadVimeoScript = async () => {
      if (window.Vimeo) return;

      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.async = true;
      document.head.appendChild(script);

      return new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = () => reject(new Error("فشل في تحميل مكتبة Vimeo"));
      });
    };

    const initPlayer = async () => {
      try {
        setIsLoading(true);
        setError(null);

        await loadVimeoScript();

        if (playerRef.current?.hasChildNodes()) {
          playerRef.current.innerHTML = "";
        }

        const newPlayer = new window.Vimeo.Player(playerRef.current, {
          id: validatedVideoId,
          width: "100%",
          height: "100%",
          autoplay: false,
          controls: false,
          responsive: true,
          color: "#f97316",
          playsinline: true,
          pip: false,
          dnt: true,
          title: false,
          byline: false,
          portrait: false,
          background: false,
          keyboard: false,
        });

        newPlayer
          .ready()
          .then(() => {
            setError(null);
            setIsLoading(false);
            if (onReady) onReady(newPlayer);

            if (startTime > 0) {
              setTimeout(() => {
                newPlayer
                  .setCurrentTime(startTime)
                  .then(() => setCurrentTime(startTime))
                  .catch(console.error);
              }, 500);
            }

            newPlayer
              .getDuration()
              .then((dur) => {
                if (dur && dur > 0) {
                  setDuration(dur);
                }
              })
              .catch(console.error);

            newPlayer
              .getVolume()
              .then((vol) => setVolume(vol))
              .catch(console.error);
          })
          .catch((error) => {
            handleError(error, "on ready");
          });

        newPlayer.on("error", (error) => {
          handleError(error, "player event");
        });

        newPlayer.on("loaded", () => {
          setError(null);
          setIsLoading(false);
        });

        newPlayer.on("play", () => {
          setIsPlaying(true);
          if (onPlay) onPlay();
        });

        newPlayer.on("pause", () => {
          setIsPlaying(false);
          if (onPause) onPause();
        });

        newPlayer.on("ended", () => {
          setIsPlaying(false);
          if (onEnded) onEnded();
          if (isLooping) {
            setTimeout(() => newPlayer.play(), 100);
          }
        });

        newPlayer.on("timeupdate", (data) => {
          setCurrentTime(data.seconds);
          if (onTimeUpdate) onTimeUpdate(data);
        });

        newPlayer.on("volumechange", (data) => {
          setVolume(data.volume);
          setIsMuted(data.volume === 0);
        });

        newPlayer.on("playbackratechange", (data) => {
          setPlaybackRate(data.playbackRate);
        });

        setPlayer(newPlayer);
      } catch (error) {
        handleError(error, "initialization");
      }
    };

    initPlayer();

    return () => {
      if (player) {
        player.destroy().catch(console.error);
      }
    };
  }, [
    validatedVideoId,
    startTime,
    retryCount,
    onReady,
    onPlay,
    onPause,
    onEnded,
    onTimeUpdate,
    handleError,
  ]);

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);
      if (!isNowFullscreen) {
        document.body.style.cursor = "auto";
      }
    };

    const events = [
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "msfullscreenchange",
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleFullscreenChange);
    });

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleFullscreenChange);
      });
    };
  }, []);

  // Player control functions
  const handlePlayPause = useCallback(() => {
    if (!player) return;
    if (isPlaying) {
      player.pause().catch(console.error);
    } else {
      player.play().catch(console.error);
    }
  }, [player, isPlaying]);

  const seek = useCallback(
    (seconds) => {
      if (!player || !duration) return;
      const newTime = Math.min(Math.max(currentTime + seconds, 0), duration);
      player.setCurrentTime(newTime).catch(console.error);
    },
    [player, duration, currentTime]
  );

  const handleSeek = useCallback(
    (e) => {
      if (!showControls || !player || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clickX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const newTime = percentage * duration;
      player.setCurrentTime(newTime).catch(console.error);
    },
    [showControls, player, duration]
  );

  const handleProgressChange = useCallback(
    (e) => {
      if (!player) return;
      const newTime = parseFloat(e.target.value);
      player.setCurrentTime(newTime).catch(console.error);
      setCurrentTime(newTime);
    },
    [player]
  );

  const handleVolumeChange = useCallback(
    (e) => {
      if (!player) return;
      const newVolume = Math.max(0, Math.min(1, parseFloat(e.target.value)));
      player.setVolume(newVolume).catch(console.error);
      setIsMuted(newVolume === 0);
    },
    [player]
  );

  const handleMuteToggle = useCallback(() => {
    if (!player) return;
    if (isMuted || volume === 0) {
      const targetVolume = volume === 0 ? 1 : volume;
      player.setVolume(targetVolume).catch(console.error);
      setIsMuted(false);
    } else {
      player.setVolume(0).catch(console.error);
      setIsMuted(true);
    }
  }, [player, isMuted, volume]);

  const handleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        } else if (containerRef.current.mozRequestFullScreen) {
          await containerRef.current.mozRequestFullScreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  }, []);

  // FIXED: Updated speed change function to ensure it works properly
  const handleSpeedChange = useCallback(
    (speed) => {
      console.log("Speed change called:", speed, "Player:", !!player);

      if (!player) {
        console.log("No player available");
        return;
      }

      // Update state immediately for UI feedback
      setPlaybackRate(speed);

      // Call the Vimeo API method
      player
        .setPlaybackRate(speed)
        .then(() => {
          console.log("Speed successfully changed to:", speed);
          // Close settings modal after successful change
          // setShowSettings(false);
        })
        .catch((error) => {
          console.error("Error changing speed:", error);
          // Revert state if API call failed
          setPlaybackRate(playbackRate);
        });
    },
    [player, playbackRate]
  );

  // FIXED: Updated loop toggle function
  const toggleLoop = useCallback(() => {
    console.log(
      "Loop toggle called, current state:",
      isLooping,
      "Player:",
      !!player
    );

    if (!player) {
      console.log("No player available");
      return;
    }

    const newLoopState = !isLooping;

    // Update state immediately for UI feedback
    setIsLooping(newLoopState);

    // Call the Vimeo API method
    player
      .setLoop(newLoopState)
      .then(() => {
        console.log("Loop successfully changed to:", newLoopState);
        // Close settings modal after successful change
        // setShowSettings(false);
      })
      .catch((error) => {
        console.error("Error changing loop state:", error);
        // Revert state if API call failed
        setIsLooping(isLooping);
      });
  }, [player, isLooping]);

  const formatTime = useCallback((seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Handle double click with controls exclusion
  const handleDoubleClick = useCallback(
    (e) => {
      if (controlsRef.current && controlsRef.current.contains(e.target)) {
        return;
      }

      e.stopPropagation();
      handleFullscreen();
    },
    [handleFullscreen]
  );

  // Error display component
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-black overflow-hidden shadow-2xl rounded-lg">
        <div className="relative aspect-video bg-black flex items-center justify-center">
          <div className="text-center text-white p-6 max-w-md">
            <div className="text-red-400 mb-4 text-4xl">⚠️</div>
            <div className="text-xl mb-2">خطأ في تحميل الفيديو</div>
            <div className="text-sm opacity-70 mb-4">{error.message}</div>
            {error.canRetry && (
              <button
                onClick={retryLoad}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
              >
                إعادة المحاولة ({retryCount + 1}/{maxRetries + 1})
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onFocus={() => setIsContainerFocused(true)}
      onBlur={() => setIsContainerFocused(false)}
      onContextMenu={(e) => e.preventDefault()}
      className={`w-full max-w-4xl mx-auto overflow-visible shadow-2xl video-container focus:outline-none focus:ring-2 focus:ring-orange-400 rounded-lg ${
        isFullscreen
          ? "fixed inset-0 z-50 max-w-none rounded-none overflow-hidden"
          : ""
      }`}
      dir="ltr"
      role="region"
      aria-label="مشغل فيديو Vimeo"
    >
      <div
        className={`relative aspect-video cursor-pointer w-full h-full bg-black ${
          isFullscreen ? "rounded-none" : "rounded-lg"
        }`}
        onDoubleClick={handleDoubleClick}
      >
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black z-20 rounded-lg">
            <div className="text-center text-white">
              <div className="animate-spin w-12 h-12 border-3 border-orange-400 border-t-transparent rounded-full mx-auto mb-4"></div>
              <div className="text-lg">جاري تحميل الفيديو...</div>
              <div className="text-sm opacity-70 mt-2">يرجى الانتظار</div>
            </div>
          </div>
        )}

        {/* Vimeo Player */}
        <div
          ref={playerRef}
          className={`absolute inset-0 w-full h-full vimeo_player_custom ${
            isFullscreen ? "rounded-none" : "rounded-lg"
          }`}
        />

        {/* Click Overlay */}
        {!showControls && !isLoading && (
          <div
            className="absolute inset-0 z-10"
            onClick={(e) => {
              e.stopPropagation();
              showControlsWithTimer();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              showControlsWithTimer();
            }}
          />
        )}

        {/* Play Button Overlay */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-15">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePlayPause();
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center transition-all duration-300 shadow-2xl bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 hover:scale-110"
              aria-label="تشغيل الفيديو"
            >
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Seek Buttons */}
        {showControls && !isLoading && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                seek(-10);
              }}
              className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition z-20"
              aria-label="تراجع 10 ثوان"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z" />
                <text
                  x="12"
                  y="15"
                  fontSize="6"
                  textAnchor="middle"
                  fill="white"
                >
                  10
                </text>
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                seek(10);
              }}
              className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition z-20"
              aria-label="تقدم 10 ثوان"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.5 8c2.65 0 5.05.99 6.9 2.6L22 7v9h-9l3.62-3.62c-1.39-1.16-3.16-1.88-5.12-1.88-3.54 0-6.55 2.31-7.6 5.5l-2.37-.78C2.92 11.03 6.85 8 11.5 8z" />
                <text
                  x="12"
                  y="15"
                  fontSize="6"
                  textAnchor="middle"
                  fill="white"
                >
                  10
                </text>
              </svg>
            </button>
          </>
        )}

        {/* Controls */}
        <div
          ref={controlsRef}
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 py-4 sm:py-6 transition-all duration-300 ${
            showControls && !isLoading
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-full pointer-events-none"
          }`}
        >
          {/* Progress Bar */}
          <div className="mb-3 sm:mb-4">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              disabled={duration === 0}
              onChange={handleProgressChange}
              onMouseDown={handleSeek}
              onTouchStart={handleSeek}
              className="w-full h-1 sm:h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: duration
                  ? `linear-gradient(to right, #f97316 0%, #f97316 ${
                      (currentTime / duration) * 100
                    }%, #4b5563 ${
                      (currentTime / duration) * 100
                    }%, #4b5563 100%)`
                  : "#4b5563",
              }}
              aria-label="شريط التقدم"
            />
          </div>

          {/* Controls Container */}
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left Controls */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <button
                onClick={handlePlayPause}
                className="flex-shrink-0 text-white hover:text-orange-400 transition-colors duration-200"
                aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
              >
                {isPlaying ? (
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 sm:w-8 sm:h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <div className="text-white text-xs sm:text-sm font-medium whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
              {/* Volume Control */}
              <div className="relative flex items-center">
                <button
                  onClick={handleMuteToggle}
                  onMouseEnter={() => !isMobile && setShowVolumeSlider(true)}
                  className="flex-shrink-0 text-white hover:text-orange-400 transition-colors duration-200 p-1"
                  aria-label={isMuted ? "إلغاء كتم الصوت" : "كتم الصوت"}
                >
                  {isMuted || volume === 0 ? (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5 sm:w-6 sm:h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  )}
                </button>

                {/* Volume Slider */}
                <div
                  className={`volume-slider-container flex ${
                    showVolumeSlider || isMobile ? "show" : ""
                  }`}
                  onMouseEnter={() => !isMobile && setShowVolumeSlider(true)}
                  onMouseLeave={() => !isMobile && setShowVolumeSlider(false)}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                    aria-label="مستوى الصوت"
                    style={{
                      background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                        (isMuted ? 0 : volume) * 100
                      }%, #4b5563 ${
                        (isMuted ? 0 : volume) * 100
                      }%, #4b5563 100%)`,
                    }}
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  }}
                  className="flex-shrink-0 text-white hover:text-orange-400 transition-colors duration-200 p-1"
                  aria-label="الإعدادات"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
                  </svg>
                </button>

                {/* Desktop Settings Dropdown */}
                {showSettings && !isMobile && (
                  <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white rounded-lg shadow-lg w-48 text-sm z-40 border border-gray-700">
                    <div className="p-2">
                      <div className="text-gray-300 text-xs mb-2 border-b border-gray-700 pb-2">
                        السرعة
                      </div>
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                        <button
                          key={speed}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSpeedChange(speed);
                          }}
                          className={`block w-full text-right px-3 py-2 hover:bg-gray-700 rounded text-sm ${
                            playbackRate === speed ? "bg-orange-600" : ""
                          }`}
                        >
                          {speed}x {speed === 1 ? "(عادي)" : ""}
                        </button>
                      ))}
                      <div className="border-t border-gray-700 mt-2 pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLoop();
                          }}
                          className={`block w-full text-right px-3 py-2 hover:bg-gray-700 rounded text-sm ${
                            isLooping ? "bg-orange-600" : ""
                          }`}
                        >
                          التكرار: {isLooping ? "مفعل" : "معطل"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="flex-shrink-0 text-white hover:text-orange-400 transition-colors duration-200 p-1"
                aria-label={
                  isFullscreen ? "إنهاء وضع ملء الشاشة" : "ملء الشاشة"
                }
              >
                {isFullscreen ? (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FIXED MOBILE SETTINGS MODAL */}
      {showSettings && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-[99999] flex items-end justify-center"
          onClick={(e) => {
            // Close modal when clicking outside
            if (e.target === e.currentTarget) {
              setShowSettings(false);
            }
          }}
        >
          <div
            className="bg-gray-800 w-full max-w-md rounded-t-2xl p-6 m-4 mb-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-gray-600">
              <h3 className="text-white text-lg font-semibold">
                إعدادات المشغل
              </h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white text-xl leading-none"
                aria-label="إغلاق"
              >
                ✕
              </button>
            </div>

            {/* Speed Section */}
            <div className="mb-6">
              <div className="text-gray-300 text-sm mb-3 font-medium">
                السرعة
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                  <button
                    key={speed}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      console.log("MOBILE: Speed button clicked:", speed);
                      handleSpeedChange(speed);
                    }}
                    className={`py-3 px-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      playbackRate === speed
                        ? "bg-orange-500 text-white border-2 border-orange-400"
                        : "bg-gray-700 text-gray-200 border-2 border-gray-600 hover:bg-gray-600"
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>
            </div>

            {/* Loop Section */}
            <div>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  console.log("MOBILE: Loop button clicked");
                  toggleLoop();
                }}
                className={`w-full py-4 px-4 rounded-lg text-base font-semibold transition-all duration-200 flex justify-between items-center ${
                  isLooping
                    ? "bg-orange-500 text-white border-2 border-orange-400"
                    : "bg-gray-700 text-gray-200 border-2 border-gray-600 hover:bg-gray-600"
                }`}
              >
                <span>التكرار</span>
                <span className="text-sm opacity-90">
                  {isLooping ? "مفعل" : "معطل"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Progress Bar Styling */
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          transition: transform 0.2s ease;
        }

        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .slider::-moz-range-thumb {
          height: 16px;
          width: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-track {
          height: 4px;
          background: #4b5563;
          border-radius: 2px;
        }

        /* Volume Slider Container */
        .volume-slider-container {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          background: rgba(0, 0, 0, 0.8);
          padding: 8px;
          border-radius: 6px;
          backdrop-filter: blur(4px);
        }

        .vimeo_player_custom > div {
          height: 100% !important;
        }

        .volume-slider-container.show {
          opacity: 1;
          visibility: visible;
        }

        /* Volume Slider */
        .volume-slider {
          writing-mode: bt-lr;
          -webkit-appearance: slider-vertical;
          width: 4px;
          height: 80px;
          background: #4b5563;
          outline: none;
          border-radius: 2px;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f97316;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        /* Mobile-specific volume slider */
        @media (max-width: 640px) {
          .volume-slider-container {
            position: relative;
            bottom: auto;
            left: auto;
            transform: none;
            margin-bottom: 0;
            margin-left: 8px;
            opacity: 1;
            visibility: visible;
            background: transparent;
            padding: 0;
            backdrop-filter: none;
          }

          .volume-slider {
            writing-mode: lr-tb;
            -webkit-appearance: none;
            width: 60px;
            height: 4px;
            background: #4b5563;
            border-radius: 2px;
          }

          .volume-slider::-webkit-slider-track {
            height: 4px;
            background: #4b5563;
            border-radius: 2px;
          }
        }

        .video-container {
          cursor: ${showControls || !isPlaying ? "auto" : "none"};
        }

        .video-container:focus {
          outline: 2px solid #f97316;
          outline-offset: 2px;
        }

        .flex.items-center {
          align-items: baseline;
        }

        .flex.items-center > * {
          align-self: center;
        }

        @media (max-width: 480px) {
          .text-xs {
            font-size: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}
