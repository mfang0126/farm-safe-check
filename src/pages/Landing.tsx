
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, FileText, ChevronRight } from 'lucide-react';

const Landing = () => {
  const scrollToSignup = () => {
    document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section min-h-[80vh] flex items-center section-padding">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="mb-6 font-bold animate-fade-in">Farm Equipment Safety Made Simple</h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 animate-fade-in">
              Stay compliant, protect your workers, and reduce risk with easy digital safety checks.
            </p>
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary-600 text-lg py-6 px-8 rounded-full shadow-lg animate-fade-in"
              onClick={scrollToSignup}
            >
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Core Benefits Section */}
      <section className="bg-gray-50 section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">How FarmSafe360 Helps Your Farm</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Prevent Equipment Failures</h3>
              <p className="text-gray-600">
                Catch issues before they become dangerous with systematic equipment checks and visual inspections.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-4">
                <Calendar size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Auto Maintenance Reminders</h3>
              <p className="text-gray-600">
                Never miss a critical safety check with customizable schedules and automated email alerts.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white p-8 rounded-xl shadow-md text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-4">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Digital Logs for Audits</h3>
              <p className="text-gray-600">
                Maintain detailed digital records of all safety checks and maintenance for instant compliance reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">How It Works</h2>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Steps */}
              <div className="hidden md:block absolute top-1/4 left-0 right-0 h-1 bg-primary-200 -z-10"></div>
              <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mb-4">
                    1
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">Add Equipment</h3>
                  <p className="text-gray-600 text-center">
                    Register all your farm equipment with details on make, model, and safety features.
                  </p>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mb-4">
                    2
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">Run Safety Check</h3>
                  <p className="text-gray-600 text-center">
                    Complete digital safety checklists from any device, including mobile.
                  </p>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mb-4">
                    3
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">Stay Compliant</h3>
                  <p className="text-gray-600 text-center">
                    Generate reports, set reminders, and maintain digital records for audits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 section-padding">
        <div className="container mx-auto px-4">
          <h2 className="text-center mb-12">What Farmers Are Saying</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-600 italic mb-4">
                    "FarmSafe360 has transformed how we manage equipment safety on our farm. The digital checklists save us hours every week."
                  </p>
                  <p className="font-medium">John D., Dairy Farmer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <p className="text-gray-600 italic mb-4">
                    "The automated reminders ensure we never miss a safety check. It's like having a safety manager on staff 24/7."
                  </p>
                  <p className="font-medium">Sarah M., Crop Farmer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="signup-section" className="section-padding bg-primary text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="mb-6 text-white">Start Your Free Trial Today</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            No credit card needed. See how FarmSafe360 can help protect your farm, workers, and bottom line.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg py-6 px-8 rounded-full" asChild>
              <Link to="/signup">Sign Up Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg py-6 px-8 rounded-full" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
          <p className="mt-6 text-sm opacity-80">Free trial includes all features for 30 days. No obligations.</p>
        </div>
      </section>
    </div>
  );
};

export default Landing;
