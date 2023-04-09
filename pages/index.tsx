import { createStyles, Container, Text, Button, rem, Group } from '@mantine/core';
import { useEffect, useState } from 'react';
import { Account, useAccountStore } from '../store';
import Locales from '../locales';
import { useDisclosure } from '@mantine/hooks';

const useStyles = createStyles((theme) => ({
  wrapper: {
    position: 'relative',
    boxSizing: 'border-box',
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },

  inner: {
    position: 'relative',
    paddingTop: rem(200),
    paddingBottom: rem(120),

    [theme.fn.smallerThan('sm')]: {
      paddingBottom: rem(80),
      paddingTop: rem(80),
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    fontSize: rem(62),
    fontWeight: 900,
    lineHeight: 1.1,
    margin: 0,
    padding: 0,
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(42),
      lineHeight: 1.2,
    },
  },

  description: {
    marginTop: theme.spacing.xl,
    fontSize: rem(24),

    [theme.fn.smallerThan('sm')]: {
      fontSize: rem(18),
    },
  },

  controls: {
    marginTop: `calc(${theme.spacing.xl} * 2)`,

    [theme.fn.smallerThan('sm')]: {
      marginTop: theme.spacing.xl,
    },
  },

  control: {
    height: rem(54),
    paddingLeft: rem(38),
    paddingRight: rem(38),

    [theme.fn.smallerThan('sm')]: {
      height: rem(54),
      paddingLeft: rem(18),
      paddingRight: rem(18),
      flex: 1,
    },
  },
}));


const HomePage = () => {
  const { classes } = useStyles();
  const accountStore = useAccountStore();
  const [account, setAccount] = useState<Account | undefined>(undefined);
  const [visible, { toggle }] = useDisclosure(false);
  useEffect(() => {
    const myAccount = accountStore.getSelfAccount();
    setAccount(myAccount);
  }, []);

  return (
    <div className={classes.wrapper}>
      <Container size={700} className={classes.inner}>
        <h1 className={classes.title}>
          基于{' '}
          <Text component="span" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }} inherit>
            GPT
          </Text>{' '}
          的智能工具箱
        </h1>

        <Text className={classes.description} color="dimmed">
          由 gpt3.5 驱动，辅助你完成日常工作，提升工作效率。
        </Text>

        <Group className={classes.controls}>
          <Button
            loading={visible}
            component="a"
            size="xl"
            href={account ? '/chat/' : '/auth/login/'}
            className={classes.control}
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            onClick={toggle}
          >
            {account ? Locales.Home.NewChat : Locales.Auth.GoLogin}
          </Button>
          {
            account ? <></> : <Button
              component="a"
              href="/auth/register/"
              size="xl"
              variant="default"
              className={classes.control}
            >
              {Locales.Auth.GoRegister}
            </Button>
          }

        </Group>
      </Container>
    </div>
  );
}
export default HomePage;