export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            J&S AutoHaus Group
          </h1>
          <p className="text-xl text-gray-300">Built to Impress</p>
        </header>

        <main className="max-w-4xl mx-auto">
          <section className="mb-16 text-center">
            <p className="text-lg text-gray-300 leading-relaxed">
              Welcome to J&S AutoHaus, where every ride is handpicked for style, power, and performance. 
              Whether you're buying, selling, or servicing, we're here to make your journey fast, easy, and unforgettable.
            </p>
          </section>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-blue-500 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-blue-400">Buy</h2>
              <p className="text-gray-300">
                Handpicked vehicles for style, power, and performance. Find your perfect ride today.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-purple-400">Sell</h2>
              <p className="text-gray-300">
                Get top cash offers for your car. Quick, easy, and hassle-free. We handle the paperwork.
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-green-500 transition-all">
              <h2 className="text-2xl font-bold mb-4 text-green-400">Service</h2>
              <p className="text-gray-300">
                Premier service, unmatched care. Expert repairs and maintenance to keep you on the road.
              </p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all transform hover:scale-105">
              Get Started
            </button>
          </div>
        </main>

        <footer className="mt-20 text-center text-gray-500 text-sm">
          <p>&copy; 2026 J&S AutoHaus Group. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
