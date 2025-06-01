import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Settings,
    FileText,
    DollarSign,
    PieChart,
    List,
    TrendingUp,
    User2
} from 'lucide-react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Mantenimientos',
        href: '/mantenimientos/tipos-gasto',
        icon: Settings,
        children: [
            {
                title: 'Tipos de Gasto',
                href: '/mantenimientos/tipos-gasto',
                icon: FileText,
            },
            {
                title: 'Fondos Monetarios',
                href: '/mantenimientos/fondos-monetarios',
                icon: DollarSign,
            },
        ],
    },
    {
        title: 'Movimientos',
        href: '/movimientos/presupuestos',
        icon: List,
        children: [
            {
                title: 'Presupuestos',
                href: '/movimientos/presupuestos',
                icon: FileText,
            },
            {
                title: 'Gastos',
                href: '/movimientos/gastos',
                icon: FileText,
            },
            {
                title: 'Depósitos',
                href: '/movimientos/depositos',
                icon: DollarSign,
            },
        ],
    },
    {
        title: 'Reportes',
        href: '/reportes/consulta-movimientos',
        icon: PieChart,
        children: [
            {
                title: 'Consulta de Movimientos',
                href: '/reportes/consulta-movimientos',
                icon: List,
            },
            {
                title: 'Gráfico: Presupuesto vs Ejecución',
                href: '/reportes/grafico-presupuesto-ejecucion',
                icon: TrendingUp,
            },
        ],
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
        icon: User2,
    },
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    const { auth } = usePage().props as { auth: { user: { rol: string } } };

    const userRol = auth?.user?.rol ?? 'usuario';

    // Función que filtra los módulos según el rol
    function filterNavItemsByRole(items: NavItem[], rol: string): NavItem[] {
        return items.filter(item => {
            if (item.title === 'Mantenimientos' && rol !== 'admin') {
                return false; // solo admin puede ver Mantenimientos
            }
            if (item.title === 'Usuarios' && rol !== 'admin') {
                return false;
            }

            if (item.children) {
                item.children = filterNavItemsByRole(item.children, rol);
            }

            return true;
        });
    }

    const filteredNavItems = filterNavItemsByRole(mainNavItems, userRol);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={filteredNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
