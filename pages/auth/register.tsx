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
import Link from 'next/link';

const LoginPage = () => {
    // eslint-disable-next-line no-console
    console.log('LoginPage');
    return (
        <Container size={420} my={40}>
            <Title align="center" sx={(theme) => ({ fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900 })}>
                欢迎你！
            </Title>
            <Text color="dimmed" size="sm" align="center" mt={5}>
                已经有账号了吗?{' '}
                <Link href="/auth/login">
                    <Anchor size="sm" component="button">
                        去登录
                    </Anchor>
                </Link>
            </Text>

            <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                <TextInput label="邮箱" placeholder="请输入邮箱" required />
                <PasswordInput label="密码" placeholder="请输入密码" required mt="md" />

                <Button fullWidth mt="xl">
                    注册
                </Button>
            </Paper>
        </Container>
    );
};

export default LoginPage;
