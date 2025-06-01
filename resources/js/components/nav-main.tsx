import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Modulos</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <div key={item.title}>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={item.href === page.url}
                                tooltip={{ children: item.title }}
                            >
                                <Link href={item.href} prefetch>
                                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        {item.children && item.children.length > 0 && (
                            <SidebarMenu className="ml-4">
                                {item.children.map((child) => (
                                    <SidebarMenuItem key={child.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={child.href === page.url}
                                            tooltip={{ children: child.title }}
                                        >
                                            <Link href={child.href} prefetch>
                                                {child.icon && <child.icon className="w-4 h-4 mr-2" />}
                                                <span>{child.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        )}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}