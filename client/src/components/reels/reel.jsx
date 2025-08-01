import React from 'react';
import './reel.css';

function Reel() {
  const videoList = [
    {
      
      src: 'https://www.youtube.com/embed/DxsXuQZw3SY?autoplay=1&mute=1&loop=1&playlist=DxsXuQZw3SY',
    },
    {
      
      src: 'https://www.youtube.com/embed/We9iIMRVOgo?autoplay=1&mute=1&loop=1&playlist=We9iIMRVOgo',
    },
    {

   src: 'https://www.youtube.com/embed/KvHpAWrwx2o?autoplay=1&mute=1&loop=1&playlist=KvHpAWrwx2o',
    },
  ];

  return (
    <div className="reels-app">
      <h1 className="reels-header">Reels</h1>
      <div className="reels-container">
        {videoList.map((video, index) => (
          <div key={index} className="reel-card">
            <h3 className="reel-title">{video.title}</h3>
            <iframe
              width="100%"
              height="100%"
              src={video.src}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="reel-video"
            ></iframe>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reel;