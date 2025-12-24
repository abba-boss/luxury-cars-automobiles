import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Star, Shield, MapPin, Phone, MessageCircle, Users } from "lucide-react";
import { useState } from "react";

const VendorsPage = () => {
  // For a single-brand approach, we can show luxury car's team
  // Replaced "Sarkin Mota" brand name with generic term
  const teamMembers = [
    {
      id: "sm-1",
      name: "Dr. Aliyu Mohammad (Al-Amin)",
      title: "Founder & CEO",
      rating: 5.0,
      sales: 5000,
      location: "Abuja, Nigeria",
      isVerified: true,
    },
    {
      id: "sm-2",
      name: "luxury car Sales Team",
      // Replaced "Sarkin Mota" brand name with generic term
      title: "Professional Sales",
      rating: 4.9,
      sales: 12000,
      location: "Nationwide, Nigeria",
      isVerified: true,
    },
    {
      id: "sm-3",
      name: "luxury car Operations",
      // Replaced "Sarkin Mota" brand name with generic term
      title: "Operations & Logistics",
      rating: 4.8,
      sales: 0,
      location: "Abuja, Nigeria",
      isVerified: true,
    },
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const filteredTeams = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Our Team" subtitle="Meet the automotive experts at luxury car">
      {/* Replaced "Sarkin Mota" brand name with generic term */}
      {/* Search */}
      <div className="relative max-w-md mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-11"
        />
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map((member, index) => (
          <Card
            key={member.id}
            variant="premium"
            className="p-6 animate-fade-in-up"
            style={{ animationDelay: `${0.1 * index}s` }}
          >
            <CardContent className="p-0">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{member.name}</h3>
                    {member.isVerified && (
                      <Shield className="h-4 w-4 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.title}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span>{member.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{member.sales.toLocaleString()}+ sales</span>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{member.location}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary mb-4">
                <div className="flex-1 text-center">
                  <p className="text-xl font-bold text-foreground">{member.sales.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Deals Completed</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div className="flex-1 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                    <p className="text-xl font-bold text-foreground">{member.rating}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Rating</p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                {member.isVerified && (
                  <Badge variant="verified" className="gap-1">
                    <Shield className="h-3 w-3" />
                    Verified Team
                  </Badge>
                )}
                <Badge variant="premium" className="gap-1">
                  <Users className="h-3 w-3" />
                  Professional Staff
                </Badge>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Phone className="h-4 w-4" />
                  Call
                </Button>
                <Button variant="default" className="flex-1 gap-2">
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTeams.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No team members found</h3>
          <p className="text-muted-foreground">Try adjusting your search query</p>
        </div>
      )}
    </Layout>
  );
};

export default VendorsPage;
