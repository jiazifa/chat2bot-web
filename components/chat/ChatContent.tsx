import { ActionIcon, Avatar, Box, Flex, Group, Paper, Space, Stack, Text, Title, TypographyStylesProvider } from '@mantine/core';
import { Message } from '../../store';
import dayjs from 'dayjs';
import BotIcon from '../../icons/bot.svg'

const ChatContentFromBotBuilder = (content: string) => {
    return (
        <TypographyStylesProvider>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </TypographyStylesProvider>
    );
};

const ChatItemBuilder = (message: Message) => {
    return (
        <div key={message.date}>
            <Paper shadow='sm'>
                <Group p="0.5rem" position={message.role === 'user' ? 'right' : 'left'}>
                    <Flex direction={message.role === 'user' ? "row-reverse" : "row"} gap='sm'>
                        {message.role === 'user' ? <Avatar radius="xl" /> : <Avatar radius="xl"> <BotIcon /> </Avatar>}
                        <div>
                            <Text size="sm">{message.role === 'user' ? "我" : "Bot"}</Text>
                            <Text size="xs" color="dimmed">
                                {message.date}
                            </Text>
                        </div>
                    </Flex>
                </Group>
                <Text>
                    {message.content}
                </Text>
                <Space h='0.5rem' />
            </Paper>
        </div >
    );
};

interface ChatContentProps {
    messages: Message[];
};

const ChatContent = ({ messages }: ChatContentProps) => {
    const chats = messages.map((message) => ChatItemBuilder(message));
    return (
        <>
            <Stack>
                {chats}
                <Box sx={{ height: 100 }} />
            </Stack>
        </>
    )
};

export default ChatContent;
