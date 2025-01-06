import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  targetX: number;
  targetY: number;
  velocity: { x: number; y: number };
}

export default function DigitalTunnel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const speed = useRef(2);
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Reset mouse position to center when resizing
      mousePosition.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      };
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Initialize particles
    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < 200; i++) {
        particles.current.push({
          x: Math.random() * 2000 - 1000,
          y: Math.random() * 2000 - 1000,
          z: Math.random() * 2000,
          size: Math.random() * 4 + 1,
          targetX: 0,
          targetY: 0,
          velocity: { x: 0, y: 0 },
        });
      }
    };
    initParticles();

    // Animation function
    const animate = () => {
      ctx.fillStyle = "#0D1626"; // or your actual bg color, like "#1a1a1a" or whatever

      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center point
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Calculate mouse direction from center
      const mouseX = mousePosition.current.x - centerX;
      const mouseY = mousePosition.current.y - centerY;
      const angle = Math.atan2(mouseY, mouseX);

      // Update and draw particles
      particles.current.forEach((particle) => {
        // Move particle closer
        particle.z -= speed.current;

        // Calculate particle movement towards mouse
        const scale = 400 / particle.z;
        const x2d = particle.x * scale + centerX;
        const y2d = particle.y * scale + centerY;

        // Update particle target based on mouse position
        const distanceFromCenter = Math.sqrt(
          Math.pow(mouseX, 2) + Math.pow(mouseY, 2),
        );
        const influenceStrength = Math.min(distanceFromCenter / 100, 10);

        particle.targetX = Math.cos(angle) * influenceStrength;
        particle.targetY = Math.sin(angle) * influenceStrength;

        // Apply forces to particle
        const acceleration = 0.1;
        particle.velocity.x +=
          (particle.targetX - particle.velocity.x) * acceleration;
        particle.velocity.y +=
          (particle.targetY - particle.velocity.y) * acceleration;

        // Update particle position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        // Reset particle if it's too close
        if (particle.z <= 0) {
          particle.z = 2000;
          particle.x = Math.random() * 2000 - 1000;
          particle.y = Math.random() * 2000 - 1000;
          particle.velocity = { x: 0, y: 0 };
        }

        // Draw particle
        const size = particle.size * scale;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x2d, y2d, size, size);

        // Draw connecting lines
        if (Math.random() < 0.1) {
          ctx.beginPath();
          ctx.moveTo(x2d, y2d);
          const lineLength = 50 * scale;
          const lineEndX = x2d + Math.cos(angle) * lineLength;
          const lineEndY = y2d + Math.sin(angle) * lineLength;
          ctx.lineTo(lineEndX, lineEndY);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
          ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 ">
      <canvas ref={canvasRef} className="w-full h-full " />
    </div>
  );
}
