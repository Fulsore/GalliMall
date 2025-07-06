// 'use client';
// import React from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { addToCart } from '../Redux/Slice/cartSlice';

// const AddToCartButton = ({ productId, quantity }) => {
//   const dispatch = useDispatch();

//   const { cart_code } = useSelector((state) => state.cart);
//   const token = useSelector((state) => state.auth?.token);

//   const handleAdd = () => {
//     dispatch(
//       addToCart({
//         productId,
//         quantity,
//         cart_code,
//         token,
//       })
//     );
//   };

//   return (
//     <button
//       onClick={handleAdd}
//       className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//     >
//       Add to Cart
//     </button>
//   );
// };

// export default AddToCartButton;
