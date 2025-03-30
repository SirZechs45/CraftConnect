import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';

export interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'order_update' | 'system' | 'message';
  isRead: boolean;
  createdAt: string;
  data?: {
    orderId?: number;
    status?: string;
    [key: string]: any;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  loading: boolean;
  error: Error | null;
}

const defaultContext: NotificationContextType = {
  notifications: [],
  unreadCount: 0,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  loading: false,
  error: null
};

const NotificationContext = createContext<NotificationContextType>(defaultContext);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [error, setError] = useState<Error | null>(null);
  
  // Fetch notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['/api/notifications'],
    enabled: !!user,
    staleTime: 30000, // 30 seconds
    refetchInterval: 30000, // 30 seconds auto refresh
  });
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/notifications/${id}/read`, {
        method: 'PUT',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
    onError: (err: Error) => {
      setError(err);
    }
  });
  
  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('/api/notifications/read-all', {
        method: 'PUT',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
    onError: (err: Error) => {
      setError(err);
    }
  });
  
  // Mark single notification as read
  const markAsRead = async (id: number) => {
    await markAsReadMutation.mutateAsync(id);
  };
  
  // Mark all notifications as read
  const markAllAsRead = async () => {
    await markAllAsReadMutation.mutateAsync();
  };
  
  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        loading: isLoading,
        error
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}