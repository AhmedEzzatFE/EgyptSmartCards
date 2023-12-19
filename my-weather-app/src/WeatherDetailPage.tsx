import React from "react";
import { WeatherDetailProps } from "./Weather";
import { useLocation } from "react-router-dom";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const WeatherDetailPage: React.FC = () => {
  const { state } = useLocation();
  const selectedDay: WeatherDetailProps | undefined = state?.selectedDay;

  return (
    <div>
      {selectedDay && (
        <WeatherDetailComponent
          date={selectedDay.date}
          temperature={selectedDay.temperature}
          condition={selectedDay.condition}
          humidity={selectedDay.humidity}
          windSpeed={selectedDay.windSpeed}
        />
      )}
    </div>
  );
};

// ... (WeatherDetailComponent remains the same)

const WeatherDetailComponent: React.FC<WeatherDetailProps> = ({
  date,
  temperature,
  condition,
  humidity,
  windSpeed,
}) => {
  return (
    <Table sx={{ marginTop: "40px" }}>
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Temperature (°C)</TableCell>
          <TableCell>Condition</TableCell>
          <TableCell>Humidity</TableCell>
          <TableCell>Wind Speed</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow style={{ cursor: "pointer" }}>
          <TableCell>{date}</TableCell>
          <TableCell>{temperature}</TableCell>
          <TableCell>{condition}</TableCell>
          <TableCell>{humidity}</TableCell>
          <TableCell>{windSpeed}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default WeatherDetailPage;
