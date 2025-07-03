import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import FarmMap, { AddRiskZoneModal } from '@/components/FarmMap';
import { FarmMapData, RiskZoneData, createMockFarmMapData } from '@/types/farmMap';
import { 
  MapPin,
  AlertTriangle,
  Shield,
  Zap,
  Settings,
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  FileText,
  Download,
  Map
} from 'lucide-react';

// Using RiskZoneData from farmMap types instead of local interface

const RiskArea = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('zones');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<RiskZoneData | null>(null);
  const [hoveredZone, setHoveredZone] = useState<RiskZoneData | null>(null);
  const [farmMapData, setFarmMapData] = useState<FarmMapData | null>(null);

  // Initialize farm map data
  useEffect(() => {
    if (user) {
      const mockData = createMockFarmMapData(user.id);
      setFarmMapData(mockData);
    }
  }, [user]);

  // Get risk zones from farm map data
  const riskZones = farmMapData?.riskZones || [];

  // Note: All risk zone data now comes from farmMapData.riskZones

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-500 hover:bg-red-600';
      case 'High': return 'bg-orange-500 hover:bg-orange-600';
      case 'Medium': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'Low': return 'bg-green-500 hover:bg-green-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getRiskLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleZoneAdded = (newZone: RiskZoneData) => {
    // Add the new zone to the farm map data
    if (farmMapData) {
      setFarmMapData({
        ...farmMapData,
        riskZones: [...farmMapData.riskZones, newZone]
      });
    }
  };

  // Handle map interactions
  const handleZoneClick = (zone: RiskZoneData) => {
    console.log('Zone clicked:', zone.name);
  };

  const handleZoneHover = (zone: RiskZoneData | null) => {
    setHoveredZone(zone);
  };

  const handleZoneSelect = (zone: RiskZoneData | null) => {
    setSelectedZone(zone);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Risk Area Management</h1>
          <p className="text-gray-500">Define and monitor risk zones across your farm operations</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2" size={16} />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="mr-2" size={16} />
            Search
          </Button>
          <Button size="sm">
            <Plus className="mr-2" size={16} />
            Add Risk Area
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="zones">Manage Zones</TabsTrigger>
          <TabsTrigger value="map">View Map</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="text-blue-500" size={20} />
                  <span>Total Areas</span>
                </CardTitle>
                <CardDescription>Defined risk zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <div className="text-sm text-blue-600">Active monitoring</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="text-amber-500" size={20} />
                  <span>High Risk</span>
                </CardTitle>
                <CardDescription>Areas requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2</div>
                <div className="text-sm text-amber-600">Immediate action needed</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="text-green-500" size={20} />
                  <span>Safe Areas</span>
                </CardTitle>
                <CardDescription>Low risk zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5</div>
                <div className="text-sm text-green-600">All clear</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="text-purple-500" size={20} />
                  <span>Active Alerts</span>
                </CardTitle>
                <CardDescription>Current notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">3</div>
                <div className="text-sm text-purple-600">Real-time monitoring</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Risk Area Activities</CardTitle>
                <CardDescription>Latest updates from your risk zones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
                    <AlertTriangle className="text-amber-500" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">Chemical Storage Area</p>
                      <p className="text-sm text-gray-600">Risk level elevated due to temperature increase</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <Shield className="text-green-500" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">Equipment Shed</p>
                      <p className="text-sm text-gray-600">Safety inspection completed successfully</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <MapPin className="text-blue-500" size={20} />
                    <div className="flex-1">
                      <p className="font-medium">New Area Added</p>
                      <p className="text-sm text-gray-600">Grain Storage B has been added to monitoring</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Risk Zone Map</CardTitle>
                <CardDescription>Visual overview of your farm risk areas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MapPin size={48} className="mx-auto mb-2" />
                    <p className="font-medium">Interactive Map</p>
                    <p className="text-sm">Risk area visualization will be displayed here</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">High-Risk Zones Management</h2>
              <p className="text-gray-600">Manage and configure your farm's risk areas</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="mr-2" size={16} />
                Export Report
              </Button>
              <Button size="sm" onClick={() => setShowAddModal(true)}>
                <Plus className="mr-2" size={16} />
                Add New Risk Zone
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Current Risk Zones */}
            <Card>
              <CardHeader>
                <CardTitle>Current Risk Zones</CardTitle>
                <CardDescription>Active risk areas requiring management attention</CardDescription>
              </CardHeader>
                             <CardContent>
                 <div className="space-y-4">
                   {riskZones.map((zone) => (
                     <div 
                       key={zone.id} 
                       className={`border rounded-lg p-4 space-y-3 transition-all cursor-pointer ${
                         selectedZone?.id === zone.id ? 'ring-2 ring-blue-500 border-blue-500' : 
                         hoveredZone?.id === zone.id ? 'border-gray-400 shadow-md' : ''
                       }`}
                       onClick={() => handleZoneSelect(zone)}
                     >
                       <div className="flex items-start justify-between">
                         <div className="flex-1">
                           <div className="flex items-center gap-2 mb-2">
                             <h3 className="font-semibold text-lg">{zone.name}</h3>
                             <Badge className={getRiskLevelBadgeColor(zone.riskLevel)}>
                               {zone.riskLevel}
                             </Badge>
                           </div>
                           <p className="text-sm text-gray-600 mb-1">{zone.category}</p>
                           <p className="text-sm text-gray-800 mb-2">{zone.description}</p>
                           <div className="text-xs text-gray-500">
                             <p>Last review: {zone.lastReview} | {zone.incidentsThisYear} incidents this year</p>
                             <p>Position: ({Math.round(zone.geometry.x)}, {Math.round(zone.geometry.y)})</p>
                           </div>
                         </div>
                         <div className="flex gap-1 ml-4">
                           <Button size="sm" variant="outline">
                             <Eye className="mr-1" size={14} />
                             View
                           </Button>
                           <Button size="sm" variant="outline">
                             <Edit className="mr-1" size={14} />
                             Edit
                           </Button>
                           <Button size="sm" className={getRiskLevelColor(zone.riskLevel)}>
                             <FileText className="mr-1" size={14} />
                             Action Plan
                           </Button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Interactive Farm Risk Map */}
                          {farmMapData && (
            <Card>
              <CardHeader>
                <CardTitle>Interactive Farm Risk Map</CardTitle>
                <CardDescription>
                  Click and drag to pan, scroll to zoom, click zones for details
                  {selectedZone && (
                    <span className="ml-2 text-blue-600 font-medium">
                      • Selected: {selectedZone.name}
                    </span>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative border rounded-lg overflow-hidden">
                  <FarmMap
                    mapData={farmMapData}
                    onZoneClick={handleZoneClick}
                    onZoneHover={handleZoneHover}
                    onZoneSelect={handleZoneSelect}
                    width={800}
                    height={500}
                    className="relative"
                  />
                </div>
                
                {/* Zone details panel */}
                {selectedZone && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-lg flex items-center gap-2">
                        {selectedZone.name}
                        <Badge className={getRiskLevelBadgeColor(selectedZone.riskLevel)}>
                          {selectedZone.riskLevel}
                        </Badge>
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedZone(null)}
                      >
                        ✕
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{selectedZone.category}</p>
                    <p className="text-sm mb-2">{selectedZone.description}</p>
                    <div className="text-xs text-gray-500 flex gap-4">
                      <span>Last review: {selectedZone.lastReview}</span>
                      <span>{selectedZone.incidentsThisYear} incidents this year</span>
                      <span>Location: {selectedZone.location}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="map" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Full-Screen Interactive Farm Map</CardTitle>
              <CardDescription>
                Expanded view of your farm's risk zones with enhanced interaction
                {selectedZone && (
                  <span className="ml-2 text-blue-600 font-medium">
                    • Selected: {selectedZone.name}
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {farmMapData ? (
                <div className="relative border rounded-lg overflow-hidden">
                  <FarmMap
                    mapData={farmMapData}
                    onZoneClick={handleZoneClick}
                    onZoneHover={handleZoneHover}
                    onZoneSelect={handleZoneSelect}
                    width={1000}
                    height={700}
                    className="relative"
                  />
                </div>
              ) : (
                <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Map size={48} className="mx-auto mb-2" />
                    <p className="font-medium">Loading Interactive Map...</p>
                    <p className="text-sm">Initializing farm layout with risk zones</p>
                  </div>
                </div>
              )}
              
              {/* Enhanced zone details for full-screen view */}
              {selectedZone && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {selectedZone.name}
                        <Badge className={getRiskLevelBadgeColor(selectedZone.riskLevel)}>
                          {selectedZone.riskLevel}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Category:</strong> {selectedZone.category}</p>
                        <p><strong>Description:</strong> {selectedZone.description}</p>
                        <p><strong>Location:</strong> {selectedZone.location}</p>
                        <p><strong>Last Review:</strong> {selectedZone.lastReview}</p>
                        <p><strong>Incidents This Year:</strong> {selectedZone.incidentsThisYear}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Zone Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2">
                        <Button variant="outline">
                          <Eye className="mr-2" size={16} />
                          View Detailed Report
                        </Button>
                        <Button variant="outline">
                          <Edit className="mr-2" size={16} />
                          Edit Zone Properties
                        </Button>
                        <Button className={getRiskLevelColor(selectedZone.riskLevel)}>
                          <FileText className="mr-2" size={16} />
                          Create Action Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Zone Reports</CardTitle>
              <CardDescription>Generate and export risk analysis reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Risk Analysis Reports</h3>
                <p className="mb-4">Generate comprehensive reports on risk zones and incidents</p>
                <Button variant="outline">
                  <Download className="mr-2" size={16} />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>



        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Risk Area Settings</CardTitle>
              <CardDescription>Configure risk thresholds and alert preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Settings size={48} className="mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Configuration Settings</h3>
                <p className="mb-4">Set up risk thresholds, alert levels, and notification preferences</p>
                <Button variant="outline">
                  <Settings className="mr-2" size={16} />
                  Open Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Risk Zone Modal */}
      <AddRiskZoneModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onZoneAdded={handleZoneAdded}
      />
    </div>
  );
};

export default RiskArea; 