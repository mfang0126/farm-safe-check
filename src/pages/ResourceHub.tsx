import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, FileCheck, Search } from "lucide-react";

const resources = [
  {
    id: 1,
    title: "Maintenance Log Template",
    description: "Detailed log sheet for tracking equipment maintenance history.",
    type: "PDF",
    category: "Templates",
    downloadUrl: "#",
    updatedAt: "2025-03-15"
  },
  {
    id: 2,
    title: "Safety Checklist Template",
    description: "Customizable checklist for different types of farm equipment.",
    type: "DOCX",
    category: "Templates",
    downloadUrl: "#",
    updatedAt: "2025-03-20"
  },
  {
    id: 3,
    title: "Incident Report Form",
    description: "Standard form for documenting safety incidents and accidents.",
    type: "PDF",
    category: "Templates",
    downloadUrl: "#",
    updatedAt: "2025-04-01"
  },
  {
    id: 4,
    title: "Farm Equipment Safety Guide",
    description: "Comprehensive guide with best practices for farm equipment safety.",
    type: "PDF",
    category: "Guides",
    downloadUrl: "#",
    updatedAt: "2025-02-10"
  },
  {
    id: 5,
    title: "OSHA Agricultural Safety Standards",
    description: "Overview of relevant OSHA standards for agricultural operations.",
    type: "PDF",
    category: "Regulations",
    downloadUrl: "#",
    updatedAt: "2025-01-15"
  },
  {
    id: 6,
    title: "Farm Safety Training Slides",
    description: "Presentation slides for training farm workers on equipment safety.",
    type: "PPTX",
    category: "Training",
    downloadUrl: "#",
    updatedAt: "2025-03-05"
  }
];

const articles = [
  {
    id: 101,
    title: "5 Critical Tractor Safety Features Every Farmer Should Check",
    description: "Learn about the most important safety features that can prevent accidents.",
    readTime: "5 min read",
    date: "2025-04-10",
    imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&q=80&w=400&h=250"
  },
  {
    id: 102,
    title: "How to Implement an Effective Equipment Maintenance Schedule",
    description: "Proper maintenance is key to equipment longevity and operational safety.",
    readTime: "8 min read",
    date: "2025-04-05",
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?auto=format&fit=crop&q=80&w=400&h=250"
  },
  {
    id: 103,
    title: "Understanding Equipment Compliance Requirements for Small Farms",
    description: "Navigating the complex world of agricultural safety regulations made simple.",
    readTime: "10 min read",
    date: "2025-03-28",
    imageUrl: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?auto=format&fit=crop&q=80&w=400&h=250"
  }
];

const ResourceHub = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compliance Resource Hub</h1>
        <p className="text-gray-600 mt-1">Access templates, guides, and resources for farm equipment safety</p>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
        <Input placeholder="Search resources..." className="pl-10" />
      </div>
      
      <Tabs defaultValue="resources">
        <TabsList className="grid grid-cols-2 w-full max-w-md mb-6">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resources">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {resources.map(resource => (
              <Card key={resource.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full">
                      {resource.category}
                    </span>
                    <span className="font-medium text-xs bg-gray-100 px-2 py-1 rounded-full">
                      {resource.type}
                    </span>
                  </div>
                  <CardTitle>{resource.title}</CardTitle>
                  <CardDescription>{resource.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-500">
                  Updated: {new Date(resource.updatedAt).toLocaleDateString()}
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2 bg-primary hover:bg-primary-600">
                    <Download size={16} />
                    Download
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="articles">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {articles.map(article => (
              <Card key={article.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <div className="flex gap-2 text-sm text-gray-500 mt-1">
                        <span>{article.readTime}</span>
                        <span>•</span>
                        <span>{new Date(article.date).toLocaleDateString()}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{article.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="gap-2">
                        <FileText size={16} />
                        Read Article
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="bg-primary-50 border border-primary-100 p-6 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-primary-900">Need Custom Resources?</h2>
            <p className="text-primary-700 mt-2">
              Our team can create customized compliance documents tailored to your specific equipment and farm operations.
            </p>
          </div>
          <Button className="bg-primary hover:bg-primary-600 whitespace-nowrap">
            Request Custom Resources
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourceHub;
