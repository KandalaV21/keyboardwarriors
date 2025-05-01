import React, { useState, useEffect, useRef } from 'react';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const particlesRef = useRef(null);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );

  useEffect(() => {
    if (isSignedIn) {
      navigate('/dashboard');
    }
  }, [isSignedIn, navigate]);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Create particles effect
    const canvas = particlesRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(${Math.floor(Math.random() * 100 + 100)}, ${Math.floor(Math.random() * 50)}, ${Math.floor(Math.random() * 150 + 100)}, ${Math.random() * 0.5 + 0.3})`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) {
          this.speedX = -this.speedX;
        }

        if (this.y > canvas.height || this.y < 0) {
          this.speedY = -this.speedY;
        }
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particles = [];
      const particleCount = Math.min(100, Math.floor(window.innerWidth / 20));

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }

      requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <section className="hero">
      <canvas ref={particlesRef} className="particles-canvas"></canvas>
      <div className="glowing-orb"></div>
      <div className="glowing-orb secondary"></div>
      <div className="container center-hero">
        <div className="hero-content">
          <div className="hero-text glass">
            <div className="hero-header">
              <h1 className="main-title">UWB HACKS</h1>
              <h2 className="sub-title">presents</h2>
              <div className="event-name">ISS KEYBOARD WARRIORS</div>
            </div>
            <p className="hero-description">
              Join us in this exciting typing challenge where speed and accuracy matter.
              Test your typing skills, compete with others, and see if you can make it
              to the top of our leaderboard!
            </p>
            <div className="hero-buttons">
              {isDesktop ? (
                <>
                  <button className="cta-button" onClick={() => navigate('/leaderboard')}>LEADERBOARD</button>
                  <SignInButton mode="modal">
                    <button className="btn-secondary">Participate</button>
                  </SignInButton>
                </>
              ) : (
                <button className="cta-button" onClick={() => navigate('/leaderboard')}>Leaderboard</button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="hero-decorations">
        <div className="deco-line"></div>
        <div className="deco-circle"></div>
        <div className="deco-line"></div>
      </div>
    </section>
  );
};

export default Hero;
