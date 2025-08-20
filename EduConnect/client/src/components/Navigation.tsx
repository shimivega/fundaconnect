import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/useTheme";
import { SOUTH_AFRICAN_LANGUAGES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { GraduationCap, Bell, User, Menu, X } from "lucide-react";

export function Navigation() {
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  const themeButtons = [
    { value: "default", color: "bg-white border-gray-300", title: "Default Theme" },
    { value: "dark", color: "bg-gray-900 border-gray-600", title: "Dark Theme" },
    { value: "vibrant", color: "bg-gradient-to-r from-red-400 to-pink-400 border-red-300", title: "Vibrant Theme" },
    { value: "soft", color: "bg-gradient-to-r from-purple-300 to-blue-300 border-purple-200", title: "Soft Theme" },
  ];

  return (
    <nav className="sticky top-0 z-50 themed-bg-secondary shadow-lg border-b theme-transition">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center animate-pulse">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold themed-text">Funda-App</h1>
              <p className="text-xs themed-text-secondary">Educational Platform for SA</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Switcher */}
            <div className="flex space-x-2">
              {themeButtons.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value as any)}
                  className={`w-6 h-6 ${t.color} border-2 rounded-full hover:scale-110 transition-transform ${
                    theme === t.value ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  title={t.title}
                  data-testid={`theme-${t.value}`}
                />
              ))}
            </div>

            {/* Language Selector */}
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-32" data-testid="language-selector">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SOUTH_AFRICAN_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="icon" data-testid="notifications-button">
                <Bell className="w-5 h-5" />
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2" data-testid="user-menu-button">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium themed-text">Guest User</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem data-testid="profile-menu-item">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="admin-menu-item">
                    <Link href="/admin/dashboard" className="flex items-center w-full">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="logout-menu-item">
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 border-t" data-testid="mobile-menu">
            {/* Mobile Theme Switcher */}
            <div className="flex justify-center space-x-2">
              {themeButtons.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setTheme(t.value as any)}
                  className={`w-8 h-8 ${t.color} border-2 rounded-full hover:scale-110 transition-transform ${
                    theme === t.value ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                  title={t.title}
                  data-testid={`mobile-theme-${t.value}`}
                />
              ))}
            </div>

            {/* Mobile Language Selector */}
            <div className="px-4">
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger data-testid="mobile-language-selector">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOUTH_AFRICAN_LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile User Menu */}
            <div className="flex flex-col space-y-2 px-4">
              <Button variant="ghost" className="justify-start" data-testid="mobile-profile-button">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button variant="ghost" className="justify-start" data-testid="mobile-notifications-button">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href="/admin/dashboard">
                <Button variant="ghost" className="justify-start w-full" data-testid="mobile-admin-button">
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Admin Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
