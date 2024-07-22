import React from 'react';
import './CardStatic.css'; // Import CSS for styling

const CardStatic = ({ color, data, title,icon }) => {
  return (
    <div className="card-static" style={{ backgroundColor: color }}>
      <div className="card-data">
        <h3>{data}</h3>
        <p>{title}</p>
      </div>
      <div className="card-icon">
        {/* You can conditionally render different icons here based on the title or other props */}
        <span>{icon}</span> {/* Example icon */}
      </div>
    </div>
  );
};

export default CardStatic;
