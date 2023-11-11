import React from "react";
import Plot from "react-plotly.js";

const BubbleChart = ({ dataRows }) => {
  console.log(dataRows);

  const scatterPlot = {
    x: dataRows.map((row) => row["new-stars-last-14d"]),
    y: dataRows.map((row) => row["mentionable-users"]),
    text: dataRows.map((row) => row.repo),
    mode: "markers",
    marker: {
      size: dataRows.map((row) => row["stars"]),
      sizemode: "diameter", // Set sizemode to 'diameter'
      sizeref: 1100.1, // Adjust this value to control the maximum size
    },
    type: "scatter",
  };

  const data = [scatterPlot];

  const layout = {
    xaxis: { type: "log", title: "New Stars Last 14 Days" },
    yaxis: { type: "log", title: "Mentionable Users" },
    size: "stars",
    color: "main-category",
    hovermode: "closest",
    hover_name: "repo",
    showlegend: true,
    title: "Awesome Go Bubble Chart",
    autosize: true,
    height: 800,
    width: 1200,
  };

  return (
    <div className="App" style={{ width: "800px", height: "600px" }}>
      <Plot data={data} layout={layout} />
    </div>
  );
};

export default BubbleChart;
