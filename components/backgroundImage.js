import Image from 'next/image';

export default function BackgroundImage() {
  return (
    <div className="hidden">
      <Image
        src="/pexels-andre-furtado-43594-370717.webp"
        alt="Background"
        layout="fill"
        priority
        quality={100}
      />
    </div>
  );
}