import React from "react";
import Linkweb from "@mui/material/Link";
import GitHubButton from "react-github-btn";

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

  const githubButtonStyle = {
    marginLeft: "auto", // Push GitHub button to the right
  };

  return (
    <div className="header" style={headerStyle}>
      <p>Last Update: {lastUpdate}</p>
      <Linkweb href={csvURL} download>
        Link to CSV
      </Linkweb>
      <div style={githubButtonStyle}>
        <GitHubButton
          href="https://github.com/emanuelef/awesome-go-repo-stats"
          data-color-scheme="no-preference: dark; light: dark_dimmed; dark: dark_high_contrast;"
          data-size="large"
          data-show-count="true"
          aria-label="Star emanuelef/awesome-go-repo-stats on GitHub"
        >
          Star
        </GitHubButton>
      </div>
    </div>
  );
}

export default Header;
