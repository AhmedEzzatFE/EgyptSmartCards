// src/Weather.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
}

interface WeatherDetail {
  humidity: number;
  windSpeed: number;
  // Add more details as needed
}

const Weather: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedDay, setSelectedDay] = useState<WeatherDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "093a27ab8cb0ad95178dc7b56f0e937b";
  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

  const fetchWeatherData = async (cityName: string, numberOfDays: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      // Calculate the start date by adding 2 days to the current date
      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() + 3);

      const data: WeatherData[] = response.data.list.reduce(
        (acc: WeatherData[], item: any) => {
          const itemDate = new Date(item.dt_txt);
          itemDate.setHours(0, 0, 0, 0);

          // Check if the item's date is after or equal to the start date
          if (itemDate >= startDate) {
            // Check if a record for the day already exists
            const existingRecord = acc.find((record) => {
              const existingDate = new Date(record.date);
              return existingDate.getTime() === itemDate.getTime();
            });

            // If a record doesn't exist, add it to the accumulator
            if (!existingRecord) {
              acc.push({
                date: item.dt_txt,
                temperature: item.main.temp,
                condition: item.weather[0].description,
              });
            }
          }

          // If we have enough records for the desired number of days, exit the loop
          if (acc.length >= numberOfDays) {
            return acc;
          }

          return acc;
        },
        []
      );

      setWeatherData(data);
    } catch (error) {
      setError("Error fetching weather data");
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
  };

  const handleSearch = () => {
    if (city.trim() !== "") {
      // Pass the desired number of days (3 or 5)
      fetchWeatherData(city, 3); // Change 3 to 5 if you want 5 days
    }
  };

  const handleDayClick = (index: number) => {
    // Fetch more details for the selected day and update selectedDay state
    // You can extend the API call and update the WeatherDetail state
    const selectedDate = weatherData[index].date;
    // Make another API call to get more details based on the selectedDate
    // Update setSelectedDay with the detailed data
  };

  return (
    <div>
      <TextField
        label="Enter city name"
        variant="outlined"
        value={city}
        onChange={handleCityChange}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {weatherData.length > 0 && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Temperature (°C)</TableCell>
              <TableCell>Condition</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {weatherData.map((item, index) => (
              <TableRow
                key={index}
                onClick={() => handleDayClick(index)}
                hover
                style={{ cursor: "pointer" }}>
                <TableCell>{item.date}</TableCell>
                <TableCell>{item.temperature}</TableCell>
                <TableCell>{item.condition}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {selectedDay && (
        <div>
          <h2>Details for the selected day:</h2>
          <p>Humidity: {selectedDay?.humidity}</p>
          <p>Wind Speed: {selectedDay?.windSpeed}</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
};

export default Weather;
