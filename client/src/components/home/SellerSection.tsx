import { Link } from "wouter";

const SellerSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-800">Start Selling Your Handicrafts</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of artisans who have turned their passion into a thriving business. Our platform makes it easy to reach customers around the world.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-primary/10 rounded-full p-2">
                    <i className="fas fa-check text-primary"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Easy to Get Started</h3>
                  <p className="text-gray-600">Create your shop in minutes and start listing your products right away.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-primary/10 rounded-full p-2">
                    <i className="fas fa-check text-primary"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Global Reach</h3>
                  <p className="text-gray-600">Connect with customers from around the world interested in your crafts.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-primary/10 rounded-full p-2">
                    <i className="fas fa-check text-primary"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Secure Payments</h3>
                  <p className="text-gray-600">Receive payments securely with our integrated payment system.</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Link 
                href="/register?role=seller" 
                className="px-6 py-3 bg-primary text-white font-medium rounded-lg shadow hover:bg-indigo-700 transition-colors inline-block"
              >
                Become a Seller
              </Link>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:col-start-2">
            <div className="relative">
              <div className="absolute -left-6 -top-6 w-28 h-28 bg-secondary/20 rounded-full blur-xl"></div>
              <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-primary/10 rounded-full blur-xl"></div>
              <div className="rounded-lg shadow-lg relative z-10 overflow-hidden">
                <svg viewBox="0 0 1000 600" className="w-full h-full bg-gray-200">
                  <rect width="100%" height="100%" fill="#f3f4f6" />
                  <text x="50%" y="50%" fontFamily="sans-serif" fontSize="32" fill="#9ca3af" textAnchor="middle">Artisan working on crafts</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerSection;
