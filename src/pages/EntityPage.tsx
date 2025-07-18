import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api/client';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
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
import { EntityForm } from '@/components/forms/EntityForm';
import type { EntityConfig, BaseEntity } from '../types';

interface EntityPageProps<T extends BaseEntity> {
  config: EntityConfig<T>;
}

export function EntityPage<T extends BaseEntity>({ config }: EntityPageProps<T>) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEntity, setEditingEntity] = useState<T | null>(null);
  const [viewingEntity, setViewingEntity] = useState<T | null>(null);
  const [deleteEntity, setDeleteEntity] = useState<T | null>(null);
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Helper function to check if deletion is allowed for an entity
  const canDeleteEntity = (entity: T): boolean => {
    const deleteConfig = config.actions?.delete;
    
    // If delete is disabled entirely
    if (deleteConfig === false) return false;
    
    // If delete is simply true (no conditions)
    if (deleteConfig === true) return true;
    
    // If delete has conditions
    if (typeof deleteConfig === 'object' && deleteConfig.enabled) {
      if (deleteConfig.condition) {
        return deleteConfig.condition(entity, currentUser || undefined);
      }
      return true;
    }
    
    return false;
  };

  const { data: entities, isLoading, refetch } = useQuery({
    queryKey: [config.apiEndpoint],
    queryFn: async () => {
      // Special handling for exercise endpoints
      if (config.apiEndpoint.startsWith('exercises/')) {
        const exerciseType = config.apiEndpoint.split('/')[1]; // Get 'letter', 'animal', etc.
        const response = await api.get<{exercises: Record<string, T[]>}>('/exercises');
        
        // Extract the specific exercise type from the grouped response
        const exerciseData = response.data?.exercises?.[exerciseType];
        if (Array.isArray(exerciseData)) {
          return exerciseData;
        }
        return [];
      }
      
      // Regular endpoint handling
      const response = await api.get<T[]>(`/${config.apiEndpoint}`);
      // Handle the API response structure which has data inside the response
      if (Array.isArray(response.data)) {
        return response.data;
      }
      if (Array.isArray(response)) {
        return response;
      }
      return [];
    },
  });

  const deleteEntityMutation = useMutation({
    mutationFn: async (entityId: string) => {
      await api.delete(`/${config.apiEndpoint}/${entityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.apiEndpoint] });
      // Also invalidate the exercises cache for dashboard if this is an exercise endpoint
      if (config.apiEndpoint.startsWith('exercises/')) {
        queryClient.invalidateQueries({ queryKey: ['exercises'] });
      }
      toast.success(`${config.displayName} deleted successfully`, {
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
        closeButton: true,
      });
    },
    onError: (error) => {
      toast.error(`Failed to delete ${config.displayName.toLowerCase()}`, {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        action: {
          label: 'Retry',
          onClick: () => deleteEntityMutation.reset(),
        },
        closeButton: true,
      });
    }
  });

  const createEntityMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      await api.post(`/${config.apiEndpoint}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.apiEndpoint] });
      // Also invalidate the exercises cache for dashboard if this is an exercise endpoint
      if (config.apiEndpoint.startsWith('exercises/')) {
        queryClient.invalidateQueries({ queryKey: ['exercises'] });
      }
      setIsCreateModalOpen(false);
      toast.success(`${config.displayName} created successfully`, {
        description: `${config.displayName} has been created.`,
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
        closeButton: true,
      });
    },
    onError: (error) => {
      toast.error(`Failed to create ${config.displayName.toLowerCase()}`, {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  const updateEntityMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Record<string, unknown> }) => {
      await api.patch(`/${config.apiEndpoint}/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [config.apiEndpoint] });
      // Also invalidate the exercises cache for dashboard if this is an exercise endpoint
      if (config.apiEndpoint.startsWith('exercises/')) {
        queryClient.invalidateQueries({ queryKey: ['exercises'] });
      }
      setEditingEntity(null);
      toast.success(`${config.displayName} updated successfully`, {
        description: `${config.displayName} has been updated.`,
        action: {
          label: 'Dismiss',
          onClick: () => {},
        },
        closeButton: true,
      });
    },
    onError: (error) => {
      toast.error(`Failed to update ${config.displayName.toLowerCase()}`, {
        description: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  });

  const handleSubmit = async (formData: Record<string, unknown>) => {
    try {
      if (editingEntity) {
        await updateEntityMutation.mutateAsync({ 
          id: editingEntity[config.primaryKey] as string, 
          data: formData 
        });
      } else {
        await createEntityMutation.mutateAsync(formData);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground w-full flex flex-col items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p>Loading {config.displayNamePlural.toLowerCase()}...</p>
        </div>
      </div>
    );
  }

  const renderCellValue = (column: EntityConfig<T>['tableColumns'][0], entity: T) => {
    const value = entity[column.key];
    if (column.render) {
      return column.render(value, entity);
    }
    
    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    
    // Handle date strings (like birthdate from API)
    if (typeof value === 'string' && column.key === 'birthdate') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date.toLocaleDateString();
    }
    
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    
    return value?.toString() || 'N/A';
  };

  const renderDetailValue = (field: EntityConfig<T>['tableColumns'][0], entity: T) => {
    const value = entity[field.key];
    if (field.render) {
      return field.render(value, entity);
    }
    
    // Handle Date objects
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    
    // Handle date strings (like birthdate from API)
    if (typeof value === 'string' && field.key === 'birthdate') {
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date.toLocaleString();
    }
    
    if (typeof value === 'boolean') {
      return value ? (
        <span className="inline-flex rounded-full bg-green-500/10 px-2 text-xs font-semibold leading-5 text-green-700">Yes</span>
      ) : (
        <span className="inline-flex rounded-full bg-red-500/10 px-2 text-xs font-semibold leading-5 text-red-700">No</span>
      );
    }
    
    return value?.toString() || 'N/A';
  };

  return (
    <div className="min-h-screen bg-background text-foreground w-full flex flex-col items-center px-32 py-8">
      <div className="w-full max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary">{config.displayNamePlural}</h1>
            <p className="text-muted-foreground">Manage {config.displayNamePlural.toLowerCase()}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              aria-label="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            {config.actions?.create !== false && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                aria-label={`Create ${config.displayName}`}
              >
                <Plus className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {entities && entities.length > 0 ? (
          <Table>
            <TableCaption>{entities?.length} {config.displayNamePlural.toLowerCase()}</TableCaption>
            <TableHeader>
              <TableRow>
                {config.tableColumns.map((column) => (
                  <TableHead key={column.key as string}>{column.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entities?.map((entity) => (
                <TableRow key={entity[config.primaryKey] as string}>
                  {config.tableColumns.map((column) => (
                    <TableCell key={column.key as string}>
                      {renderCellValue(column, entity)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right flex gap-2 justify-end">
                    {config.actions?.view !== false && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setViewingEntity(entity)}
                        aria-label="View"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {config.actions?.edit !== false && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingEntity(entity)}
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {canDeleteEntity(entity) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Delete"
                            onClick={() => setDeleteEntity(entity)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className='bg-white'>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete {config.displayName}</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this {config.displayName.toLowerCase()}? This action cannot be undone.<br />
                              <span className="block mt-2 text-sm text-muted-foreground">
                                <b>ID:</b> {entity[config.primaryKey]?.toString()}
                              </span>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setDeleteEntity(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={async () => {
                                if (deleteEntity) {
                                  await deleteEntityMutation.mutateAsync(deleteEntity[config.primaryKey] as string);
                                  setDeleteEntity(null);
                                }
                              }}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground">No {config.displayNamePlural.toLowerCase()} found</div>
        )}

        {/* Entity View Drawer */}
        {config.actions?.view !== false && (
          <Drawer
            open={viewingEntity !== null}
            onOpenChange={(open) => !open && setViewingEntity(null)}
            direction='right'
          >
            <div className={viewingEntity ? 'fixed inset-0 bg-black/40 z-40 transition-opacity' : 'hidden'} />
            <DrawerContent className="h-full w-full z-50 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-right-80">
              <DrawerHeader>
                <DrawerTitle>{config.displayName} Details</DrawerTitle>
                <DrawerDescription>Detailed information about this {config.displayName.toLowerCase()}.</DrawerDescription>
              </DrawerHeader>
              {viewingEntity && (
                <div className="p-6">
                  <Table>
                    <TableBody>
                      {(config.detailFields || config.tableColumns).map((field) => (
                        <TableRow key={field.key as string}>
                          <TableCell className="font-medium w-40">{field.label}</TableCell>
                          <TableCell>{renderDetailValue(field, viewingEntity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              <DrawerClose asChild>
                <Button variant="outline" className="absolute top-4 right-4" aria-label={`Close ${config.displayName.toLowerCase()} details`}>
                  <span>Close</span>
                </Button>
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        )}

        {/* Create Entity Drawer */}
        {config.actions?.create !== false && (
          <Drawer
            open={isCreateModalOpen}
            onOpenChange={() => setIsCreateModalOpen(false)}
            direction='right'
          >
            <div className={isCreateModalOpen ? 'fixed inset-0 bg-black/40 z-40 transition-opacity' : 'hidden'} />
            <DrawerContent className="h-full w-full z-50 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-right-80 flex flex-col">
              <DrawerHeader className="flex-shrink-0">
                <DrawerTitle>Create New {config.displayName}</DrawerTitle>
                <DrawerDescription>
                  Fill in the details to create a new {config.displayName.toLowerCase()}
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto p-6">
                <FocusTrap active={isCreateModalOpen}>
                  <EntityForm
                    config={config}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsCreateModalOpen(false)}
                  />
                </FocusTrap>
              </div>
              <DrawerClose asChild>
                <Button variant="outline" className="absolute top-4 right-4" aria-label={`Close ${config.displayName.toLowerCase()} creation form`}>
                  <span>Close</span>
                </Button>
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        )}

        {/* Edit Entity Drawer */}
        {config.actions?.edit !== false && (
          <Drawer
            open={editingEntity !== null}
            onOpenChange={(open) => !open && setEditingEntity(null)}
            direction='right'
          >
            <div className={editingEntity ? 'fixed inset-0 bg-black/40 z-40 transition-opacity' : 'hidden'} />
            <DrawerContent className="h-full w-full z-50 bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 shadow-2xl animate-in slide-in-from-right-80 flex flex-col">
              <DrawerHeader className="flex-shrink-0">
                <DrawerTitle>Edit {config.displayName}</DrawerTitle>
                <DrawerDescription>Update {config.displayName.toLowerCase()} information</DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto p-6">
                {editingEntity && (
                  <FocusTrap active={editingEntity !== null}>
                    <EntityForm
                      config={config}
                      entity={editingEntity}
                      onSubmit={handleSubmit}
                      onCancel={() => setEditingEntity(null)}
                    />
                  </FocusTrap>
                )}
              </div>
              <DrawerClose asChild>
                <Button variant="outline" className="absolute top-4 right-4" aria-label={`Close ${config.displayName.toLowerCase()} edit form`}>
                  <span>Close</span>
                </Button>
              </DrawerClose>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}
