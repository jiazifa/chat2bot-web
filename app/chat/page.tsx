'use client';

import { Container, List, Stack, Textarea } from '@mantine/core';
import { IconTruckLoading } from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { useLayoutEffect, useRef, useState } from 'react';
import ChatItem from '../components/ChatItem';
import Locale from "../locales";
import { Message, SubmitKey, useChatStore } from '../store';
import { isIOS, selectOrCopy } from '../utils';

const Markdown = dynamic(async () => (await import('../components/markdown')).Markdown, { loading: () => <IconTruckLoading /> });

function useSubmitHandler() {
    const config = useChatStore((state) => state.config);
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


const ChatPage = () => {
    type RenderMessage = Message & { preview?: boolean };

    const chatStore = useChatStore();
    const [session, sessionIndex] = useChatStore((state) => [
        state.currentSession(),
        state.currentSessionIndex,
    ]);

    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { submitKey, shouldSubmit } = useSubmitHandler();

    // submit user input
    const onUserSubmit = () => {
        if (userInput.length <= 0) return;
        setIsLoading(true);
        chatStore.onUserInput(userInput).then(() => setIsLoading(false));
        setUserInput("");
        inputRef.current?.focus();
    };

    // check if should send message
    const onInputKeyDown = (e: KeyboardEvent) => {
        if (shouldSubmit(e)) {
            onUserSubmit();
            e.preventDefault();
        }
    };
    const onRightClick = (e: any, message: Message) => {
        // auto fill user input
        if (message.role === "user") {
            setUserInput(message.content);
        }

        // copy to clipboard
        if (selectOrCopy(e.currentTarget, message.content)) {
            e.preventDefault();
        }
    };

    const onResend = (botIndex: number) => {
        // find last user input message and resend
        for (let i = botIndex; i >= 0; i -= 1) {
            if (messages[i].role === "user") {
                setIsLoading(true);
                chatStore
                    .onUserInput(messages[i].content)
                    .then(() => setIsLoading(false));
                return;
            }
        }
    };

    // for auto-scroll
    const latestMessageRef = useRef<HTMLDivElement>(null);

    // wont scroll while hovering messages
    const [autoScroll, setAutoScroll] = useState(false);

    // preview messages
    const messages = (session.messages as RenderMessage[])
        .concat(
            isLoading
                ? [
                    {
                        role: "assistant",
                        content: "……",
                        date: new Date().toLocaleString(),
                        preview: true,
                    },
                ]
                : []
        )
        .concat(
            userInput.length > 0
                ? [
                    {
                        role: "user",
                        content: userInput,
                        date: new Date().toLocaleString(),
                        preview: true,
                    },
                ]
                : []
        );

    // auto scroll
    useLayoutEffect(() => {
        setTimeout(() => {
            const dom = latestMessageRef.current;
            if (dom && !isIOS() && autoScroll) {
                dom.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
            }
        }, 500);
    });


    return (
        <>
            <Container>
                <List>
                    <List.Item>
                        <ChatItem item={messages[0]} />
                    </List.Item>
                </List>
            </Container>
            <Container>
                <Textarea
                    value={userInput}
                    onChange={(event) => setUserInput(event.currentTarget.value)}
                    minRows={3}
                    placeholder={Locale.Chat.Input(submitKey)} />
            </Container>
        </>
    )
}
export default ChatPage;