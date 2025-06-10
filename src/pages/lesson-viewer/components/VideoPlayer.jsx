import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const VideoPlayer = ({ videoUrl, transcript, onProgress }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showTranscript, setShowTranscript] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [showCaptions, setShowCaptions] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleProgress = () => {
      if (duration > 0) {
        const progress = (video.currentTime / duration) * 100;
        onProgress(progress);
      }
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('timeupdate', handleProgress);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('timeupdate', handleProgress);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, [duration, onProgress]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = e => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = e => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const handlePlaybackRateChange = rate => {
    setPlaybackRate(rate);
    videoRef.current.playbackRate = rate;
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipTime = seconds => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  return (
    <div className='flex flex-col lg:flex-row h-full'>
      {/* Video Player */}
      <div className='flex-1 bg-black relative group'>
        <video
          ref={videoRef}
          src={videoUrl}
          className='w-full h-full object-contain'
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onMouseEnter={() => setShowControls(true)}
          onMouseLeave={() => setShowControls(false)}
        />

        {/* Video Controls Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          {/* Center Play Button */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <button
              onClick={togglePlay}
              className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'
            >
              <Icon name={isPlaying ? 'Pause' : 'Play'} size={24} color='white' />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className='absolute bottom-0 left-0 right-0 p-4'>
            {/* Progress Bar */}
            <div
              className='w-full h-2 bg-white/20 rounded-full cursor-pointer mb-4'
              onClick={handleSeek}
            >
              <div
                className='h-full bg-primary rounded-full transition-all duration-150'
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>

            {/* Control Buttons */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <button
                  onClick={togglePlay}
                  className='text-white hover:text-primary transition-colors'
                >
                  <Icon name={isPlaying ? 'Pause' : 'Play'} size={20} />
                </button>

                <button
                  onClick={() => skipTime(-10)}
                  className='text-white hover:text-primary transition-colors'
                >
                  <Icon name='RotateCcw' size={20} />
                </button>

                <button
                  onClick={() => skipTime(10)}
                  className='text-white hover:text-primary transition-colors'
                >
                  <Icon name='RotateCw' size={20} />
                </button>

                <div className='flex items-center space-x-2'>
                  <Icon name='Volume2' size={16} color='white' />
                  <input
                    type='range'
                    min='0'
                    max='1'
                    step='0.1'
                    value={volume}
                    onChange={handleVolumeChange}
                    className='w-20'
                  />
                </div>

                <span className='text-white text-sm'>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className='flex items-center space-x-4'>
                {/* Playback Speed */}
                <div className='relative group'>
                  <button className='text-white hover:text-primary transition-colors text-sm'>
                    {playbackRate}x
                  </button>
                  <div className='absolute bottom-full right-0 mb-2 bg-black/80 backdrop-blur-sm rounded-lg p-2 opacity-0 group-hover:opacity-100 transition-opacity'>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <button
                        key={rate}
                        onClick={() => handlePlaybackRateChange(rate)}
                        className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-white/20 transition-colors ${
                          playbackRate === rate ? 'text-primary' : 'text-white'
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setShowCaptions(!showCaptions)}
                  className={`transition-colors ${showCaptions ? 'text-primary' : 'text-white hover:text-primary'}`}
                >
                  <Icon name='Captions' size={20} />
                </button>

                <button
                  onClick={() => setShowTranscript(!showTranscript)}
                  className={`transition-colors ${showTranscript ? 'text-primary' : 'text-white hover:text-primary'}`}
                >
                  <Icon name='FileText' size={20} />
                </button>

                <button className='text-white hover:text-primary transition-colors'>
                  <Icon name='Maximize' size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Captions */}
        {showCaptions && (
          <div className='absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-center max-w-md'>
            <p className='text-sm'>
              Les réseaux de neurones sont l'épine dorsale de l'intelligence artificielle moderne.
            </p>
          </div>
        )}
      </div>

      {/* Transcript Panel */}
      {showTranscript && (
        <div className='w-full lg:w-80 bg-surface border-l border-border flex flex-col'>
          <div className='p-4 border-b border-border flex items-center justify-between'>
            <h3 className='font-semibold text-text-primary'>Transcription</h3>
            <button
              onClick={() => setShowTranscript(false)}
              className='p-1 hover:bg-secondary-50 rounded transition-colors'
            >
              <Icon name='X' size={16} />
            </button>
          </div>

          <div className='flex-1 overflow-auto p-4'>
            <div className='prose prose-sm max-w-none'>
              <p className='text-text-secondary leading-relaxed whitespace-pre-line'>
                {transcript}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
