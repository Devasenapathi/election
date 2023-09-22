import React from 'react'
import { Doughnut, Pie } from 'react-chartjs-2';
import { useEffect, useState, useReducer } from 'react';
import axios from 'axios';

import { Chart, ArcElement } from 'chart.js'
import { generateRandomColors } from '../../../../assets/colors';
Chart.register(ArcElement);

const Majority = (data) => {
   const [party, setParty] = useState([])
   useEffect(() => {
      setParty(data.data)
   }, [data]);

   const chartOptions = {
      responsive: true,
      maintainAspectRatio: true,
      // Additional options for labels and arranging charts in a row
      plugins: {
         legend: {
            display: false, // Set to true to display the legend
            position: 'top', // You can change the legend position ('top', 'bottom', 'left', 'right')
            labels: {
               font: {
                  size: 15, // Font size for the legend labels
               },
            },
         },
      },
   };

   const chartData = {
      labels: party.map(item => item.party),
      datasets: [
         {
            data: party.map(item => item.votes),
            backgroundColor: generateRandomColors(party.length),
         },
      ],
   };



   return (
         <div>
            <Pie data={chartData} options={chartOptions} />
         </div>
   );
}

export default Majority
