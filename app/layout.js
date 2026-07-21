import './styles.css';

export const metadata = {
  title: 'Secure sign in',
  description: 'Passwordless sign in with Scalekit Magic Link',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
