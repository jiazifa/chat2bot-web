'use client';

import { Container, Flex, Group, Paper, SegmentedControl, Select, Slider, Space, Switch, Text, TextInput, Title } from "@mantine/core";
import { ReactNode, useEffect, useState } from "react";
import Locales from '../locales';
import { SubmitKey, useAccountStore, useAppStore, useChatStore } from "../store";

const SettingItemBuilder = ({ children, title, description }: { children: ReactNode, title: string, description?: string }) => {
    return (
        <Paper
            radius="md"
            withBorder
            p="sm"
        >
            <Group position='apart'>
                <Flex direction='column' align='flex-start'>
                    <Title order={4}>
                        {title}
                    </Title>
                    <Text ta="center" c="dimmed" fz="sm">
                        {description ?? ""}
                    </Text>
                </Flex>
                {children}
            </Group>
        </Paper>
    )
};

const SettingSectionHeader = ({ title, description }: { title?: string, description?: string }) => (
    <div>
        <Space h="md" />
        <Title order={2}>{title}</Title>
        <Text c="dimmed" fz="sm">
            {description ?? ""}
        </Text>
        <Space h="md" />
    </div>
);

const SettingPage = () => {

    const accountStore = useAccountStore();
    const chatStore = useChatStore();
    const appStore = useAppStore();

    const [selfEmail, setSelfEmail] = useState<string | undefined>(undefined);
    const [submitKey, setSubmitKey] = useState<string | undefined>(undefined);
    // const submitOptionKey = Object.keys(SubmitKey).map((key) => (key));
    const submitOptions = Object.values(SubmitKey).map((value) => ({ value: value, label: value }));

    useEffect(() => {
        const email = accountStore.getSelfAccount()?.email
        setSelfEmail(email);

        const submitKey = chatStore.chatConfig.submitKey;
        console.log(submitKey)
        setSubmitKey(submitKey);
    }, []);

    const lang = appStore.appConfig.language;

    const onSubmitKeyChange = (e: string) => {
        const targetKey = Object.values(SubmitKey).find((value) => value === e);
        if (targetKey) {
            chatStore.updateChatConfig((config) => {
                config.submitKey = targetKey;
            })
            setSubmitKey(targetKey);
        }
    };
    return (
        <>
            <Container>
                <SettingSectionHeader title={Locales.Settings.Title} description={Locales.Settings.SubTitle} />

                <SettingItemBuilder title={Locales.Settings.Email.Title} description={Locales.Settings.Email.SubTitle}>
                    <Text ta="center" c="dimmed" fz="sm">
                        {selfEmail ?? Locales.Settings.Email.NoEmail}
                    </Text>
                </SettingItemBuilder>

                {/* <SettingItemBuilder title={Locales.Settings.Lang.Name}>
                    <Select value={lang} data={[{ value: "cn", label: Locales.Settings.Lang.Options.cn }]} />
                </SettingItemBuilder> */}

            </Container>

            <Container mt='lg'>

                {/* <SettingItemBuilder title={Locales.Settings.FontSize.Title} description={Locales.Settings.FontSize.SubTitle}>
                    <SegmentedControl
                        radius='lg'
                        size="md"
                        data={['xs', 'sm', 'md', 'lg', 'xl']}
                    />
                </SettingItemBuilder> */}

                <SettingItemBuilder title={Locales.Settings.SendKey}>
                    <Select value={submitKey} data={submitOptions} onChange={onSubmitKeyChange} />
                </SettingItemBuilder>


                {/* <SettingItemBuilder title={Locales.Settings.Prompt.Disable.Title}>
                    <Switch size='lg' />
                </SettingItemBuilder> */}

                {/* <SettingItemBuilder title={Locales.Settings.HistoryCount.Title} description={Locales.Settings.HistoryCount.SubTitle}>
                    <Slider
                        sx={{ width: 200 }}
                        defaultValue={40}
                        min={10}
                        max={90}
                    />
                </SettingItemBuilder>

                <SettingItemBuilder title={Locales.Settings.CompressThreshold.Title} description={Locales.Settings.CompressThreshold.SubTitle}>
                    <Slider
                        sx={{ width: 200 }}
                        defaultValue={40}
                        min={10}
                        max={90}
                    />
                </SettingItemBuilder> */}
            </Container>

        </>
    )
};

export default SettingPage;