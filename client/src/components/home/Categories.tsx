import { Link } from "wouter";

const categories = [
  { name: "Art & Paintings", icon: "fas fa-paint-brush", href: "/products?category=Art and Paintings" },
  { name: "Jewelry", icon: "fas fa-gem", href: "/products?category=Jewelry" },
  { name: "Clothing", icon: "fas fa-tshirt", href: "/products?category=Clothing" },
  { name: "Home Decor", icon: "fas fa-home", href: "/products?category=Home Decor" },
  { name: "Gifts", icon: "fas fa-gift", href: "/products?category=Gifts" },
  { name: "More", icon: "fas fa-ellipsis-h", href: "/products" },
];

const Categories = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-gray-800">Shop by Category</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Discover amazing handcrafted items organized by category</p>
        </div>
        
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <Link key={index} href={category.href} className="group">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
                  <i className={`${category.icon} text-2xl text-primary`}></i>
                </div>
                <span className="text-gray-800 font-medium">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
