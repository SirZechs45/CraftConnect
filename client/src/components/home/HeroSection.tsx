import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-indigo-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 leading-tight">
              Discover Unique <span className="text-primary">Handicrafts</span> from Around the World
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Browse thousands of handmade products created by passionate artisans. Support small businesses and find treasures that tell a story.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors text-center">
                Shop Now
              </Link>
              <Link href="/register?role=seller" className="px-6 py-3 bg-white text-primary font-medium rounded-lg shadow border border-primary hover:bg-gray-50 transition-colors text-center">
                Become a Seller
              </Link>
            </div>
            <div className="mt-6 flex items-center text-sm text-gray-500 flex-wrap">
              <span className="flex items-center mr-3">
                <i className="fas fa-shield-alt mr-2 text-primary"></i> Secure payments
              </span>
              <span className="mx-3 hidden sm:inline">•</span>
              <span className="flex items-center mr-3">
                <i className="fas fa-truck mr-2 text-primary"></i> Global shipping
              </span>
              <span className="mx-3 hidden sm:inline">•</span>
              <span className="flex items-center">
                <i className="fas fa-undo mr-2 text-primary"></i> Easy returns
              </span>
            </div>
          </div>
          <div className="hidden md:block relative">
            <div className="absolute -left-6 -top-6 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <div className="rounded-lg shadow-lg h-40 w-full overflow-hidden">
                  <svg viewBox="0 0 500 400" className="w-full h-full bg-gray-200">
                    <rect width="100%" height="100%" fill="#f3f4f6" />
                    <text x="50%" y="50%" fontFamily="sans-serif" fontSize="24" fill="#9ca3af" textAnchor="middle">Handcrafted pottery</text>
                  </svg>
                </div>
                <div className="rounded-lg shadow-lg h-56 w-full overflow-hidden">
                  <svg viewBox="0 0 500 560" className="w-full h-full bg-gray-200">
                    <rect width="100%" height="100%" fill="#f3f4f6" />
                    <text x="50%" y="50%" fontFamily="sans-serif" fontSize="24" fill="#9ca3af" textAnchor="middle">Handmade jewelry</text>
                  </svg>
                </div>
              </div>
              <div className="space-y-4 mt-10">
                <div className="rounded-lg shadow-lg h-56 w-full overflow-hidden">
                  <svg viewBox="0 0 500 560" className="w-full h-full bg-gray-200">
                    <rect width="100%" height="100%" fill="#f3f4f6" />
                    <text x="50%" y="50%" fontFamily="sans-serif" fontSize="24" fill="#9ca3af" textAnchor="middle">Weaved basket</text>
                  </svg>
                </div>
                <div className="rounded-lg shadow-lg h-40 w-full overflow-hidden">
                  <svg viewBox="0 0 500 400" className="w-full h-full bg-gray-200">
                    <rect width="100%" height="100%" fill="#f3f4f6" />
                    <text x="50%" y="50%" fontFamily="sans-serif" fontSize="24" fill="#9ca3af" textAnchor="middle">Hand-painted art</text>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
