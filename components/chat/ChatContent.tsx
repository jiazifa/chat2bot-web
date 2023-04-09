'use client';

import { Avatar, Box, Divider, Flex, Group, Paper, Space, Stack, Text, TypographyStylesProvider } from '@mantine/core';
import { Message, MessageStat, useChatStore } from '../../store';
import BotIcon from '../../icons/bot.svg'
import { useEffect, useState } from 'react';
import { timestampToDateString } from '../../utils/utils';
import { useScrollIntoView } from '@mantine/hooks';

const ChatContentFromBotBuilder = (content: string) => {
    return (
        <TypographyStylesProvider sx={{ whiteSpace: 'pre-line' }}>
            <div dangerouslySetInnerHTML={{ __html: content }} />
        </TypographyStylesProvider>
    );
};



const ChatItemBuilder = (message: Message) => {
    const dateString = timestampToDateString(message.date);
    const stat = message.extra?.stat ?? MessageStat.unknown;
    let contentNode: JSX.Element = ChatContentFromBotBuilder(message.content);
    if (message.role === 'assistant') {
        if (stat === MessageStat.waiting) {
            contentNode = (
                <Text pl='xl' sx={{ whiteSpace: 'pre-line' }}>
                    正在等待回应...
                </Text>
            )
        }
        else if (stat === MessageStat.error) {
            contentNode = (
                <Text pl='xl' sx={{ whiteSpace: 'pre-line' }}>
                    {message.extra?.errorMsg ?? '未知错误'}
                </Text>
            )
        }
    }
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

                    {contentNode}
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
