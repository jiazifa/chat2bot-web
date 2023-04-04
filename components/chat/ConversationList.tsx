import { CloseButton, Flex, Paper, Stack, Text, Title } from "@mantine/core";
import { ChatConversation, useChatStore } from "../../store";

interface ConversationListProps {
    conversations: ChatConversation[];
    currentConversationUuid: string;
    onConversationClick: (uuid: string) => void;
    onConversationDelete: (uuid: string) => void;
}

const ConversationList = ({ conversations, currentConversationUuid, onConversationClick, onConversationDelete }: ConversationListProps) => {

    const ConversationItemBuilder = (conversation: ChatConversation) => {
        return (
            <Paper key={conversation.id} shadow={currentConversationUuid === conversation.uuid ? 'sm' : undefined} radius='md' >
                <Flex sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                }}>
                    <Stack pl="1rem" pt="0.5rem" pb="0.5rem">
                        <Title order={4} onClick={() => onConversationClick(conversation.uuid)}>
                            {currentConversationUuid === conversation.uuid ? "【" : ""}{conversation.topic}{currentConversationUuid === conversation.uuid ? "】" : ""}
                        </Title>
                        <Text>
                            {conversation.messages.length} 条内容
                        </Text>
                    </Stack>
                    <Stack sx={{ paddingRight: "0.2rem" }}>
                        <CloseButton onClick={() => onConversationDelete(conversation.uuid)} />
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