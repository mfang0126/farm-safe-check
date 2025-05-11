
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, FileText, Calendar, Clock, Users, CheckCircle } from 'lucide-react';
import { mockTrainingSessions } from './mock-data';

const TrainingCourses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'active' | 'upcoming' | 'past'>('active');
  
  // Group sessions by training type
  const getTrainingsByType = () => {
    const trainings = {};
    mockTrainingSessions.forEach(session => {
      if (!trainings[session.type]) {
        trainings[session.type] = [];
      }
      trainings[session.type].push(session);
    });
    return trainings;
  };
  
  const trainingsByType = getTrainingsByType();
  
  // Get the human-readable training type
  const getTrainingTypeLabel = (type: string) => {
    const labels = {
      'classroom': 'Classroom Training',
      'online': 'Online Course',
      'hands_on': 'Hands-on Workshop',
      'self_study': 'Self Study',
      'assessment': 'Assessment'
    };
    return labels[type] || type;
  };
  
  // Courses filtered by search and filter type
  const filteredSessions = mockTrainingSessions.filter(session => 
    (session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     session.instructor.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterType === 'all' || 
     (filterType === 'active' && new Date() >= session.schedule.startDate && new Date() <= session.schedule.endDate) ||
     (filterType === 'upcoming' && new Date() < session.schedule.startDate) ||
     (filterType === 'past' && new Date() > session.schedule.endDate))
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            placeholder="Search courses, instructors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button variant={filterType === 'all' ? 'default' : 'outline'} onClick={() => setFilterType('all')}>
            All
          </Button>
          <Button variant={filterType === 'active' ? 'default' : 'outline'} onClick={() => setFilterType('active')}>
            Active
          </Button>
          <Button variant={filterType === 'upcoming' ? 'default' : 'outline'} onClick={() => setFilterType('upcoming')}>
            Upcoming
          </Button>
          <Button variant={filterType === 'past' ? 'default' : 'outline'} onClick={() => setFilterType('past')}>
            Past
          </Button>
        </div>
        
        <Button>
          <Plus size={16} className="mr-2" />
          Create Course
        </Button>
      </div>
      
      <Tabs defaultValue="grid" className="w-full">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Training Courses</h3>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="grid" className="mt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map(session => (
              <Card key={session.id} className="hover:shadow-md transition-shadow">
                <div className="h-32 bg-muted flex items-center justify-center overflow-hidden">
                  <div 
                    className={`px-4 py-2 rounded text-xs uppercase tracking-wider font-semibold ${
                      session.type === 'classroom' ? 'bg-blue-100 text-blue-800' :
                      session.type === 'online' ? 'bg-green-100 text-green-800' :
                      session.type === 'hands_on' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {getTrainingTypeLabel(session.type)}
                  </div>
                </div>
                <CardHeader className="p-4 pb-0">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{session.title}</CardTitle>
                    <Badge variant={
                      new Date() > session.schedule.endDate ? "outline" :
                      new Date() >= session.schedule.startDate ? "default" : "secondary"
                    }>
                      {new Date() > session.schedule.endDate ? "Completed" :
                       new Date() >= session.schedule.startDate ? "Active" : "Upcoming"}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Instructor: {session.instructor.name}
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{new Date(session.schedule.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span>
                        {new Date(session.schedule.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                        {new Date(session.schedule.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>{session.capacity.current}/{session.capacity.max} enrolled</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex justify-between">
                    <Button size="sm" variant="outline">View Details</Button>
                    <Button size="sm">Enroll</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {filteredSessions.length === 0 && (
              <div className="col-span-full p-12 text-center text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <h3 className="font-medium text-lg">No courses found</h3>
                <p>Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4">Course</th>
                    <th className="text-left p-4">Type</th>
                    <th className="text-left p-4">Date & Time</th>
                    <th className="text-left p-4">Enrollment</th>
                    <th className="text-left p-4">Status</th>
                    <th className="text-right p-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.map((session, index) => (
                    <tr key={session.id} className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-muted/20'}`}>
                      <td className="p-4">
                        <div className="font-medium">{session.title}</div>
                        <div className="text-sm text-muted-foreground">
                          Instructor: {session.instructor.name}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          session.type === 'classroom' ? 'bg-blue-100 text-blue-800' :
                          session.type === 'online' ? 'bg-green-100 text-green-800' :
                          session.type === 'hands_on' ? 'bg-amber-100 text-amber-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getTrainingTypeLabel(session.type)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>{new Date(session.schedule.startDate).toLocaleDateString()}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(session.schedule.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                          {new Date(session.schedule.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{session.capacity.current}/{session.capacity.max}</span>
                        </div>
                        {session.capacity.waitlist > 0 && (
                          <div className="text-sm text-muted-foreground">
                            +{session.capacity.waitlist} waitlist
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`flex items-center gap-1 ${
                          new Date() > session.schedule.endDate ? 'text-green-600' :
                          new Date() >= session.schedule.startDate ? 'text-blue-600' : 'text-amber-600'
                        }`}>
                          {new Date() > session.schedule.endDate ? (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              <span>Completed</span>
                            </>
                          ) : new Date() >= session.schedule.startDate ? (
                            <>
                              <Clock className="h-4 w-4" />
                              <span>Active</span>
                            </>
                          ) : (
                            <>
                              <Calendar className="h-4 w-4" />
                              <span>Upcoming</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button size="sm" variant="outline" className="mr-2">View</Button>
                        <Button size="sm">Enroll</Button>
                      </td>
                    </tr>
                  ))}
                  
                  {filteredSessions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-12 text-center text-muted-foreground">
                        <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <h3 className="font-medium text-lg">No courses found</h3>
                        <p>Try adjusting your search or filters</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader className="px-6 py-4 bg-muted/50">
          <CardTitle className="text-lg">Filter Courses by Type</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(trainingsByType).map(([type, sessions]) => (
              <div key={type} className={`p-4 border rounded-lg ${
                type === 'classroom' ? 'border-blue-200 bg-blue-50' :
                type === 'online' ? 'border-green-200 bg-green-50' :
                type === 'hands_on' ? 'border-amber-200 bg-amber-50' :
                type === 'self_study' ? 'border-purple-200 bg-purple-50' :
                'border-gray-200 bg-gray-50'
              }`}>
                <div className="font-medium">{getTrainingTypeLabel(type)}</div>
                <div className="text-2xl font-bold mt-1">{sessions.length}</div>
                <div className="text-sm text-muted-foreground">courses available</div>
                <Button variant="outline" className="w-full mt-2 text-xs">
                  View All
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">Quick Filters</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="required" />
                <Label htmlFor="required">Required Training</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="expiring" />
                <Label htmlFor="expiring">Expiring Soon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="recommended" />
                <Label htmlFor="recommended">Recommended</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="free-seats" />
                <Label htmlFor="free-seats">With Free Seats</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingCourses;
