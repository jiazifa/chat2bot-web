import {
    TextInput,
    PasswordInput,
    Anchor,
    Paper,
    Title,
    Text,
    Container,
    Button,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import Link from 'next/link';
import { useState } from 'react';
import Locales from '../../locales';
import { regexEmailValid, regexPasswordValid } from '../../utils/utils';

const LoginPage = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const onRegisterAction = () => {
        if (email === "" || password === "" || confirmPassword === "") {
            notifications.show({
                title: Locales.Auth.EmptyFields,
                color: 'red',
                message: Locales.Auth.EmptyFields
            })
            return;
        }
        // regex password format
        if (password !== confirmPassword) {
            notifications.show({
                title: Locales.Auth.PasswordsNotMatch,
                color: 'red',
                message: Locales.Auth.TryInputAgain
            })
            return;
        }

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

        notifications.show({
            title: "Success",
            color: 'green',
            message: ""
        })
    };

    return (
        <Container size={420} my={40}>
            <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
                {Locales.Auth.Welcome}
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                {Locales.Auth.AlreadyHaveAccount}{' '}
                <Link href="/auth/login">
                    <Anchor size="sm" component="button">
                        {Locales.Auth.GoLogin}
                    </Anchor>
                </Link>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label={Locales.Auth.EmailTitle} placeholder={Locales.Auth.EmailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} required />
                <PasswordInput label={Locales.Auth.PasswordTitle} placeholder={Locales.Auth.PasswordPlaceholder} value={password} onChange={(e) => setPassword(e.target.value)} required mt="md" />
                <PasswordInput label={Locales.Auth.ConfirmPasswordTitle} placeholder={Locales.Auth.ConfirmPasswordPlaceholder} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required mt="md" />
                <Button fullWidth mt="xl" onClick={() => onRegisterAction()}>
                    {Locales.Auth.Register}
                </Button>
            </Paper>
        </Container>
    );
};

export default LoginPage;
