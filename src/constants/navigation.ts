import { Calendar, FileCheck, LayoutDashboard, PieChart, Tractor } from "lucide-react";

export const NAV_ITEMS = [
    { icon: LayoutDashboard, name: 'Dashboard', path: '/dashboard' },
    { icon: Tractor, name: 'Equipment', path: '/dashboard/equipment' },
    { icon: FileCheck, name: 'Checklists', path: '/dashboard/checklists' },
    { icon: Calendar, name: 'Maintenance', path: '/dashboard/maintenance' },
    // { icon: AlertTriangle, name: 'Incidents', path: '/dashboard/incidents' },
    // { icon: BookOpen, name: 'Training', path: '/dashboard/training' },
    // { icon: Heart, name: 'Worker Health', path: '/dashboard/health' },
    { icon: PieChart, name: 'Risk Dashboard', path: '/dashboard/risk' },
    // { icon: FileText, name: 'Resources', path: '/dashboard/resources' },
  ];