import {
  Container,
  Title,
  SimpleGrid,
  Card,
  Text,
  Button,
  List,
  Badge,
  Group,
  ThemeIcon,
  Stack,
  Paper,
  Table,
} from '@mantine/core'
import { IconCheck, IconDownload } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { getInvoices, getPlans } from '../../../services/billingService'
import { Invoice, Plan } from '../../../services/mockData'

export function BillingPage() {
  const [plans, setPlans] = useState<Plan[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const [planData, invoiceData] = await Promise.all([getPlans(), getInvoices()])
      if (mounted) {
        setPlans(planData)
        setInvoices(invoiceData)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  return (
    <Container size="xl">
      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs">
            Billing & Subscription
          </Title>
          <Text c="dimmed">Manage your subscription and billing information</Text>
        </div>

        <div>
          <Title order={2} mb="md">
            Choose Your Plan
          </Title>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
            {plans.map((plan) => (
              <Card
                key={plan.id}
                withBorder
                radius="md"
                p="xl"
                style={{
                  position: 'relative',
                  border: plan.popular ? '2px solid var(--mantine-primary-color-5)' : undefined,
                }}
              >
                {plan.popular && (
                  <Badge
                    variant="filled"
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                    }}
                  >
                    Most Popular
                  </Badge>
                )}

                <Stack gap="md">
                  <div>
                    <Text size="xl" fw={700}>
                      {plan.name}
                    </Text>
                    <Group align="baseline" gap="xs" mt="xs">
                      <Text size="3rem" fw={900}>
                        ${plan.price}
                      </Text>
                      <Text size="sm" c="dimmed">
                        /{plan.interval}
                      </Text>
                    </Group>
                  </div>

                  <List
                    spacing="sm"
                    size="sm"
                    icon={
                      <ThemeIcon size={20} radius="xl" color="green">
                        <IconCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    {plan.features.map((feature) => (
                      <List.Item key={feature}>{feature}</List.Item>
                    ))}
                  </List>

                  <Button fullWidth variant={plan.popular ? 'filled' : 'light'} size="md">
                    Get Started
                  </Button>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </div>

        <div>
          <Title order={2} mb="md">
            Billing History
          </Title>
          <Paper withBorder radius="md">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Invoice</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Amount</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Actions</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {invoices.map((invoice) => (
                  <Table.Tr key={invoice.id}>
                    <Table.Td>
                      <Text fw={500}>{invoice.id}</Text>
                    </Table.Td>
                    <Table.Td>{invoice.date}</Table.Td>
                    <Table.Td>{invoice.amount}</Table.Td>
                    <Table.Td>
                      <Badge color="green">{invoice.status}</Badge>
                    </Table.Td>
                    <Table.Td>
                      <Button variant="subtle" size="xs" leftSection={<IconDownload size={14} />}>
                        Download
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </div>
      </Stack>
    </Container>
  )
}
