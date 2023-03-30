'use client';
import { Loader, MantineProvider } from '@mantine/core';
import HeaderMiddle from './components/HeaderMiddle';
const LINKS = [{ label: "首页", link: "/" }, { label: "聊天", link: "/chat" }];

export default function RootTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <MantineProvider
            withGlobalStyles
            withCSSVariables
            withNormalizeCSS
        >
            {/* <NotificationsProvider limit={3} position='bottom-right'>
                
            </NotificationsProvider> */}
            <>
                <HeaderMiddle links={LINKS} />
                {children}
            </>
        </MantineProvider >
    )
}