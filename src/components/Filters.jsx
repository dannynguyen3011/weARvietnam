export default function Filters({ filters, setFilters, categories, ethnics }) {
  const update = (key) => (e) => setFilters(f => ({...f, [key]: e.target.value}))
  return (
    <div className="card">
      <div className="section-title">Bộ lọc</div>
      <div className="grid cols-3">
        <div>
          <div>Danh mục</div>
          <select value={filters.category} onChange={update('category')}>
            <option value="">Tất cả</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <div>Dân tộc</div>
          <select value={filters.ethnic} onChange={update('ethnic')}>
            <option value="">Tất cả</option>
            {ethnics.map(e => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div>
          <div>Sắp xếp</div>
          <select value={filters.sort} onChange={update('sort')}>
            <option value="relevance">Liên quan</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>
      </div>
    </div>
  )
}