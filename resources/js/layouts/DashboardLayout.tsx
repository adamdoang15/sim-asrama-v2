import { Head } from '@inertiajs/react';
import { PropsWithChildren, useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

interface DashboardLayoutProps {
    title?: string;
}

export default function DashboardLayout({
    children,
    title = 'Dashboard',
}: PropsWithChildren<DashboardLayoutProps>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Head title={title} />
            
            <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header setSidebarOpen={setSidebarOpen} />
                
                <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
