'use client';

import { useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/contact-messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to send message. Try again later.');
      setSubmitted(true);
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
      {/* Hero Section */}
      <section className="text-center px-6 py-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Get in Touch with GalliMall</h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl">
          Whether you're a vendor, customer, or just curious — we're here to help.
        </p>
      </section>

      {/* Contact Form & Info */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <h2 className="text-2xl font-semibold text-blue-600 mb-6">Send Us a Message</h2>

          {submitted && (
            <p className="text-green-600 font-medium mb-4">
              ✅ Message sent successfully! We'll get back to you soon.
            </p>
          )}

          {error && (
            <p className="text-red-600 font-medium mb-4">
              ❌ {error}
            </p>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block font-medium">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block font-medium">Message</label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Type your message here..."
                value={form.message}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-blue-600">Contact Information</h2>
          <div className="text-base space-y-3">
            <p><strong>Email:</strong> fulsoreanilkumar@gmail.com</p>
            <p><strong>Phone:</strong> +91 9392034144</p>
            <p><strong>Address:</strong> GalliMall, Bharath Nagar Colony - E.W.S - 752</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Business Hours</h3>
            <p>Mon – Sat: 9:00 AM to 9:00 PM</p>
            <p>Sun: timings may differ</p>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-2">Follow Us</h3>
            <div className="flex gap-4 text-blue-500">
              <a href="https://www.instagram.com/fulsore00/" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://github.com/fulsore/" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://linkedin.com/in/fulsoreanilkumar/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
