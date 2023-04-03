import { createStyles, Paper, Text, ThemeIcon, rem, Box, Title } from '@mantine/core';
import { IconColorSwatch } from '@tabler/icons-react';

const useStyles = createStyles((theme) => ({
    card: {
        position: 'relative',
        cursor: 'pointer',
        overflow: 'hidden',
        transition: 'transform 150ms ease, box-shadow 100ms ease',
        padding: theme.spacing.xl,
        paddingLeft: `calc(${theme.spacing.xl} * 2)`,

        '&:hover': {
            boxShadow: theme.shadows.md,
            transform: 'scale(1.02)',
        },

        '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            width: rem(6),
            backgroundImage: theme.fn.linearGradient(0, theme.colors.pink[6], theme.colors.orange[6]),
        },
    },
}));

interface CardGradientProps {
    icon?: React.ReactNode;
    title: string;
    description: string;
}

export function CardGradient({ icon, title, description }: CardGradientProps) {
    const { classes } = useStyles();
    return (
        <Paper withBorder radius="md" className={classes.card}>
            <Text fz='lg' fw='700' lineClamp={2}>
                {title}
            </Text>

            <Text size="sm" mt="sm" color="dimmed" lineClamp={4}>
                {description}
            </Text>

        </Paper>
    );
}