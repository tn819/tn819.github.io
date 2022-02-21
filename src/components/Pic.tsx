import Image from 'next/image'

interface Props {
  src: string
  alt: string
}

const Pic: React.FC<Props> = ({ src, alt }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Image src={src} alt={alt} layout="fill" objectFit="contain" />
    </div>
  )
}

export default Pic
