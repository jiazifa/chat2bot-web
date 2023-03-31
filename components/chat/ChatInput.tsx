'use client';
import { useRef } from 'react';
import { Textarea } from '@mantine/core';
import { useChatStore } from '../store';
import Locales from '../locales';

const ChatInput = () => {
    const submitKey = useChatStore((state) => state.config.submitKey);
    const ref = useRef<HTMLTextAreaElement>(null);
    return (
        <>
            <Textarea placeholder={Locales.Chat.Input(submitKey)} withAsterisk ref={ref} />
        </>
    );
};

export default ChatInput;
