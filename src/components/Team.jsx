import React, { useState } from 'react';
import './Team.css';

// Team members data with posts
const teamMembers = [
  {
    id: 1,
    name: "Alex Rivera",
    post: "Creative Director",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    postIcon: "🎨"
  },
  {
    id: 2,
    name: "Maya Chen",
    post: "Lead Designer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    postIcon: "✏️"
  },
 
];

const Team = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="team-container">
      {/* Background Pattern */}
      <div className="background-pattern">
        <div className="pattern-grid"></div>
        <div className="pattern-dots"></div>
      </div>

      {/* Header */}
      <div className="team-header">
        <h1 className="team-title">
          <span className="title-yellow">Creative</span> Minds
        </h1>
        <p className="team-subtitle">Meet the visionaries behind our success</p>
      </div>

      {/* Grid Layout */}
      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div
            key={member.id}
            className={`team-card ${hoveredId === member.id ? 'hovered' : ''}`}
            onMouseEnter={() => setHoveredId(member.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Glassmorphism Background */}
            <div className="card-glass"></div>
            
            {/* Border Decorations */}
            <div className="card-border">
              <div className="border-corner top-left"></div>
              <div className="border-corner top-right"></div>
              <div className="border-corner bottom-left"></div>
              <div className="border-corner bottom-right"></div>
            </div>

            {/* Yellow-Green Accent Lines */}
            <div className="accent-lines">
              <div className="accent-line horizontal"></div>
              <div className="accent-line vertical"></div>
            </div>

            {/* Image Container */}
            <div className="image-wrapper">
              <div className="image-glow"></div>
              <div className="image-border"></div>
              <img 
                src={member.image} 
                alt={member.name}
                className="member-image"
              />
              
              {/* Hover Overlay */}
              <div className="image-overlay">
                <span className="view-text">View Profile</span>
              </div>
            </div>

            {/* Name and Post */}
            <div className="member-info">
              <h3 className="member-name">{member.name}</h3>
              <div className="member-post">
                <span className="post-icon">{member.postIcon}</span>
                <span className="post-text">{member.post}</span>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="card-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;