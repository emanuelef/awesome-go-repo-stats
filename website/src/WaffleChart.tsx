import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
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

function WaffleChart({ dataRows }) {
  const [data, setData] = useState([]);
  const [minDaysLastCommit, setMinDaysLastCommit] = useState("0");
  const [minStars, setMinStars] = useState("0");

  const handleLastCommitInputChange = (event) => {
    const inputText = event.target.value;

    // Use a regular expression to check if the input contains only digits
    if (/^\d*$/.test(inputText)) {
      setMinDaysLastCommit(inputText);
    }
  };

  const handleMinStarsInputChange = (event) => {
    const inputText = event.target.value;

    // Use a regular expression to check if the input contains only digits
    if (/^\d*$/.test(inputText)) {
      setMinStars(inputText);
    }
  };

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
      if (
        //element.archived === "true" &&
        parseInt(element["days-last-commit"]) > parseInt(minDaysLastCommit)
      ) {
        dataSample[0].value++;
      } else {
        dataSample[1].value++;
      }
    });

    console.log(dataSample);

    setData(dataSample);
  };

  useEffect(() => {
    loadData();
  }, [minDaysLastCommit, minStars]);

  return (
    <div style={{ height: 780, width: 1040, backgroundColor: "azure" }}>
      <TextField
        style={{ marginTop: "20px" }}
        label="Min days since last commit"
        variant="outlined"
        value={minDaysLastCommit}
        onChange={handleLastCommitInputChange}
        InputProps={{
          inputProps: {
            pattern: "[0-9]*", // Use pattern attribute to restrict input to digits
            inputMode: "numeric", // Use inputMode attribute for better mobile support
          },
        }}
      />
      <TextField
        style={{ marginTop: "20px" }}
        label="Min stars"
        variant="outlined"
        value={minStars}
        onChange={handleMinStarsInputChange}
        InputProps={{
          inputProps: {
            pattern: "[0-9]*", // Use pattern attribute to restrict input to digits
            inputMode: "numeric", // Use inputMode attribute for better mobile support
          },
        }}
      />
      <ResponsiveWaffle
        data={data}
        total={dataRows.length}
        rows={14}
        columns={26}
        padding={1}
        margin={{ top: 10, right: 10, bottom: 10, left: 120 }}
        colors={{ scheme: "set1" }}
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

export default WaffleChart;
