import { CloseButton, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { ChatConversation, useChatStore } from "../../store";

interface ConversationListProps {
    conversations: ChatConversation[];
    currentConversationId: number;
    onConversationClick: (index: number) => void;
    onConversationDelete: (index: number) => void;
}

const ConversationList = ({ conversations, currentConversationId, onConversationClick, onConversationDelete }: ConversationListProps) => {

    const ConversationItemBuilder = (conversation: ChatConversation) => {
        return (
            <>
                <Paper id={`${conversation.id}`} shadow='sm' radius='md' >
                    <Flex sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '100%',
                    }}>
                        <Stack pl="1rem" pt="0.5rem" pb="0.5rem">
                            <Title order={4} onClick={() => onConversationClick(conversation.id)}>
                                {currentConversationId === conversation.id ? "【" : ""}{conversation.topic}{currentConversationId === conversation.id ? "】" : ""}
                            </Title>
                            <Text>
                                {conversation.messages.length} 条内容
                            </Text>
                        </Stack>
                        <Stack>
                            <CloseButton onClick={() => onConversationDelete(conversation.id)} />
                        </Stack>
                    </Flex>
                </Paper>
            </>
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