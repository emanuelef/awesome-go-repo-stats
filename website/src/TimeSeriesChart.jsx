import React, { useState, useEffect, useRef } from "react";
import FusionCharts from "fusioncharts";
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
import ReactFC from "react-fusioncharts";
import CandyTheme from "fusioncharts/themes/fusioncharts.theme.candy";
import schemaStars from "./schema_stars";
import schemaCommits from "./schema_commits";

ReactFC.fcRoot(FusionCharts, TimeSeries, CandyTheme);
const chart_props = {
  timeseriesDs: {
    type: "timeseries",
    width: "100%",
    height: "80%",
    dataEmptyMessage: "Fetching data...",
    dataSource: {
      caption: { text: "" },
      data: null,
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

const API_BASE_URL =
  "https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main";
const API_STARS_URL = `${API_BASE_URL}/stars-history-30d.json`;
const API_COMMITS_URL = `${API_BASE_URL}/commits-history-30d.json`;

function TimeSeriesChart({ repo, metric }) {
  const [ds, setds] = useState(chart_props);
  const [dataLoaded, setDataLoaded] = useState(false);
  const dataRef = useRef([]);

  const loadData = async () => {
    try {
      if (dataRef.current.length === 0) {
        console.log("load all data " + metric);

        const response = await fetch(
          metric == "Stars" ? API_STARS_URL : API_COMMITS_URL
        );
        const data = await response.json();

        console.log(data);

        dataRef.current = data;
        setDataLoaded(true);
        renderData();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const renderData = () => {
    try {
      console.log(dataRef.current);

      if (dataRef.current.length === 0) {
        console.log("Rendering but no data");
        throw new Error("No data");
      }

      const dataRepo = dataRef.current[repo];
      const fusionTable = new FusionCharts.DataStore().createDataTable(
        dataRepo,
        metric == "Stars" ? schemaStars : schemaCommits
      );
      const options = { ...ds };
      options.timeseriesDs.dataSource.data = fusionTable;
      options.timeseriesDs.dataSource.caption = {
        text: `${repo}`,
      };
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
    loadData();
  }, []);

  /*
  useEffect(() => {
    console.log("render");
    renderData();
  }, [repo]);
  */

  return (
    <div
      style={{
        marginLeft: "10px",
        marginTop: "10px",
        marginRight: "10px",
      }}
    >
      {dataLoaded && <ReactFC {...ds.timeseriesDs} />}
    </div>
  );
}

export default TimeSeriesChart;
