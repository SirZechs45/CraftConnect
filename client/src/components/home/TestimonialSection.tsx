const testimonials = [
  {
    name: "Amelia Thompson",
    role: "Jewelry Seller",
    rating: 5,
    comment: "Since joining ArtisanBazaar, my sales have increased by 300%. The platform makes it easy to manage my inventory and connect with customers who truly appreciate handmade jewelry.",
    avatar: ""
  },
  {
    name: "Marco Rodriguez",
    role: "Buyer",
    rating: 4.5,
    comment: "I love being able to find unique, handcrafted items that tell a story. The customer service is excellent, and I always feel good knowing I'm supporting individual artisans and small businesses.",
    avatar: ""
  },
  {
    name: "Sophia Chen",
    role: "Pottery Seller",
    rating: 5,
    comment: "As a ceramics artist, I needed a platform that understood the value of handmade goods. ArtisanBazaar has been perfect - their tools make it easy to manage my shop while I focus on creating.",
    avatar: ""
  }
];

const TestimonialSection = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-gray-800">What Our Community Says</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied creators and shoppers on our platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                  <i className="fas fa-user text-gray-400"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex text-amber-500 mb-2">
                {Array(Math.floor(testimonial.rating)).fill(0).map((_, i) => (
                  <i key={i} className="fas fa-star"></i>
                ))}
                {testimonial.rating % 1 >= 0.5 && (
                  <i className="fas fa-star-half-alt"></i>
                )}
              </div>
              <p className="text-gray-700">
                "{testimonial.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
