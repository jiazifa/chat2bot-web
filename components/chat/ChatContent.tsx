import { ActionIcon, Avatar, Box, Flex, Group, Paper, Space, Stack, Text, Title, TypographyStylesProvider } from '@mantine/core';
import { Message } from '../store';
import dayjs from 'dayjs';
import BotIcon from '../icons/bot.svg'

const messages: Message[] = [
    {
        content: "Lorem ipsum dolor sit, <a>amet</a> consectetur adipisicing",
        date: dayjs('2023-03-31').format('DD/MM/YYYY'),
        role: 'user',
    },
    {
        content: "Bot: Lorem ipsum dolor sit, <a>amet</a> consectetur adipisicing",
        date: dayjs('2023-03-30').format('DD/MM/YYYY'),
        role: 'assistant',
    },
    {
        content: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus eveniet, nam modi quas amet voluptatem tempora possimus vero ducimus pariatur atque. Voluptatibus voluptates amet alias distinctio similique perferendis accusamus quo?",
        date: dayjs('2023-03-31').format('DD/MM/YYYY'),
        role: 'user',
    },
    {
        content: "Bot: Lorem ipsum dolor sit, <a>amet</a> consectetur adipisicing",
        date: dayjs('2023-03-30').format('DD/MM/YYYY'),
        role: 'assistant',
    },
    {
        content: "Bot: Lorem ipsum dolor sit, <a>amet</a> consectetur adipisicing",
        date: dayjs('2023-03-30').format('DD/MM/YYYY'),
        role: 'assistant',
    },
    {
        content: "Bot: Lorem ipsum dolor sit, <a>amet</a> consectetur adipisicing",
        date: dayjs('2023-03-30').format('DD/MM/YYYY'),
        role: 'assistant',
    },
];

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
            <Paper shadow="md">
                <Group p="0.5rem" position={message.role === 'user' ? 'right' : 'left'}>
                    <Flex direction={message.role === 'user' ? "row-reverse" : "row"}>
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
            </Paper>
        </div >
    );
};

const ChatContent = () => {
    const chats = messages.map((message) => ChatItemBuilder(message));
    return (
        <>
            <Stack>
                <Box sx={{ height: 100 }} />
                {chats}
                <Box sx={{ height: 100 }} />
            </Stack>
        </>
    )
};

export default ChatContent;
