import { useRouter } from 'next/navigation';

const FloatingCartBar = ({ quantities, products }) => {
  const router = useRouter();

  const selectedItems = products.filter(p => quantities[p.id]);
  const totalItems = selectedItems.reduce((sum, item) => sum + quantities[item.id], 0);
  const totalPrice = selectedItems.reduce((sum, item) => sum + item.price * quantities[item.id], 0);

  if (totalItems === 0) return null;

  const handleViewCart = () => {
    localStorage.setItem('cartItems', JSON.stringify(selectedItems));
    localStorage.setItem('cartQuantities', JSON.stringify(quantities));
    localStorage.setItem('cartTotal', JSON.stringify(totalPrice));
    router.push('/cart');
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[90%] max-w-md bg-white border border-gray-300 shadow-xl rounded-full px-5 py-3 flex justify-between items-center animate-slideUp">
      <div>
        <p className="text-sm font-medium text-gray-800">
          🛒 {totalItems} item(s) | ₹{totalPrice.toFixed(2)}
        </p>
        <p className="text-xs text-gray-500">Extra charges may apply</p>
      </div>
      <button
        onClick={handleViewCart}
        className="bg-blue-600 text-white text-sm px-4 py-2 rounded-full hover:bg-blue-700 transition"
      >
        View Cart
      </button>
    </div>
  );
};

export default FloatingCartBar;
