import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, CreateUserDTO, CreateAdminUserDTO } from '../../types';
import { api } from '../../lib/api/client';
import { toast } from 'sonner';
import { FocusTrap } from '@/components/ui/focus-trap';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { Eye, Pencil, Trash2, RefreshCw, Plus } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { UserForm } from '@/components/forms/UserForm';

export function UsersPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await api.get<User[]>('/users');
      return response.data || [];
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      await api.delete(`/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('User deleted successfully', {
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
        closeButton: true,
      });
    },
    onError: (error) => {
      toast.error('Failed to delete user', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        action: {
          label: 'Retry',
          onClick: () => deleteUserMutation.reset(),
        },
        closeButton: true,
      });
    }
  });

  const createUserMutation = useMutation({
    mutationFn: async (data: CreateUserDTO | CreateAdminUserDTO) => {
      const endpoint = 'isAdmin' in data && data.isAdmin ? '/users/admin' : '/users';
      await api.post(endpoint, data);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreateModalOpen(false);
      toast.success('User created successfully', {
        description: `User ${data.username} has been created.`,
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
        closeButton: true,
      });
    },
    onError: (error) => {
      toast.error('Failed to create user', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateUserDTO | CreateAdminUserDTO> }) => {
      await api.patch(`/users/${id}`, data);
    },
    onSuccess: (_, { data }) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUser(null);
      toast.success('User updated successfully', {
        description: `User ${data.username || ''} has been updated.`,
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
        closeButton: true,
      });
    },
    onError: (error) => {
      toast.error('Failed to update user', {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  // Handle form submission from UserForm
  const handleSubmit = async (formData: {
    email: string;
    username: string;
    password?: string;
    birthdate?: string;
    isAdmin?: boolean;
    adminCreationKey?: string;
    googleId?: string;
    emailVerified?: boolean;
    createdAt?: string;
    updatedAt?: string;
  }) => {
    try {
      // Prepare data for API
      const apiData: CreateUserDTO | CreateAdminUserDTO = {
        email: formData.email,
        username: formData.username,
        password: formData.password,
        birthdate: formData.birthdate ? new Date(formData.birthdate) : undefined,
        googleId: formData.googleId,
        emailVerified: formData.emailVerified,
        ...formData.isAdmin && { isAdmin: true, adminCreationKey: formData.adminCreationKey },
      };
      
      if (editingUser) {
        await updateUserMutation.mutateAsync({ id: editingUser.id, data: apiData });
        setEditingUser(null);
      } else {
        await createUserMutation.mutateAsync(apiData);
        setIsCreateModalOpen(false);
      }
      
      return Promise.resolve(); // Return resolved promise for the form
    } catch (error) {
      console.error('Error submitting user form:', error);
      return Promise.reject(error); // Return rejected promise for the form
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // TODO: Replace with proper loading component
  }

  return (
    <div className="min-h-screen bg-background text-foreground w-full flex flex-col items-center px-32 py-8">
      <div className="w-full flex flex-row justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-primary">Users</h1>
        <div className="flex gap-2">
          <Button onClick={() => refetch()} variant="outline" size="icon" aria-label="Reload">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)} size="icon" aria-label="Add user">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>
      {users && users.length > 0 ? (
        <Table>
          <TableCaption>{users?.length} users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Google ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="text-xs">{user.id}</TableCell>
                <TableCell>{user.googleId || 'N/A'}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="font-medium pl-4">{user.username}</TableCell>
                <TableCell>{user.isAdmin ? 'Admin' : 'User'}</TableCell>
                <TableCell>
                  {user.emailVerified ? (
                    <span className="inline-flex rounded-full bg-green-500/10 px-2 text-xs font-semibold leading-5 text-green-700">Verified</span>
                  ) : (
                    <span className="inline-flex rounded-full bg-yellow-400/20 px-2 text-xs font-semibold leading-5 text-yellow-700">Pending</span>
                  )}
                </TableCell>
                <TableCell>
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 text-xs font-semibold text-yellow-800">
                      <span>Admin</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 text-xs font-semibold text-blue-800">
                      <span>User</span>
                    </span>
                  )}
                </TableCell>
                <TableCell className="text-right flex gap-2 justify-end">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setViewingUser(user)}
                    aria-label="View"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingUser(user)}
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete"
                        onClick={() => setDeleteUser(user)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent
                    className='bg-white'
                    >
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this user? This action cannot be undone.<br />
                          <span className="block mt-2 text-sm text-muted-foreground">
                            <b>ID:</b> {deleteUser?.id}<br />
                            <b>Email:</b> {deleteUser?.email}<br />
                            <b>Username:</b> {deleteUser?.username}
                          </span>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteUser(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            if (deleteUser) {
                              await deleteUserMutation.mutateAsync(deleteUser.id);
                              setDeleteUser(null);
                            }
                          }}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center text-muted-foreground">No users found</div>
      )}
      {/* User View Drawer */}
      <Drawer
        open={viewingUser !== null}
        onOpenChange={(open) => !open && setViewingUser(null)}
        direction='right'
      >
        <div className={viewingUser ? 'fixed inset-0 bg-black/40 z-40 transition-opacity' : 'hidden'} />
        <DrawerContent className="h-full w-full z-50 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-right-80">
          <DrawerHeader>
            <DrawerTitle>User Details</DrawerTitle>
            <DrawerDescription>Detailed information about the user.</DrawerDescription>
          </DrawerHeader>
          {viewingUser && (
            <div className="p-6">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium w-40">ID</TableCell>
                    <TableCell>{viewingUser.id}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Google ID</TableCell>
                    <TableCell>{viewingUser.googleId || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email</TableCell>
                    <TableCell>{viewingUser.email}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Username</TableCell>
                    <TableCell>{viewingUser.username}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Birthdate</TableCell>
                    <TableCell>{viewingUser.birthdate ? new Date(viewingUser.birthdate).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Email Verification</TableCell>
                    <TableCell>
                      {viewingUser.emailVerified ? (
                        <span className="inline-flex rounded-full bg-green-500/10 px-2 text-xs font-semibold leading-5 text-green-700">Verified</span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-500/10 px-2 text-xs font-semibold leading-5 text-red-700">Not Verified</span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Role</TableCell>
                    <TableCell>
                      {viewingUser.isAdmin ? (
                        <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 text-xs font-semibold text-yellow-800">
                          <span>Admin</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 text-xs font-semibold text-blue-800">
                          <span>User</span>
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Created At</TableCell>
                    <TableCell>{new Date(viewingUser.createdAt).toLocaleString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Updated At</TableCell>
                    <TableCell>{new Date(viewingUser.updatedAt).toLocaleString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
          <DrawerClose asChild>
            <Button variant="outline" className="absolute top-4 right-4" aria-label="Close user details">
              <span>Close</span>
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* Create User Drawer */}
      <Drawer
        open={isCreateModalOpen}
        onOpenChange={() => setIsCreateModalOpen(false)}
        direction='right'
      >
        <div className={isCreateModalOpen ? 'fixed inset-0 bg-black/40 z-40 transition-opacity' : 'hidden'} />
        <DrawerContent className="h-full w-full z-50 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-right-80">
          <DrawerHeader>
            <DrawerTitle>Create New User</DrawerTitle>
            <DrawerDescription>
              Fill in the details to create a new user
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            <FocusTrap active={isCreateModalOpen}>
              <UserForm
                onSubmit={handleSubmit}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </FocusTrap>
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="absolute top-4 right-4" aria-label="Close user creation form">
              <span>Close</span>
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>

      {/* Edit User Drawer */}
      <Drawer
        open={editingUser !== null}
        onOpenChange={(open) => !open && setEditingUser(null)}
        direction='right'
      >
        <div className={editingUser ? 'fixed inset-0 bg-black/40 z-40 transition-opacity' : 'hidden'} />
        <DrawerContent className="h-full w-full z-50 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-right-80">
          <DrawerHeader>
            <DrawerTitle>Edit User</DrawerTitle>
            <DrawerDescription>Update user information</DrawerDescription>
          </DrawerHeader>
          <div className="p-6">
            {editingUser && (
              <FocusTrap active={editingUser !== null}>
                <UserForm
                  user={editingUser}
                  onSubmit={handleSubmit}
                  onCancel={() => setEditingUser(null)}
                />
              </FocusTrap>
            )}
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="absolute top-4 right-4" aria-label="Close user editing form">
              <span>Close</span>
            </Button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </div>
  );
}