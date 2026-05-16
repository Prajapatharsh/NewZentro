import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/templates/MainLayout";
import { lazy, Suspense } from "react";
import ErrorBoundary from "./components/feedback/ErrorBoundary";

// Public Pages
const Home = lazy(() => import("./pages/public/home/index"));
const Shop = lazy(() => import("./pages/public/shop/page"));
const ProductDetails = lazy(() => import("./pages/public/product/slug/page"));
const Cart = lazy(() => import("./pages/public/cart/page"));
const SignIn = lazy(() => import("./pages/auth/sign-in/page"));
const SignUp = lazy(() => import("./pages/auth/sign-up/page"));

// Dashboard Pages
const DashboardLayout = lazy(() => import("./pages/private/dashboard/layout"));
const DashboardOverview = lazy(() => import("./pages/private/dashboard/page"));
const DashboardCategories = lazy(() => import("./pages/private/dashboard/categories/page"));
const DashboardProducts = lazy(() => import("./pages/private/dashboard/products/page"));
const DashboardUsers = lazy(() => import("./pages/private/dashboard/users/page"));
const DashboardInventory = lazy(() => import("./pages/private/dashboard/inventory/page"));
const DashboardTransactions = lazy(() => import("./pages/private/dashboard/transactions/page"));
const DashboardAttributes = lazy(() => import("./pages/private/dashboard/attributes/page"));
const DashboardChats = lazy(() => import("./pages/private/dashboard/chats/page"));
const DashboardAnalytics = lazy(() => import("./pages/private/dashboard/analytics/page"));
const DashboardReports = lazy(() => import("./pages/private/dashboard/reports/page"));

function App() {
  const loadingFallback = (
    <div className="h-screen flex items-center justify-center bg-gray-50 text-indigo-600 font-bold">
      Loading Zentro...
    </div>
  );

  return (
    <ErrorBoundary>
      <Suspense fallback={loadingFallback}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="categories" element={<DashboardCategories />} />
            <Route path="products" element={<DashboardProducts />} />
            <Route path="users" element={<DashboardUsers />} />
            <Route path="inventory" element={<DashboardInventory />} />
            <Route path="transactions" element={<DashboardTransactions />} />
            <Route path="attributes" element={<DashboardAttributes />} />
            <Route path="chats" element={<DashboardChats />} />
            <Route path="analytics" element={<DashboardAnalytics />} />
            <Route path="reports" element={<DashboardReports />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
