import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoaded } = useUser();

  const getDisplayName = () => {
    console.log("Header getDisplayName: isLoaded?", isLoaded);
    // Wait until Clerk has loaded the user data
    if (!isLoaded) {
      console.log("Header getDisplayName: Not loaded yet, returning empty.");
      return ''; // Return empty or a placeholder while loading
    }
    
    console.log("Header getDisplayName: User object:", user);
    // If user exists after loading
    if (user) {
      const name = user.firstName || user.fullName;
      console.log("Header getDisplayName: Found name?", name);
      if (name) return name;
      
      const email = user.primaryEmailAddress?.emailAddress;
      console.log("Header getDisplayName: Found email?", email);
      if (email) {
        const emailPart = email.split('@')[0];
        console.log("Header getDisplayName: Returning email part:", emailPart);
        return emailPart;
      }
    }
    
    // Fallback only if not loading and no user/name/email found
    console.log("Header getDisplayName: Falling back to 'User'.");
    return 'User'; 
  };

  const displayName = getDisplayName();

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header glass ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-content">
          <div className="logo center-mobile">
            <div className="logo-icon"></div>
            <NavLink to="/" className="logo-text">UWB HACKS</NavLink>
          </div>

          <div className="header-right-texts desktop-only">
            <span className="header-highlight">Save the world</span>
          </div>

          <SignedIn>
            <div className="signed-in-content">
              <nav className="desktop-nav">
                <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Home</NavLink>
                <NavLink to="/typing-test" className={({ isActive }) => isActive ? "active" : ""}>Typing Test</NavLink>
                <NavLink to="/leaderboard" className={({ isActive }) => isActive ? "active" : ""}>Leaderboard</NavLink>
                <NavLink to="/profile" className={({ isActive }) => isActive ? "active" : ""}>Profile</NavLink>
                <NavLink to="/dashboard/about" className={({ isActive }) => isActive ? "active" : ""}>About Us</NavLink>
              </nav>

              <div className="user-info">
                {isLoaded && displayName && <span className="user-name">{displayName}</span>} 
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </SignedIn>
        </div>
      </div>
    </header>
  );
};

export default Header;
