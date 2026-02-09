import { Public_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";

export const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default async function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body id="body" className={publicSans.className}>
        {children}
        {/* <GoogleAnalytics gaId="G-XKPD36JXY0" /> */}
      </body>
    </html>
  );
}
