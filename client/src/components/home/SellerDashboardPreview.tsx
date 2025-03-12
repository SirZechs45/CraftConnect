const SellerDashboardPreview = () => {
  return (
    <section className="py-12 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <h2 className="text-3xl font-display font-bold text-gray-800">Powerful Tools for Sellers</h2>
            <p className="mt-4 text-lg text-gray-600">
              Our seller dashboard gives you everything you need to manage your products, track orders, and grow your business.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-full p-1 bg-primary text-white">
                    <i className="fas fa-chart-line"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Analytics Dashboard</h3>
                  <p className="text-gray-600">Track your sales, views, and customer engagement with detailed analytics.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-full p-1 bg-primary text-white">
                    <i className="fas fa-box-open"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Inventory Management</h3>
                  <p className="text-gray-600">Easily update your product listings, prices, and stock levels.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-full p-1 bg-primary text-white">
                    <i className="fas fa-money-bill-wave"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Order Processing</h3>
                  <p className="text-gray-600">Manage orders, update shipping status, and communicate with buyers.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="rounded-full p-1 bg-primary text-white">
                    <i className="fas fa-tag"></i>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-800">Bulk Order Options</h3>
                  <p className="text-gray-600">Set special pricing and terms for wholesale buyers and large orders.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 lg:mt-0">
            <div className="relative lg:ml-10">
              <div className="rounded-xl bg-white shadow-xl overflow-hidden border border-gray-200">
                <div className="p-4 bg-gray-800 text-white flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 font-medium">Seller Dashboard</div>
                </div>
                
                <div className="bg-gray-50 p-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Sales Today</h3>
                        <i className="fas fa-shopping-cart text-primary"></i>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">$234</p>
                      <span className="text-xs text-green-500 flex items-center">
                        <i className="fas fa-arrow-up mr-1"></i> 12% from yesterday
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-500">New Orders</h3>
                        <i className="fas fa-box text-primary"></i>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">8</p>
                      <span className="text-xs text-green-500 flex items-center">
                        <i className="fas fa-arrow-up mr-1"></i> 3 more than yesterday
                      </span>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-sm font-medium text-gray-500">Visitors</h3>
                        <i className="fas fa-users text-primary"></i>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">143</p>
                      <span className="text-xs text-green-500 flex items-center">
                        <i className="fas fa-arrow-up mr-1"></i> 24% increase
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-gray-800">Recent Orders</h3>
                      <a href="#" className="text-xs text-primary">View All</a>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                            <i className="fas fa-shopping-bag text-gray-400"></i>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">Handmade Earrings</div>
                            <div className="text-xs text-gray-500">Order #5782 - John Smith</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-800">$48.99</div>
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Processing</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                            <i className="fas fa-shopping-bag text-gray-400"></i>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">Painted Canvas</div>
                            <div className="text-xs text-gray-500">Order #5781 - Amanda Lee</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-800">$129.00</div>
                          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Shipped</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-gray-200 flex items-center justify-center">
                            <i className="fas fa-shopping-bag text-gray-400"></i>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-800">Ceramic Bowl Set</div>
                            <div className="text-xs text-gray-500">Order #5780 - Michael Wong</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-800">$89.50</div>
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">New</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerDashboardPreview;
