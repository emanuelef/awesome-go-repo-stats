import React from "react";
import Linkweb from "@mui/material/Link";

const csvURL =
  "https://raw.githubusercontent.com/emanuelef/awesome-go-repo-stats/main/analysis-latest.csv";

function Header({ lastUpdate }) {
  const headerStyle = {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#333",
    color: "#fff",
    padding: "10px",
    gap: "10px",
    height: "30px",
  };

  return (
    <div className="header" style={headerStyle}>
      <p>Last Update: {lastUpdate}</p>
      <Linkweb href={csvURL} download>
        Link to CSV
      </Linkweb>
    </div>
  );
}

export default Header;
