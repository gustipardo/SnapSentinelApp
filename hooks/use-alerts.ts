import { useState, useEffect } from 'react';
import Constants from 'expo-constants';

// The Alert type expected by the UI components.
export interface Alert {
  id: string;
  date: string;
  time: string;
  imageUrl: string;
  triggerTerm: string;
}

// Types that match the structure of the API response.
interface ApiLabel {
  Confidence: string;
  Name: string;
}

interface ApiAlert {
  id: string;
  timestamp: string;
  labels: ApiLabel[];
  status: string;
  image_url: string;
}

const API_URL = Constants.expoConfig?.extra?.API_URL;

/**
 * Transforms a single alert object from the API into the shape expected by the UI.
 * @param apiAlert - The alert object from the API.
 * @returns An Alert object formatted for the UI.
 */
const transformApiData = (apiAlert: ApiAlert): Alert => {
  const date = new Date(apiAlert.timestamp);
  
  // The API `timestamp` can be a full ISO string or a Unix timestamp in seconds.
  // We need to handle both cases.
  const timestampInMs = date.getTime();

  const formattedDate = isNaN(timestampInMs)
    ? new Date(parseInt(apiAlert.timestamp, 10) * 1000).toLocaleDateString()
    : date.toLocaleDateString();
  
  const formattedTime = isNaN(timestampInMs)
    ? new Date(parseInt(apiAlert.timestamp, 10) * 1000).toLocaleTimeString()
    : date.toLocaleTimeString();

  return {
    id: apiAlert.id,
    imageUrl: apiAlert.image_url,
    // Use the first label as the primary trigger term.
    triggerTerm: apiAlert.labels[0]?.Name || 'Unknown',
    date: formattedDate,
    time: formattedTime,
  };
};

/**
 * A custom hook to fetch and manage alert data from the API.
 * It handles loading and error states automatically.
 */
export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        if (!API_URL) {
          throw new Error('API_URL is not defined in app.config');
        }
        setIsLoading(true);
        const response = await fetch(String(API_URL));
        if (!response.ok) {
          throw new Error('Failed to fetch alerts from API');
        }
        const data: { items: ApiAlert[] } = await response.json();
        
        // The API returns items in a random order, so we sort them by timestamp descending.
        const sortedItems = data.items.sort((a, b) => {
            const timeA = new Date(a.timestamp).getTime() || (parseInt(a.timestamp) * 1000);
            const timeB = new Date(b.timestamp).getTime() || (parseInt(b.timestamp) * 1000);
            return timeB - timeA;
        });

        const transformedAlerts = sortedItems.map(transformApiData);
        setAlerts(transformedAlerts);
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  return { alerts, isLoading, error };
};
