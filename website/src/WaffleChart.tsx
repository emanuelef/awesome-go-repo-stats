import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { ResponsiveWaffle } from "@nivo/waffle";
import "./App.css";

const initialDataSample = [
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
  const [minDaysLastCommit, setMinDaysLastCommit] = useState("30");
  const [minStars, setMinStars] = useState("10");
  const [minMentionableUsers, setMinMentionableUsers] = useState("10");
  const [data, setData] = useState(initialDataSample);

  const handleInputChange = (event, setStateFunction) => {
    const inputText = event.target.value;

    // Use a regular expression to check if the input contains only digits
    if (/^\d*$/.test(inputText)) {
      setStateFunction(inputText);
    }
  };

  const loadData = () => {
    const updatedDataSample = [
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
        parseInt(element["days-last-commit"]) > parseInt(minDaysLastCommit) ||
        parseInt(element["stars"]) < parseInt(minStars) ||
        parseInt(element["mentionable-users"]) < parseInt(minMentionableUsers)
      ) {
        updatedDataSample[0].value++;
      } else {
        updatedDataSample[1].value++;
      }
    });
    console.log(updatedDataSample);
    setData(updatedDataSample);
  };

  useEffect(() => {
    loadData();
  }, [minDaysLastCommit, minStars, minMentionableUsers]);

  return (
    <div style={{ height: 780, width: 1040, backgroundColor: "azure" }}>
      <TextField
        style={{ marginTop: "20px", marginRight: "20px", marginLeft: "20px" }}
        label="Min days since last commit"
        variant="outlined"
        value={minDaysLastCommit}
        onChange={(e) => handleInputChange(e, setMinDaysLastCommit)}
        InputProps={{
          inputProps: {
            pattern: "[0-9]*",
            inputMode: "numeric",
          },
        }}
      />
      <TextField
        style={{ marginTop: "20px", marginRight: "20px" }}
        label="Min stars"
        variant="outlined"
        value={minStars}
        onChange={(e) => handleInputChange(e, setMinStars)}
        InputProps={{
          inputProps: {
            pattern: "[0-9]*",
            inputMode: "numeric",
          },
        }}
      />
      <TextField
        style={{ marginTop: "20px" }}
        label="Min men. users"
        variant="outlined"
        value={minMentionableUsers}
        onChange={(e) => handleInputChange(e, setMinMentionableUsers)}
        InputProps={{
          inputProps: {
            pattern: "[0-9]*",
            inputMode: "numeric",
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
