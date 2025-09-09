export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row" style={{justifyContent:'space-between', alignItems: 'center', flexWrap: 'wrap'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <span style={{fontSize: '20px'}}>🇻🇳</span>
            <div>
              <div style={{fontWeight: '600', color: 'var(--primary)'}}>weARvietnam</div>
              <div style={{fontSize: '14px', color: 'var(--text-light)'}}>
                &copy; {new Date().getFullYear()} — AR Virtual Try-On cho trang phục Việt Nam
              </div>
            </div>
          </div>
          <div className="row" style={{gap: '24px', flexWrap: 'wrap'}}>
            <a href="#" style={{fontSize: '14px', fontWeight: '500'}}>📖 Về chúng tôi</a>
            <a href="#" style={{fontSize: '14px', fontWeight: '500'}}>🛟 Hỗ trợ</a>
            <a href="#" style={{fontSize: '14px', fontWeight: '500'}}>📞 Liên hệ</a>
          </div>
        </div>
      </div>
    </footer>
  )
}