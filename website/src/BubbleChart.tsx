import React from "react";
import FusionCharts from "fusioncharts";
import Charts from "fusioncharts/fusioncharts.charts";
import FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
import ReactFC from "react-fusioncharts";

// Adding the chart as dependency to the core fusioncharts
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);

const BubbleChart = ({ dataRows }) => {
  const chartConfigs = {
    type: "bubble",
    width: "100%",
    height: "400",
    dataFormat: "json",
    dataSource: {
      chart: {
        caption: "Bubble Chart Work in progress",
        xaxisname: "X-Axis",
        yaxisname: "Y-Axis",
        plottooltext: "<b>$name</b> {br}X: $x{br}Y: $y{br}Value: $z",
        showvalues: "1",
      },
      categories: [
        {
          category: dataRows.map((entry) => ({
            label: entry["main-category"],
          })),
        },
      ],
      dataset: [
        {
          data: dataRows.map((entry) => ({
            x: entry["new-stars-last-14d"],
            y: entry["mentionable-users"],
            z: entry["stars"],
            name: entry["repo"],
          })),
        },
      ],
    },
  };

  return (
    <div
      style={{
        height: 960,
        width: 1400,
        marginTop: 10,
        backgroundColor: "azure",
      }}
    >
      <ReactFC {...chartConfigs} />;
    </div>
  );
};

export default BubbleChart;
