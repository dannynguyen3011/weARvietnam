import { Link } from 'react-router-dom'

export default function ProductCard({ p }) {
  return (
    <div className="card product-card fade-in">
      <Link to={`/product/${p.id}`}>
        <img 
          src={p.image} 
          alt={p.name} 
          className="product-image"
        />
        <div className="product-info">
          <div className="product-name">{p.name}</div>
          <div className="product-details">
            <span className="badge">{p.ethnic}</span>
            <span className="product-price">${p.price}</span>
          </div>
        </div>
      </Link>
    </div>
  )
}