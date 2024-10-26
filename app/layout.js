// app/layout.jsx
import localFont from "next/font/local";
import SessionProviderWrapper from '../app/sessionwrapper'; // Import the session wrapper
import ClientLayout from './clientlayout'; // Import the ClientLayout
import './globals.css'; // Import global styles

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Apartment Site',
  description: 'This is the apartment site that will help clients and users to create and look for a room.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SessionProviderWrapper>
          <ClientLayout>{children}</ClientLayout> {/* Use ClientLayout here */}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
