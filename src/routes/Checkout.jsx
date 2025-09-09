export default function Checkout() {
  return (
    <div className="grid cols-3">
      <form className="card">
        <div className="section-title">Thông tin giao hàng</div>
        <input placeholder="Họ tên" required />
        <input placeholder="Số điện thoại" required style={{marginTop:8}} />
        <input placeholder="Địa chỉ" required style={{marginTop:8}} />
        <select style={{marginTop:8}}>
          <option>Phương thức thanh toán</option>
          <option>Thẻ</option>
          <option>VNPay</option>
          <option>MoMo</option>
        </select>
        <button type="button" className="btn primary" style={{marginTop:12}}>Đặt hàng</button>
      </form>
      <div className="card" style={{gridColumn:'span 2'}}>
        <div className="section-title">Tóm tắt đơn hàng</div>
        <p>Bạn có thể kết nối API thanh toán của bạn ở đây.</p>
      </div>
    </div>
  )
}