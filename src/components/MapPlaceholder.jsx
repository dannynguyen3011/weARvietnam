export default function MapPlaceholder() {
  return (
    <div className="card" style={{height:360, display:'grid', placeItems:'center'}}>
      <div>
        <div style={{fontWeight:800, fontSize:18}}>Bản đồ làng nghề</div>
        <div className="badge">Thay bằng Mapbox/Leaflet sau</div>
      </div>
    </div>
  )
}