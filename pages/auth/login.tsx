import {
    TextInput,
    PasswordInput,
    Checkbox,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Group,
    Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import Locales from '../../locales';
import { requestLogin } from '../../utils/requests';
import { useAccountStore } from '../../store';
import { regexEmailValid, regexPasswordValid } from '../../utils/utils';

const LoginPage = () => {
    const [email, setEmail] = useState("804506054@qq.com");
    const [password, setPassword] = useState("admin");
    const store = useAccountStore();

    const onLoginAction = async () => {
        if (!regexEmailValid(email)) {
            notifications.show({
                title: Locales.Auth.EmailNotValid,
                color: 'red',
                message: Locales.Auth.TryInputAgain
            })
            return;
        }

        if (!regexPasswordValid(password)) {
            notifications.show({
                title: Locales.Auth.PasswordInvalid,
                color: 'red',
                message: Locales.Auth.TryInputAgain
            })
            return;
        }
        const data = await requestLogin(email, password);
        if (!data) {
            return;
        }
        const account = {
            id: data.user_id,
            uuid: data.identifier,
            email: data.email,
            createAt: data.createAt
        }
        store.addAccount(account);
        store.loginAccount({ ...account, token: data.token });
        Router.push('/');
    };
    return (
        <Container size={420} my={40}>
            <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
                {Locales.Auth.Welcome}
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                {Locales.Auth.HaveNoAccount}{' '}
                <Link href="/auth/register">
                    <Anchor size="sm" component="button">
                        {Locales.Auth.GoRegister}
                    </Anchor>
                </Link>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label={Locales.Auth.EmailTitle} placeholder={Locales.Auth.EmailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <PasswordInput label={Locales.Auth.PasswordTitle} placeholder={Locales.Auth.PasswordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required mt="md" />
                <Group position="apart" mt="lg">
                    <Checkbox label={Locales.Auth.RememberMe} />
                    <Anchor component="button" size="sm">
                        {Locales.Auth.ForgotPassword}
                    </Anchor>
                </Group>
                <Button fullWidth mt="xl" onClick={() => onLoginAction()}>
                    {Locales.Auth.Login}
                </Button>
            </Paper>
        </Container>
    );
};

export default LoginPage;
