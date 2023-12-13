import React from "react";
import "./IssueCard.scss";

export const IssueCard = ({ issueCard, issueTypes }) => {
  const issueType = Object.keys(issueCard);
  const percentageData = issueType.map((issueTypeKey) => {
    const innerArray = issueCard[issueTypeKey];
    const data = innerArray.map((innerItem) => {
      const date = Object.keys(innerItem)[0];
      const counts = innerItem[date];
      const createdCount = counts.created_count;
      const closedCount = counts.closed_count;
      return { date, createdCount, closedCount };
    });
    return data;
  });

  return (
    <>
      {issueType.map((issueTypeKey, index) => {
        // if (issueTypes.includes(issueTypeKey)) {
        if (issueTypeKey === issueTypes) {
          return (
            <div className="d-flex" key={index}>
              {percentageData[index].map((item, innerIndex) => {
                if (innerIndex > 0) {
                  const previousData = percentageData[index][innerIndex - 1];
                  const currentData = item;

                  const previousCreatedCount = previousData.createdCount;
                  const previousClosedCount = previousData.closedCount;
                  const currentCreatedCount = currentData.createdCount;
                  const currentClosedCount = currentData.closedCount;

                  const calculateCreatedCountPercentage = (
                    (previousCreatedCount - currentCreatedCount) /
                    100
                  ).toFixed(2);

                  const calculateClosedCountPercentage = (
                    (previousClosedCount - currentClosedCount) /
                    100
                  ).toFixed(2);

                  const arrowDirection1 =
                    calculateCreatedCountPercentage < 0 ? "▼" : "▲";
                  const arrowDirection2 =
                    calculateClosedCountPercentage < 0 ? "▼" : "▲";

                  return (
                    <div
                      className="d-flex col-md-12 issueCard"
                      key={innerIndex}
                    >
                      <div className="card-item shadow w-100">
                        <div className="body-card">
                          <div className="header-card ">
                            <span className={`prom-arrow-1 ${arrowDirection1}`}>
                              {arrowDirection1}{" "}
                              {calculateCreatedCountPercentage}%
                            </span>
                            <p>Issues Created</p>
                          </div>
                          <div className="bottom-card ">
                            <div className="card-left px-1 ">
                              <span id="issueCreation" className="text-left">
                                {previousCreatedCount}
                              </span>
                              <p>Current Month</p>
                            </div>

                            <div className="card-right px-1">
                              <span id="issueCreation" className="text-right">
                                {currentCreatedCount}
                              </span>
                              <p>Previous Month</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="card-item ms-4 shadow w-100">
                        <div className="body-card">
                          <div className="header-card ">
                            <span className={`prom-arrow-2 ${arrowDirection2}`}>
                              {arrowDirection2}{" "}
                              {Math.abs(calculateClosedCountPercentage)}%
                            </span>
                            <p>Issues Closed</p>
                          </div>
                          <div className="bottom-card ">
                            <div className="card-left px-1 ">
                              <span id="issueCreation" className="text-left">
                                {previousClosedCount}
                              </span>
                              <p>Current Month</p>
                            </div>
                            <div className="card-right px-1">
                              <span id="issueCreation" className="text-right">
                                {currentClosedCount}
                              </span>
                              <p>Previous Month</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};
