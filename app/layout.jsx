import './globals.css';

export const metadata = {
  title: 'Executive Secretary V37',
  description: 'Premium AI executive secretary dashboard'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
