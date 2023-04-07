'use client';

import { Avatar, Box, Flex, Group, Paper, Space, Stack, Text, TypographyStylesProvider } from '@mantine/core';
import { Message, useChatStore } from '../../store';
import BotIcon from '../../icons/bot.svg'
import { useEffect, useState } from 'react';
import { timestampToDateString } from '../../utils/utils';

const ChatContentFromBotBuilder = (content: string) => {
    return (
        <TypographyStylesProvider sx={{ whiteSpace: 'pre-line' }}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </TypographyStylesProvider>
    );
};

const ChatItemBuilder = (message: Message) => {
    const dateString = timestampToDateString(message.date);
    return (
        <div key={`${message.date}-${message.role}`} >
            <Paper shadow='sm'>
                <Stack spacing='xs' align={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                    <Group p="0.5rem" position={message.role === 'user' ? 'right' : 'left'}>
                        <Flex direction={message.role === 'user' ? "row-reverse" : "row"} gap='sm'>
                            {message.role === 'user' ? <Avatar radius="xl" /> : <Avatar radius="xl"> <BotIcon /> </Avatar>}
                            <Stack spacing='0.01rem' align={message.role === 'user' ? 'flex-end' : 'flex-start'}>
                                <Text size="sm">{message.role === 'user' ? "我" : "Bot"}</Text>
                                <Text size="xs" color="dimmed">
                                    {dateString}
                                </Text>
                            </Stack>
                        </Flex>
                    </Group>
                    <Text pl='xl' sx={{ whiteSpace: 'pre-line' }}>
                        {message.content}
                        {/* {ChatContentFromBotBuilder(message.content)} */}
                    </Text>
                </Stack>
                <Space h='xs' />
            </Paper>
        </div >
    );
};

interface ChatContentProps {

};

const ChatContent = ({ }: ChatContentProps) => {
    const conversation = useChatStore((state) => state.currentConversation());
    const [messages, setMessages] = useState<Message[]>([]);
    useEffect(() => {
        if (conversation) {
            setMessages(conversation.messages);
        }
    }, [conversation]);
    const chats = messages.map((message) => ChatItemBuilder(message));
    return (
        <>
            <Stack>
                {chats}
            </Stack>
        </>
    )
};

export default ChatContent;
