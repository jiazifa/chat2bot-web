
import { useViewportSize } from '@mantine/hooks';
import { Text, Container, Flex, Paper, ScrollArea, Stack, Title, Divider, Space, Box, Group, Button, createStyles, rem } from '@mantine/core';
import ChatContent from '../../components/chat/ChatContent';
import ChatInput from '../../components/chat/ChatInput';
import ConversationList from '../../components/chat/ConversationList';
import { useChatStore } from '../../store';

const useStyles = createStyles((theme) => ({
    container: {
        height: ``,

    },
}));

const ChatPage = () => {
    const { classes } = useStyles();
    const chatStore = useChatStore();
    const conversations = chatStore.conversations;
    const currentConversationId = chatStore.currentConversation().id;
    const currentConversation = chatStore.currentConversation();
    const onConversationClick = (index: number) => {
        chatStore.selectConversation(index)
    };
    const onConversationDelete = (index: number) => {
        chatStore.removeConversation(index)
    };

    const { height } = useViewportSize();
    // const chatContentHeight = height * 0.67;
    // const chatInputHeight = height * 0.1;
    // const chatRoomHeight = height * 0.77;

    return (
        <>
            <Container sx={{ height: 'calc(100 % - 3.75rem)' }} size='lg'>
                <Space h="xl" />
                <Box sx={{ width: '20rem', minHeight: '100%', backgroundColor: 'red' }}>
                    test
                </Box>
                {/* <Flex>
                    <ScrollArea
                        w={500}
                        sx={{ height: chatRoomHeight }}
                    >
                        <Paper mr='md'>
                            <ConversationList
                                conversations={conversations}
                                currentConversationId={currentConversationId}
                                onConversationClick={(cid) => onConversationClick(cid)}
                                onConversationDelete={(cid) => onConversationDelete(cid)}
                            />
                        </Paper>
                    </ScrollArea>

                    <Stack
                        w={1000}
                    >
                        <Paper>
                            <Title order={2}>
                                {currentConversation.topic}
                            </Title>
                            <Text c="dimmed">
                                {currentConversation.lastUpdate}
                            </Text>
                        </Paper>
                        <ScrollArea p="xs"
                            scrollbarSize={8}
                            sx={{ height: chatContentHeight }}
                            type='hover'>
                            <ChatContent messages={currentConversation.messages} />
                        </ScrollArea>

                        <Paper sx={{ height: chatInputHeight }}>
                            <ChatInput enabled />
                        </Paper>

                    </Stack>
                </Flex> */}
            </Container>
        </>
    );
};

export default ChatPage;