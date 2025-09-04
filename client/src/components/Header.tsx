import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AuthModal } from "@/components/AuthModal";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { user, logout } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthSuccess = (userData: any) => {
    // The auth context will be updated through the login function
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-teal-500">HotelShare</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Browse Hotels</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Support</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.firstName} />
                      <AvatarFallback>
                        {user.firstName ? user.firstName.charAt(0) : user.email.charAt(0).toUpperCase()}
                        {user.lastName ? user.lastName.charAt(0) : ''}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.email.split('@')[0]
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem>
                      My Bookings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={() => {}}>
                    Profile Settings
                  </DropdownMenuItem>
                  {user.userType === "hotel_partner" && (
                    <DropdownMenuItem onClick={() => {}}>
                      Hotel Dashboard
                    </DropdownMenuItem>
                  )}
                  {user.userType === "admin" && (
                    <DropdownMenuItem onClick={() => {}}>
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="space-x-2">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  Login
                </Button>
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}