import { useState } from 'react';
import { Link } from 'wouter';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatDistance } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Bell, 
  Package, 
  CheckCircle, 
  TruckIcon, 
  Clock,
  MessageSquare,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

export function NotificationsPopover() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const filteredNotifications = activeTab === 'all' 
    ? notifications 
    : notifications.filter(n => !n.isRead);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_update':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'system':
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
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

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-medium">Notifications</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => markAllAsRead()}
              className="text-xs h-7"
            >
              Mark all as read
            </Button>
          )}
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-full rounded-none">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="m-0">
            <ScrollArea className="h-[300px]">
              {filteredNotifications.length > 0 ? (
                <div className="flex flex-col">
                  {filteredNotifications.map((notification) => (
                    <div key={notification.id}>
                      <Link
                        href={notification.data?.orderId 
                          ? `/dashboard/${notification.type === 'order_update' ? 'buyer' : 'seller'}/orders?id=${notification.data.orderId}` 
                          : '#'}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className={`flex items-start p-3 hover:bg-gray-50 cursor-pointer ${!notification.isRead ? 'bg-blue-50/50' : ''}`}>
                          <div className="flex-shrink-0 mr-3 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            {notification.data?.status && (
                              <div className="flex items-center mt-1">
                                {getStatusIcon(notification.data.status)}
                                <span className="text-xs ml-1 capitalize text-gray-600">
                                  {notification.data.status}
                                </span>
                              </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistance(new Date(notification.createdAt), new Date(), { 
                                addSuffix: true 
                              })}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="ml-2 mt-0.5">
                              <div className="h-2 w-2 bg-blue-500 rounded-full" />
                            </div>
                          )}
                        </div>
                      </Link>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Bell className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">
                    {activeTab === 'all' 
                      ? "No notifications yet" 
                      : "No unread notifications"}
                  </p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unread" className="m-0">
            <ScrollArea className="h-[300px]">
              {filteredNotifications.length > 0 ? (
                <div className="flex flex-col">
                  {filteredNotifications.map((notification) => (
                    <div key={notification.id}>
                      <Link
                        href={notification.data?.orderId 
                          ? `/dashboard/${notification.type === 'order_update' ? 'buyer' : 'seller'}/orders?id=${notification.data.orderId}` 
                          : '#'}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="flex items-start p-3 hover:bg-gray-50 cursor-pointer bg-blue-50/50">
                          <div className="flex-shrink-0 mr-3 mt-0.5">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.message}
                            </p>
                            {notification.data?.status && (
                              <div className="flex items-center mt-1">
                                {getStatusIcon(notification.data.status)}
                                <span className="text-xs ml-1 capitalize text-gray-600">
                                  {notification.data.status}
                                </span>
                              </div>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDistance(new Date(notification.createdAt), new Date(), { 
                                addSuffix: true 
                              })}
                            </p>
                          </div>
                          <div className="ml-2 mt-0.5">
                            <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          </div>
                        </div>
                      </Link>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-12">
                  <Bell className="h-10 w-10 text-gray-300 mb-3" />
                  <p className="text-gray-500 text-sm">No unread notifications</p>
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <div className="p-2 border-t">
          <Button variant="outline" size="sm" className="w-full text-xs" asChild>
            <Link href="/dashboard/notifications">
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}