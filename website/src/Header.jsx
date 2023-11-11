import React from "react";
import Linkweb from "@mui/material/Link";
import GitHubButton from "react-github-btn";

const awesomeGoUrl = "https://github.com/avelino/awesome-go";

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
    marginLeft: "auto",
    marginRight: "20px",
  };

  return (
    <div className="header" style={headerStyle}>
      <Linkweb href={awesomeGoUrl} target="_blank">
        Awesome Go Stats
      </Linkweb>
      <Linkweb href={csvURL} download>
        CSV File
      </Linkweb>
      <p>Last Update: {lastUpdate}</p>
      <div style={githubButtonStyle}>
        <GitHubButton
          href="https://github.com/emanuelef/awesome-go-repo-stats"
          data-color-scheme="no-preference: dark; light: dark_dimmed; dark: dark_high_contrast;"
          data-size="large"
          data-show-count="true"
          aria-label="Star emanuelef/awesome-go-repo-stats on GitHub"
        >
          Star Me
        </GitHubButton>
      </div>
    </div>
  );
}

export default Header;
