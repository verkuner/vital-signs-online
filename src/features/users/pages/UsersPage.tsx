import { useEffect, useState } from 'react'
import {
  Container,
  Title,
  Paper,
  Table,
  Avatar,
  Group,
  Text,
  Badge,
  ActionIcon,
  Menu,
  TextInput,
  PasswordInput,
  Button,
  Flex,
  Select,
  Pagination,
  Modal,
  Stack,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconSearch, IconDots, IconPencil, IconTrash, IconUserPlus } from '@tabler/icons-react'
import { modals } from '@mantine/modals'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { deleteUser, getUsers, createUser } from '../../../services/usersService'
import { User } from '../../../services/mockData'

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false)
  const [addLoading, setAddLoading] = useState(false)

  const addForm = useForm({
    initialValues: { name: '', email: '', password: '' },
    validate: {
      name: (v) => (v.length >= 2 ? null : 'Name must be at least 2 characters'),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      password: (v) => (v.length >= 8 ? null : 'Password must be at least 8 characters'),
    },
  })

  useEffect(() => {
    let mounted = true
    const load = async () => {
      const data = await getUsers()
      if (mounted) setUsers(data)
    }
    load()
    return () => { mounted = false }
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesRole = !roleFilter || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const handleDeleteUser = (userId: string) => {
    modals.openConfirmModal({
      title: 'Delete user',
      children: <Text size="sm">Are you sure you want to delete this user?</Text>,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        deleteUser(userId).then(() => {
          setUsers((prev) => prev.filter((u) => u.id !== userId))
        })
        notifications.show({
          title: 'Success',
          message: 'User deleted successfully',
          color: 'green',
        })
      },
    })
  }

  const handleAddUser = async (values: typeof addForm.values) => {
    setAddLoading(true)
    try {
      const newUser = await createUser(values)
      setUsers((prev) => [newUser, ...prev])
      closeAdd()
      addForm.reset()
      notifications.show({
        title: 'User created',
        message: `${newUser.name} (${newUser.email}) has been added`,
        color: 'green',
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create user'
      notifications.show({
        title: 'Error',
        message,
        color: 'red',
      })
    } finally {
      setAddLoading(false)
    }
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        User Management
      </Title>

      <Paper withBorder p="md" radius="md" mb="md">
        <Flex gap="md" justify="space-between" align="flex-end" direction={{ base: 'column', sm: 'row' }}>
          <TextInput
            placeholder="Search users..."
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            style={{ flex: 1 }}
          />
          <Select
            placeholder="Filter by role"
            data={['Admin', 'User', 'Manager']}
            value={roleFilter}
            onChange={setRoleFilter}
            clearable
            style={{ minWidth: 200 }}
          />
          <Button leftSection={<IconUserPlus size={16} />} onClick={openAdd}>
            Add User
          </Button>
        </Flex>
      </Paper>

      <Paper withBorder radius="md">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>User</Table.Th>
              <Table.Th>Role</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Joined</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {filteredUsers
              .slice((page - 1) * itemsPerPage, page * itemsPerPage)
              .map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar src={user.avatar} radius="xl">
                        {user.name.charAt(0)}
                      </Avatar>
                      <div>
                        <Text size="sm" fw={500}>
                          {user.name}
                        </Text>
                        <Text size="xs" c="dimmed">
                          {user.email}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Badge variant="light">{user.role}</Badge>
                  </Table.Td>
                  <Table.Td>
                    <Badge color={user.status === 'active' ? 'green' : 'gray'}>
                      {user.status}
                    </Badge>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{user.joinedAt}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle">
                          <IconDots size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item leftSection={<IconPencil size={16} />}>Edit</Menu.Item>
                        <Menu.Item
                          color="red"
                          leftSection={<IconTrash size={16} />}
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
          </Table.Tbody>
        </Table>

        <Flex justify="center" p="md">
          <Pagination total={Math.ceil(filteredUsers.length / itemsPerPage)} value={page} onChange={setPage} />
        </Flex>
      </Paper>

      <Modal opened={addOpened} onClose={closeAdd} title="Add New User" centered>
        <form onSubmit={addForm.onSubmit(handleAddUser)}>
          <Stack gap="md">
            <TextInput
              label="Full name"
              placeholder="Jane Doe"
              required
              {...addForm.getInputProps('name')}
            />
            <TextInput
              label="Email"
              placeholder="jane@example.com"
              required
              {...addForm.getInputProps('email')}
            />
            <PasswordInput
              label="Password"
              placeholder="Minimum 8 characters"
              required
              {...addForm.getInputProps('password')}
            />
            <Group justify="flex-end" mt="sm">
              <Button variant="default" onClick={closeAdd}>
                Cancel
              </Button>
              <Button type="submit" loading={addLoading}>
                Create User
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </Container>
  )
}
