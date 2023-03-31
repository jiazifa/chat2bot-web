import { useViewportSize } from '@mantine/hooks';
import { Paper, ScrollArea } from '@mantine/core';
import ChatContent from './ChatContent';
import ChatInput from './ChatInput';

const ChatRoom = () => {
    const { height } = useViewportSize();
    const chatContentHeight = height * 0.8;
    return (
        <>
            <ScrollArea p="xs"
                ml='1rem' mr='1rem'
                scrollbarSize={1}
                sx={{ height: chatContentHeight }}
                type='auto'>
                <ChatContent />
            </ScrollArea>
            <Paper ml='1rem' mr='1rem'>
                <ChatInput />
            </Paper>
        </>
    );
};

export default ChatRoom;