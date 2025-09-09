import { useParams } from 'react-router-dom'
import products from '../data/products.json'
import ModelViewerPlaceholder from '../components/ModelViewerPlaceholder'
import { useCart } from '../store/cart'

export default function ProductDetail() {
  const { id } = useParams()
  const product = products.find(p => p.id === id)
  const add = useCart(s => s.add)
  if (!product) return <div>Không tìm thấy sản phẩm.</div>
  return (
    <div className="row" style={{alignItems:'flex-start'}}>
      <section className="main">
        <ModelViewerPlaceholder />
      </section>
      <aside className="sidebar">
        <div className="card">
          <h2>{product.name}</h2>
          <div className="badge">{product.ethnic}</div>
          <p>Giá: ${product.price}</p>
          <div className="row" style={{gap:8}}>
            <button className="btn ghost" onClick={()=>add(product)}>Thêm vào giỏ</button>
            <a className="btn primary" href="/try-on">Thử ngay</a>
          </div>
        </div>
      </aside>
    </div>
  )
}