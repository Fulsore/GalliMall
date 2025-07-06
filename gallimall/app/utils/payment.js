// utils/payment.js

export const handlePayment = async ({ order_id, razorpay_key, amount, name, description }) => {
  const loadRazorpayScript = () =>
    new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });

  try {
    await loadRazorpayScript();
  } catch (err) {
    console.error('Razorpay SDK load failed:', err);
    alert('Failed to load payment gateway. Please try again later.');
    return;
  }

  const token = localStorage.getItem('access_token'); // Correct token key

  const options = {
    key: razorpay_key,
    amount: amount * 100, // Razorpay expects amount in paisa
    currency: 'INR',
    name: name || 'Fulsore Store',
    description,
    image: '/logo.png',
    order_id,
    handler: async function (response) {
      try {
        const verifyResponse = await fetch('http://127.0.0.1:8000/api/verify_payment/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }), // Add token only if it exists
          },
          body: JSON.stringify(response),
        });

        const verifyData = await verifyResponse.json();

        if (verifyResponse.ok) {
          alert('✅ Payment Successful!');
        } else {
          console.error('Verification failed:', verifyData);
          alert('❌ Payment Failed: ' + (verifyData.detail || 'Unknown error'));
        }
      } catch (err) {
        console.error('Payment verification error:', err);
        alert('❌ Payment verification failed. Please try again.');
      }
    },
    prefill: {
      name: 'Anil',
      email: 'customer@example.com',
      contact: '9999999999',
    },
    theme: {
      color: '#f97316',
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};
