import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Package, ArrowRight } from "lucide-react";

const MessagesPage = () => {
  const navigate = useNavigate();

  // Redirect to orders page since that's where the chat functionality is
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/orders');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <DashboardLayout title="Messages" subtitle="Your order conversations">
      <div className="max-w-2xl mx-auto">
        <Card variant="premium" className="p-8">
          <CardContent className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <MessageSquare className="w-10 h-10 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Order Chat System</h2>
              <p className="text-muted-foreground">
                All your order conversations are now in the Orders page
              </p>
            </div>

            <div className="space-y-4 text-left bg-secondary/30 p-6 rounded-lg">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">View Your Orders</h3>
                  <p className="text-sm text-muted-foreground">
                    See all your orders in one place with their current status
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Chat in Real-Time</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any order to open a WhatsApp-like chat with our team
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Get Instant Responses</h3>
                  <p className="text-sm text-muted-foreground">
                    Our admin team will respond to your messages instantly
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/orders')} 
                size="lg" 
                className="w-full"
              >
                Go to Orders & Chat
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              
              <p className="text-xs text-muted-foreground">
                Redirecting automatically in 3 seconds...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
