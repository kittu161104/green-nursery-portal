
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="relative pt-6 pb-16 sm:pb-24">
        <div className="mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Bring Nature</span>
              <span className="block text-green-600">Into Your Home</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Discover our collection of beautiful indoor and outdoor plants, 
              carefully selected to bring life and color to your space.
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/shop">
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white md:py-3 md:text-lg">
                    Shop Now
                  </Button>
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <Link to="/about">
                  <Button variant="outline" className="w-full md:py-3 md:text-lg">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex flex-col" aria-hidden="true">
          <div className="flex-1" />
          <div className="w-full flex-1 bg-gradient-to-b from-white via-white to-green-100" />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <img
            className="relative rounded-lg shadow-xl"
            src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Collection of houseplants in different planters"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
