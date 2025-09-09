import { useMemo, useState } from 'react'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard'
import Filters from '../components/Filters'

export default function Shop() {
  const categories = Array.from(new Set(products.map(p=>p.category)))
  const ethnics = Array.from(new Set(products.map(p=>p.ethnic)))
  const [filters, setFilters] = useState({ category:'', ethnic:'', sort:'relevance' })
  const filtered = useMemo(() => {
    let list = products.filter(p => (!filters.category || p.category===filters.category) && (!filters.ethnic || p.ethnic===filters.ethnic))
    if (filters.sort === 'price-asc') list = list.sort((a,b)=>a.price-b.price)
    if (filters.sort === 'price-desc') list = list.sort((a,b)=>b.price-a.price)
    return list
  }, [filters])
  return (
    <div className="fade-in">
      <div className="section-title">🛍️ Cửa hàng trang phục truyền thống</div>
      <p style={{color: 'var(--text-light)', marginBottom: '32px', fontSize: '18px'}}>
        Khám phá bộ sưu tập trang phục từ 54 dân tộc Việt Nam
      </p>
      <div className="row" style={{alignItems:'flex-start', gap: '32px'}}>
        <aside className="sidebar">
          <Filters filters={filters} setFilters={setFilters} categories={categories} ethnics={ethnics} />
        </aside>
        <section className="main">
          <div style={{marginBottom: '20px', color: 'var(--text-light)'}}>
            Tìm thấy {filtered.length} sản phẩm
          </div>
          <div className="product-list">
            {filtered.map((p, index) => (
              <div key={p.id} className="slide-up" style={{animationDelay: `${index * 0.05}s`}}>
                <ProductCard p={p} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}