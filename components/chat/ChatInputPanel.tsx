'use client';
import { useRef, useState } from 'react';
import { Button, Flex, Textarea } from '@mantine/core';
import { SubmitKey, useAppStore, useChatStore } from '../../store';
import Locales from '../../locales';
import SendWhiteIcon from '../../icons/send-white.svg';
import { notifications } from '@mantine/notifications';

function useSubmitHandler() {
    const config = useAppStore((state) => state.chatConfig);
    const submitKey = config.submitKey;

    const shouldSubmit = (e: KeyboardEvent) => {
        if (e.key !== "Enter") return false;

        return (
            (config.submitKey === SubmitKey.AltEnter && e.altKey) ||
            (config.submitKey === SubmitKey.CtrlEnter && e.ctrlKey) ||
            (config.submitKey === SubmitKey.ShiftEnter && e.shiftKey) ||
            (config.submitKey === SubmitKey.MetaEnter && e.metaKey) ||
            (config.submitKey === SubmitKey.Enter &&
                !e.altKey &&
                !e.ctrlKey &&
                !e.shiftKey &&
                !e.metaKey)
        );
    };

    return {
        submitKey,
        shouldSubmit,
    };
}

interface ChatInputPanelProps {
    height: number;
};

const ChatInputPanel = ({ height }: ChatInputPanelProps) => {
    const chatStore = useChatStore();

    const [inputContent, setInputContent] = useState<string>('');
    const { submitKey, shouldSubmit } = useSubmitHandler();
    const ref = useRef<HTMLTextAreaElement>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (shouldSubmit(event.nativeEvent)) {
            onSubmitAction()
            event.preventDefault();
        }
    };

    const onSubmitAction = () => {
        const content = inputContent;
        chatStore.onUserInput(content).then(() => {
            setIsLoading(false);
        });
        setInputContent('');
    }

    return (
        <>
            <Flex gap='md' align='center' h={height}>
                <Textarea
                    w={1000}
                    minRows={3}
                    maxRows={4}

                    disabled={isLoading}
                    placeholder={Locales.Chat.Input(submitKey)}
                    autosize

                    value={inputContent}
                    onChange={(event) => setInputContent(event.target.value)}

                    onKeyDown={(event) => onInputKeyDown(event)}
                    ref={ref}
                />
                <Button w={100} disabled={inputContent.length === 0 || isLoading} onClick={() => onSubmitAction()}>
                    <SendWhiteIcon />
                </Button>
            </Flex>
        </>
    );
};

export default ChatInputPanel;
