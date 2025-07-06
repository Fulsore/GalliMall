'use client';

const TermsPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 text-center">
        Terms & Conditions
      </h1>
      <p className="mb-8 text-lg text-center">
        Please read these Terms and Conditions carefully before using the GalliMall application.
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the GalliMall website, mobile app, or services, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use our platform.
        </p>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">2. About GalliMall</h2>
        <p>
          GalliMall is a hyperlocal e-commerce platform that connects customers with nearby vendors, enabling digital storefronts, real-time product availability, order management, and secure payments.
        </p>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">3. User Responsibilities</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>You agree to provide accurate account information.</li>
          <li>You will not use the platform for illegal or unauthorized purposes.</li>
          <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
        </ul>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">4. Vendor Guidelines</h2>
        <p>
          Vendors must provide true, updated information about their products, pricing, and availability. GalliMall reserves the right to suspend vendors who violate these standards or engage in fraudulent behavior.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">5. Payments & Transactions</h2>
        <p>
          All transactions made through GalliMall are processed via secure payment gateways. GalliMall does not store your payment information. Refund and cancellation policies depend on the vendor's return terms.
        </p>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">6. Privacy Policy</h2>
        <p>
          Your use of the GalliMall platform is also governed by our Privacy Policy. We take your data seriously and ensure responsible use and protection of your information.
        </p>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">7. Limitation of Liability</h2>
        <p>
          GalliMall is not liable for any indirect or consequential damages arising from your use of the platform, including vendor misconduct, service interruptions, or delivery issues.
        </p>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">8. Modifications to Terms</h2>
        <p>
          GalliMall reserves the right to update these Terms at any time. Continued use of the platform following changes means you accept the updated Terms.
        </p>
      </section>

      {/* Section 9 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">9. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please contact us at <strong>support@gallimall.com</strong>.
        </p>
      </section>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-10">
        &copy; {new Date().getFullYear()} GalliMall. All rights reserved.
      </div>
    </div>
  );
};

export default TermsPage;
