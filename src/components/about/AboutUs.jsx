import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us-page glass-container">
      <h1 className="page-title gradient-text">About ISS</h1>
      <div className="about-content">
        <p>
          Welcome to the International Students Society (ISS) at the University of Washington Bothell! 
          We are a vibrant and inclusive community that brings together students from all corners of 
          the world, fostering cultural exchange, lifelong friendships, and mutual understanding. 
          Whether you're an international student looking for a home away from home or a domestic 
          student eager to explore global perspectives, ISS is the perfect place to connect, learn, 
          and grow together.
        </p>
        
        <h2>Our Story</h2>
        <p>
          The ISS Club was founded with a simple yet powerful mission—to ensure that international 
          students have an unforgettable experience at UW Bothell. We understand that adjusting to 
          a new country and academic environment can be both exciting and challenging, which is why 
          we strive to create a supportive and engaging community. Through social events, cultural 
          celebrations, and meaningful conversations, we aim to make your time here enriching, fun, 
          and memorable.
        </p>

        <h2>Join the ISS Family!</h2>
        <p>
          Become a part of our growing community and enjoy exclusive perks, including:
        </p>

        <div className="highlight-box">
          <h3>Get an ISS Hoodie</h3>
          <p>Show your ISS pride with our stylish hoodies!</p>
          
          <h4>Steps to get an ISS Hoodie:</h4>
          <ol>
            <li>
              <strong>Visit Our Website</strong> – Check out our official website: 
              <a href="https://www.uwbiss.live" className="gradient-link" target="_blank" rel="noopener noreferrer">ISS Website</a>
            </li>
            <li>
              <strong>Follow Us on Gather</strong> – Connect with fellow members in our virtual space, 
              this step is must for the Hoodie: <a href="https://gather.uwb.edu/ISS/club_signup" className="gradient-link">[Gather Link]</a>
            </li>
            <li>
              <strong>Fill Out Our Hoodie Google Form</strong> – Stay updated on events and opportunities: 
              <a href="https://forms.gle/aQ7Hj6CXQJHdBYyeA" className="gradient-link">[Google Form Link]</a>
            </li>
            <li>
              <strong>Follow Us on Social Media</strong> – Never miss out on exciting events and announcements!
            </li>
          </ol>
        </div>

        <p className="closing-message">
          We can't wait to meet you and make your UW Bothell experience truly special. 
          Let's create unforgettable memories together!
        </p>

        <div className="hashtags">
          #WeAreISS #GlobalCommunity #UWBProud
        </div>
      </div>
    </div>
  );
};


export default AboutUs;
