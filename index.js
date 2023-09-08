const express = require("express");
const dotenv = require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (_, res) => {
  res.status(200).json({ message: "welcome to the stage one HNGX project" });
});

app.get("/api/", (req, res) => {
  const { slack_name, track } = req.query;

  if (!slack_name || !track) {
    return res
      .status(400)
      .json({ error: "slack_name and track are required parameters" });
  }
  //   Current UTC Time
  const currentUTCTime = new Date();
  const year = currentUTCTime.getUTCFullYear();
  const month = String(currentUTCTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(currentUTCTime.getUTCDate()).padStart(2, "0");
  const hours = String(currentUTCTime.getUTCHours()).padStart(2, "0");
  const minutes = String(currentUTCTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(currentUTCTime.getUTCSeconds()).padStart(2, "0");
  const utc_time = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
  //   Two minute ahead
  const twoMinutesAhead = new Date(currentUTCTime);
  twoMinutesAhead.setUTCMinutes(currentUTCTime.getUTCMinutes() + 2);
  //   Two minute behind
  const twoMinutesBehind = new Date(currentUTCTime);
  twoMinutesBehind.setUTCMinutes(currentUTCTime.getUTCMinutes() - 2);

  if (currentUTCTime >= twoMinutesBehind && currentUTCTime <= twoMinutesAhead) {
    //   CurrentDay
    const today = new Date();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const current_day = daysOfWeek[today.getDay()];

    // GitHub URLs
    const github_file_url =
      "https://github.com/gamelayo/endpoint/blob/master/index.js";
    const github_repo_url = "https://github.com/gamelayo/endpoint";

    // Response JSON
    const response = {
      slack_name,
      current_day,
      utc_time,
      track,
      github_file_url,
      github_repo_url,
      status_code: 200,
    };

    res.status(200).json(response);
  } else {
    return res.status(400).json({ error: "utc_time is incorrect" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
