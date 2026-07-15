import Image from 'next/image';

type LandingImageProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export default function LandingImage({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, 50vw',
}: LandingImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}