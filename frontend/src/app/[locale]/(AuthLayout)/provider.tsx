'use client';

import { useRouter } from '@/navigation';
import { useUserStore } from '@/store';

export const Provider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { isLoggedIn } = useUserStore();

    isLoggedIn && router.back();

    return <>{children}</>;
};
