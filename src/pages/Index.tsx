import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChefHat, TrendingUp, Users, Package } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        navigate("/dashboard");
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <ChefHat className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              MenuSync HQ
            </span>
          </div>
          <Button onClick={() => navigate("/auth")} className="bg-gradient-primary hover:opacity-90">
            Get Started
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">
            Modern Restaurant{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              POS System
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your restaurant operations with our all-in-one point of sale system. 
            Manage orders, inventory, staff, and analytics in real-time.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:opacity-90 h-12 px-8 text-base"
            >
              Start Free Trial
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="h-12 px-8 text-base"
            >
              Learn More
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-border">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Real-time Analytics</h3>
            <p className="text-muted-foreground">
              Track sales, orders, and performance metrics in real-time with beautiful dashboards.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-border">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Staff Management</h3>
            <p className="text-muted-foreground">
              Manage your team efficiently with role-based access and performance tracking.
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow border border-border">
            <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-foreground">Inventory Control</h3>
            <p className="text-muted-foreground">
              Keep track of stock levels and get alerts when items are running low.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
