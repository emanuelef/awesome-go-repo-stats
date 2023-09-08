import { useState, useEffect } from "react";
// @ts-ignore
import Papa from "papaparse";
import "./App.css";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Link from "@mui/material/Link";

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
    width: 200,
    renderCell: (params) => (
      <Link href={GitHubURL + params.value} target="_blank">
        {params.value}
      </Link>
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
    field: "dependencies",
    headerName: "Direct deps",
    width: 130,
    valueGetter: (val) => parseInt(val.row["dependencies"]),
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

  useEffect(() => {
    fetchPositions();
  }, []);

  return (
    <div style={{ height: 800, width: 1440, backgroundColor: "azure" }}>
      <Link href={csvURL} download>
        Link
      </Link>
      <DataGrid
        getRowId={(row) => row.repo}
        rows={dataRows}
        columns={columns}
        rowHeight={30}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 50 },
          },
          sorting: {
            sortModel: [{ field: "stars-per-mille-30d", sort: "desc" }],
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
  );
}

export default App;
