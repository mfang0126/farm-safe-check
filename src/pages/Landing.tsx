import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { CheckCircle, Calendar, FileText, ChevronRight, AlertTriangle, BookOpen, Heart, Star, Shield, CheckSquare, Calculator, Clock } from 'lucide-react';

const Landing = () => {
  const scrollToSignup = () => {
    document.getElementById('signup-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const watchDemo = () => {
    // In a real app, this would open a modal with a demo video
    alert("Demo video would play here");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section - Redesigned with principles from screenshots */}
      <section className="min-h-[80vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-full text-left">
                <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-primary-50 text-primary text-sm border border-primary-100">
                  <Shield size={16} className="mr-2" /> Trusted by 500+ Australian farms
                </div>
                <h1 className="mb-6 font-bold text-4xl md:text-5xl leading-tight text-left bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                  Reduce Farm Safety Incidents by 60% with Digital Safety Management
                </h1>
                <p className="text-xl md:text-2xl text-gray-700 mb-8">
                  Join 500+ Australian farms who've eliminated paperwork, ensured compliance, and protected their workers with our all-in-one safety platform
                </p>
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button 
                    size="lg" 
                    className="bg-primary hover:bg-primary-600 text-lg py-6 px-8 rounded-full shadow-lg"
                    onClick={scrollToSignup}
                  >
                    Start Free 30-Day Trial
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="text-lg py-6 px-8 rounded-full border-2 border-primary text-primary hover:bg-primary-50"
                    onClick={watchDemo}
                  >
                    Watch 2-Minute Demo
                  </Button>
                </div>
                
                {/* Featured Testimonial - Styled more like screenshots */}
                <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80" alt="Client" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} size={18} fill="#FFD700" color="#FFD700" />
                      ))}
                    </div>
                    <p className="text-gray-600 italic mb-2">
                      "FarmSafe360 cut our safety incidents by 72% in the first year. The ROI is incredible."
                    </p>
                    <p className="font-medium">John D., Safety Manager at Murray River Farms</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="absolute bottom-8 left-0 right-0 z-10">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto flex justify-center items-center gap-4 flex-wrap">
              <div className="bg-white py-2 px-4 rounded-lg shadow-sm text-sm text-gray-600 border border-gray-100">ISO 45001 Certified</div>
              <div className="bg-white py-2 px-4 rounded-lg shadow-sm text-sm text-gray-600 border border-gray-100">99.9% Uptime</div>
              <div className="bg-white py-2 px-4 rounded-lg shadow-sm text-sm text-gray-600 border border-gray-100">Data Protection Compliant</div>
              <div className="bg-white py-2 px-4 rounded-lg shadow-sm text-sm text-gray-600 border border-gray-100">SOC 2 Compliant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section - Redesigned with principles from screenshots */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-700">Tired of Safety Management Chaos?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-left border border-gray-100 hover:border-primary-200 transition-all hover:shadow-md">
                <CheckSquare size={24} className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Worried about workplace accidents?</h3>
                <p className="text-gray-600">
                  Incidents that could shut down your operation and cost thousands in damages.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-left border border-gray-100 hover:border-primary-200 transition-all hover:shadow-md">
                <CheckSquare size={24} className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Drowning in paperwork?</h3>
                <p className="text-gray-600">
                  Struggling to stay compliant with ever-changing regulations and documentation.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-left border border-gray-100 hover:border-primary-200 transition-all hover:shadow-md">
                <CheckSquare size={24} className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Losing sleep over potential audit failures?</h3>
                <p className="text-gray-600">
                  Worrying about hefty fines and penalties from failed safety inspections.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm text-left border border-gray-100 hover:border-primary-200 transition-all hover:shadow-md">
                <CheckSquare size={24} className="text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-800">Wasting hours on manual documentation?</h3>
                <p className="text-gray-600">
                  Time that could be better spent running your farm and growing your business.
                </p>
              </div>
            </div>
            <div className="mt-8 bg-gradient-to-r from-primary-50 to-green-50 p-6 rounded-lg border border-primary-100">
              <h3 className="text-xl font-semibold mb-2 text-primary-700">FarmSafe360 eliminates these headaches with one integrated platform</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Core Benefits Section - Styled like screenshots */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Real Results for Your Farm</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
            <p className="text-xl text-gray-600 mt-8 max-w-2xl mx-auto">
              Our customers report an average 60% reduction in safety incidents and 100% audit pass rate after implementing FarmSafe360.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Benefit 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-6">
                <CheckCircle size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Save $50,000+ annually</h3>
              <p className="text-gray-600">
                By preventing costly equipment breakdowns before they happen with systematic equipment checks and visual inspections.
              </p>
            </div>
            
            {/* Benefit 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-6">
                <Calendar size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Never face unexpected failures again</h3>
              <p className="text-gray-600">
                Smart scheduling and automated reminders ensure critical safety checks are never missed.
              </p>
            </div>
            
            {/* Benefit 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-6">
                <FileText size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Pass every safety audit</h3>
              <p className="text-gray-600">
                Instantly accessible digital records make compliance reporting a breeze, eliminating audit stress.
              </p>
            </div>
            
            {/* Benefit 4 - Incident Reporting */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-6">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Reduce incident investigation time</h3>
              <p className="text-gray-600">
                Cut investigation time from days to hours with structured reporting and digital documentation.
              </p>
            </div>
            
            {/* Benefit 5 - Training Register */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-6">
                <BookOpen size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Eliminate compliance violations</h3>
              <p className="text-gray-600">
                Automated certification tracking ensures workers are always properly trained and qualified.
              </p>
            </div>

            {/* Benefit 6 - Worker Health */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 text-primary mb-6">
                <Heart size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Protect your most valuable asset</h3>
              <p className="text-gray-600">
                Keep your workers safe with personalized health monitoring and targeted fitness-for-work programs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section - Styled like screenshots */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Trusted by Leading Australian Farms</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 max-w-5xl mx-auto mb-16">
            {[1, 2, 3, 4, 5, 6].map((logo) => (
              <div key={logo} className="h-16 w-40 bg-white rounded-lg shadow-sm flex items-center justify-center border border-gray-100">
                <div className="text-gray-400 font-semibold">FARM LOGO</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-sm p-8 max-w-2xl border border-gray-100">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">60%</div>
                  <p className="text-gray-800 font-medium">Average reduction in safety incidents</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">100%</div>
                  <p className="text-gray-800 font-medium">Audit pass rate after implementation</p>
                </div>
                <div className="text-center">
                  <div className="bg-primary text-white h-16 w-16 rounded-full flex items-center justify-center font-bold text-2xl mx-auto mb-4">4.9★</div>
                  <p className="text-gray-800 font-medium">Average customer satisfaction rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works Section - Styled like screenshots */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How It Works</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Steps */}
              <div className="hidden md:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-primary-100 to-primary-300 -z-10"></div>
              <div className="grid md:grid-cols-3 gap-12">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mb-6">
                    1
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm text-center h-full border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Upload farm details in 15 minutes</h3>
                    <p className="text-gray-600 mb-6">
                      Quickly register equipment and safety protocols with our guided setup wizard.
                    </p>
                    <div className="bg-primary-50 p-3 rounded-lg text-primary font-medium border border-primary-100">
                      Get immediate safety insights
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mb-6">
                    2
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm text-center h-full border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Complete digital safety checks in 2 minutes</h3>
                    <p className="text-gray-600 mb-6">
                      Workers easily complete checks from any mobile device, reducing paperwork burden.
                    </p>
                    <div className="bg-primary-50 p-3 rounded-lg text-primary font-medium border border-primary-100">
                      Reduce incidents by 60%
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white font-bold text-2xl mb-6">
                    3
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm text-center h-full border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="text-xl font-semibold mb-3 text-gray-800">Generate compliance reports instantly</h3>
                    <p className="text-gray-600 mb-6">
                      One-click reporting for audits, incidents, and safety performance tracking.
                    </p>
                    <div className="bg-primary-50 p-3 rounded-lg text-primary font-medium border border-primary-100">
                      Be audit-ready in seconds, not days
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Timeline Section - Styled to match screenshots */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">From Chaos to Compliance in 30 Days</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
            <p className="text-xl text-gray-600 mt-8 max-w-3xl mx-auto">
              Our proven onboarding process gets you fully operational in just 4 weeks, with expert support every step of the way.
            </p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <div className="relative">
              <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-green-100 to-primary-100"></div>
              <div className="grid md:grid-cols-4 gap-6">
                {/* Week 1 */}
                <div className="relative">
                  <div className="bg-primary text-white text-lg font-bold w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative shadow-md">W1</div>
                  <div className="bg-white p-6 rounded-xl shadow-sm h-full border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="font-semibold text-lg mb-4 text-center text-gray-800">Setup & Configuration</h3>
                    <ul className="text-gray-600 text-sm space-y-3">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>System setup with your farm details</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Equipment registry creation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>User accounts creation</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Week 2 */}
                <div className="relative">
                  <div className="bg-primary text-white text-lg font-bold w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative shadow-md">W2</div>
                  <div className="bg-white p-6 rounded-xl shadow-sm h-full border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="font-semibold text-lg mb-4 text-center text-gray-800">Data Migration & Training</h3>
                    <ul className="text-gray-600 text-sm space-y-3">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Import existing safety records</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Admin team training session</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Customize safety checklists</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Week 3 */}
                <div className="relative">
                  <div className="bg-primary text-white text-lg font-bold w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative shadow-md">W3</div>
                  <div className="bg-white p-6 rounded-xl shadow-sm h-full border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="font-semibold text-lg mb-4 text-center text-gray-800">Team Onboarding</h3>
                    <ul className="text-gray-600 text-sm space-y-3">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Worker training sessions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Mobile app deployment</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Supervisor dashboard setup</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                {/* Week 4 */}
                <div className="relative">
                  <div className="bg-primary text-white text-lg font-bold w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-6 z-10 relative shadow-md">W4</div>
                  <div className="bg-white p-6 rounded-xl shadow-sm h-full border border-gray-100 hover:shadow-md transition-all duration-300">
                    <h3 className="font-semibold text-lg mb-4 text-center text-gray-800">Full Deployment</h3>
                    <ul className="text-gray-600 text-sm space-y-3">
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Go live with all features</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>First safety reports generation</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={16} className="text-primary mt-1 mr-2 flex-shrink-0" />
                        <span>Success review meeting</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section - Styled with screenshot inspiration */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">See Your Potential Savings</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2">
              <div className="p-8 bg-gradient-to-br from-primary to-primary-700 text-white">
                <h3 className="text-2xl font-semibold mb-6 flex items-center">
                  <Calculator size={24} className="mr-2" />
                  ROI Calculator
                </h3>
                <p className="mb-8 opacity-90">
                  Calculate how much your farm could save with FarmSafe360 by reducing incidents, eliminating paperwork, and ensuring compliance.
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-white opacity-90 text-sm">Annual safety incidents</label>
                    <input type="number" className="w-full p-3 rounded-lg text-gray-800 border-0" placeholder="5" />
                  </div>
                  <div>
                    <label className="block mb-2 text-white opacity-90 text-sm">Hours spent on paperwork per week</label>
                    <input type="number" className="w-full p-3 rounded-lg text-gray-800 border-0" placeholder="10" />
                  </div>
                  <div>
                    <label className="block mb-2 text-white opacity-90 text-sm">Number of workers</label>
                    <input type="number" className="w-full p-3 rounded-lg text-gray-800 border-0" placeholder="25" />
                  </div>
                  <div className="pt-2">
                    <Button className="w-full bg-white text-primary hover:bg-gray-100 py-6 text-lg">
                      Calculate Savings
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-8 bg-gray-50">
                <h3 className="text-2xl font-semibold mb-8 text-gray-800">Your Potential Savings</h3>
                <div className="space-y-8">
                  <div>
                    <h4 className="font-medium text-gray-600 text-sm uppercase tracking-wider">Incident Cost Reduction</h4>
                    <div className="text-3xl font-bold text-primary mt-2">$45,000</div>
                    <p className="text-sm text-gray-500 mt-1">Based on average incident cost of $15,000</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-600 text-sm uppercase tracking-wider">Paperwork Time Savings</h4>
                    <div className="text-3xl font-bold text-primary mt-2">$18,720</div>
                    <p className="text-sm text-gray-500 mt-1">Based on 10hrs/week at $36/hr</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-600 text-sm uppercase tracking-wider">Compliance Cost Avoidance</h4>
                    <div className="text-3xl font-bold text-primary mt-2">$12,500</div>
                    <p className="text-sm text-gray-500 mt-1">Based on average audit prep & potential fines</p>
                  </div>
                  <div className="border-t pt-6 mt-6">
                    <h4 className="font-medium text-gray-600 text-sm uppercase tracking-wider">Total Annual Savings</h4>
                    <div className="text-4xl font-bold text-primary mt-2">$76,220</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Reversal Section - Styled like screenshots */}
      <section className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Zero Risk, 100% Reward</h2>
              <div className="h-1 w-20 bg-primary mx-auto"></div>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100">
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Our Commitment to Your Success</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <CheckCircle size={24} className="text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block text-gray-800">30-day money-back guarantee</span>
                        <span className="text-gray-600 text-sm mt-1 block">Try FarmSafe360 risk-free</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={24} className="text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block text-gray-800">No setup fees or hidden costs</span>
                        <span className="text-gray-600 text-sm mt-1 block">Transparent pricing with no surprises</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={24} className="text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block text-gray-800">Cancel anytime, keep your data</span>
                        <span className="text-gray-600 text-sm mt-1 block">Your data always belongs to you</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-gray-800">Comprehensive Support</h3>
                  <ul className="space-y-6">
                    <li className="flex items-start">
                      <CheckCircle size={24} className="text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block text-gray-800">Full implementation support included</span>
                        <span className="text-gray-600 text-sm mt-1 block">We'll guide you through the entire process</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={24} className="text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block text-gray-800">Free data migration</span>
                        <span className="text-gray-600 text-sm mt-1 block">We'll import your existing safety data at no cost</span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={24} className="text-primary mt-1 mr-4 flex-shrink-0" />
                      <div>
                        <span className="font-semibold block text-gray-800">Unlimited technical support</span>
                        <span className="text-gray-600 text-sm mt-1 block">Our team is always ready to help</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mt-10 bg-yellow-50 p-6 rounded-xl border border-yellow-200 flex items-start">
                <Clock size={24} className="text-yellow-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-800">New Farm Safety Regulations Take Effect Soon</span>
                  <span className="text-gray-600">Ensure your compliance today before the deadline.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section - Styled like screenshots */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Loved by Farms Across Australia</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="#FFD700" color="#FFD700" />
                    ))}
                  </div>
                  <p className="font-medium text-gray-800">Sarah M.</p>
                  <p className="text-sm text-gray-500">Operations Manager, Riverdale Crops</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "FarmSafe360 has transformed our safety culture. We've reduced incidents by 78% and our workers actually enjoy using the app for daily checks."
              </p>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="#FFD700" color="#FFD700" />
                    ))}
                  </div>
                  <p className="font-medium text-gray-800">Mark J.</p>
                  <p className="text-sm text-gray-500">Farm Owner, Golden Valley Farms</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "We passed our safety audit with flying colors thanks to the digital records in FarmSafe360. The ROI was evident within the first month."
              </p>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-300 flex-shrink-0"></div>
                <div>
                  <div className="flex mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={16} fill="#FFD700" color="#FFD700" />
                    ))}
                  </div>
                  <p className="font-medium text-gray-800">David L.</p>
                  <p className="text-sm text-gray-500">Health & Safety Officer, Murray Basin Agriculture</p>
                </div>
              </div>
              <p className="text-gray-600 italic mb-4">
                "The worker health module is a game-changer. We've improved worker wellbeing and reduced time off due to preventable issues."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Styled like screenshots */}
      <section className="py-20 bg-gradient-to-b from-green-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-primary mx-auto"></div>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Is my sensitive farm data secure?</h3>
              <p className="text-gray-600">
                Absolutely. FarmSafe360 uses bank-level encryption and security protocols. Your data is stored in secure Australian data centers that comply with all privacy regulations. We never share your information with third parties.
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">How long does implementation take?</h3>
              <p className="text-gray-600">
                Most farms are fully operational within 30 days. Our structured 4-week implementation process ensures a smooth transition. Smaller operations can be up and running even faster, often within 2 weeks.
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">What if my workers aren't tech-savvy?</h3>
              <p className="text-gray-600">
                FarmSafe360 is designed with simplicity in mind. The mobile app has an intuitive interface that even the least tech-savvy workers can master in minutes. We also provide training resources and ongoing support.
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Can I integrate with our existing systems?</h3>
              <p className="text-gray-600">
                Yes, FarmSafe360 integrates with most farm management software, accounting systems, and equipment monitoring tools. Our team will work with you to ensure smooth data flow between systems.
              </p>
            </div>
            
            {/* FAQ Item 5 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">What happens to our data if we cancel?</h3>
              <p className="text-gray-600">
                Your data always belongs to you. If you decide to cancel, we provide a complete export of all your information in standard formats that can be imported into other systems. We also retain your data securely for 90 days post-cancellation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Styled like screenshots */}
      <section id="signup-section" className="py-24 bg-gradient-to-r from-primary-700 to-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-6 text-white text-3xl md:text-4xl font-bold">Protect Your Farm Today</h2>
            <p className="text-xl mb-10 mx-auto opacity-90 text-white">
              Join 500+ Australian farms already using FarmSafe360 to reduce incidents, ensure compliance, and protect their workers.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 text-lg py-6 px-10 rounded-full shadow-lg" asChild>
                <Link to="/signup">Start Free 30-Day Trial</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg py-6 px-10 rounded-full" onClick={watchDemo}>
                See FarmSafe360 in Action
              </Button>
            </div>
            <div className="flex justify-center items-center gap-2">
              <Shield size={20} className="text-white/80" />
              <p className="text-white/80">No credit card required. 30-day free trial with all features included.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
