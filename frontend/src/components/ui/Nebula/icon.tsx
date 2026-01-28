import localFont from 'next/font/local';

const NerdRegular = localFont({
  src: '../../../../public/fonts/SymbolsNerdFont-Regular.ttf',
  variable: '--font-my-custom-font',
  display: 'swap',
});

const NerdMonoRegular = localFont({
  src: '../../../../public/fonts/SymbolsNerdFontMono-Regular.ttf',
  variable: '--font-my-mono-custom-font',
  display: 'swap',
});

interface IconProps {
    className?: string;
    value?: string;
    children?: React.ReactNode;
}

const Icon: React.FC<IconProps> = ({className, value, children}) => {
  return (
    <span className={`${NerdRegular.className} ${NerdMonoRegular.className} ${className}`}>
      {value || children}
    </span>
  );
}
export { Icon };