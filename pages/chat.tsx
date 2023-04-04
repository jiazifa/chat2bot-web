'use client';

import { useViewportSize } from '@mantine/hooks';
import { Text, Container, Flex, Paper, ScrollArea, Stack, Title, Divider, Space, Box, Group, Button, createStyles, rem, ActionIcon } from '@mantine/core';
import ChatContent from '../components/chat/ChatContent';
import ConversationList from '../components/chat/ConversationList';
import { ChatConversation, useChatStore } from '../store';
import ChatInputPanel from '../components/chat/ChatInputPanel';
import { useDebugValue, useEffect, useState } from 'react';
import Locales from '../locales'
import { IconPlus } from '@tabler/icons-react';

const ChatPage = () => {
    const chatStore = useChatStore();

    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const { currentConversationUuid } = chatStore;
    const [currentConversation, setCurrentConversation] = useState<ChatConversation | undefined>(undefined);
    console.log('conversations', conversations)
    console.log('currentConversationUuid', currentConversationUuid)
    console.log('chatStore', chatStore)
    useDebugValue(conversations)
    useEffect(() => {
        const conversations = chatStore.getConversations().sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate));
        setCurrentConversation(chatStore.currentConversation())
        setConversations(conversations)
    }, [])

    const onConversationClick = (uuid: string) => {
        console.log('onConversationClick', uuid)
        chatStore.selectConversation(uuid)
        setCurrentConversation(chatStore.currentConversation())
    };
    const onConversationDelete = (uuid: string) => {
        chatStore.removeConversation(uuid)
        const convers = chatStore.getConversations().sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate));
        setConversations(convers)
        setCurrentConversation(chatStore.currentConversation())
    };

    const onNewConversation = () => {
        chatStore.newConversation()
        const convers = chatStore.getConversations().sort((a, b) => b.lastUpdate.localeCompare(a.lastUpdate));
        setConversations(convers)
        setCurrentConversation(chatStore.currentConversation())
    };

    const { height } = useViewportSize();
    const heightWithoutHeader = height - 60;

    const sidebarWidth = 300;
    const sideBarHeaderHeight = 60;
    const sideBarMenuHeight = 60;
    const chatSideBarBodyHeight = heightWithoutHeader - sideBarHeaderHeight - sideBarMenuHeight - 40;
    const chatInputContentHeight = 150;

    return (
        <>
            <Container sx={{ height: heightWithoutHeader }} >
                <Flex h='100%'>
                    <Stack sx={{ width: sidebarWidth, paddingRight: 20 }}>
                        <Paper key={'chat-side-header'} sx={{ position: 'relative', height: sideBarHeaderHeight, paddingTop: 10 }}>
                            <Title>Title</Title>
                        </Paper>
                        <ScrollArea key={'chat-side-list'} type='hover' sx={{ height: chatSideBarBodyHeight }}>
                            <ConversationList
                                conversations={conversations}
                                currentConversationUuid={currentConversationUuid}
                                onConversationClick={(cid) => onConversationClick(cid)}
                                onConversationDelete={(cid) => onConversationDelete(cid)}
                            />
                        </ScrollArea>
                        <Paper key={'chat-side-menu'} sx={{ position: 'absolute', bottom: 0, height: sideBarMenuHeight, width: sidebarWidth, paddingRight: 20 }}>
                            <Group position='right'>
                                <Button leftIcon={<IconPlus />} color='white' onClick={() => onNewConversation()}>
                                    {Locales.Home.NewChat}
                                </Button>
                            </Group>
                        </Paper>
                    </Stack>

                    <Stack
                        sx={{
                            position: 'relative',
                            width: `calc(100% - ${sidebarWidth}px)`,
                            paddingTop: 10,
                        }}
                    >
                        <Paper
                            sx={{
                                height: sideBarHeaderHeight,
                            }}
                        >
                            <Title order={2}>
                                {currentConversation?.topic}
                            </Title>
                            <Text c="dimmed">
                                {currentConversation?.lastUpdate}
                            </Text>
                        </Paper>
                        <ScrollArea p="xs"
                            scrollbarSize={8}
                            sx={{ height: chatSideBarBodyHeight }}
                            type='hover'>
                            <ChatContent messages={currentConversation?.messages ?? []} />
                        </ScrollArea>

                        <ChatInputPanel height={chatInputContentHeight} />
                        <Space />
                    </Stack>
                </Flex>
            </Container >
        </>
    );
};

export default ChatPage;