'use client';

import { useScrollIntoView, useViewportSize } from '@mantine/hooks';
import { Text, Container, Flex, Paper, ScrollArea, Stack, Title, Divider, Space, Box, Group, Button, createStyles, rem, ActionIcon, Modal, Dialog } from '@mantine/core';
import ChatContent from '../components/chat/ChatContent';
import ConversationList from '../components/chat/ConversationList';
import { ChatConversation, useChatStore } from '../store';
import ChatInputPanel from '../components/chat/ChatInputPanel';
import { useDebugValue, useEffect, useState } from 'react';
import Locales from '../locales'
import { IconPlus, IconTrash } from '@tabler/icons-react';
import AlertForm from '../components/card/AlertForm';
import ChatContentHeader from '../components/chat/ChatContentHeader';


const ChatPage = () => {
    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();
    const chatStore = useChatStore();
    const [cleanAllConversationModalOpened, setCleanAllConversationModalOpened] = useState<boolean>(false);

    const { height } = useViewportSize();

    const heightWithoutHeader = height - 60;

    const sidebarWidth = 300;
    const sideBarHeaderHeight = 60;
    const sideBarMenuHeight = 60;
    const chatSideBarBodyHeight = heightWithoutHeader - sideBarHeaderHeight - sideBarMenuHeight - 40;
    const chatInputContentHeight = 150;

    const handleDeleteAllConversation = () => {
        chatStore.clearAllData();
    };

    const onUserInput = (content: string) => {
        const scrollContent = document.getElementById('chat-content-scroll-area');
        if (scrollContent) {
            scrollContent.lastElementChild?.scrollIntoView(false);
        }
    };

    return (
        <>
            <Modal opened={cleanAllConversationModalOpened} title={Locales.Chat.Delete.CleanAll} onClose={() => setCleanAllConversationModalOpened(false)}>
                <AlertForm
                    title={Locales.Chat.Delete.CleanAll}
                    content={Locales.Chat.Delete.CleanAllConfirm}
                    confirmText={Locales.Common.OK}
                    cancelText={Locales.Common.Cancel}
                    onCancel={() => setCleanAllConversationModalOpened(false)}
                    onConfirm={() => {
                        setCleanAllConversationModalOpened(false);
                        handleDeleteAllConversation();
                    }} />
            </Modal>
            <Container sx={{ height: heightWithoutHeader }} >
                <Flex h='100%'>
                    <Stack sx={{ width: sidebarWidth, paddingRight: 20 }}>
                        <Paper key={'chat-side-header'} sx={{ position: 'relative', height: sideBarHeaderHeight, paddingTop: 10 }}>
                            <Title>Title</Title>
                        </Paper>
                        <ScrollArea key={'chat-side-list'} type='hover' sx={{ height: chatSideBarBodyHeight }}>
                            <ConversationList />
                        </ScrollArea>
                        <Paper key={'chat-side-menu'} sx={{ position: 'absolute', bottom: 0, height: sideBarMenuHeight, width: sidebarWidth, paddingRight: 20 }}>
                            <Group position='right'>
                                <Button color='white' onClick={() => setCleanAllConversationModalOpened(true)}>
                                    <IconTrash />
                                </Button>

                                <Button leftIcon={<IconPlus />} color='white' onClick={() => chatStore.newConversation()}>
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
                        <ChatContentHeader height={sideBarHeaderHeight} />
                        <ScrollArea id='chat-content-scroll-area' p="xs"
                            scrollbarSize={8}
                            sx={{ height: chatSideBarBodyHeight }}
                            type='hover'>
                            <ChatContent />
                            <Divider ref={targetRef} label="已经是最新了!" labelPosition='center' />
                        </ScrollArea>

                        <ChatInputPanel onUserInput={onUserInput} />
                        <Space />
                    </Stack>
                </Flex>
            </Container >
        </>
    );
};

export default ChatPage;