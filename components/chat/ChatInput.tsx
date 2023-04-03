'use client';
import { useRef, useState } from 'react';
import { Button, Flex, Textarea } from '@mantine/core';
import { useChatStore } from '../../store';
import Locales from '../../locales';
import SendWhiteIcon from '../../icons/send-white.svg';

interface ChatInputProps {
    enabled: boolean;
};

const ChatInput = ({ enabled }: ChatInputProps) => {
    const submitKey = useChatStore((state) => state.config.submitKey);
    const [value, setValue] = useState<string>('');
    const ref = useRef<HTMLTextAreaElement>(null);

    // const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // };


    return (
        <>
            <Flex gap='md' align='center'>
                <Textarea
                    w={1000}
                    minRows={3}
                    maxRows={4}

                    disabled={!enabled}
                    placeholder={Locales.Chat.Input(submitKey)}
                    autosize

                    // value={value}
                    // onChange={(event) => setValue(event.currentTarget.value)}

                    // onKeyDown={(event) => onInputKeyDown(event)}
                    ref={ref}
                />
                <Button w={100}>
                    <SendWhiteIcon />
                </Button>
            </Flex>
        </>
    );
};

export default ChatInput;
