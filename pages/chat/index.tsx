
import { useViewportSize } from '@mantine/hooks';
import { Text, Container, Flex, Paper, ScrollArea, Stack, Title, Divider, Space } from '@mantine/core';
import ChatContent from '../../components/chat/ChatContent';
import ChatInput from '../../components/chat/ChatInput';
import ConversationList from '../../components/chat/ConversationList';

const ChatPage = () => {
    const { height } = useViewportSize();
    const chatContentHeight = height * 0.8;
    return (
        <>
            <Space h="xl" />
            <Container>
                <Stack>
                    <Paper>
                        <Title order={2}>
                            新的主题
                        </Title>
                        <Text c="dimmed">
                            2021-08-01
                        </Text>
                    </Paper>

                    <ScrollArea p="xs"
                        scrollbarSize={8}
                        sx={{ height: chatContentHeight }}
                        type='auto'>
                        <ChatContent />
                    </ScrollArea>

                    <Paper>
                        <ChatInput />
                    </Paper>

                </Stack>
            </Container>
        </>
    );
};

export default ChatPage;