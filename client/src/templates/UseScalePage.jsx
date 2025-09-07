import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import HorizontalSidebar from "../components/HorizontalSidebar";
import VerticalDropdown from "../components/VerticalDropdown";
import UseScaleBlock from "../components/UseScaleBlock";
import TableSection from "../components/TableSection";

export default function UseScalePage() {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display:"flex", height: "100vh" }}>
      <Sidebar />
      <div style={{ width: open ? 400: 32, transition: "width 0.3s"}}>
      <HorizontalSidebar open ={open} setOpen={setOpen}>
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
      </HorizontalSidebar>
      </div>
      <div
        style={{
          flex: 1,
          padding: "1rem",
          overflow: "auto",
        }}
      >
        <TableSection />
      </div>
    </div>
  );
}
