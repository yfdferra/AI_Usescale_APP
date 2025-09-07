import React from "react";
import Sidebar from "../components/Sidebar";
import HorizontalSidebar from "../components/HorizontalSidebar";
import VerticalDropdown from "../components/VerticalDropdown";
import UseScaleBlock from "../components/UseScaleBlock";

export default function UseScalePage() {
  return (
    <div className="layout" style={{ position: "relative", height: "100vh" }}>
      <Sidebar />
      <HorizontalSidebar>
        {open ? (
          <div style={{ width: "100%" }}>
            <VerticalDropdown title="Written Assessments">
              {/* Any dropdown content here */}
              <UseScaleBlock level="LEVEL N" label="NO AI" labelBg="#ffb3b3" />
              <UseScaleBlock level="LEVEL R-1" label="" labelBg="#ffcfb3ff" />
              <UseScaleBlock level="LEVEL R-2" label="" labelBg="#ffffb3ff" />
              <UseScaleBlock level="LEVEL G" label="" labelBg="#d9b3ffff" />
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
    </div>
  );
}
