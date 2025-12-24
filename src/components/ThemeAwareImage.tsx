import { useTheme } from '../contexts/ThemeContext';

interface ThemeAwareImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

export default function ThemeAwareImage({ 
  lightSrc, 
  darkSrc, 
  alt, 
  className,
  onError 
}: ThemeAwareImageProps) {
  const { effectiveTheme } = useTheme();
  const src = effectiveTheme === 'dark' ? darkSrc : lightSrc;

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal"
        onError={onError}
      />
    </div>
  );
}
