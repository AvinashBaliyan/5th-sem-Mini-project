import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: '#F5F5DC', // Light Beige
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#FF9933" strokeWidth="2"/>
            <circle cx="12" cy="12" r="6" stroke="#FF9933" strokeWidth="2"/>
            <circle cx="12" cy="12" r="2" fill="#FF9933"/>
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
