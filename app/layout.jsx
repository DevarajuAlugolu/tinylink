import "../styles/globals.css";
import { FaLink } from "react-icons/fa6";

export const metadata = {
  title: "TinyLink",
  description: "TinyLink URL shortener",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-screen flex flex-col">
        <header className="gradient-bg text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <FaLink />
                <h1 className="text-2xl font-bold">TinyLink</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-5xl mx-auto px-4 py-6 w-full">
          {children}
        </main>

        <footer className="bg-gray-800 text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <div className="flex items-center space-x-2">
                  <FaLink />
                  <span className="font-bold text-lg">TinyLink</span>
                </div>
                <p className="text-gray-400 mt-2">
                  Shorten your URLs with ease
                </p>
              </div>
              <div className="text-gray-400">
                <p>&copy; 2025 TinyLink. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
