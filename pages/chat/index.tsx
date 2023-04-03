'use client';

import { useViewportSize } from '@mantine/hooks';
import { Text, Container, Flex, Paper, ScrollArea, Stack, Title, Divider, Space, Box, Group, Button, createStyles, rem } from '@mantine/core';
import ChatContent from '../../components/chat/ChatContent';
import ConversationList from '../../components/chat/ConversationList';
import { useChatStore } from '../../store';
import ChatInputPanel from '../../components/chat/ChatInputPanel';



const ChatPage = () => {
    const chatStore = useChatStore();
    let conversations = chatStore.conversations;
    const currentConversationId = chatStore.currentConversation().id;
    const currentConversation = chatStore.currentConversation();
    conversations = conversations.concat(conversations)
    conversations = conversations.concat(conversations)
    conversations = conversations.concat(conversations)
    const onConversationClick = (index: number) => {
        chatStore.selectConversation(index)
    };
    const onConversationDelete = (index: number) => {
        chatStore.removeConversation(index)
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
                        <Paper sx={{ position: 'relative', height: sideBarHeaderHeight, paddingTop: 10 }}>
                            <Title>Title</Title>
                        </Paper>
                        <ScrollArea type='hover' sx={{ height: chatSideBarBodyHeight }}>
                            <ConversationList
                                conversations={conversations}
                                currentConversationId={currentConversationId}
                                onConversationClick={(cid) => onConversationClick(cid)}
                                onConversationDelete={(cid) => onConversationDelete(cid)}
                            />
                        </ScrollArea>
                        <Paper sx={{ position: 'absolute', bottom: 0, height: sideBarMenuHeight }}>
                            <Group>
                                <Button>
                                    Test
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
                            {/* <Title order={2}>
                                {currentConversation.topic}
                            </Title>
                            <Text c="dimmed">
                                {currentConversation.lastUpdate}
                            </Text> */}
                        </Paper>
                        {/* <ScrollArea p="xs"
                            scrollbarSize={8}
                            sx={{ height: chatSideBarBodyHeight }}
                            type='hover'>
                            <ChatContent messages={currentConversation.messages} />
                        </ScrollArea> */}

                        {/* <ChatInputPanel enabled>

                        </ChatInputPanel> */}
                        {/* <Paper sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: chatInputContentHeight
                        }}>
                            <ChatInput enabled />
                        </Paper> */}

                    </Stack>
                </Flex>
            </Container >
        </>
    );
};

export default ChatPage;