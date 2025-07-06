'use client';

const AboutPage = () => {
  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      {/* Hero Section */}
      <section className="text-center px-4 py-16 sm:px-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-blue-600 mb-4">Welcome to GalliMall</h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
          Your trusted hyperlocal marketplace designed to connect customers with nearby vendors, transforming the way local commerce works.
        </p>
      </section>

      {/* Vision Section */}
      <section className="bg-gray-100 dark:bg-gray-800 px-4 sm:px-8 py-12">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-10 items-center">
          <img
            src="/images/journey1.jpg"
            alt="Our Vision"
            className="rounded-lg shadow-md w-full object-cover h-72 sm:h-80"
          />
          <div>
            <h2 className="text-2xl font-bold mb-4 text-blue-600">Our Vision</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg">
              At GalliMall, we envision a world where small vendors thrive by harnessing the power of digital reach.
              We bridge the gap between local sellers and modern consumers with real-time product access, doorstep delivery, and seamless digital payments.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-10">What Makes GalliMall Unique?</h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-blue-500">Hyperlocal Shopping</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Connect with nearby shops for real-time product availability and quick delivery.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-blue-500">Digital Storefronts</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Every vendor gets a customizable online presence to showcase their products and manage orders.
              </p>
            </div>
            <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-blue-500">Secure Payments</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                Integrated payment gateways ensure fast, secure transactions between buyers and vendors.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-gray-100 dark:bg-gray-800 px-4 sm:px-8 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Meet the Team</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-10">
            Our passionate minds behind GalliMall, working hard to revolutionize local commerce.
          </p>
          <div className="grid sm:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-xl font-semibold text-blue-500">Anil</h3>
              <p className="text-gray-600 dark:text-gray-300">Founder & CEO</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-500">Ramu</h3>
              <p className="text-gray-600 dark:text-gray-300">Co-founder & Lead Developer</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-blue-500">Team GalliMall</h3>
              <p className="text-gray-600 dark:text-gray-300">Designers, Engineers & Growth Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Media Section */}
      <section className="px-4 sm:px-8 py-16">
        <div className="max-w-6xl mx-auto grid sm:grid-cols-3 gap-6">
          <img
            src="/images/journey2.jpg"
            alt="Vendor Onboarding"
            className="w-full h-60 object-cover rounded-lg shadow"
          />
          <img
            src="/images/journey1.jpg"
            alt="Tech at work"
            className="w-full h-60 object-cover rounded-lg shadow"
          />
          <video controls className="w-full h-60 object-cover rounded-lg shadow">
            <source src="/videos/gallimall-intro.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
