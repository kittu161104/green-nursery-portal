
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Package,
  Users,
  Settings,
  FileText,
  Home,
  Info,
  Phone
} from "lucide-react";

const SideNavAdmin = () => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "About",
      href: "/admin/about",
      icon: <Info className="h-5 w-5" />,
    },
    {
      label: "Contact",
      href: "/admin/contact",
      icon: <Phone className="h-5 w-5" />,
    },
    {
      label: "Orders",
      href: "/admin/orders",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Customers",
      href: "/admin/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="hidden border-r border-green-900/30 bg-green-900/10 md:block w-64 p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex h-12 items-center border-b border-green-900/30 pb-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold text-green-400">NGN Admin</span>
          </Link>
        </div>
        
        <nav className="grid gap-2">
          {navItems.map((item, index) => (
            <Link to={item.href} key={index}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-green-400",
                  isActiveRoute(item.href) && "bg-green-900/30 text-green-300 font-medium"
                )}
              >
                {item.icon}
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNavAdmin;
