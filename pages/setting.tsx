'use client';

import { Container, Flex, Group, Paper, SegmentedControl, Select, Slider, Space, Switch, Text, TextInput, Title } from "@mantine/core";
import { ReactNode } from "react";
import Locales from '../locales';
import { useAccountStore, useAppStore, useChatStore } from "../store";

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

    const selfAccount = accountStore.getSelfAccount();
    const lang = appStore.appConfig.language;
    const submitKey = chatStore.config.submitKey;

    return (
        <>
            <Container>
                <SettingSectionHeader title={Locales.Settings.Title} description={Locales.Settings.SubTitle} />

                <SettingItemBuilder title={Locales.Settings.Email.Title} description={Locales.Settings.Email.SubTitle}>
                    <Text ta="center" c="dimmed" fz="sm">
                        {selfAccount?.email ?? Locales.Settings.Email.NoEmail}
                    </Text>
                </SettingItemBuilder>

                <SettingItemBuilder title={Locales.Settings.Lang.Name}>
                    <Select value={lang} data={[{ value: "cn", label: Locales.Settings.Lang.Options.cn }]} />
                </SettingItemBuilder>

            </Container>

            <Container mt='lg'>

                <SettingItemBuilder title={Locales.Settings.FontSize.Title} description={Locales.Settings.FontSize.SubTitle}>
                    <SegmentedControl
                        radius='lg'
                        size="md"
                        data={['xs', 'sm', 'md', 'lg', 'xl']}
                    />
                </SettingItemBuilder>

                <SettingItemBuilder title={Locales.Settings.SendKey}>
                    <Select value={submitKey} data={[{ value: "cn", label: Locales.Settings.Lang.Options.cn }]} />
                </SettingItemBuilder>

                <SettingItemBuilder title={Locales.Settings.Theme}>
                    <Select value={"cn"} data={[{ value: "cn", label: Locales.Settings.Lang.Options.cn }]} />
                </SettingItemBuilder>

                <SettingItemBuilder title={Locales.Settings.Prompt.Disable.Title}>
                    <Switch size='lg' />
                </SettingItemBuilder>

                <SettingItemBuilder title={Locales.Settings.HistoryCount.Title} description={Locales.Settings.HistoryCount.SubTitle}>
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
                </SettingItemBuilder>
            </Container>

            <Container mt='lg'>
                <SettingItemBuilder title={Locales.Settings.Token.Title} description={Locales.Settings.Token.SubTitle}>
                    <TextInput withAsterisk />
                </SettingItemBuilder>


                <SettingItemBuilder title={Locales.Settings.Temperature.Title} description={Locales.Settings.Temperature.SubTitle}>
                    <Group>
                        <Slider
                            sx={{ width: 200 }}
                            defaultValue={40}
                            min={10}
                            max={90}
                        />
                        <Text>value</Text>
                    </Group>
                </SettingItemBuilder>


                <SettingItemBuilder title={Locales.Settings.MaxTokens.Title} description={Locales.Settings.MaxTokens.SubTitle}>
                    <Slider
                        sx={{ width: 200 }}
                        defaultValue={40}
                        min={10}
                        max={90}
                    />
                </SettingItemBuilder>

                <SettingItemBuilder title={Locales.Settings.PresencePenlty.Title} description={Locales.Settings.PresencePenlty.SubTitle}>
                    <Slider
                        sx={{ width: 200 }}
                        defaultValue={40}
                        min={10}
                        max={90}
                    />
                </SettingItemBuilder>
            </Container>
        </>
    )
};

export default SettingPage;