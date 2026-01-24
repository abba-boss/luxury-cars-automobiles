import { useState, useEffect } from 'react';
import {
  Home,
  Image,
  Type,
  Link,
  Save,
  Eye,
  Plus,
  Trash2,
  GripVertical,
  Settings,
  Layout,
  Sparkles,
  Car,
  Quote,
  Upload,
  Loader2
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { homepageImageService } from '@/services';
import type { HomepageImage } from '@/types/api';
import HomepageImageUpload from '@/components/admin/HomepageImageUpload';

interface FeaturedSection {
  id: string;
  type: 'featured' | 'new_arrivals' | 'hot_deals';
  title: string;
  enabled: boolean;
  count: number;
}

interface HeroSlide extends HomepageImage {
  id: string;
}

const mockSections: FeaturedSection[] = [
  { id: '1', type: 'featured', title: 'Featured Vehicles', enabled: true, count: 6 },
  { id: '2', type: 'new_arrivals', title: 'New Arrivals', enabled: true, count: 4 },
  { id: '3', type: 'hot_deals', title: 'Hot Deals', enabled: true, count: 4 },
];

const AdminHomepage = () => {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [sections, setSections] = useState<FeaturedSection[]>(mockSections);
  const [siteTitle, setSiteTitle] = useState('Sarkin Mota');
  const [siteTagline, setSiteTagline] = useState('Trusted Cars. Transparent Deals.');
  const [footerText, setFooterText] = useState('© 2024 Sarkin Mota. All rights reserved.');
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [showLiveChat, setShowLiveChat] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch homepage images on component mount
  useEffect(() => {
    fetchHomepageImages();
  }, []);

  const fetchHomepageImages = async () => {
    try {
      setLoading(true);
      const response = await homepageImageService.getHomepageImages({ section_type: 'hero' });
      if (response.success && response.data) {
        // Convert API response to HeroSlide format
        const slides: HeroSlide[] = response.data.map(img => ({
          ...img,
          id: img.id.toString(),
          cta: img.cta_text || '',
          ctaLink: img.cta_link || ''
        }));
        setHeroSlides(slides);
      } else {
        toast.error(response.message || 'Failed to load homepage images');
      }
    } catch (error) {
      console.error('Error fetching homepage images:', error);
      toast.error('Failed to load homepage images');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Update all hero slides
      for (const slide of heroSlides) {
        await homepageImageService.updateHomepageImage(parseInt(slide.id), {
          title: slide.title,
          subtitle: slide.subtitle,
          image_url: slide.image_url,
          cta_text: slide.cta,
          cta_link: slide.ctaLink,
          is_active: slide.enabled,
          position: slide.position,
          section_type: slide.section_type
        });
      }

      toast.success('Homepage settings saved');
    } catch (error) {
      console.error('Error saving homepage images:', error);
      toast.error('Failed to save homepage settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleSlide = (id: string) => {
    setHeroSlides(slides => slides.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const toggleSection = (id: string) => {
    setSections(sects => sects.map(s =>
      s.id === id ? { ...s, enabled: !s.enabled } : s
    ));
  };

  const deleteSlide = async (id: string) => {
    try {
      await homepageImageService.deleteHomepageImage(parseInt(id));
      setHeroSlides(slides => slides.filter(s => s.id !== id));
      toast.success('Slide deleted');
    } catch (error) {
      console.error('Error deleting slide:', error);
      toast.error('Failed to delete slide');
    }
  };

  const addNewSlide = () => {
    const newSlide: HeroSlide = {
      id: `new-${Date.now()}`,
      title: 'New Slide',
      subtitle: 'Enter subtitle here',
      image_url: '/placeholder.svg',
      cta: 'Learn More',
      ctaLink: '#',
      position: heroSlides.length,
      is_active: true,
      section_type: 'hero',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setHeroSlides([...heroSlides, newSlide]);
  };

  const updateSlideField = (id: string, field: keyof HeroSlide, value: any) => {
    setHeroSlides(slides => slides.map(slide =>
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  return (
    <AdminLayout>
      <div className="space-y-6 h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Homepage Controls</h2>
            <p className="text-muted-foreground">Customize your website's homepage</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 rounded-xl">
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button className="gap-2 rounded-xl" onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="hero" className="space-y-6">
          <TabsList className="bg-card border border-border rounded-xl p-1">
            <TabsTrigger value="hero" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Image className="w-4 h-4" />
              Hero Carousel
            </TabsTrigger>
            <TabsTrigger value="sections" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layout className="w-4 h-4" />
              Sections
            </TabsTrigger>
            <TabsTrigger value="general" className="rounded-lg gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
          </TabsList>

          {/* Hero Carousel Tab */}
          <TabsContent value="hero" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Hero Slides</h3>
              <div className="flex gap-2">
                <Button className="gap-2 rounded-xl" onClick={addNewSlide}>
                  <Plus className="w-4 h-4" />
                  Add Slide
                </Button>
              </div>
            </div>

            {/* Upload Component */}
            <HomepageImageUpload onUploadSuccess={fetchHomepageImages} />

            {loading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-4">
                {heroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className="rounded-2xl bg-card border border-border p-6 animate-fade-in"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="cursor-grab text-muted-foreground">
                        <GripVertical className="w-5 h-5" />
                      </div>

                      <div className="w-32 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                        <img src={slide.image_url} alt={slide.title} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-foreground">{slide.title}</h4>
                            <p className="text-sm text-muted-foreground">{slide.subtitle}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={slide.is_active ? 'default' : 'secondary'}>
                              {slide.is_active ? 'Active' : 'Disabled'}
                            </Badge>
                            <Switch checked={slide.is_active} onCheckedChange={() => toggleSlide(slide.id)} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">CTA Button</Label>
                            <Input
                              value={slide.cta}
                              onChange={(e) => updateSlideField(slide.id, 'cta', e.target.value)}
                              className="mt-1 rounded-lg"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">CTA Link</Label>
                            <Input
                              value={slide.ctaLink}
                              onChange={(e) => updateSlideField(slide.id, 'ctaLink', e.target.value)}
                              className="mt-1 rounded-lg"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-muted-foreground">Image URL</Label>
                          <Input
                            value={slide.image_url}
                            onChange={(e) => updateSlideField(slide.id, 'image_url', e.target.value)}
                            className="mt-1 rounded-lg"
                            placeholder="Enter image URL"
                          />
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => deleteSlide(slide.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Sections Tab */}
          <TabsContent value="sections" className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Homepage Sections</h3>
            
            <div className="space-y-4">
              {sections.map((section, idx) => (
                <div
                  key={section.id}
                  className="rounded-2xl bg-card border border-border p-6 animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab text-muted-foreground">
                      <GripVertical className="w-5 h-5" />
                    </div>

                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      section.type === 'featured' && 'bg-primary/20 text-primary',
                      section.type === 'new_arrivals' && 'bg-blue-500/20 text-blue-400',
                      section.type === 'hot_deals' && 'bg-amber-500/20 text-amber-400'
                    )}>
                      {section.type === 'featured' && <Sparkles className="w-5 h-5" />}
                      {section.type === 'new_arrivals' && <Car className="w-5 h-5" />}
                      {section.type === 'hot_deals' && <Quote className="w-5 h-5" />}
                    </div>

                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">Showing {section.count} items</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">Items:</Label>
                        <Input
                          type="number"
                          value={section.count}
                          onChange={(e) => setSections(sects => sects.map(s =>
                            s.id === section.id ? { ...s, count: parseInt(e.target.value) || 4 } : s
                          ))}
                          className="w-20 rounded-lg"
                        />
                      </div>
                      <Switch checked={section.enabled} onCheckedChange={() => toggleSection(section.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-card border border-border p-6">
              <h4 className="font-semibold text-foreground mb-4">Additional Sections</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Layout className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Brand Showcase</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Quote className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Testimonials</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Why Choose Us</span>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div className="flex items-center gap-3">
                    <Car className="w-5 h-5 text-muted-foreground" />
                    <span className="text-foreground">Category Grid</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Site Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Site Title</Label>
                  <Input 
                    value={siteTitle} 
                    onChange={(e) => setSiteTitle(e.target.value)}
                    className="mt-1 rounded-xl" 
                  />
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input 
                    value={siteTagline} 
                    onChange={(e) => setSiteTagline(e.target.value)}
                    className="mt-1 rounded-xl" 
                  />
                </div>
              </div>

              <div>
                <Label>Footer Text</Label>
                <Textarea 
                  value={footerText} 
                  onChange={(e) => setFooterText(e.target.value)}
                  className="mt-1 rounded-xl" 
                  rows={2}
                />
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Chat & Support</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">WhatsApp Button</p>
                    <p className="text-sm text-muted-foreground">Show floating WhatsApp button</p>
                  </div>
                  <Switch checked={showWhatsApp} onCheckedChange={setShowWhatsApp} />
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                  <div>
                    <p className="font-medium text-foreground">Live Chat</p>
                    <p className="text-sm text-muted-foreground">Enable live chat widget</p>
                  </div>
                  <Switch checked={showLiveChat} onCheckedChange={setShowLiveChat} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border p-6 space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Social Links</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Instagram</Label>
                  <Input placeholder="https://instagram.com/..." className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Twitter/X</Label>
                  <Input placeholder="https://x.com/..." className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>Facebook</Label>
                  <Input placeholder="https://facebook.com/..." className="mt-1 rounded-xl" />
                </div>
                <div>
                  <Label>YouTube</Label>
                  <Input placeholder="https://youtube.com/..." className="mt-1 rounded-xl" />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminHomepage;
