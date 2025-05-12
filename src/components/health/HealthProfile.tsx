
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertCircle, Lock } from "lucide-react";
import HealthStatusBadge from './HealthStatusBadge';
import HealthConditionCard from './HealthConditionCard';
import AllergyCard from './AllergyCard';
import RestrictionCard from './RestrictionCard';
import EmergencyContactCard from './EmergencyContactCard';
import MedicalAlertCard from './MedicalAlertCard';
import { getWorkerHealthProfile } from './mock-data';
import { HealthProfile as HealthProfileType } from '@/types/health';

interface HealthProfileProps {
  workerId: string;
}

const HealthProfile = ({ workerId }: HealthProfileProps) => {
  const [profile, setProfile] = useState<HealthProfileType | undefined>(getWorkerHealthProfile(workerId));
  const [activeTab, setActiveTab] = useState("overview");

  if (!profile) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-2 text-lg font-medium">No Health Profile Found</h3>
            <p className="mt-1 text-muted-foreground">
              This worker does not have a health profile yet.
            </p>
            <Button className="mt-4">Create Health Profile</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date);
  };

  const handleViewPlan = (id: string) => {
    console.log(`View plan for item with ID: ${id}`);
    // In a real implementation, this would open a detailed view of the health action plan
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="relative pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">Health Profile</CardTitle>
              <CardDescription>
                Last updated: {formatDate(profile.lastAssessmentDate)}
              </CardDescription>
            </div>
            <div className="flex space-x-1">
              <Badge variant="outline" className="border-primary/50 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                <span>Private</span>
              </Badge>
              <Badge variant="outline" className="border-primary/50 flex items-center gap-1">
                <FileText className="h-3 w-3" />
                <span>Medical</span>
              </Badge>
              <Badge variant="outline" className="border-primary/50 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                <span>Confidential</span>
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <HealthStatusBadge 
                  status={profile.fitnessStatus} 
                  restrictionsCount={profile.restrictions.length}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Last Assessment</div>
                  <div className="font-medium">{formatDate(profile.lastAssessmentDate)}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Next Medical Review</div>
                  <div className="font-medium">{profile.nextAssessmentDate ? formatDate(profile.nextAssessmentDate) : 'Not scheduled'}</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="medical">Medical</TabsTrigger>
          <TabsTrigger value="accommodations">Accommodations</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Health Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.allergies.some(a => a.severity === 'severe') && (
                <MedicalAlertCard 
                  title="Severe Allergy Alert"
                  description={`This worker has a severe allergy to ${profile.allergies.find(a => a.severity === 'severe')?.allergen}.`}
                  level="critical"
                  instructions={[
                    "Keep appropriate medication accessible",
                    "Know emergency response procedures",
                    "Avoid exposure to allergen"
                  ]}
                  actions={[
                    { id: '1', type: 'primary', label: 'View Response Plan' },
                    { id: '2', type: 'secondary', label: 'Alert Team' }
                  ]}
                  onActionClick={(action) => console.log('Action clicked:', action)}
                />
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Medical Conditions</h3>
                  {profile.medicalConditions.length > 0 ? (
                    profile.medicalConditions.map(condition => (
                      <HealthConditionCard 
                        key={condition.id} 
                        condition={condition}
                        onViewPlan={handleViewPlan}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No medical conditions recorded.</p>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Allergies</h3>
                  {profile.allergies.length > 0 ? (
                    profile.allergies.map(allergy => (
                      <AllergyCard 
                        key={allergy.id} 
                        allergy={allergy}
                        onViewPlan={handleViewPlan}
                      />
                    ))
                  ) : (
                    <p className="text-muted-foreground">No allergies recorded.</p>
                  )}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Current Restrictions</h3>
                {profile.restrictions.length > 0 ? (
                  profile.restrictions.map(restriction => (
                    <RestrictionCard 
                      key={restriction.id} 
                      restriction={restriction}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">No current restrictions.</p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold mb-3">Emergency Contacts</h3>
                {profile.emergencyContacts.length > 0 ? (
                  profile.emergencyContacts.map(contact => (
                    <EmergencyContactCard 
                      key={contact.id} 
                      contact={contact}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground">No emergency contacts recorded.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>
                Medical history and documentation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain detailed medical information.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accommodations">
          <Card>
            <CardHeader>
              <CardTitle>Accommodations</CardTitle>
              <CardDescription>
                Workplace accommodations and adjustments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain accommodation information.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assessments">
          <Card>
            <CardHeader>
              <CardTitle>Assessments</CardTitle>
              <CardDescription>
                Health assessment history and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain assessment history.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency">
          <Card>
            <CardHeader>
              <CardTitle>Emergency Information</CardTitle>
              <CardDescription>
                Critical medical information for emergencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This tab would contain emergency medical information.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HealthProfile;
