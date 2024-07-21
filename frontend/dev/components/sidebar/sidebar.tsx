"use client"
import { FC, useState } from 'react';
import { Navbar, NavbarBrand, NavbarMenuToggle, NavbarMenuItem, NavbarMenu, NavbarContent, NavbarItem, Link, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { PiShippingContainerThin, PiMemoryThin, PiNetworkThin, PiFilesThin, PiStorefrontThin, PiUserGearThin, PiArrowFatDownDuotone } from "react-icons/pi";
import { DiDocker } from "react-icons/di";

import { useRouter, usePathname } from 'next/navigation'

export default function App() {
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const items = [
        {
            id: 'admin',
            label: 'Admin Home',
            icon: <PiUserGearThin size={22} />,
            href: '/admin',
            description: 'Admin Home',
            class: 'text-gray-900',
            parent: null,
        },
        {
            id: 'docker',
            label: 'Docker',
            icon: <DiDocker size={32} />,
            href: '#',
            description: 'Docker Page',
            class: 'text-gray-900',
            parent: null,
        },
        {
            id: 'containers',
            label: 'Containers',
            icon: <PiShippingContainerThin size={40} />,
            href: '/admin/containers',
            description: 'Containers',
            class: 'text-gray-900',
            parent: 'docker',
        },
        {
            id: 'volumes',
            label: 'Volumes',
            icon: <PiMemoryThin size={40} />,
            href: '/admin/volumes',
            description: 'volumes',
            class: 'text-gray-900',
            parent: 'docker',
        },
        {
            id: 'networks',
            label: 'networks',
            icon: <PiNetworkThin size={40} />,
            href: '/admin/networks',
            description: 'networks',
            class: 'text-gray-900',
            parent: 'docker',
        },
        {
            id: 'images',
            label: 'images',
            icon: <PiFilesThin size={40} />,
            href: '/admin/images',
            description: 'images',
            class: 'text-gray-900',
            parent: 'docker',
        },
        {
            id: 'compose',
            label: 'compose',
            icon: <PiFilesThin size={22} />,
            href: '/admin/compose',
            description: 'images',
            class: 'text-gray-900',
            parent: null,
        },
        {
            id: 'store',
            label: 'store',
            icon: <PiStorefrontThin size={22} />,
            href: '/admin/store',
            description: 'images',
            class: 'text-gray-900',
            parent: null,
        }

    ]

    return (
        <Navbar
            isBordered
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
        >
            <NavbarContent className="sm:hidden" justify="start">
                <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
            </NavbarContent>

            <NavbarContent className="sm:hidden pr-3" justify="center">
                <NavbarBrand>
                    LOGO
                    <p className="font-bold text-inherit">ACME</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {items.filter(item => item.parent == null).map((item, index) => item.href != '#' ? (

                    <NavbarItem>
                        <Button
                            variant="light"
                            onClick={() => {
                                router.push(item.href)
                            }}
                            key={item.id}
                            startContent={item.icon}
                            className={`${item.class} ${item.href == pathname ? 'bg-gray-100' : ''} py-2 px-6 rounded-full w-full`}
                        >

                            {item.label}

                        </Button>
                    </NavbarItem>
                ) : (
                    <NavbarItem>
                        <Dropdown>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Button
                                        disableRipple
                                        className={`${item.class} ${item.href == pathname ? 'bg-gray-100' : ''} py-2 px-6 rounded-full w-full`}
                                        radius="sm"
                                        variant="light"
                                        startContent={item.icon}
                                        endContent={<PiArrowFatDownDuotone size={11} className="translate-y-0"></PiArrowFatDownDuotone>}
                                    >
                                        {item.label}
                                    </Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu
                                aria-label="ACME features"
                                className="w-[340px]"
                                itemClasses={{
                                    base: "gap-4",
                                }}
                            >
                                {items.filter(subItem => subItem.parent == item.id).map((subItem, index) => (

                                    <DropdownItem
                                        onClick={() => {
                                            router.push(subItem.href)
                                        }}
                                        key={subItem.id}
                                        description={subItem.description}
                                        startContent={subItem.icon}
                                        className={`${subItem.class} ${subItem.href == pathname ? 'bg-gray-100' : ''} py-2 px-6 rounded-full w-full`}
                                    >

                                        {subItem.label}

                                    </DropdownItem>

                                ))
                                }


                            </DropdownMenu>
                        </Dropdown>
                    </NavbarItem>
                ))}


            </NavbarContent>

            <NavbarContent justify="end">
                <NavbarItem className="hidden lg:flex">
                    <Link href="#">Login</Link>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="warning" href="#" variant="flat">
                        Sign Up
                    </Button>
                </NavbarItem>
            </NavbarContent>

            <NavbarMenu>
                {items.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className={`${item.class} ${item.href == pathname ? 'bg-gray-100' : ''} py-2 px-6 rounded-full w-full`}
                            href={item.href}
                            size="lg"

                        >
                            {item.label}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </Navbar>
    );
}
