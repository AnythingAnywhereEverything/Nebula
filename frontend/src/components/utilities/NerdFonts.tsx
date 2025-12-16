import localFont from 'next/font/local';

const NerdRegular = localFont({
  src: '../../../public/fonts/SymbolsNerdFont-Regular.ttf',
  variable: '--font-my-custom-font',
  display: 'swap',
});

const NerdMonoRegular = localFont({
  src: '../../../public/fonts/SymbolsNerdFontMono-Regular.ttf',
  variable: '--font-my-mono-custom-font',
  display: 'swap',
});

const NerdFonts = ({ children, extraClass }: { children: React.ReactNode, extraClass?: string }) => {
  return (
    <span className={`${NerdRegular.className} ${NerdMonoRegular.className} ${extraClass ? extraClass : ''}`}>
      {children}
    </span>
  );
}

export { NerdFonts };