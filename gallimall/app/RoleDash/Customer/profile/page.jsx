// 'use client';

// import { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { updateCustomerProfile } from '../../../Redux/Slice/customerSlice';
// import { useRouter } from 'next/navigation';

// export default function EditProfilePage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { customer, loading, error } = useSelector((state) => state.customer);

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     pin: '',
//   });

//   useEffect(() => {
//     if (customer) {
//       setFormData({
//         name: customer.name || '',
//         email: customer.email || '',
//         phone: customer.phone || '',
//         address: customer.address || '',
//         pin: customer.pin || '',
//       });
//     }
//   }, [customer]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await dispatch(updateCustomerProfile(formData));
//     router.push('/customer/dashboard');
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl border border-gray-200">
//       <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Edit Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-5">
//         {['name', 'email', 'phone', 'address', 'pin'].map((field) => (
//           <div key={field}>
//             <label htmlFor={field} className="block text-sm font-medium text-gray-700 capitalize">
//               {field}
//             </label>
//             <input
//               type={field === 'email' ? 'email' : 'text'}
//               id={field}
//               name={field}
//               value={formData[field]}
//               onChange={handleChange}
//               className="mt-1 block w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 text-gray-800"
//               required
//             />
//           </div>
//         ))}
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow transition duration-200"
//         >
//           {loading ? 'Updating...' : 'Update Profile'}
//         </button>
//       </form>
//     </div>
//   );
// }
