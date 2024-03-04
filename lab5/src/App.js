import React, { useEffect, useState } from 'react';

const mapImage = './image.png';


const mapDimensions = { width: 626, height: 443 };

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  useEffect(() => {
    const fetchData = () => {
      const BASE_URL = process.env.BASE_URL || 'http://localhost:8000/processed_agent_data';
      fetch(BASE_URL)
        .then(response => response.json())
        .then(data => {
          setData(data);
          setError(null);
        })
        .catch(error => {
          setError(error.toString());
        });
    };
  
    fetchData(); 
    const intervalId = setInterval(fetchData, 5000); 
  
    return () => clearInterval(intervalId); 
  }, []);

  const min_lon = 30.514831671079804  
  const max_lon = 30.524547100067142  
  const min_lat = 50.44802590272302   
  const max_lat = 50.45536507833424 

  function coordsToPixels(lon, lat, img_width, img_height, min_lon, max_lon, min_lat, max_lat){
    const x_pixel = ((lon - min_lon) * (img_width / (max_lon - min_lon))) % img_width
    const y_pixel = (img_height - (lat - min_lat) * (img_height / (max_lat - min_lat))) % img_height
    
    return {x_pixel: Math.floor(x_pixel), y_pixel: Math.floor(y_pixel)}
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ position: "relative", width: mapDimensions.width, height: mapDimensions.height, backgroundImage: `url(${mapImage})` }}>
      {data.map(({ id, latitude, longitude, road_state }) => {
        const { x_pixel, y_pixel } = coordsToPixels(Number(longitude), Number(latitude), mapDimensions.width, mapDimensions.height, min_lon, max_lon, min_lat, max_lat);
        console.log(x_pixel, y_pixel)
        return (
          <div key={id} style={{
            position: "absolute",
            left: `${x_pixel}px`, 
            top: `${y_pixel}px`, 
            transform: "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#F00",
            border: "2px solid #fff"
          }}
          onMouseEnter={() => setHoveredMarker({ id, road_state })}
          onMouseLeave={() => setHoveredMarker(null)}
          >
          </div>
      );
    })}
      {hoveredMarker && (
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", padding: "10px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
          Road State: {hoveredMarker.road_state}
        </div>
      )}
    </div>
  );
}

export default App;