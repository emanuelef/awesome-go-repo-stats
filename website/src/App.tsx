import { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
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

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "stars",
    headerName: "Stars",
    width: 130,
    valueGetter: (val) => parseInt(val.row["stars"]),
  },
  { field: "repo", headerName: "Repo", width: 130 },
  {
    field: "archived",
    headerName: "Archived",
    width: 130,
  },
  {
    field: "days-last-commit",
    headerName: "Days last commit",
    width: 130,
    valueGetter: (val) => parseInt(val.row["days-last-commit"]),
  },
];

// https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/analysis-latest.csv

function App() {
  const fetchPositions = () => {
    fetch(
      "https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/analysis-latest.csv"
    )
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
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        getRowId={(row) => row.repo}
        rows={dataRows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}

export default App;
