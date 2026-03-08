import React, { useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";

const cities = [
  { name: "Laayoune", lat: 27.1536, lng: -13.2033, region: "Southern Morocco", population: "217,732" },
  { name: "Agadir", lat: 30.4278, lng: -9.5981, region: "Souss-Massa", population: "421,844" },
  { name: "Casablanca", lat: 33.5731, lng: -7.5898, region: "Casablanca-Settat", population: "3,359,818" },
  { name: "Marrakech", lat: 31.6295, lng: -7.9811, region: "Marrakech-Safi", population: "928,850" },
  { name: "Rabat", lat: 34.0209, lng: -6.8416, region: "Rabat-Salé-Kénitra", population: "577,827" },
  { name: "Fes", lat: 34.0181, lng: -5.0078, region: "Fès-Meknès", population: "1,112,072" },
  { name: "Tangier", lat: 35.7595, lng: -5.8340, region: "Tanger-Tétouan-Al Hoceïma", population: "947,952" }
];

export default function GlobeSection() {
  const globeRef = useRef();
  const [hoveredCity, setHoveredCity] = useState(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 700, height: 600 });
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setDimensions({ width: window.innerWidth - 60, height: 350 });
      } else {
        setDimensions({ width: 700, height: 600 });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (globeRef.current && !globeReady) {
      globeRef.current.pointOfView({
        lat: 30,
        lng: -5,
        altitude: 2.2
      }, 1000);
      
      const timer = setInterval(() => {
        if (globeRef.current && !hoveredCity) {
          globeRef.current.pointOfView({
            lng: (Date.now() / 40) % 360 - 180
          }, 0);
        }
      }, 30);

      setGlobeReady(true);
      
      return () => clearInterval(timer);
    }
  }, [globeReady, hoveredCity]);

  const handleCityHover = (city, event) => {
    if (city) {
      setHoveredCity(city);
      setShowTooltip(true);
      
      // Get mouse position for tooltip
      if (event) {
        setTooltipPosition({ x: event.clientX, y: event.clientY });
      }
    } else {
      setHoveredCity(null);
      setShowTooltip(false);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 0.6fr",
        minHeight: "100vh",
        background: "#000000",
        color: "white",
        alignItems: "center",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Custom Tooltip - appears on hover */}
      {showTooltip && hoveredCity && (
        <div
          style={{
            position: "fixed",
            left: tooltipPosition.x + 20,
            top: tooltipPosition.y - 40,
            background: "rgba(0, 0, 0, 0.95)",
            color: "greenyellow",
            padding: "8px 20px",
            borderRadius: "30px",
            fontSize: "16px",
            fontWeight: "500",
            border: "1px solid greenyellow",
            boxShadow: "0 10px 30px #b3ff00, 0 0 20px #b3ff00",
            zIndex: 1000,
            pointerEvents: "none",
            transform: "translateY(0)",
            animation: "fadeInUp 0.2s ease",
            whiteSpace: "nowrap",
            backdropFilter: "blur(5px)"
          }}
        >
          {hoveredCity.name}
          <div style={{
            position: "absolute",
            bottom: "-5px",
            left: "50%",
            transform: "translateX(-50%) rotate(45deg)",
            width: "10px",
            height: "10px",
            background: "rgba(0, 0, 0, 0.95)",
            borderRight: "1px solid greenyellow",
            borderBottom: "1px solid greenyellow",
            zIndex: -1
          }} />
        </div>
      )}

      {/* Gradient mask overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            linear-gradient(90deg, 
              rgba(0,0,0,1) 0%, 
              rgba(0,0,0,1) 35%, 
              rgba(0,0,0,0.85) 50%, 
              rgba(0,0,0,0.6) 60%, 
              rgba(0,0,0,0.3) 70%, 
              rgba(0,0,0,0.1) 80%, 
              rgba(0,0,0,0) 100%
            )
          `,
          pointerEvents: "none",
          zIndex: 3
        }}
      />

      {/* Column 1 - Text Content (without cities grid) */}
      <div
        style={{
          paddingLeft: "80px",
          paddingRight: "40px",
          zIndex: 5,
          position: "relative"
        }}
      >
        <div style={{ maxWidth: "600px" }}>
          <div
            style={{
              width: "60px",
              height: "2px",
              background: "greenyellow",
              marginBottom: "30px"
            }}
          />
          
          <h1
            style={{
              fontSize: "clamp(42px, 6vw, 72px)",
              marginBottom: "30px",
              color: "white",
              fontWeight: "300",
              lineHeight: "1.1",
              letterSpacing: "-0.02em"
            }}
          >
            Our <span style={{ 
              fontWeight: "600", 
              color: "greenyellow",
              textShadow: "0 0 30px rgba(173, 255, 47, 0.3)"
            }}>Global</span> Presence
          </h1>

          <p
            style={{
              fontSize: "clamp(16px, 2vw, 18px)",
              lineHeight: "1.8",
              color: "#b0b0b0",
              marginBottom: "60px",
              fontWeight: "300",
              maxWidth: "500px"
            }}
          >
            Our services span across multiple Moroccan cities, from the Atlantic coast 
            to the Sahara desert. With strategic hubs in major urban centers, 
            we ensure comprehensive coverage and local expertise in every region we serve.
          </p>

          <div
            style={{
              display: "flex",
              gap: "50px"
            }}
          >
            <div>
              <div style={{ fontSize: "36px", fontWeight: "300", color: "greenyellow" }}>
                {cities.length}
              </div>
              <div style={{ fontSize: "13px", color: "#666", letterSpacing: "1px" }}>
                MAJOR CITIES
              </div>
            </div>
            <div>
              <div style={{ fontSize: "36px", fontWeight: "300", color: "greenyellow" }}>
                100%
              </div>
              <div style={{ fontSize: "13px", color: "#666", letterSpacing: "1px" }}>
                COVERAGE
              </div>
            </div>
            <div>
              <div style={{ fontSize: "36px", fontWeight: "300", color: "greenyellow" }}>
                24/7
              </div>
              <div style={{ fontSize: "13px", color: "#666", letterSpacing: "1px" }}>
                SUPPORT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2 - Globe */}
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 2,
          position: "relative"
        }}
      >
        <div
          style={{
            width: dimensions.width,
            height: dimensions.height,
            marginRight: "-100px",
            transform: "scale(1)",
            transition: "transform 0.3s ease"
          }}
        >
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="#000000"
            globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
            atmosphereColor="rgb(204,255,0)"
            atmosphereAltitude={0.15}
            
            // Points data - only green dots, no labels
            pointsData={cities}
            pointLat="lat"
            pointLng="lng"
            pointColor={() => "greenyellow"}
            pointAltitude={0.03}
            pointRadius={0.5}
            pointsMerge={false}
            
            // Enable point interaction
            enablePointerInteraction={true}
            
            // Handle hover on points - fluent hover effect
            onPointHover={(point, prevPoint, event) => {
              if (point) {
                handleCityHover(point, event);
              } else {
                handleCityHover(null);
              }
            }}
            
            // No labels data - completely removed
            labelsData={[]}
          />
        </div>

        {/* Instruction text */}
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            fontSize: "12px",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "1px",
            textTransform: "uppercase",
            zIndex: 10
          }}
        >
          Hover over green dots
        </div>
      </div>

      {/* Bottom gradient */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "100px",
          background: "linear-gradient(180deg, transparent 0%, #000000 100%)",
          pointerEvents: "none",
          zIndex: 6
        }}
      />

      {/* Animation keyframes */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}