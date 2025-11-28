export interface Alert {
  id: string;
  date: string;
  time: string;
  imageUrl: string;
  triggerTerm: string;
}

// Mock data for alerts
export const MOCK_ALERTS: Alert[] = [
  {
    id: '1',
    date: '2025-11-28',
    time: '14:30:15',
    imageUrl: 'https://picsum.photos/seed/1/800/600',
    triggerTerm: 'Person',
  },
  {
    id: '2',
    date: '2025-11-28',
    time: '11:45:55',
    imageUrl: 'https://picsum.photos/seed/2/800/600',
    triggerTerm: 'Vehicle',
  },
  {
    id: '3',
    date: '2025-11-27',
    time: '22:10:05',
    imageUrl: 'https://picsum.photos/seed/3/800/600',
    triggerTerm: 'Animal',
  },
  {
    id: '4',
    date: '2025-11-27',
    time: '21:50:23',
    imageUrl: 'https://picsum.photos/seed/4/800/600',
    triggerTerm: 'Person',
  },
  {
    id: '5',
    date: '2025-11-26',
    time: '18:05:19',
    imageUrl: 'https://picsum.photos/seed/5/800/600',
    triggerTerm: 'Package',
  },
  {
    id: '6',
    date: '2025-11-26',
    time: '09:15:42',
    imageUrl: 'https://picsum.photos/seed/6/800/600',
    triggerTerm: 'Vehicle',
  },
  {
    id: '7',
    date: '2025-11-25',
    time: '16:30:00',
    imageUrl: 'https://picsum.photos/seed/7/800/600',
    triggerTerm: 'Person',
  },
  {
    id: '8',
    date: '2025-11-25',
    time: '15:22:11',
    imageUrl: 'https://picsum.photos/seed/8/800/600',
    triggerTerm: 'Animal',
  },
  {
    id: '9',
    date: '2025-11-24',
    time: '12:00:30',
    imageUrl: 'https://picsum.photos/seed/9/800/600',
    triggerTerm: 'Vehicle',
  },
  {
    id: '10',
    date: '2025-11-23',
    time: '08:45:00',
    imageUrl: 'https://picsum.photos/seed/10/800/600',
    triggerTerm: 'Person',
  },
  {
    id: '11',
    date: '2025-11-22',
    time: '23:59:59',
    imageUrl: 'https://picsum.photos/seed/11/800/600',
    triggerTerm: 'Package',
  },
  {
    id: '12',
    date: '2025-11-22',
    time: '17:30:45',
    imageUrl: 'https://picsum.photos/seed/12/800/600',
    triggerTerm: 'Person',
  },
  {
    id: '13',
    date: '2025-11-21',
    time: '13:13:13',
    imageUrl: 'https://picsum.photos/seed/13/800/600',
    triggerTerm: 'Vehicle',
  },
  {
    id: '14',
    date: '2025-11-20',
    time: '10:10:10',
    imageUrl: 'https://picsum.photos/seed/14/800/600',
    triggerTerm: 'Animal',
  },
  {
    id: '15',
    date: '2025-11-19',
    time: '20:00:00',
    imageUrl: 'https://picsum.photos/seed/15/800/600',
    triggerTerm: 'Person',
  },
  {
    id: '16',
    date: '2025-11-18',
    time: '14:50:00',
    imageUrl: 'https://picsum.photos/seed/16/800/600',
    triggerTerm: 'Vehicle',
  },
  {
    id: '17',
    date: '2025-11-17',
    time: '11:20:30',
    imageUrl: 'https://picsum.photos/seed/17/800/600',
    triggerTerm: 'Person',
  },
  {
    id: '18',
    date: '2025-11-16',
    time: '07:07:07',
    imageUrl: 'https://picsum.photos/seed/18/800/600',
    triggerTerm: 'Package',
  },
  {
    id: '19',
    date: '2025-11-15',
    time: '19:45:15',
    imageUrl: 'https://picsum.photos/seed/19/800/600',
    triggerTerm: 'Animal',
  },
  {
    id: '20',
    date: '2025-11-14',
    time: '22:30:00',
    imageUrl: 'https://picsum.photos/seed/20/800/600',
    triggerTerm: 'Vehicle',
  },
];
