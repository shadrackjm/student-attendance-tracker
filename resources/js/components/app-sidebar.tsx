import { Link, usePage } from '@inertiajs/react';
import { BookOpen, CalendarCheck, FileBarChart, FolderGit2, GraduationCap, LayoutGrid, School, Users } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { Auth, NavItem } from '@/types';

type Role = Auth['user']['role'];

// Each item lists the roles allowed to see it. Undefined means "everyone".
type GatedNavItem = NavItem & { roles?: Role[] };

const mainNavItems: GatedNavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Take Attendance',
        href: '/attendance',
        icon: CalendarCheck,
        roles: ['teacher'],
    },
    {
        title: 'My Attendance',
        href: '/my-attendance',
        icon: CalendarCheck,
        roles: ['student'],
    },
    {
        title: 'Teachers',
        href: '/teachers',
        icon: Users,
        roles: ['admin'],
    },
    {
        title: 'Classes',
        href: '/classes',
        icon: School,
        roles: ['admin'],
    },
    {
        title: 'Students',
        href: '/students',
        icon: GraduationCap,
        roles: ['admin'],
    },
    {
        title: 'Reports',
        href: '/reports',
        icon: FileBarChart,
        roles: ['admin'],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: Auth }>().props;
    const role = auth.user.role;

    const items = mainNavItems.filter((item) => !item.roles || item.roles.includes(role));

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
