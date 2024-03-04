const min_lon = 30.514831671079804  
  const max_lon = 30.524547100067142  
  const min_lat = 50.44802590272302   
  const max_lat = 50.45536507833424 

  function coordsToPixels(lon, lat, img_width, img_height, min_lon, max_lon, min_lat, max_lat){
    const x_pixel = ((lon - min_lon) * (img_width / (max_lon - min_lon))) % img_width
    const y_pixel = (img_height - (lat - min_lat) * (img_height / (max_lat - min_lat))) % img_height
    
    return {x_pixel: Math.floor(x_pixel), y_pixel: Math.floor(y_pixel)}
  }

  const lon = 50.45061519043338
  const lat = 30.524111541773035

  const width = 626
  const height = 443

  const data = coordsToPixels(lon, lat, width, height, min_lon, max_lon, min_lat, max_lat);
  console.log(data);