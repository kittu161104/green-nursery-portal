
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
          alt="Collection of houseplants"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-green-950/40 to-black/90 backdrop-blur-sm"></div>
      </div>

      <div className="relative pt-16 pb-32 sm:pt-24 sm:pb-40">
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-green-300 sm:text-5xl md:text-6xl">
              <span className="block">Bring Nature</span>
              <span className="block text-green-500">Into Your Home</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-green-400 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Discover our collection of beautiful indoor and outdoor plants, 
              carefully selected to bring life and color to your space.
            </p>
            <div className="mx-auto mt-8 max-w-md sm:flex sm:justify-center md:mt-10">
              <div className="rounded-md shadow">
                <Link to="/shop">
                  <Button className="w-full bg-green-800 hover:bg-green-700 text-green-300 border border-green-700 md:py-3 md:text-lg">
                    Shop Now
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link to="/about">
                  <Button variant="outline" className="w-full border-green-800 text-green-400 hover:bg-black/50 md:py-3 md:text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
