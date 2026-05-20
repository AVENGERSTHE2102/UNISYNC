import '@/styles/variables.css';
import '@/styles/globals.css';
import '@/styles/common.css';
import '@/styles/components.css';
import '@/styles/navigation.css';

export const metadata = {
  title: 'UniSync',
  description: 'The Ultimate Campus Experience, Reimagined.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="/assets/js/runtime-config.js" defer></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
