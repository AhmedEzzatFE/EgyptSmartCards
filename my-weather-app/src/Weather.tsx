// Weather.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WeatherDetailPage from "./WeatherDetailPage";
import {
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
} from "@mui/material";

interface WeatherData {
  date: string;
  temperature: number;
  condition: string;
}
export interface WeatherDetailProps extends WeatherData {
  humidity: number;
  windSpeed: number;
  // Add more details as needed
}

const WeatherTable: React.FC = () => {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherDetailProps[]>([]);
  const [, setSelectedDay] = useState<WeatherDetailProps | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const API_KEY = "093a27ab8cb0ad95178dc7b56f0e937b";
  const API_URL = "https://api.openweathermap.org/data/2.5/forecast";

  const fetchWeatherData = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_URL}?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      const startDate = new Date(currentDate);
      startDate.setDate(startDate.getDate() + 3);

      const data: WeatherDetailProps[] = response.data.list.reduce(
        (
          fullDataAccumulator: WeatherDetailProps[],
          //   accumulator: WeatherData[],
          item: any
        ) => {
          const itemDate = new Date(item.dt_txt);
          itemDate.setHours(0, 0, 0, 0);

          if (itemDate >= startDate) {
            const existingRecord = fullDataAccumulator.find((record) => {
              const existingDate = new Date(record.date);
              return existingDate.getTime() === itemDate.getTime();
            });

            if (!existingRecord) {
              //   accumulator.push({
              //     date: item.dt_txt,
              //     temperature: item.main.temp,
              //     condition: item.weather[0].description,
              //   });
              fullDataAccumulator.push({
                date: item.dt_txt,
                temperature: item.main.temp,
                condition: item.weather[0].description,
                humidity: item.main.humidity,
                windSpeed: item.wind.speed,
              });
            }
          }

          return fullDataAccumulator;
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
      fetchWeatherData(city);
    }
  };

  const handleDayClick = (selectedWeather: WeatherDetailProps) => {
    setSelectedDay(selectedWeather);
  };

  return (
    <div>
      <FormControl sx={{ display: "flex", flexDirection: "row" }}>
        <TextField
          sx={{ paddingRight: "20px" }}
          label="Enter city name"
          variant="outlined"
          value={city}
          onChange={handleCityChange}
        />

        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </FormControl>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <WeatherTableComponent
        weatherData={weatherData}
        onRowClick={handleDayClick}
      />
    </div>
  );
};

interface WeatherTableProps {
  weatherData: WeatherDetailProps[];
  onRowClick: (item: WeatherDetailProps) => void;
}

const WeatherTableComponent: React.FC<WeatherTableProps> = ({
  weatherData,
  onRowClick,
}) => {
  const navigate = useNavigate(); // Add this line to initialize useNavigate()

  const handleRowClick = (item: WeatherDetailProps) => {
    onRowClick(item);
    navigate("/detail", { state: { selectedDay: item } });
  };
  return (
    <Table sx={{ marginTop: "40px" }}>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Temperature (°C)</TableCell>
          <TableCell>Condition</TableCell>
        </TableRow>
      </TableHead>

      {weatherData.length > 0 && (
        <TableBody>
          {weatherData.map((item, index) => (
            <TableRow
              key={index}
              onClick={() => handleRowClick(item)}
              hover
              style={{ cursor: "pointer" }}>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.temperature}</TableCell>
              <TableCell>{item.condition}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      )}
    </Table>
  );
};
const Weather: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WeatherTable />} />
        <Route path="/detail" element={<WeatherDetailPage />} />
      </Routes>
    </Router>
  );
};

export default Weather;
