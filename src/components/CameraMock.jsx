import { useEffect, useRef, useState } from 'react'

export default function CameraMock() {
  const videoRef = useRef(null)
  const [error, setError] = useState('')
  useEffect(() => {
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (e) {
        setError('Không thể bật camera (trình duyệt bị chặn hoặc không hỗ trợ).')
      }
    }
    start()
    return () => {
      const stream = videoRef.current?.srcObject
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }, [])
  return (
    <div className="card" style={{position:'relative'}}>
      {error && <div className="badge">{error}</div>}
      <video ref={videoRef} autoPlay playsInline style={{width:'100%', borderRadius:12}} />
      <img src="/overlay.png" alt="overlay" style={{position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'contain', pointerEvents:'none', opacity:.7}}/>
    </div>
  )
}