import { useCart } from '../store/cart'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, updateQty, remove, total } = useCart()
  return (
    <div>
      <h2>Giỏ hàng</h2>
      {items.length === 0 ? (
        <div className="card">Chưa có sản phẩm. <Link to="/shop">Mua sắm ngay</Link></div>
      ) : (
        <table className="table">
          <thead><tr><th>Sản phẩm</th><th>Giá</th><th>Số lượng</th><th>Tổng</th><th></th></tr></thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id}>
                <td>{i.name}</td>
                <td>${i.price}</td>
                <td><input type="number" min="1" value={i.qty} onChange={e=>updateQty(i.id, Number(e.target.value))} /></td>
                <td>${i.price * i.qty}</td>
                <td><button className="btn ghost" onClick={()=>remove(i.id)}>Xoá</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="row" style={{justifyContent:'space-between', marginTop:12}}>
        <div className="badge">Tổng cộng: ${total().toFixed(2)}</div>
        <Link className="btn primary" to="/checkout">Thanh toán</Link>
      </div>
    </div>
  )
}