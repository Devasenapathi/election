import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { generateRandomColors } from '../../../../assets/colors';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export default function PieChart(props) {
    const [details, setDetails] = useState([])

    useEffect(() => {
        setDetails(props.data)
    }, [props])
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Votes by Parties',
            },
        },
        scales: {
            x: {
                grid: {
                  lineWidth: 0, // Adjust this value to reduce the width of the grid lines
                },
              },
            y: {
              beginAtZero: true,
              grid:{
                lineWidth:0
              }
            },
          },
    };

    const data = {
        labels:details.map(item => item.party),
        datasets: [
            {
                label: "Vote ratio",
                data: details.map((e) => e.votes),
                backgroundColor: generateRandomColors(details.length),
                borderWidth: 1,
                barThickness: 10,
            },
        ],
    };
    return (
            <div>
                <Bar options={options} data={data} />
            </div>
    );
}
