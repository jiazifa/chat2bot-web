import { Paper, Title, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { ChatConversation, useChatStore } from "../../store";
import { timestampToDateString } from "../../utils/utils";

export type ChatContentHeaderProps = {
    height: number;
}

const ChatContentHeader = ({ height }: ChatContentHeaderProps) => {
    const conversation = useChatStore((state) => state.currentConversation());
    const [currentConv, setCurrentConv] = useState<ChatConversation | undefined>(undefined);
    const [dateString, setDateString] = useState<string>("");

    useEffect(() => {
        if (conversation) {
            setCurrentConv(conversation);
            setDateString(timestampToDateString(conversation.lastUpdate));
        }
    }, [conversation]);

    return (
        <Paper
            sx={{
                height: height,
            }}
        >
            <Title order={2}>
                {currentConv?.topic}
            </Title>
            <Text c="dimmed">
                {dateString}
            </Text>
        </Paper>
    )
};
export default ChatContentHeader;