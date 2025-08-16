import { create } from 'zustand';

export interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

interface BreadcrumbState {
  breadcrumbs: BreadcrumbItem[];
  setBreadcrumbs: (breadcrumbs: BreadcrumbItem[]) => void;
  addBreadcrumb: (breadcrumb: BreadcrumbItem) => void;
  clearBreadcrumbs: () => void;
  updateBreadcrumbsFromPath: (pathname: string) => void;
}

const getPageTitleFromSegment = (segment: string): string => {
  const titleMap: Record<string, string> = {
    'dashboard': 'Dashboard',
    'bank': 'Bank',
    'client': 'Client',
    'investor': 'Investor',
    'deals': 'Deals',
    'investors': 'Investors',
    'clients': 'Clients',
    'analytics': 'Analytics',
    'overview': 'Overview',
    'documents': 'Documents',
    'timeline': 'Timeline',
    'settings': 'Settings',
    'cim': 'CIM',
    'data-room': 'Data Room',
    'investments': 'Investments',
    'opportunities': 'Opportunities',
    'tasks': 'Tasks',
  };

  return titleMap[segment] || segment
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  breadcrumbs: [],
  
  setBreadcrumbs: (breadcrumbs) => set({ breadcrumbs }),
  
  addBreadcrumb: (breadcrumb) => 
    set((state) => ({ 
      breadcrumbs: [...state.breadcrumbs, breadcrumb] 
    })),
  
  clearBreadcrumbs: () => set({ breadcrumbs: [] }),
  
  updateBreadcrumbsFromPath: (pathname) => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [];
    
    segments.forEach((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      const isActive = index === segments.length - 1;
      
      let label = getPageTitleFromSegment(segment);
      
      // Handle dynamic routes like [id]
      if (segment.match(/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/)) {
        // If it's a UUID, get a more meaningful label based on context
        const prevSegment = segments[index - 1];
        if (prevSegment === 'deals') {
          label = 'Deal Details';
        } else if (prevSegment === 'clients') {
          label = 'Client Details';
        } else {
          label = 'Details';
        }
      }
      
      breadcrumbs.push({
        label,
        href,
        isActive,
      });
    });
    
    set({ breadcrumbs });
  },
}));