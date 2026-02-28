// import React, { useState, useEffect } from "react";
// import { useCart } from "../../contexts/Cartcontext";
// import Navbar from "../../Components/Navbar";
// import Footer from "../../Components/Footer";
// import { Trash2, ShoppingCart } from "lucide-react";
// import { Link } from "react-router-dom";
// import { getProducts } from "../../api.js";

// export default function Wishlist() {
//   const { wishlist, removeFromWishlist, addToCart } = useCart();
//   const [products, setProducts] = useState([]);
//   const isLoggedIn = localStorage.getItem("isLoggedIn");

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await getProducts();
//         setProducts(response.data);
//       } catch (error) {
//         console.error('Error fetching products:', error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   const wishlistProducts = products.filter(product =>
//     wishlist.some(item => item.productId === product.id)
//   );

//   if (!isLoggedIn) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
//         <Navbar />
//         <div className="pt-16 flex items-center justify-center min-h-[80vh]">
//           <div className="text-center">
//             <h2 className="text-3xl font-bold text-[#00FFFF] mb-4">
//               Access Denied
//             </h2>
//             <p className="text-gray-300 mb-6">
//               Please log in to view your wishlist.
//             </p>
//             <a
//               href="/login"
//               className="bg-[#00FFFF] text-black px-6 py-3 rounded-md font-semibold hover:bg-cyan-400 transition"
//             >
//               Login
//             </a>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
//       <Navbar />

//       <main className="flex-grow py-10 px-4">
//         {wishlist.length === 0 ? (
//           <div className="max-w-4xl mx-auto text-center pt-20">
//             <h2 className="text-3xl font-semibold mb-6 text-[#00FFFF]">
//               Your Wishlist is Empty
//             </h2>
//             <p className="text-gray-400 mb-6">
//               Add some products to your wishlist!
//             </p>
//             <Link to="/products">
//               <button className="bg-[#00FFFF] text-black px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition">
//                 Continue Shopping
//               </button>
//             </Link>
//           </div>
//         ) : (
//           <div className="max-w-5xl mx-auto bg-[#111]/60 backdrop-blur-md rounded-xl p-6 shadow-lg">
//             <h1 className="text-2xl font-semibold mb-8 text-[#00FFFF]">
//               My Wishlist ({wishlist.length})
//             </h1>

//             <div className="divide-y divide-gray-700">
//               {wishlistProducts.map((product) => (
//                 <div
//                   key={product.id}
//                   className="flex items-center justify-between py-5 gap-4 hover:bg-[#1a1a1a]/60 rounded-lg transition-all"
//                 >
//                   {/* Image */}
//                   <div className="w-28 h-28 flex-shrink-0">
//                     <img
//                       src={product.image}
//                       alt={product.name}
//                       className="w-full h-full object-cover rounded-md"
//                     />
//                   </div>

//                   {/* Product Info */}
//                   <div className="flex-1 text-left">
//                     <h3 className="text-lg font-semibold text-white hover:text-[#00FFFF] transition cursor-pointer">
//                       {product.name}
//                     </h3>
//                     {product.description && (
//                       <p className="text-gray-400 text-sm mb-1 line-clamp-1">
//                         {product.description}
//                       </p>
//                     )}

//                     {/* Price & Discount */}
//                     <div className="flex items-center gap-2">
//                       <span className="text-[#00FFFF] text-xl font-bold">
//                         ₹{product.price.toFixed(2)}
//                       </span>
//                       {product.oldPrice && (
//                         <span className="text-gray-400 line-through text-sm">
//                           ₹{product.oldPrice}
//                         </span>
//                       )}
//                       {product.discount && (
//                         <span className="text-green-400 text-sm font-semibold">
//                           {product.discount}% off
//                         </span>
//                       )}
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex flex-col items-center gap-3">
//                     <button
//                       onClick={() => addToCart(product)}
//                       className="flex items-center gap-2 bg-[#00FFFF] text-black px-3 py-2 rounded-md font-semibold hover:bg-cyan-400 transition"
//                     >
//                       <ShoppingCart size={16} /> Add
//                     </button>
//                     <button
//                       onClick={() => removeFromWishlist(wishlist.find(item => item.productId === product.id).id)}
//                       className="text-gray-400 hover:text-red-500 transition"
//                       title="Remove from Wishlist"
//                     >
//                       <Trash2 size={20} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </main>

//       <Footer />
//     </div>
//   );
// }




import React, { useState, useEffect, useContext } from "react";
import Navbar from "../../Components/Navbar";
import Footer from "../../Components/Footer";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import { useCart } from "../../contexts/Cartcontext";

import { AuthContext } from "../../contexts/AuthContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist, addToCart } = useCart();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <Navbar />
        <div className="pt-16 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#00FFFF] mb-4">
              Access Denied
            </h2>
            <p className="text-gray-300 mb-6">
              Please log in to view your wishlist.
            </p>
            <a
              href="/login"
              className="bg-[#00FFFF] text-black px-6 py-3 rounded-md font-semibold hover:bg-cyan-400 transition"
            >
              Login
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navbar />

      <main className="flex-grow py-10 px-4">
        {wishlist.length === 0 ? (
          <div className="max-w-4xl mx-auto text-center pt-20">
            <h2 className="text-3xl font-semibold mb-6 text-[#00FFFF]">
              Your Wishlist is Empty
            </h2>
            <p className="text-gray-400 mb-6">
              Add some products to your wishlist!
            </p>
            <Link to="/products">
              <button className="bg-[#00FFFF] text-black px-6 py-3 rounded-lg font-semibold hover:bg-cyan-400 transition">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto bg-[#111]/60 backdrop-blur-md rounded-xl p-6 shadow-lg">
            <h1 className="text-2xl font-semibold mb-8 text-[#00FFFF]">
              My Wishlist ({wishlist.length})
            </h1>

            <div className="divide-y divide-gray-700/50">
              {wishlist.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between py-6 gap-6 hover:bg-gray-800/30 transition-all rounded-md px-2"
                >
                  {/* Left Side: Image & Text */}
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 flex-shrink-0 bg-transparent flex items-center justify-center">
                      <img
                        src={item.imageUrl || item.image || "/assets/placeholder.jpg"}
                        alt={item.productName || item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-bold text-gray-200">
                        {item.productName}
                      </h3>
                      <div className="mt-1">
                        <span className="text-[#00FFFF] text-lg font-bold">
                          ₹{item.price}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Actions */}
                  <div className="flex flex-col items-center gap-3">
                    <button
                      onClick={() => addToCart({ id: item.productId, name: item.productName })}
                      className="flex items-center justify-center gap-2 bg-[#00FFFF] text-black px-4 py-2 rounded-md font-semibold hover:bg-cyan-400 transition"
                    >
                      <ShoppingCart size={16} /> Add
                    </button>

                    <button
                      onClick={() => handleRemove(item.productId)}
                      className="text-gray-400 hover:text-red-500 transition mt-1"
                      title="Remove from Wishlist"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}