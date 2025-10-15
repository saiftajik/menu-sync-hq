import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

interface Stats {
  totalSales: number;
  totalOrders: number;
  activeOrders: number;
  todayRevenue: number;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats>({
    totalSales: 0,
    totalOrders: 0,
    activeOrders: 0,
    todayRevenue: 0,
  });

  useEffect(() => {
    fetchStats();
    
    // Set up realtime subscription for orders
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      // Get total orders
      const { count: totalOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      // Get active orders (pending and in_progress)
      const { count: activeOrders } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .in("status", ["pending", "in_progress"]);

      // Get today's revenue
      const today = new Date().toISOString().split("T")[0];
      const { data: todayOrders } = await supabase
        .from("orders")
        .select("total")
        .gte("created_at", today)
        .eq("status", "completed");

      const todayRevenue = todayOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      // Get total sales (completed orders)
      const { data: completedOrders } = await supabase
        .from("orders")
        .select("total")
        .eq("status", "completed");

      const totalSales = completedOrders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        totalSales,
        totalOrders: totalOrders || 0,
        activeOrders: activeOrders || 0,
        todayRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalSales.toFixed(2)}`,
      icon: DollarSign,
      gradient: "bg-gradient-success",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      gradient: "bg-gradient-primary",
    },
    {
      title: "Active Orders",
      value: stats.activeOrders,
      icon: Users,
      gradient: "bg-warning",
    },
    {
      title: "Today's Revenue",
      value: `$${stats.todayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      gradient: "bg-accent",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your restaurant overview.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 ${stat.gradient} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">No recent activity</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-muted-foreground">Start managing your restaurant from the sidebar menu</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
