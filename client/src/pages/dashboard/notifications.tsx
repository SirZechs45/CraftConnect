import { useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { useAuth } from '@/lib/auth';
import { Redirect } from 'wouter';

import { 
  Package, 
  MessageSquare, 
  AlertCircle, 
  Clock, 
  TruckIcon, 
  CheckCircle 
} from 'lucide-react';

import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function NotificationsPage() {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    loading 
  } = useNotifications();

  // Redirect if not logged in
  if (!user) {
    return <Redirect to="/auth" />;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_update':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-5 w-5 text-green-500" />;
      case 'system':
      default:
        return <AlertCircle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Notifications</h1>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={() => markAllAsRead()}
            >
              Mark all as read
            </Button>
          )}
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>All Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="unread">
                  Unread ({unreadCount})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                {loading ? (
                  <div className="text-center py-10">Loading notifications...</div>
                ) : notifications.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    You don't have any notifications yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`border rounded-lg p-4 ${!notification.isRead ? 'bg-blue-50 border-blue-100' : ''}`}
                        onClick={() => handleMarkAsRead(notification)}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-3">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{notification.title}</h3>
                              <span className="text-sm text-gray-500">
                                {formatDistance(new Date(notification.createdAt), new Date(), { 
                                  addSuffix: true 
                                })}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-1">{notification.message}</p>
                            {notification.data?.status && (
                              <div className="flex items-center mt-2">
                                {getStatusIcon(notification.data.status)}
                                <span className="ml-1 text-sm capitalize">
                                  {notification.data.status}
                                </span>
                              </div>
                            )}
                            {notification.data?.orderId && (
                              <div className="mt-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  asChild
                                >
                                  <a href={`/dashboard/${notification.type === 'order_update' ? 'buyer' : 'seller'}/orders?id=${notification.data.orderId}`}>
                                    View Order
                                  </a>
                                </Button>
                              </div>
                            )}
                          </div>
                          {!notification.isRead && (
                            <div className="ml-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="unread">
                {loading ? (
                  <div className="text-center py-10">Loading notifications...</div>
                ) : unreadCount === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    You don't have any unread notifications.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {notifications
                      .filter(n => !n.isRead)
                      .map((notification) => (
                        <div 
                          key={notification.id} 
                          className="border border-blue-100 rounded-lg p-4 bg-blue-50"
                          onClick={() => handleMarkAsRead(notification)}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1 mr-3">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-medium">{notification.title}</h3>
                                <span className="text-sm text-gray-500">
                                  {formatDistance(new Date(notification.createdAt), new Date(), { 
                                    addSuffix: true 
                                  })}
                                </span>
                              </div>
                              <p className="text-gray-600 mt-1">{notification.message}</p>
                              {notification.data?.status && (
                                <div className="flex items-center mt-2">
                                  {getStatusIcon(notification.data.status)}
                                  <span className="ml-1 text-sm capitalize">
                                    {notification.data.status}
                                  </span>
                                </div>
                              )}
                              {notification.data?.orderId && (
                                <div className="mt-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                  >
                                    <a href={`/dashboard/${notification.type === 'order_update' ? 'buyer' : 'seller'}/orders?id=${notification.data.orderId}`}>
                                      View Order
                                    </a>
                                  </Button>
                                </div>
                              )}
                            </div>
                            <div className="ml-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full" />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}