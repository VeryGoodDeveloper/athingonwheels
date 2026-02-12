import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      {/* Minimal Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-tight text-gray-400 hover:text-white transition-colors">
            ATOW
          </Link>
        </nav>
      </header>

      {/* Full Screen Centered Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-4xl w-full text-center">
          
          {/* Minimalist Icon/Visual - "A Thing" */}
          <div className="mb-12 flex justify-center">
            <div className="relative">
              {/* Abstract geometric "thing on wheels" */}
              <div className="w-32 h-32 relative">
                {/* The "thing" - abstract rounded rectangle */}
                <div className="absolute inset-x-4 top-2 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl border border-gray-600/30"></div>
                {/* The "wheels" - two circles */}
                <div className="absolute bottom-0 left-6 w-10 h-10 bg-gray-800 rounded-full border-4 border-gray-700"></div>
                <div className="absolute bottom-0 right-6 w-10 h-10 bg-gray-800 rounded-full border-4 border-gray-700"></div>
              </div>
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-gray-100">
            A Thing On Wheels
          </h1>
          
          {/* Simple Tagline */}
          <p className="text-lg md:text-xl text-gray-500 mb-16 font-light">
            Buy or sell. Simple as that.
          </p>

          {/* Two Prominent CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            
            {/* Buy Button */}
            <Link 
              href="/shop"
              className="group w-full sm:w-80 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-8 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-900/50"
            >
              <div className="text-3xl font-bold mb-2 text-white">Buy</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Browse inventory
              </div>
            </Link>

            {/* Sell Button */}
            <Link 
              href="/sell"
              className="group w-full sm:w-80 bg-gradient-to-br from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 border border-gray-700/50 hover:border-gray-600 rounded-2xl p-8 transition-all duration-200 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-gray-900/50"
            >
              <div className="text-3xl font-bold mb-2 text-white">Sell</div>
              <div className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                Get your best offer
              </div>
            </Link>

          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>&copy; 2026 ATOW</p>
      </footer>
    </div>
  );
}
