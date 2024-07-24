import React from 'react';
import './CardStatic.css'; // Import CSS for CardStatic styling

const CardStatic = ({ color, data, title, icon }) => {
  return (
    <div className={`card-static ${color}`}>
      <div className="card-content">
        <div className="card-icon">
          {icon}
        </div>
        <div className="card-data">
          {data}
        </div>
      </div>
      <div className="card-title">
        {title}
      </div>
    </div>
  );
};

export default CardStatic;