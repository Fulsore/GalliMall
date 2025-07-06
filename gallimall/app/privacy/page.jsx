'use client';

const PrivacyPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-gray-800 dark:text-gray-200">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-600 mb-6 text-center">
        Privacy Policy
      </h1>
      <p className="mb-8 text-lg text-center">
        This Privacy Policy describes how GalliMall collects, uses, and protects your personal information when you use our services.
      </p>

      {/* Section 1 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li><strong>Personal Information:</strong> Name, phone number, email, and address when you register or place an order.</li>
          <li><strong>Location Data:</strong> To show nearby shops and services.</li>
          <li><strong>Device & Usage Info:</strong> Browser type, IP address, and interaction with our app and website.</li>
        </ul>
      </section>

      {/* Section 2 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>To facilitate shop browsing, order placement, and delivery.</li>
          <li>To personalize user experience and improve our services.</li>
          <li>To communicate updates, promotions, or respond to inquiries.</li>
          <li>To prevent fraud, enforce terms, and maintain platform security.</li>
        </ul>
      </section>

      {/* Section 3 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">3. Sharing Your Information</h2>
        <p>
          We do not sell your personal data. We may share your data with trusted vendors (for order fulfillment), payment processors, or government agencies (if required by law).
        </p>
      </section>

      {/* Section 4 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <p>
          GalliMall uses secure servers, encryption, and access controls to protect your data. However, no method of internet transmission is 100% secure.
        </p>
      </section>

      {/* Section 5 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">5. Cookies & Tracking</h2>
        <p>
          We use cookies and similar technologies to enhance your experience, analyze usage, and show relevant ads. You can control cookies through your browser settings.
        </p>
      </section>

      {/* Section 6 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">6. Your Rights</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Access and review your data at any time.</li>
          <li>Request corrections or deletion of your account information.</li>
          <li>Opt-out of non-essential communication.</li>
        </ul>
      </section>

      {/* Section 7 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">7. Children’s Privacy</h2>
        <p>
          GalliMall is not intended for children under 13. We do not knowingly collect personal data from minors.
        </p>
      </section>

      {/* Section 8 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Users will be notified via email or platform banner when material changes are made.
        </p>
      </section>

      {/* Section 9 */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">9. Contact Us</h2>
        <p>
          For any questions or concerns about this Privacy Policy, please contact us at <strong>privacy@gallimall.com</strong>.
        </p>
      </section>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-10">
        &copy; {new Date().getFullYear()} GalliMall. All rights reserved.
      </div>
    </div>
  );
};

export default PrivacyPage;
