import { Link } from "wouter";

const CTASection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold">Ready to Join Our Creative Community?</h2>
        <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto opacity-90">
          Start buying or selling unique handcrafted items today. It takes just a few minutes to get started.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/register" 
            className="px-8 py-3 bg-white text-primary font-medium rounded-lg shadow hover:bg-gray-100 transition-colors text-center"
          >
            Create an Account
          </Link>
          <Link 
            href="/products" 
            className="px-8 py-3 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white/10 transition-colors text-center"
          >
            Browse Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
