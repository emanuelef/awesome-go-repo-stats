import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import TimelineRoundedIcon from "@mui/icons-material/TimelineRounded";
import LibraryBooksRoundedIcon from "@mui/icons-material/LibraryBooksRounded";
import ViewModuleRoundedIcon from "@mui/icons-material/ViewModuleRounded";

import GitHubButton from "react-github-btn";

// Import the Header component
import Header from "./Header";

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

const lastUpdateURL =
  "https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/last-update.txt";

const fullStarsHistoryURL =
  "https://emanuelef.github.io/gh-repo-stats-server/#/";

function extractVersionNumber(value) {
  const match = value.match(/\d+(\.\d+)+(\.\d+)?/);
  return match ? match[0] : null;
}

function compareSemanticVersions(versionA, versionB) {
  const semVerA = versionA.split(".");
  const semVerB = versionB.split(".");

  for (let i = 0; i < Math.min(semVerA.length, semVerB.length); i++) {
    if (semVerA[i] !== semVerB[i]) {
      return semVerA[i] - semVerB[i];
    }
  }

  return semVerA.length - semVerB.length;
}

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
    width: 90,
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
    width: 100,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "days-since-creation",
    headerName: "Created days ago",
    width: 130,
    valueGetter: (params) => parseInt(params.value),
  },
  {
    field: "min-go-version",
    headerName: "Min Go version",
    width: 80,
    valueGetter: (params) => params.value,
    sortComparator: (a, b) => {
      // Extract the version numbers
      const versionA = extractVersionNumber(a);
      const versionB = extractVersionNumber(b);

      // Use a custom comparison for semantic versions
      if (versionA && versionB) {
        return compareSemanticVersions(versionA, versionB);
      }

      // If the versions are not in the correct format, use a basic string comparison
      return a.localeCompare(b);
    },
  },
  {
    field: "archived",
    headerName: "Archived",
    width: 100,
    renderCell: (params) => (
      <span style={{ color: params.value === "true" ? "red" : "inherit" }}>
        {params.value}
      </span>
    ),
  },
  {
    headerName: "Stars Timeline 30d",
    width: 120,
    renderCell: (params) => (
      <Linkweb href={`./#/starstimeline/${params.row.repo}`}>link</Linkweb>
    ),
  },
];

// https://emanuelef.github.io/awesome-go-repo-stats/#/starstimeline/mewkiz/flac

// https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/analysis-latest.csv

