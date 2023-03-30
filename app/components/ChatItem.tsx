import { ActionIcon, Avatar } from '@mantine/core';
import { Message } from '../store';
import BotIcon from '../icons/bot.svg';
const ChatItem = ({ item }: { item: Message }) => {
    return (
        <>
            <ActionIcon>
                <BotIcon />
            </ActionIcon>
        </>
    );
}

export default ChatItem;