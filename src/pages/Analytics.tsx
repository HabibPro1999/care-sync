
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn, formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock function to fetch analytics data
const fetchAnalytics = async (month: string) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock data
  if (month === '2024-03') {
    return {
      totalAppointments: 45,
      totalCompleted: 38,
      totalIncome: 3800,
      perDoctorStats: {
        d1: {
          doctorId: 'd1',
          doctorName: 'Dr. Robert',
          totalAppointments: 25,
          completedAppointments: 22,
          income: 2200
        },
        d2: {
          doctorId: 'd2',
          doctorName: 'Dr. Sophie',
          totalAppointments: 20,
          completedAppointments: 16,
          income: 1600
        }
      },
      dailyAppointments: [
        { date: '2024-03-01', count: 2 },
        { date: '2024-03-02', count: 3 },
        { date: '2024-03-03', count: 0 },
        { date: '2024-03-04', count: 4 },
        { date: '2024-03-05', count: 5 },
        { date: '2024-03-06', count: 3 },
        { date: '2024-03-07', count: 2 },
        { date: '2024-03-08', count: 1 },
        { date: '2024-03-09', count: 0 },
        { date: '2024-03-10', count: 0 },
        { date: '2024-03-11', count: 6 },
        { date: '2024-03-12', count: 4 },
        { date: '2024-03-13', count: 3 },
        { date: '2024-03-14', count: 2 },
        { date: '2024-03-15', count: 3 },
        { date: '2024-03-16', count: 0 },
        { date: '2024-03-17', count: 0 },
        { date: '2024-03-18', count: 4 },
        { date: '2024-03-19', count: 3 },
        { date: '2024-03-20', count: 0 }
      ],
      statusBreakdown: [
        { name: 'Terminés', value: 38 },
        { name: 'Annulés', value: 4 },
        { name: 'Confirmés', value: 2 },
        { name: 'En attente', value: 1 }
      ]
    };
  } else if (month === '2024-02') {
    return {
      totalAppointments: 42,
      totalCompleted: 36,
      totalIncome: 3600,
      perDoctorStats: {
        d1: {
          doctorId: 'd1',
          doctorName: 'Dr. Robert',
          totalAppointments: 23,
          completedAppointments: 20,
          income: 2000
        },
        d2: {
          doctorId: 'd2',
          doctorName: 'Dr. Sophie',
          totalAppointments: 19,
          completedAppointments: 16,
          income: 1600
        }
      },
      dailyAppointments: [
        { date: '2024-02-01', count: 3 },
        { date: '2024-02-02', count: 2 },
        { date: '2024-02-03', count: 0 },
        { date: '2024-02-04', count: 0 },
        { date: '2024-02-05', count: 4 },
        { date: '2024-02-06', count: 3 },
        { date: '2024-02-07', count: 3 },
        { date: '2024-02-08', count: 2 },
        { date: '2024-02-09', count: 3 },
        { date: '2024-02-10', count: 0 },
        { date: '2024-02-11', count: 0 },
        { date: '2024-02-12', count: 5 },
        { date: '2024-02-13', count: 4 },
        { date: '2024-02-14', count: 2 },
        { date: '2024-02-15', count: 3 },
        { date: '2024-02-16', count: 2 },
        { date: '2024-02-17', count: 0 },
        { date: '2024-02-18', count: 0 },
        { date: '2024-02-19', count: 3 },
        { date: '2024-02-20', count: 3 }
      ],
      statusBreakdown: [
        { name: 'Terminés', value: 36 },
        { name: 'Annulés', value: 3 },
        { name: 'Confirmés', value: 2 },
        { name: 'En attente', value: 1 }
      ]
    };
  } else {
    return {
      totalAppointments: 0,
      totalCompleted: 0,
      totalIncome: 0,
      perDoctorStats: {},
      dailyAppointments: [],
      statusBreakdown: []
    };
  }
};

const COLORS = ['#0088FE', '#FF8042', '#FFBB28', '#00C49F'];

const Analytics = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState<Date>(currentDate);
  
  // Format month for API
  const monthKey = format(selectedMonth, 'yyyy-MM');
  
  // Fetch analytics data
  const { data, isLoading } = useQuery({
    queryKey: ['analytics', monthKey],
    queryFn: () => fetchAnalytics(monthKey)
  });
  
  // Handle month change
  const handleMonthChange = (date: Date | undefined) => {
    if (date) {
      setSelectedMonth(date);
    }
  };
  
  return (
    <DashboardLayout title="Analyse">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-semibold">Statistiques pour {format(selectedMonth, 'MMMM yyyy', { locale: fr })}</h2>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("gap-2")}>
              <CalendarIcon className="h-4 w-4" />
              Changer de mois
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="month"
              selected={selectedMonth}
              onSelect={handleMonthChange}
              locale={fr}
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {isLoading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 rounded-lg animate-pulse bg-muted"></div>
            ))}
          </div>
          <div className="h-80 rounded-lg animate-pulse bg-muted"></div>
        </div>
      ) : data ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total des rendez-vous
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.totalAppointments}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalCompleted} terminés ({Math.round((data.totalCompleted / data.totalAppointments) * 100) || 0}%)
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Revenu total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(data.totalIncome, 'EUR')}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatCurrency(data.totalIncome / data.totalCompleted || 0, 'EUR')} par consultation
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Taux de complétion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round((data.totalCompleted / data.totalAppointments) * 100) || 0}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {data.totalAppointments - data.totalCompleted} rendez-vous non terminés
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Rendez-vous quotidiens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data.dailyAppointments}
                      margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).getDate().toString()}
                        interval={2}
                      />
                      <YAxis allowDecimals={false} />
                      <Tooltip 
                        formatter={(value) => [`${value} rendez-vous`, 'Nombre']}
                        labelFormatter={(label) => format(new Date(label), 'EEEE dd MMMM', { locale: fr })}
                      />
                      <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition par statut</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.statusBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {data.statusBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} rendez-vous`, 'Nombre']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance par docteur</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={Object.values(data.perDoctorStats || {})}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="doctorName" />
                    <YAxis yAxisId="left" orientation="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="totalAppointments" name="Total rendez-vous" fill="#8884d8" />
                    <Bar yAxisId="left" dataKey="completedAppointments" name="Rendez-vous terminés" fill="#82ca9d" />
                    <Bar yAxisId="right" dataKey="income" name="Revenu (€)" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucune donnée disponible pour cette période</p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Analytics;
