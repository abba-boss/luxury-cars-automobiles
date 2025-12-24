import { useState } from 'react';
import {
  Upload,
  Image,
  Video,
  Folder,
  Grid3X3,
  List,
  Search,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Link,
  Check,
  X,
  Filter,
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  name: string;
  type: 'image' | 'video' | '360';
  url: string;
  size: string;
  uploadedAt: string;
  car?: string;
}

const mockMedia: MediaItem[] = [
  { id: '1', name: 'mercedes-front.jpg', type: 'image', url: '/placeholder.svg', size: '2.4 MB', uploadedAt: '2024-05-01', car: '2024 Mercedes S-Class' },
  { id: '2', name: 'bmw-interior.jpg', type: 'image', url: '/placeholder.svg', size: '1.8 MB', uploadedAt: '2024-05-01', car: '2023 BMW X7' },
  { id: '3', name: 'range-rover-360.zip', type: '360', url: '/placeholder.svg', size: '45 MB', uploadedAt: '2024-04-28', car: '2024 Range Rover' },
  { id: '4', name: 'lexus-promo.mp4', type: 'video', url: '/placeholder.svg', size: '128 MB', uploadedAt: '2024-04-25', car: '2024 Lexus LX 600' },
  { id: '5', name: 'toyota-side.jpg', type: 'image', url: '/placeholder.svg', size: '3.2 MB', uploadedAt: '2024-04-20', car: '2023 Toyota Land Cruiser' },
  { id: '6', name: 'porsche-engine.mp4', type: 'video', url: '/placeholder.svg', size: '89 MB', uploadedAt: '2024-04-18', car: '2024 Porsche 911' },
];

const AdminMedia = () => {
  const [media, setMedia] = useState<MediaItem[]>(mockMedia);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDelete = (id: string) => {
    setMedia(prev => prev.filter(item => item.id !== id));
    toast.success('Media deleted');
  };

  const handleBulkDelete = () => {
    setMedia(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    toast.success(`${selectedItems.length} items deleted`);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file upload
    toast.success('Files uploaded successfully');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case '360': return <Grid3X3 className="w-5 h-5" />;
      default: return <Image className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case '360': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Media Manager</h2>
            <p className="text-muted-foreground">Manage all images, videos, and 360° files</p>
          </div>
          <Button className="gap-2 rounded-xl">
            <Upload className="w-4 h-4" />
            Upload Files
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Image className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Images</p>
                <p className="text-xl font-bold text-foreground">{media.filter(m => m.type === 'image').length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Video className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Videos</p>
                <p className="text-xl font-bold text-foreground">{media.filter(m => m.type === 'video').length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">360° Views</p>
                <p className="text-xl font-bold text-foreground">{media.filter(m => m.type === '360').length}</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Folder className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Storage</p>
                <p className="text-xl font-bold text-foreground">2.4 GB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed rounded-2xl p-8 text-center transition-all',
            isDragging 
              ? 'border-primary bg-primary/5' 
              : 'border-border hover:border-primary/50'
          )}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground mb-2">Drag & Drop Files</h3>
          <p className="text-sm text-muted-foreground mb-4">
            or click to browse. Supports JPG, PNG, MP4, and ZIP files
          </p>
          <Button variant="outline" className="rounded-xl">
            Browse Files
          </Button>
        </div>

        {/* Filters & Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'image', 'video', '360'].map((type) => (
                <Button
                  key={type}
                  variant={typeFilter === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTypeFilter(type)}
                  className="rounded-lg capitalize"
                >
                  {type === 'all' ? 'All' : type}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedItems.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleBulkDelete} className="rounded-lg gap-2">
                <Trash2 className="w-4 h-4" />
                Delete ({selectedItems.length})
              </Button>
            )}
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button 
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Media Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredMedia.map((item, idx) => (
              <div
                key={item.id}
                className={cn(
                  'group relative rounded-xl border overflow-hidden transition-all animate-fade-in cursor-pointer',
                  selectedItems.includes(item.id) 
                    ? 'border-primary ring-2 ring-primary/30' 
                    : 'border-border hover:border-primary/50'
                )}
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => toggleSelect(item.id)}
              >
                <div className="aspect-square bg-secondary relative">
                  <img 
                    src={item.url} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={cn(
                    'absolute inset-0 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'
                  )}>
                    <Button variant="secondary" size="icon" className="rounded-lg w-8 h-8">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" size="icon" className="rounded-lg w-8 h-8">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="icon" 
                      className="rounded-lg w-8 h-8"
                      onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  {selectedItems.includes(item.id) && (
                    <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <Badge 
                    variant="outline" 
                    className={cn('absolute top-2 right-2', getTypeColor(item.type))}
                  >
                    {getTypeIcon(item.type)}
                  </Badge>
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-secondary/30">
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">File</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Associated Car</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Size</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Uploaded</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item, idx) => (
                  <tr 
                    key={item.id}
                    className={cn(
                      'border-b border-border/50 hover:bg-secondary/20 transition-colors animate-fade-in',
                      selectedItems.includes(item.id) && 'bg-primary/5'
                    )}
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-secondary overflow-hidden">
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="outline" className={cn('capitalize', getTypeColor(item.type))}>
                        {item.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{item.car || '-'}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{item.size}</td>
                    <td className="py-4 px-6 text-sm text-muted-foreground">{item.uploadedAt}</td>
                    <td className="py-4 px-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-lg">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Preview</DropdownMenuItem>
                          <DropdownMenuItem><Download className="w-4 h-4 mr-2" /> Download</DropdownMenuItem>
                          <DropdownMenuItem><Link className="w-4 h-4 mr-2" /> Copy Link</DropdownMenuItem>
                          <DropdownMenuItem 
                            className="text-destructive"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
