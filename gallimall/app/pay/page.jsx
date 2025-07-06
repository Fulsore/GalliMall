// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import axios from 'axios';
// import { LoaderCircle } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../../Redux/Slice/cartSlice';
// import { createOrder, verifyPayment } from '../../Redux/Slice/orderSlice';
// import { useFavourite } from '../../hooks/useFavourite';

// const ProductPage = () => {
//   const { productId } = useParams();
//   const dispatch = useDispatch();
//   const { addToFavourite } = useFavourite();

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const cartStatus = useSelector((state) => state.cart.status);
//   const cartError = useSelector((state) => state.cart.error);

//   const orderLoading = useSelector((state) => state.order.loading);
//   const orderError = useSelector((state) => state.order.error);

//   const checkLogin = () => {
//     const token = localStorage.getItem('access_token');
//     setIsLoggedIn(!!token);
//   };

//   useEffect(() => {
//     checkLogin();
//     window.addEventListener('storage', checkLogin);
//     const intervalId = setInterval(checkLogin, 2000);
//     return () => {
//       window.removeEventListener('storage', checkLogin);
//       clearInterval(intervalId);
//     };
//   }, []);

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) return resolve(true);
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   useEffect(() => {
//     if (!productId) return;
//     setLoading(true);
//     setFetchError(null);
//     axios
//       .get(`http://127.0.0.1:8000/api/product/${productId}/`)
//       .then((res) => setProduct(res.data))
//       .catch(() => setFetchError('Failed to fetch product details'))
//       .finally(() => setLoading(false));
//   }, [productId]);

// const handleAddToCart = () => {
//   if (!product) return;

//   const token = localStorage.getItem('access_token');
//   let cart_code = null;

//   if (!token) {
//     const cart = localStorage.getItem('cart');
//     if (cart) {
//       try {
//         const parsedCart = JSON.parse(cart);
//         cart_code = parsedCart.cart_code || null;
//       } catch (e) {
//         console.warn('⚠️ Failed to parse local cart:', e);
//       }
//     }
//   }

//   dispatch(addToCart({
//     productId: product.id,
//     quantity: 1,
//     token,
//     cart_code,
//   }));
// };



//   const razor_payment = async () => {
//     if (!product) return;
//     const scriptLoaded = await loadRazorpayScript();
//     if (!scriptLoaded) return alert('Razorpay SDK failed to load');

//     try {
//       const action = await dispatch(createOrder(product.id));
//       if (createOrder.fulfilled.match(action)) {
//         const order = action.payload;

//         const options = {
//           key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//           amount: order.amount * 100,
//           currency: 'INR',
//           name: 'Galli Mall',
//           description: `Payment for ${order.product}`,
//           order_id: order.order_id,
//           handler: function (response) {
//             const paymentData = {
//               razorpay_order_id: response.razorpay_order_id,
//               razorpay_payment_id: response.razorpay_payment_id,
//               razorpay_signature: response.razorpay_signature,
//             };
//             dispatch(verifyPayment(paymentData));
//           },
//           prefill: {
//             name: 'Customer Name',
//             email: 'customer@example.com',
//             contact: '9999999999',
//           },
//           notes: {
//             address: 'Customer Address',
//           },
//           theme: {
//             color: '#F37254',
//           },
//         };

//         const rzp = new window.Razorpay(options);
//         rzp.open();
//       } else {
//         console.error('Order creation failed:', action.error.message);
//       }
//     } catch (error) {
//       console.error('Error in razor_payment:', error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <LoaderCircle className="w-10 h-10 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (fetchError || !product) {
//     return <div className="text-red-500 text-center mt-10">{fetchError || 'Product not found'}</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-10">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start bg-white shadow-md rounded-2xl p-6">
//         {/* Product Images */}
//         <div className="w-full flex flex-col items-center lg:items-start">
//           <img
//             src={`http://127.0.0.1:8000${product.image}`}
//             alt={product.name}
//             className="w-full max-w-md h-auto rounded-2xl shadow-sm object-cover"
//           />
//           <div className="flex gap-2 mt-4">
//             {product.images?.map((img, i) => (
//               <img
//                 key={i}
//                 src={`http://127.0.0.1:8000${img}`}
//                 alt={`Preview ${i + 1}`}
//                 className="w-16 h-16 rounded border hover:shadow"
//               />
//             ))}
//           </div>
//         </div>

//         {/* Product Info */}
//         <div className="flex flex-col gap-4">
//           <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
//           <p className="text-gray-600 text-lg">{product.description}</p>
//           <p className="text-3xl font-semibold text-green-600">₹{product.price}</p>

//           <div className="flex gap-4 mt-2">
//             <button
//               onClick={handleAddToCart}
//               className="bg-primary text-white text-sm px-6 py-3 rounded-xl shadow hover:bg-primary/90 transition-all duration-200 active:scale-95"
//               disabled={cartStatus === 'loading'}
//             >
//               {cartStatus === 'loading' ? 'Adding...' : '🛒 Add to Cart'}
//             </button>
//             <button
//               onClick={() => addToFavourite(product)}
//               className="bg-gray-100 text-sm px-6 py-3 rounded-xl shadow hover:bg-red-100 transition-all duration-200 active:scale-95"
//             >
//               ❤️ Favourite
//             </button>
//           </div>

//           {cartError && <div className="text-red-600 mt-2 text-sm font-semibold">{cartError}</div>}
//           {orderError && (
//             <div className="text-red-600 mt-2 text-sm font-semibold">
//               {typeof orderError === 'string' ? orderError : orderError.detail || JSON.stringify(orderError)}
//             </div>
//           )}

//           <div className={`mt-4 font-semibold ${isLoggedIn ? 'text-green-700' : 'text-red-600'}`}>
//             {isLoggedIn ? 'You are logged in' : 'You are not logged in'}
//           </div>

//           <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mt-6 rounded-xl shadow-sm">
//             <p className="text-orange-800 text-sm">
//               🎁 <strong>Use code <span className="text-orange-900">SAVE10</span></strong> to get 10% off on your first order!
//             </p>
//           </div>

//           <div className="mt-6 text-sm text-gray-600">
//             <p>🚚 Delivery in <strong>10 - 20 minutes</strong></p>
//             <p className="mt-1">📦 Free delivery on orders above ₹199</p>

//             <div className="mt-4">
//               <button
//                 className="w-full lg:w-72 bg-red-600 text-white text-lg font-semibold px-8 py-4 rounded-2xl shadow-lg hover:bg-red-700 transition-all duration-200 active:scale-95"
//                 onClick={razor_payment}
//                 disabled={orderLoading || !isLoggedIn}
//                 title={!isLoggedIn ? 'Please login to buy' : ''}
//               >
//                 {orderLoading ? 'Processing...' : '🔥 Buy Now - Instant Checkout'}
//               </button>
//             </div>
//           </div>
//         </div>
//       {/* </div> */}
//     </div>
//   );
// };

// export default ProductPage;
