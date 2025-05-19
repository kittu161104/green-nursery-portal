
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        
        {/* Plant Care Section */}
        <section className="bg-secondary/50 py-16 sm:py-20 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-green-950/50 backdrop-blur-sm"></div>
            <img 
              src="https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?ixlib=rb-1.2.1&auto=format&fit=crop&w=870&q=80"
              alt="Background plants"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div className="glass-card p-8 rounded-xl shadow-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-green-50 sm:text-4xl">
                  Plant Care Made Easy
                </h2>
                <p className="mt-3 max-w-3xl text-lg text-green-200">
                  Our plants come with detailed care instructions. But if you need more help, our
                  plant experts are just a call away. We want your plants to thrive!
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-50">Simple watering guidelines</h3>
                      <p className="mt-1 text-green-300">
                        Clear instructions on when and how much to water your plants.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-50">Light requirement indicators</h3>
                      <p className="mt-1 text-green-300">
                        Know exactly where to place your plant for optimal growth.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-green-50">Seasonal care tips</h3>
                      <p className="mt-1 text-green-300">
                        Adjust your care routine as the seasons change for year-round health.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link to="/plant-care-guides">
                    <Button className="bg-green-700 hover:bg-green-800 text-white">
                      View Care Guides
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="mt-10 lg:mt-0">
                <div className="glass-card overflow-hidden rounded-xl shadow-2xl">
                  <img
                    className="w-full h-full object-cover opacity-90"
                    src="https://images.unsplash.com/photo-1530968464165-7a1861cbaf9f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
                    alt="Person caring for a houseplant"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
