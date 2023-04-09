'use client';

import React, { useEffect, useState } from 'react';
import {
    createStyles,
    Header,
    Container,
    Group,
    Burger,
    Paper,
    Transition,
    rem,
    Avatar,
    ActionIcon,
} from '@mantine/core';
import { useDisclosure, useWindowEvent } from '@mantine/hooks';
import BotIcon from '../../icons/bot.svg';
import Router, { useRouter } from 'next/router';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';
import { Account, ACCOUNT_STAT_CHANGED_EVENT, useAccountStore } from '../../store';
import Link from 'next/link';
import Locales from '../../locales';

const HEADER_HEIGHT = rem(60);

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
        zIndex: 1,
    },

    dropdown: {
        position: 'absolute',
        top: HEADER_HEIGHT,
        left: 0,
        right: 0,
        zIndex: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        borderTopWidth: 0,
        overflow: 'hidden',

        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '100%',
    },

    links: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    burger: {
        [theme.fn.largerThan('sm')]: {
            display: 'none',
        },
    },

    link: {
        display: 'block',
        lineHeight: 1,
        padding: `${rem(8)} ${rem(12)}`,
        borderRadius: theme.radius.sm,
        textDecoration: 'none',
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],
        fontSize: theme.fontSizes.sm,
        fontWeight: 500,

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        },

        [theme.fn.smallerThan('sm')]: {
            borderRadius: 0,
            padding: theme.spacing.md,
        },
    },

    linkActive: {
        '&, &:hover': {
            backgroundColor: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background,
            color: theme.fn.variant({ variant: 'light', color: theme.primaryColor }).color,
        },
    },
}));

const LINKS = [
    {
        link: '/',
        label: Locales.NavBar.Home,
    },
    {
        link: '/setting',
        label: Locales.NavBar.Settings,
    }
]

interface HeaderResponsiveProps {
}

export function HeaderResponsive({ }: HeaderResponsiveProps) {
    const links = LINKS;

    const [opened, { toggle, close }] = useDisclosure(false);
    const [active, setActive] = useState(links[0].link);
    const { classes, cx } = useStyles();

    const accountStore = useAccountStore();

    useWindowEvent(ACCOUNT_STAT_CHANGED_EVENT, () => {
        setSelfAccount(accountStore.getSelfAccount());
    })

    const router = useRouter();
    const isAuthPage = router.pathname.includes('/auth/');
    const isIndexPage = router.pathname === '/';

    const [selfAccount, setSelfAccount] = useState<Account | undefined>(undefined);

    useEffect(() => {
        setSelfAccount(accountStore.getSelfAccount());
    }, []);

    let items: React.ReactNode[] = []
    if (isAuthPage || (isIndexPage && !selfAccount)) {
        items = [< ColorSchemeToggle key='header-color-scheme-toggle' />]
    } else {
        items = links.map((link) => (
            <a
                key={link.label}
                href={link.link}
                className={cx(classes.link, { [classes.linkActive]: active === link.link })}
                onClick={(event) => {
                    setActive(link.link);
                    close();
                    event.preventDefault();
                    Router.push(link.link);
                }}
            >
                {link.label}
            </a>
        ));
        items.push(< ColorSchemeToggle key='header-color-scheme-toggle' />)
        if (selfAccount) {
            items.push(<Avatar key='header-avatar' radius='xl'> {selfAccount.email.charAt(0)} </Avatar>)
        } else {
            items.push(<Link key='header-go-login' href='/auth/login/'>{Locales.Auth.GoLogin}</Link>)
        }
    }

    return (
        <Header height={HEADER_HEIGHT} className={classes.root}>
            <Container className={classes.header}>
                <ActionIcon size='lg' component='a' href='/'>
                    <BotIcon size={28} />
                </ActionIcon>
                <Group spacing={5} className={classes.links}>
                    {items}
                </Group>

                <Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

                <Transition transition="pop-top-right" duration={200} mounted={opened}>
                    {(styles) => (
                        <Paper className={classes.dropdown} withBorder style={styles}>
                            {items}
                        </Paper>
                    )}
                </Transition>
            </Container>
        </Header>
    );
}