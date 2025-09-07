import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HorizontalSidebar from "../components/HorizontalSidebar";
import VerticalDropdown from "../components/VerticalDropdown";
import UseScaleBlock from "../components/UseScaleBlock";
import Textbox from "../components/Textbox";
import HOST from "../GLOBALS/Globals";

export default function UseScalePage({ usescale_id }) {
  console.log("UseScalePage for ID:", usescale_id);
  var [usecase, setUsecase] = React.useState(null);
  useEffect(() => {
    fetch(`${HOST}/usecase?usescale_id=${usescale_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUsecase(data);
        console.log("Fetched data:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [usescale_id]);
  return (
    <div className="layout" style={{ position: "relative", height: "100vh" }}>
      <Sidebar />
      <HorizontalSidebar>
        {open ? (
          <div style={{ width: "100%" }}>
            <VerticalDropdown title="Written Assessments">
              {/* Any dropdown content here */}
              <UseScaleBlock level="LEVEL N" label="NO AI" labelBg="#ffb3b3" />
              <UseScaleBlock
                level="LEVEL R-1"
                label="Limited use"
                labelBg="#ffcfb3ff"
              />
              <UseScaleBlock
                level="LEVEL R-2"
                label="Moderate use"
                labelBg="#ffffb3ff"
              />
              <UseScaleBlock
                level="LEVEL G"
                label="Full access"
                labelBg="#d9b3ffff"
              />
            </VerticalDropdown>

            <VerticalDropdown title="Coding Assessments">
              {/* Any dropdown content here */}
              <div>Dropdown content goes here!</div>
            </VerticalDropdown>

            <VerticalDropdown title="Oral Assessments">
              {/* Any dropdown content here */}
              <div>Dropdown content goes here!</div>
            </VerticalDropdown>

            <VerticalDropdown title="Presentation Assessments">
              {/* Any dropdown content here */}
              <div>Dropdown content goes here!</div>
            </VerticalDropdown>
          </div>
        ) : (
          <span style={{ fontSize: 24 }}>≡</span>
        )}
      </HorizontalSidebar>
      <div style={{ marginLeft: "470px", padding: "1rem" }}>
        {usecase &&
          usecase.map((data) => (
            <div
              key={data.row_id}
              style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}
            >
              <Textbox key={`${data.row_id}-category`} text={data.category} />
              <Textbox key={`${data.row_id}-comments`} text={data.comments} />
              <Textbox
                key={`${data.row_id}-description`}
                text={data.description}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
