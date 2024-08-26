import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
type PrayerStatus = 'not-prayed' | 'prayed' | 'prayed-jamaat' | null;
type PrayerEntry = { date: string; statuses: Record<string, PrayerStatus> };

const statusColors = {
  'not-prayed': '#ef4444',
  prayed: '#22c55e',
  'prayed-jamaat': '#bbf7d0',
};

export default function Component() {
  const [entries, setEntries] = useState<PrayerEntry[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    const savedEntries = localStorage.getItem('prayerEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

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
      case 'not-prayed':
        return 'text-red-500';
      case 'prayed':
        return 'text-green-500';
      case 'prayed-jamaat':
        return 'text-green-500 bg-green-100';
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
                  onValueChange={(value: PrayerStatus) =>
                    handlePrayerStatusChange(prayer, value)
                  }
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
                    <SelectItem value="not-prayed" className="text-red-500">
                      Not Prayed
                    </SelectItem>
                    <SelectItem value="prayed" className="text-green-500">
                      Prayed
                    </SelectItem>
                    <SelectItem
                      value="prayed-jamaat"
                      className="text-green-500 bg-green-100"
                    >
                      Prayed in Jamaat
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
          <div className="mt-8 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPieChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
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
            <Button className="mt-4">Save Entry</Button>
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
