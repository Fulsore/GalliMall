// 'use client';

// import React, { useState } from 'react';
// import { MessageSquare, X } from 'lucide-react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addUserMessage, sendMessageToBot } from '../Redux/Slice/chatbotSlice';

// const categories = {
//   Customer: {
//     Order: [
//       { question: 'What is the average delivery time?', answer: 'Orders are usually delivered within 1-2 hours depending on your location.' },
//       { question: 'Can I cancel my order?', answer: 'Yes, you can cancel your order from the order history page before it is confirmed by the vendor.' }
//     ],
    
//     Payment: [
//       { question: 'How can I pay?', answer: 'You can pay via Razorpay, UPI, or Cash on Delivery.' }
//     ],
//     Profile: [
//       { question: 'How do I check my profile?', answer: 'Go to the "My Profile" section in the bottom tab.' }
//     ]
//   },
//   Vendor: {
//     Store: [
//       { question: 'How do I manage my store?', answer: 'Use the Vendor Dashboard to update your products and status.' }
//     ],
//     Orders: [
//       { question: 'How to see my orders?', answer: 'Vendor orders appear in your Dashboard under the "Orders" tab.' }
//     ]
//   },
//   GalliMall: {
//     General: [
//       { question: 'What is Galli Mall?', answer: 'Galli Mall is a hyperlocal marketplace for same-day delivery from nearby stores.' },
//       { question: 'Who is the founder?', answer: 'The founder and CEO is Anil, with developers Ramu and team building the platform.' }
//     ]
//   }
// };

// const Chatbot = () => {
//   const [open, setOpen] = useState(false);
//   const [input, setInput] = useState('');
//   const [category, setCategory] = useState('');
//   const [subCategory, setSubCategory] = useState('');

//   const dispatch = useDispatch();
//   const { messages, loading } = useSelector((state) => state.chatbot);

// const handleSend = (text = input) => {

//   const trimmed = text.trim();

//   if (!trimmed) return;

//   dispatch(addUserMessage(trimmed));

//   dispatch(sendMessageToBot(trimmed));

//   setInput('');
// };

//   const subCategories = category ? Object.keys(categories[category]) : [];
//   const questions = category && subCategory ? categories[category][subCategory] : [];

//   return (
//     <div className="fixed bottom-24 right-6 z-50">
//       {open ? (
//         <div className="bg-white w-80 shadow-xl rounded-xl p-4 border border-gray-200">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-lg font-bold text-gray-800">AI Assistant</h2>
//             <button onClick={() => setOpen(false)}>
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>

//           <div className="space-y-2 mb-3">
//             <select
//               className="w-full border text-sm px-2 py-1 rounded"
//               value={category}
//               onChange={(e) => {
//                 setCategory(e.target.value);
//                 setSubCategory('');
//               }}
//             >
//               <option value="">Select Category</option>
//               {Object.keys(categories).map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat}
//                 </option>
//               ))}
//             </select>

//             {subCategories.length > 0 && (
//               <select
//                 className="w-full border text-sm px-2 py-1 rounded"
//                 value={subCategory}
//                 onChange={(e) => setSubCategory(e.target.value)}
//               >
//                 <option value="">Select Subcategory</option>
//                 {subCategories.map((sub) => (
//                   <option key={sub} value={sub}>
//                     {sub}
//                   </option>
//                 ))}
//               </select>
//             )}

//             {questions.length > 0 && (
//               <div className="flex flex-wrap gap-2">
//                 {questions.map((item, idx) => (
//                   <button
//                     key={idx}
//                     onClick={() => handleSend(item.question)}
//                     className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full hover:bg-gray-200"
//                   >
//                     {item.question}
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="h-56 overflow-y-auto space-y-2 mb-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
//             {messages.map((msg, index) => (
//               <div
//                 key={index}
//                 className={`px-3 py-2 rounded-lg text-sm max-w-[85%] ${
//                   msg.sender === 'bot'
//                     ? 'bg-gray-100 text-left'
//                     : 'bg-blue-100 self-end text-right ml-auto'
//                 }`}
//               >
//                 {msg.text}
//               </div>
//             ))}
//             {loading && <div className="text-sm text-gray-500">Typing...</div>}
//           </div>

//           <div className="flex gap-2">
//             <input
//               type="text"
//               className="flex-1 border border-gray-300 px-3 py-2 rounded-md text-sm focus:outline-none"
//               placeholder="Type your message..."
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             />
//             <button
//               onClick={() => handleSend()}
//               className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm hover:bg-blue-700"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => setOpen(true)}
//           className="bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-blue-700"
//         >
//           <MessageSquare className="w-6 h-6" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Chatbot;
