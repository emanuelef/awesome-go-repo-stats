import React, { useState, useEffect } from "react";
import "./App.css";
import { ResponsiveWaffle } from "@nivo/waffle";

let dataSample = [
  {
    id: "satisified",
    label: "Ok",
    value: 0,
  },
  {
    id: "unsatisfied",
    label: "Non ok",
    value: 0,
  },
];

function LangBarChart({ dataRows }) {
  const [data, setData] = useState([]);

  const loadData = () => {
    console.log(dataRows);

    dataSample = [
      {
        id: "unsatisfied",
        label: "Non ok",
        value: 0,
      },
      {
        id: "satisified",
        label: "Ok",
        value: 0,
      },
    ];

    dataRows.forEach((element) => {
      if (element.archived === "true") {
        dataSample[1].value++;
      } else {
        dataSample[0].value++;
      }
    });

    console.log(dataSample);

    setData(dataSample);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div style={{ height: 800, width: 1440, backgroundColor: "azure" }}>
      <ResponsiveWaffle
        data={data}
        total={dataRows.length}
        rows={18}
        columns={14}
        padding={1}
        margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
        colors={{ scheme: "dark2" }}
        borderRadius={3}
        borderColor={{
          from: "color",
          modifiers: [["darker", 0.3]],
        }}
        motionStagger={2}
        legends={[
          {
            anchor: "top-left",
            direction: "column",
            justify: false,
            translateX: -100,
            translateY: 0,
            itemsSpacing: 4,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 1,
            itemTextColor: "#777",
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemTextColor: "#000",
                  itemBackground: "#f7fafb",
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
}

export default LangBarChart;
