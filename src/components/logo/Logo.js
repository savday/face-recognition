import React from "react";
import "./Logo.css";
import Tilt from "react-parallax-tilt";
import brain from './brain.png'

const Logo = () => {
  return (
    <div className="ma4 mt0">
      <Tilt
        className="Tilt br2 shadow-2"
        perspective={500}
        glareEnable={true}
        glareMaxOpacity={0.45}
        scale={1.02}
        gyroscope={true}
      >
        <div className="Tilt-inner pa3">
          <div><img style={{ paddingTop: '5px'}} src={brain} alt="brain" /></div>
        </div>
      </Tilt>
    </div>
  );
};

export default Logo;
