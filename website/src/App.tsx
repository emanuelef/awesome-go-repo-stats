import { useState, useEffect } from "react";
// @ts-ignore
import Papa from "papaparse";
import "./App.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Linkweb from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Routes, Route, Link } from "react-router-dom";

import TimeSeriesChart from "./TimeSeriesChart";
import WaffleChart from "./WaffleChart";
import DepsChart from "./DepsChart";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import TableViewRounded from "@mui/icons-material/TableViewRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";

/*
archived
"false"
days-last-commit
"151"
days-last-star
"5"
days-since-creation
"3961"
dependencies
"5"
language
"Go"
mentionable-users
"8"
new-stars-last-7d
"1"
new-stars-last-14d
"5"
new-stars-last-24H
"0"
new-stars-last-30d
"7"
repo
"mewkiz/flac"
stars
"262"
stars-per-mille-30d
"26.718"*/

const GitHubURL = "https://github.com/";

const csvURL =
  "https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/analysis-latest.csv";

const columns: GridColDef[] = [
  {
    field: "repo",
    headerName: "Repo",
    width: 220,
    renderCell: (params) => (
      <Linkweb href={GitHubURL + params.value} target="_blank">
        {params.value}
      </Linkweb>
    ),
  },
  {
    field: "stars",
    headerName: "Stars",
    width: 130,
    valueGetter: (val) => parseInt(val.row["stars"]),
  },
  {
    field: "days-last-commit",
    headerName: "Days last commit",
    width: 130,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "days-last-star",
    headerName: "Days last star",
    width: 110,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "new-stars-last-30d",
    headerName: "Stars last 30d",
    width: 110,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "new-stars-last-7d",
    headerName: "Stars last 7d",
    width: 110,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "stars-per-mille-30d",
    headerName: "New Stars 30d ‰",
    width: 130,
    valueGetter: (val) => parseFloat(val.row["stars-per-mille-30d"]),
  },
  {
    field: "mentionable-users",
    headerName: "Ment. users",
    width: 110,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "dependencies",
    headerName: "Direct deps",
    width: 130,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "archived",
    headerName: "Archived",
    width: 110,
  },
];

// https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/analysis-latest.csv

function App() {
  const fetchPositions = () => {
    fetch(csvURL)
      .then((response) => response.text())
      .then((text) => Papa.parse(text, { header: true }))
      .then(function (result) {
        console.log(result);
        setDataRows(result.data);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  };

  const [dataRows, setDataRows] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("kubernetes/kubernetes");
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    fetchPositions();
  }, []);

  const Table = () => {
    return (
      <>
        <Linkweb href={csvURL} download>
          Link
        </Linkweb>
        <DataGrid
          getRowId={(row) => row.repo}
          rows={dataRows}
          columns={columns}
          rowHeight={30}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 25 },
            },
            sorting: {
              sortModel: [{ field: "stars-per-mille-30d", sort: "desc" }],
            },
          }}
          pageSizeOptions={[5, 10]}
        />
      </>
    );
  };

  const StarsTimeline = () => {
    return (
      <>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={dataRows.map((el) => {
            return { label: el.repo };
          })}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="Repo" />}
          onChange={(e, v) => {
            console.log(v?.label);
            setSelectedRepo(v?.label);
          }}
        />
        <TimeSeriesChart repo={selectedRepo} />
      </>
    );
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar className="app" collapsed={collapsed}>
        <Menu>
          <MenuItem
            component={<Link to="/" className="link" />}
            className="menu1"
            icon={
              <MenuRoundedIcon
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
              />
            }
          >
            <h2>Awesome Go Stats</h2>
          </MenuItem>
          <MenuItem
            component={<Link to="/table" className="link" />}
            icon={<TableViewRounded />}
          >
            Table
          </MenuItem>
          <MenuItem
            component={<Link to="/deps" className="link" />}
            icon={<TableViewRounded />}
          >
            Dependencies
          </MenuItem>
          <MenuItem
            component={<Link to="/waffle" className="link" />}
            icon={<BarChartRoundedIcon />}
          >
            Waffle
          </MenuItem>
          <MenuItem
            component={<Link to="/starstimeline" className="link" />}
            icon={<TimelineRoundedIcon />}
          >
            StarsTimeline
          </MenuItem>
        </Menu>
      </Sidebar>
      <section>
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/table" element={<Table />} />
          <Route path="/deps" element={<DepsChart />} />
          <Route path="/waffle" element={<WaffleChart dataRows={dataRows} />} />
          <Route path="/starstimeline" element={<StarsTimeline />} />
        </Routes>
      </section>
    </div>
  );
}

export default App;
