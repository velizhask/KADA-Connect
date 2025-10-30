import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  // Eye animation
  useEffect(() => {
    const pupils = document.querySelectorAll<HTMLElement>(".eye-pupil");
    let frame = 0;

    const animate = () => {
      frame++;
      const x = Math.sin(frame / 20) * 10;
      const y = Math.cos(frame / 25) * 10;
      pupils.forEach((p) => {
        p.style.transform = `translate(${x}px, ${y}px)`;
      });
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center px-6 bg-background text-foreground font-sans transition-colors duration-500">
      {/* Eyes Section */}
      <div className="flex justify-center gap-2 mb-10">
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-md">
          <div className="eye-pupil w-8 h-8 bg-foreground rounded-full transition-transform duration-150"></div>
        </div>
        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-md">
          <div className="eye-pupil w-8 h-8 bg-foreground rounded-full transition-transform duration-150"></div>
        </div>
      </div>

      {/* Heading */}
      <div className="space-y-2 mb-6">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium text-primary">
          Looks like you’re lost
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-light">
          404 error
        </p>
      </div>

      {/* Button */}
      <Button
        asChild
        variant="outline"
        className="border-primary text-primary hover:bg-primary hover:text-white rounded-xl shadow-sm px-6 py-2 text-base transition-all"
      >
        <Link to="/">Back to Home</Link>
      </Button>
    </main>
  );
};

export default NotFoundPage;
