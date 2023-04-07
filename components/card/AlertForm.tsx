import { Text, Container, Flex, Paper, ScrollArea, Stack, Title, Divider, Space, Box, Group, Button, createStyles, rem, ActionIcon, Modal, Dialog } from '@mantine/core';

export type AlertFormProps = {
    title: string;
    content: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

const AlertForm = ({ title, content, confirmText, cancelText, onConfirm, onCancel }: AlertFormProps) => {
    const onConfirmAction = () => {
        if (onConfirm) {
            onConfirm();
        }
    }

    const onCancelAction = () => {
        if (onCancel) {
            onCancel();
        }
    }

    return (
        <Stack align='flex-end'>
            <Group noWrap mt="md">
                {content}
            </Group>

            <Group mt="xl">
                <Button variant="outline" onClick={() => onConfirmAction()}>
                    {confirmText}
                </Button>
                <Button variant="outline" onClick={() => onCancelAction()}>
                    {cancelText}
                </Button>
            </Group>
        </Stack>
    )
};
export default AlertForm;