"use client";

import { usePathname } from "next/navigation";
import MuzeHeader from "@/components/muze_header/header";
import './globals.css';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLandingPage = pathname === "/";

    return (
        <>
            {!isLandingPage && <MuzeHeader />}
            {children}
        </>
    );
}