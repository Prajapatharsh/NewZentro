import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Search, LogOut } from "lucide-react";
import UserMenu from "../molecules/UserMenu";
import SearchBar from "../molecules/SearchBar";
import { useGetCartCountQuery } from "@/store/apis/CartApi";
import useClickOutside from "@/hooks/dom/useClickOutside";
import useEventListener from "@/hooks/dom/useEventListener";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch } from "@/store/hooks";
import { useSignOutMutation } from "@/store/apis/AuthApi";
import { logout } from "@/store/slices/AuthSlice";
import { generateUserAvatar } from "@/utils/placeholderImage";

const Navbar = () => {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const [signout] = useSignOutMutation();
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { data: cartData } = useGetCartCountQuery(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEventListener("scroll", () => {
    setScrolled(window.scrollY > 20);
  });

  useClickOutside(menuRef, () => setMenuOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  const handleSignOut = async () => {
    try {
      await signout();
      dispatch(logout());
      navigate("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className={`sticky top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-md py-2" : "bg-white/95 backdrop-blur-sm py-3 sm:py-4"}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-16">
          <Link to="/" className="font-medium text-lg sm:text-xl lg:text-xl text-gray-900 flex-shrink-0">Zentro</Link>
          <div className="hidden md:flex flex-1 max-w-lg mx-8"><SearchBar /></div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors"><Search size={20} /></button>
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
              <ShoppingCart size={22} />
              {cartData?.cartCount > 0 && <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">{cartData.cartCount}</span>}
            </Link>
            {!isLoading && isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button 
                  onClick={() => setMenuOpen(!menuOpen)} 
                  className="flex items-center justify-center w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-indigo-500/50 transition-all duration-200"
                >
                  <img 
                    src={user?.avatar || generateUserAvatar(user?.name || "User")} 
                    alt="User" 
                    className="w-full h-full object-cover" 
                  />
                </button>
                {menuOpen && <UserMenu user={user} menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />}
              </div>
            ) : (
              pathname !== "/sign-up" && pathname !== "/sign-in" && <Link to="/sign-in" className="hidden sm:block px-4 py-2 text-sm font-medium text-gray-800 hover:text-indigo-600 transition-colors">Sign in</Link>
            )}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-700 hover:text-indigo-600 transition-colors">{mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}</button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
