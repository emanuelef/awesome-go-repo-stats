import React, { useState, useEffect } from "react";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import ReactFC from "react-fusioncharts";
import schema from "./schema";

ReactFC.fcRoot(FusionCharts, TimeSeries);
const chart_props = {
  timeseriesDs: {
    type: "timeseries",
    width: "1200",
    height: "800",
    dataEmptyMessage: "Fetching data...",
    dataSource: {
      caption: { text: "Daily Stars" },
      data: null,
      yAxis: [
        {
          plot: [
            {
              value: "New Stars",
            },
          ],
        },
      ],
      chart: {
        animation: "0",
        theme: "candy",
        exportEnabled: "1",
        exportMode: "client",
        exportFormats: "PNG=Export as PNG|PDF=Export as PDF",
      },
    },
  },
};

const API_URL =
  "https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/stars-history-30d.json";

const CSVToArray = (data, delimiter = ",", omitFirstRow = true) =>
  data
    .slice(omitFirstRow ? data.indexOf("\n") + 1 : 0)
    .split("\n")
    .map((v) => {
      let arr = v.split(delimiter);
      arr[1] = parseInt(arr[1]);
      arr[2] = parseInt(arr[2]);
      return arr;
    });

const movingAvg = (array, countBefore, countAfter = 0) => {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    const subArr = array.slice(
      Math.max(i - countBefore, 0),
      Math.min(i + countAfter + 1, array.length)
    );
    const avg =
      subArr.reduce((a, b) => a + (isNaN(b) ? 0 : b), 0) / subArr.length;
    result.push(avg);
  }
  return result;
};

function TimeSeriesChart({ repo }) {
  const [ds, setds] = useState(chart_props);
  const loadData = async () => {
    try {
      console.log("loadData " + repo);

      const response = await fetch(API_URL);
      const data = await response.json();
      const dataRepo = data[repo];

      let calcMovingAvg = dataRepo.map((el) => {
        return el[1];
      });
      calcMovingAvg = movingAvg(calcMovingAvg, 3, 3);

      const movingAverageData = dataRepo.map((el, index) => {
        el[1] = calcMovingAvg[index];
        return el;
      });

      console.log(movingAverageData);

      const fusionTable = new FusionCharts.DataStore().createDataTable(
        movingAverageData,
        schema
      );
      const options = { ...ds };
      options.timeseriesDs.dataSource.data = fusionTable;
      options.timeseriesDs.dataSource.caption = { text: `Daily Stars ${repo}` };
      options.timeseriesDs.dataSource.chart.exportFileName = `${repo.replace(
        "/",
        "_"
      )}-stars-history`;
      setds(options);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("render");
    loadData();
  }, [repo]);

  return (
    <div>
      <ReactFC {...ds.timeseriesDs} />
    </div>
  );
}

export default TimeSeriesChart;
