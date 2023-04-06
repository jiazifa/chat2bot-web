'use client';

import { CloseButton, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { ChatConversation, useChatStore } from "../../store";

interface ConversationListProps {
}

const ConversationList = ({ }: ConversationListProps) => {
    const store = useChatStore();
    const [selectConversation, removeConversation] = useChatStore(
        state => [state.selectConversation, state.removeConversation]
    );
    const [conversations, setConversations] = useState<ChatConversation[]>([]);
    const [currentConversationUuid, setCurrentConversationUuid] = useState<string>("");
    useEffect(() => {
        setConversations(store.conversations);
        setCurrentConversationUuid(store.currentConversationUuid);
    }, [store.conversations, store.currentConversationUuid]);

    const ConversationItemBuilder = (conversation: ChatConversation) => {
        return (
            <Paper key={conversation.id} shadow={currentConversationUuid === conversation.uuid ? 'sm' : undefined} radius='md' onClick={() => selectConversation(conversation.uuid)} >
                <Flex sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                }}>
                    <Stack pl="1rem" pt="0.5rem" pb="0.5rem">
                        <Title order={4}>
                            {currentConversationUuid === conversation.uuid ? "【" : ""}{conversation.topic}{currentConversationUuid === conversation.uuid ? "】" : ""}
                        </Title>
                        <Text>
                            {conversation.messages.length} 条内容
                        </Text>
                    </Stack>
                    <Stack sx={{ paddingRight: "0.2rem" }}>
                        <CloseButton onClick={() => removeConversation(conversation.uuid)} />
                    </Stack>
                </Flex>
            </Paper>
        )
    };
    const conversationItems = conversations.map((conversation) => ConversationItemBuilder(conversation));
    return (
        <>
            <Stack justify="flex-start">
                {conversationItems}
            </Stack>
        </>
    )
};
export default ConversationList;