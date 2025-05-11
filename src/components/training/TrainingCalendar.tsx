
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, Clock, MapPin } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { mockTrainingSessions } from './mock-data';

const TrainingCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  
  // Filter sessions for current date if in calendar view
  const currentSessions = view === 'calendar' && date
    ? mockTrainingSessions.filter(session => 
        format(session.schedule.startDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )
    : mockTrainingSessions;
  
  const selectedSessionDetails = selectedSession 
    ? mockTrainingSessions.find(s => s.id === selectedSession) 
    : null;
  
  // Helper to group training sessions by date for list view
  const groupSessionsByDate = () => {
    const grouped = {};
    mockTrainingSessions.forEach(session => {
      const dateKey = format(session.schedule.startDate, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(session);
    });
    return grouped;
  };
  
  const groupedSessions = groupSessionsByDate();
  const sortedDates = Object.keys(groupedSessions).sort();
  
  // Helper for parsing sessions for calendar day rendering
  const hasSessions = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return mockTrainingSessions.some(session => 
      format(session.schedule.startDate, 'yyyy-MM-dd') === dateStr
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                modifiers={{
                  hasSessions: (day) => hasSessions(day)
                }}
                modifiersStyles={{
                  hasSessions: { fontWeight: 'bold', backgroundColor: 'rgba(var(--primary), 0.1)' }
                }}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Select value={view} onValueChange={(value: 'calendar' | 'list') => setView(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="calendar">Calendar</SelectItem>
              <SelectItem value="list">List</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button>Schedule Training</Button>
      </div>
      
      {view === 'calendar' ? (
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="col-span-2">
            <CardHeader className="px-6 py-4 bg-muted/50">
              <CardTitle className="text-lg">
                Training Schedule - {date ? format(date, 'MMMM d, yyyy') : 'Select a Date'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {currentSessions.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Time</TableHead>
                      <TableHead>Training</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentSessions.map(session => (
                      <TableRow 
                        key={session.id} 
                        className={`cursor-pointer hover:bg-muted/50 ${selectedSession === session.id ? 'bg-muted/50' : ''}`}
                        onClick={() => setSelectedSession(session.id)}
                      >
                        <TableCell>
                          {format(session.schedule.startDate, 'h:mm a')} - {format(session.schedule.endDate, 'h:mm a')}
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{session.title}</div>
                          <div className="text-sm text-muted-foreground">
                            Instructor: {session.instructor.name}
                          </div>
                        </TableCell>
                        <TableCell>{session.schedule.location}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users size={14} />
                            <span>{session.capacity.current}/{session.capacity.max}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="outline">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No training sessions scheduled for this date.
                </div>
              )}
            </CardContent>
          </Card>
          
          {selectedSessionDetails ? (
            <Card>
              <CardHeader className="px-6 py-4 bg-muted/50">
                <CardTitle className="text-lg">{selectedSessionDetails.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-medium">Session Details</h3>
                  <dl className="grid grid-cols-2 gap-1 text-sm mt-2">
                    <dt className="text-muted-foreground flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Date
                    </dt>
                    <dd>{format(selectedSessionDetails.schedule.startDate, 'PPP')}</dd>
                    
                    <dt className="text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Time
                    </dt>
                    <dd>
                      {format(selectedSessionDetails.schedule.startDate, 'h:mm a')} - {format(selectedSessionDetails.schedule.endDate, 'h:mm a')}
                    </dd>
                    
                    <dt className="text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      Location
                    </dt>
                    <dd>{selectedSessionDetails.schedule.location}</dd>
                    
                    <dt className="text-muted-foreground">Instructor</dt>
                    <dd>{selectedSessionDetails.instructor.name}</dd>
                  </dl>
                </div>
                
                <div>
                  <h3 className="font-medium">Capacity</h3>
                  <div className="bg-muted rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary rounded-full h-full" 
                      style={{width: `${(selectedSessionDetails.capacity.current/selectedSessionDetails.capacity.max) * 100}%`}}
                    ></div>
                  </div>
                  <div className="text-sm mt-1 flex justify-between">
                    <span className="text-muted-foreground">
                      {selectedSessionDetails.capacity.current} enrolled
                    </span>
                    <span className="text-muted-foreground">
                      {selectedSessionDetails.capacity.max} max
                    </span>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium">Materials</h3>
                  <div className="space-y-1 mt-2">
                    {selectedSessionDetails.materials.map(material => (
                      <div key={material.id} className="flex items-center justify-between text-sm">
                        <div>{material.title}</div>
                        <Button variant="link" className="h-auto p-0">View</Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" className="flex-1">Add to Calendar</Button>
                  <Button className="flex-1">Enroll</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                <CalendarIcon className="h-12 w-12 mb-2 opacity-50" />
                <p>Select a session to view details</p>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader className="px-6 py-4 bg-muted/50 flex flex-row justify-between">
            <CardTitle className="text-lg">Upcoming Training Sessions</CardTitle>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {sortedDates.map(dateStr => (
                <div key={dateStr} className="p-4">
                  <h3 className="font-medium mb-2">{format(new Date(dateStr), 'EEEE, MMMM d, yyyy')}</h3>
                  <div className="space-y-3">
                    {groupedSessions[dateStr].map(session => (
                      <div key={session.id} className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{session.title}</h4>
                          <span className="text-sm text-muted-foreground">
                            {format(session.schedule.startDate, 'h:mm a')} - {format(session.schedule.endDate, 'h:mm a')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mt-1 text-sm">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.schedule.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {session.capacity.current}/{session.capacity.max}
                            </span>
                          </div>
                          <Button size="sm">View Details</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TrainingCalendar;
