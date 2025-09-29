
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Home, 
  Package,
  Bell,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Cart as CartEntity } from "@/entities/Cart"; // Renamed Cart to CartEntity to avoid naming conflict
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

const navigation = [
  { name: "Home", url: createPageUrl("Home"), icon: Home },
  { name: "Search", url: createPageUrl("Search"), icon: Search },
  { name: "Orders", url: createPageUrl("Orders"), icon: Package },
  { name: "Wishlist", url: createPageUrl("Wishlist"), icon: Heart }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    try {
      const cartItems = await CartEntity.list(); // Use CartEntity here
      const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
      setCartCount(totalItems);
    } catch (error) {
      console.error("Error loading cart count:", error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = createPageUrl("Search") + "?q=" + encodeURIComponent(searchQuery);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <style>{`
        :root {
          --primary: 30 41 59;
          --primary-foreground: 248 250 252;
          --secondary: 241 245 249;
          --accent: 16 185 129;
          --accent-foreground: 255 255 255;
          --muted: 248 250 252;
          --card: 255 255 255;
          --border: 226 232 240;
          --gold: 245 158 11;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/20 bg-white/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                SmartMart
              </span>
            </Link>

            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-colors"
                />
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.slice(2).map((item) => (
                <Link
                  key={item.name}
                  to={item.url}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    location.pathname === item.url
                      ? "text-orange-600 bg-orange-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              ))}
              
              <Link to={createPageUrl("Cart")} className="relative p-2">
                <ShoppingCart className="h-5 w-5 text-slate-600 hover:text-slate-900" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-orange-500">
                    {cartCount > 99 ? '99+' : cartCount}
                  </Badge>
                )}
              </Link>
              
              <Button size="icon" variant="ghost" className="text-slate-600 hover:text-slate-900">
                <User className="h-4 w-4" />
              </Button>
            </nav>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-6 mt-8">
                  <form onSubmit={handleSearch}>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </form>
                  
                  <nav className="flex flex-col space-y-3">
                    {navigation.map((item) => (
                      <SheetClose key={item.name} asChild>
                        <Link
                          to={item.url}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            location.pathname === item.url
                              ? "text-orange-600 bg-orange-50"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </SheetClose>
                    ))}
                    <SheetClose asChild>
                      <Link
                        to={createPageUrl("Cart")}
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span className="font-medium">Cart ({cartCount})</span>
                      </Link>
                    </SheetClose>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50/50 mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-slate-600">
            <p>© 2024 SmartMart. Fast delivery from our fulfillment centers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
