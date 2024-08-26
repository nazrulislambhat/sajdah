'use client';
import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
type AlertProps = {
  className?: string;
  variant?: 'success' | 'error' | 'info'; // Add other variants if needed
};

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';

const prayers = [
  'Fajr',
  'Tahajjud',
  'Chast',
  'Dhuhr',
  'Asr',
  'Maghrib',
  'Isha',
];
type PrayerStatus =
  | 'Not Prayed'
  | 'Prayed On Time'
  | 'Prayed In Jamaat'
  | 'Prayed But Qaza'
  | null;
type PrayerEntry = { date: string; statuses: Record<string, PrayerStatus> };

const statusColors = {
  'Not Prayed': '#F22B29',
  'Prayed On Time': '#3B28CC',
  'Prayed In Jamaat': '#2D936C',
  'Prayed But Qaza': '#360568',
};

export default function Component() {
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const [
    showAllPrayedInJamaatNotification,
    setShowAllPrayedInJamaatNotification,
  ] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem('prayerEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    const currentEntry = getCurrentEntry();

    // Check if all prayers are Prayed, considering the conditions for Chast and Tahajjud
    const allPrayedInJamaat = prayers.every((prayer) => {
      const status = currentEntry.statuses[prayer];

      if (prayer === 'Tahajjud' || prayer === 'Chast') {
        return status === 'Prayed On Time' || status === 'Not Prayed';
      } else {
        return status === 'Prayed In Jamaat';
      }
    });

    setShowAllPrayedInJamaatNotification(allPrayedInJamaat);
  }, [entries, currentDate]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setCurrentDate(selectedDate);
      setIsCalendarOpen(false);
    }
  };

  const handlePrayerStatusChange = (prayer: string, status: PrayerStatus) => {
    setEntries((prev) => {
      const existingEntryIndex = prev.findIndex(
        (entry) => entry.date === format(currentDate, 'yyyy-MM-dd')
      );
      if (existingEntryIndex !== -1) {
        const updatedEntries = [...prev];
        updatedEntries[existingEntryIndex] = {
          ...updatedEntries[existingEntryIndex],
          statuses: {
            ...updatedEntries[existingEntryIndex].statuses,
            [prayer]: status,
          },
        };
        return updatedEntries;
      } else {
        return [
          ...prev,
          {
            date: format(currentDate, 'yyyy-MM-dd'),
            statuses: { [prayer]: status },
          },
        ];
      }
    });
  };

  const getStatusColor = (status: PrayerStatus) => {
    switch (status) {
      case 'Not Prayed':
        return 'text-white bg-colorRed';
      case 'Prayed On Time':
        return 'text-white bg-colorBlue';
      case 'Prayed In Jamaat':
        return 'text-white bg-colorGreen';
      case 'Prayed But Qaza':
        return 'text-white bg-colorPurple';
      default:
        return '';
    }
  };

  const getCurrentEntry = () => {
    return (
      entries.find(
        (entry) => entry.date === format(currentDate, 'yyyy-MM-dd')
      ) || { date: format(currentDate, 'yyyy-MM-dd'), statuses: {} }
    );
  };

  const handleSave = () => {
    localStorage.setItem('prayerEntries', JSON.stringify(entries));
    setIsSaveDialogOpen(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  const getPieChartData = () => {
    const currentEntry = getCurrentEntry();
    const statusCounts = Object.values(currentEntry.statuses).reduce(
      (acc, status) => {
        if (status) {
          acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center mb-6">
        Daily Prayer Tracker
      </h2>
      {showSaveSuccess && (
        <Alert className="mb-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>
            Your prayer entries have been saved successfully.
          </AlertDescription>
        </Alert>
      )}
      {showAllPrayedInJamaatNotification && (
        <Alert className="mb-4 success border-colorGreen border-2">
          <AlertTitle>Congratulations!</AlertTitle>
          <AlertDescription>
            All fard prayers for{' '}
            <span className="text-colorBlue">{format(currentDate, 'PPP')}</span>{' '}
            have been Prayed in
            <span className=" text-colorGreen font-bold"> Jamaat</span>
          </AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Prayer Entry - {format(currentDate, 'PPP')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="date-select"
              >
                Date
              </label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    id="date-select"
                    variant={'outline'}
                    className={cn('w-full justify-start text-left font-normal')}
                    onClick={() => setIsCalendarOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(currentDate, 'PPP')}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={currentDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {prayers.map((prayer) => (
              <div key={prayer}>
                <label
                  htmlFor={prayer}
                  className="block text-sm font-medium mb-1"
                >
                  {prayer}
                </label>
                <Select
                  value={getCurrentEntry().statuses[prayer] || ''}
                  onValueChange={(value) => {
                    handlePrayerStatusChange(prayer, value as PrayerStatus);
                  }}
                >
                  <SelectTrigger
                    id={prayer}
                    className={cn(
                      getStatusColor(getCurrentEntry().statuses[prayer])
                    )}
                  >
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Prayed" className="text-colorRed">
                      Not Prayed
                    </SelectItem>
                    <SelectItem value="Prayed On Time" className="text-colorBlue">
                      Prayed On Time
                    </SelectItem>
                    <SelectItem value="Prayed But Qaza" className="text-colorPurple">
                      Prayed But Qaza
                    </SelectItem>
                    {/* Conditionally render the 'Prayed in Jamaat' option */}
                    {prayer !== 'Tahajjud' && prayer !== 'Chast' && (
                      <SelectItem
                        value="Prayed In Jamaat"
                        className="text-colorGreen"
                      >
                        Prayed In Jamaat
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%" className="text-xs">
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={65}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {getPieChartData().map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        statusColors[entry.name as keyof typeof statusColors]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-4">Save Progress</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Prayer Entry</DialogTitle>
              <DialogDescription>
                Are you sure you want to save this prayer entry?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
