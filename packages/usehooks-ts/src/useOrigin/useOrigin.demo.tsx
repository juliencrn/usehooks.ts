import { useState, useEffect } from 'react';
import { useOrigin } from './useOrigin'

interface LiveClockProps {}

interface Time {
  hours: number;
  minutes: number;
  seconds: number;
}

function formatTime(date: Date): Time {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  return { hours, minutes, seconds };
}

function LiveClock(props: LiveClockProps) {
  const origin = useOrigin();
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    // Update the current time every second
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []); // Run the effect only once on component mount

  const { hours, minutes, seconds } = formatTime(currentTime);

  return (
    <div className="bg-gray-100 p-8 rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4">Live Clock</h2>
      <p className="text-gray-600 mb-2">Current Origin: {origin}</p>
      <p className="text-3xl font-bold text-blue-600">
        Current Time: {`${hours}:${minutes}:${seconds}`}
      </p>
    </div>
  );
}

export default LiveClock;
