import { Card, CardContent } from "@/components/ui/card";

export default function StatsSection() {
  return (
    <section className="section bg-secondary">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Making a Difference Together</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Join thousands who have transformed their daily habits and discovered a more balanced, fulfilling life.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
            <p className="text-gray-700">Lives Changed</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">12k+</div>
            <p className="text-gray-700">Hours Reclaimed</p>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">$500k+</div>
            <p className="text-gray-700">Social Impact</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Group meditation class" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Community Workshops</h3>
              <p className="text-gray-600 text-sm">Free wellness workshops for underserved communities.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="People working together" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Team Building</h3>
              <p className="text-gray-600 text-sm">Corporate wellness programs improving workplace culture.</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white rounded-lg overflow-hidden shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
              alt="Meditation group" 
              className="w-full h-48 object-cover"
            />
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Wellness Support</h3>
              <p className="text-gray-600 text-sm">Providing resources to mental health organizations.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