function App() {
  const fetchReposData = () => {
    fetch(csvURL)
      .then((response) => response.text())
      .then((text) => Papa.parse(text, { header: true, skipEmptyLines: true }))
      .then(function (result) {
        console.log(result);
        setDataRows(result.data);
        setFilteredDataRows(result.data);
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  };

  const fetchLastUpdate = () => {
    fetch(lastUpdateURL)
      .then((response) => response.text())
      .then(function (dateString) {
        console.log(dateString);
        const parts = dateString.split("-");
        if (parts.length === 3) {
          const year = parseInt(parts[0]);
          const month = parseInt(parts[1]) - 1; // Months are 0-indexed
          const day = parseInt(parts[2]);
          const options = { year: "numeric", month: "long", day: "numeric" };
          const formattedDate = new Date(year, month, day).toLocaleDateString(
            "en-US",
            options
          );
          setLastUpdate(formattedDate);
        }
      })
      .catch((e) => {
        console.error(`An error occurred: ${e}`);
      });
  };

  const [dataRows, setDataRows] = useState([]);
  const [filteredDataRows, setFilteredDataRows] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("kubernetes/kubernetes");
  const [collapsed, setCollapsed] = useState(true);
  const [lastUpdate, setLastUpdate] = useState("Unknown");
  const [mainCategory, setMainCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [subCategories, setSubCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchReposData();
    fetchLastUpdate();
  }, []);

  useEffect(() => {
    const subCategories = [
      ...new Set(
        dataRows
          .filter((el) => el["main-category"] === mainCategory)
          .map((el) => el["sub-category"])
      ),
    ];
    setSubCategories(subCategories);

    if (mainCategory === "All") {
      setFilteredDataRows(dataRows);
    } else {
      setFilteredDataRows(
        dataRows.filter((el) => el["main-category"] === mainCategory)
      );
    }
  }, [mainCategory]);

  useEffect(() => {
    if (subCategory === "All") {
      setFilteredDataRows(
        dataRows.filter((el) => el["main-category"] === mainCategory)
      );
    } else {
      setFilteredDataRows(
        dataRows.filter((el) => el["sub-category"] === subCategory)
      );
    }
  }, [subCategory]);

  const Table = () => {
    return (
      <>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-main-category"
            size="small"
            options={[...new Set(dataRows.map((el) => el["main-category"]))]}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{
                  marginRight: "20px",
                  marginLeft: "10px",
                  width: "400px",
                }}
                label="Enter main category"
                variant="outlined"
                size="small"
              />
            )}
            value={mainCategory}
            onChange={(e, v) => {
              if (v) {
                setMainCategory(v);
              }
            }}
            onBlur={() => {
              setMainCategory("All");
            }}
            clearOnBlur={false}
            clearOnEscape
            onClear={() => {
              setMainCategory("All");
            }}
          />
          <Autocomplete
            disablePortal
            id="combo-box-sub-category"
            size="small"
            options={subCategories}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{
                  marginRight: "20px",
                  marginLeft: "10px",
                  width: "400px",
                }}
                label="Enter sub category"
                variant="outlined"
                size="small"
              />
            )}
            value={subCategory}
            onChange={(e, v) => {
              if (v) {
                setSubCategory(v);
              }
            }}
            onBlur={() => {
              setSubCategory("All");
            }}
            clearOnBlur={false}
            clearOnEscape
            onClear={() => {
              setSubCategory("All");
            }}
          />
        </div>
        <div style={{ marginLeft: "10px" }}>
          <DataGrid
            getRowId={(row) => row.repo}
            rows={filteredDataRows}
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
        </div>
      </>
    );
  };

  const StarsTimeline = () => {
    const { user, repository } = useParams();

    useEffect(() => {
      console.log(user + "/" + repository);
      setSelectedRepo(user + "/" + repository);
    }, []);

    return (
      <>
        <div
          style={{ display: "flex", alignItems: "center", marginTop: "10px" }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-repos"
            size="small"
            options={dataRows.map((el) => {
              return { label: el.repo };
            })}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{
                  marginRight: "20px",
                  marginLeft: "10px",
                  width: "400px",
                }}
                label="Enter a GitHub repository"
                variant="outlined"
                size="small"
              />
            )}
            value={selectedRepo}
            onChange={(e, v) => {
              console.log(v?.label);
              setSelectedRepo(v?.label);
              navigate(`/starstimeline/${v?.label}`, {
                replace: false,
              });
            }}
            onBlur={() => {
              navigate(`/starstimeline/kubernetes/kubernetes}`, {
                replace: false,
              });
            }}
            clearOnBlur={false}
            clearOnEscape
            onClear={() => {
              navigate(`/starstimeline/kubernetes/kubernetes}`, {
                replace: false,
              });
            }}
          />
          <GitHubButton
            href={"https://github.com/" + selectedRepo}
            data-size="large"
            data-show-count="true"
            aria-label="Star buttons/github-buttons on GitHub"
          >
            Star
          </GitHubButton>
          <Linkweb
            style={{ marginLeft: "10px" }}
            href={fullStarsHistoryURL + selectedRepo}
            target="_blank"
          >
            Full Stars History
          </Linkweb>
        </div>
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
            icon={<ViewListRoundedIcon />}
          >
            Table
          </MenuItem>
          <MenuItem
            component={<Link to="/deps" className="link" />}
            icon={<LibraryBooksRoundedIcon />}
          >
            Dependencies
          </MenuItem>
          <MenuItem
            component={<Link to="/waffle" className="link" />}
            icon={<ViewModuleRoundedIcon />}
          >
            Waffle
          </MenuItem>
          <MenuItem
            component={
              <Link to="/starstimeline/:user/:repository" className="link" />
            }
            icon={<TimelineRoundedIcon />}
          >
            StarsTimeline
          </MenuItem>
        </Menu>
      </Sidebar>
      <section>
        <Header lastUpdate={lastUpdate} />
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/table" element={<Table />} />
          <Route path="/deps" element={<DepsChart />} />
          <Route path="/waffle" element={<WaffleChart dataRows={dataRows} />} />
          <Route
            path="/starstimeline/:user/:repository"
            element={<StarsTimeline />}
          />
        </Routes>
      </section>
    </div>
  );
}

export default App;
