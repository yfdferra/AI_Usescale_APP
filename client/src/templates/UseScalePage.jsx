<<<<<<< HEAD
import React from "react";
=======
import React, { useState } from "react";
>>>>>>> Frontend
import Sidebar from "../components/Sidebar";
import HorizontalSidebar from "../components/HorizontalSidebar";
import VerticalDropdown from "../components/VerticalDropdown";
import UseScaleBlock from "../components/UseScaleBlock";
<<<<<<< HEAD

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
=======
import FilterSearchBar from "../components/FilterSearchBar";
import TableSection from "../components/TableSection";
import "./UseScalePage.css";

export default function UseScalePage() {
  const handleFilterChange = () => {};
  const handleSearch = () => {};
  const [open, setOpen] = useState(false);
  return (
    <div className="use-scale-page">
      <Sidebar />
      <div
        className={
          open ? "use-scale-page-sidebar" : "use-scale-page-sidebar closed"
        }
      >
        <HorizontalSidebar open={open} setOpen={setOpen}>
          <FilterSearchBar
            filterOptions={["All", "No AI", "Some AI"]}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
          <VerticalDropdown title="Written Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock level="LEVEL N" label="NO AI" labelBg="#ffb3b3" />
            <UseScaleBlock level="LEVEL R-1" label="" labelBg="#ffcfb3ff" />
            <UseScaleBlock level="LEVEL R-2" label="" labelBg="#ffffb3ff" />
            <UseScaleBlock level="LEVEL G" label="" labelBg="#d9b3ffff" />
          </VerticalDropdown>

          <VerticalDropdown title="Coding Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock level="LEVEL N" label="NO AI" labelBg="#ffb3b3" />
            <UseScaleBlock level="LEVEL R-1" label="" labelBg="#ffcfb3ff" />
            <UseScaleBlock level="LEVEL R-2" label="" labelBg="#ffffb3ff" />
            <UseScaleBlock level="LEVEL G" label="" labelBg="#d9b3ffff" />
          </VerticalDropdown>

          <VerticalDropdown title="Oral Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock level="LEVEL N" label="NO AI" labelBg="#ffb3b3" />
            <UseScaleBlock level="LEVEL R-1" label="" labelBg="#ffcfb3ff" />
            <UseScaleBlock level="LEVEL R-2" label="" labelBg="#ffffb3ff" />
            <UseScaleBlock level="LEVEL G" label="" labelBg="#d9b3ffff" />
          </VerticalDropdown>

          <VerticalDropdown title="Presentation Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock level="LEVEL N" label="NO AI" labelBg="#ffb3b3" />
            <UseScaleBlock level="LEVEL R-1" label="" labelBg="#ffcfb3ff" />
            <UseScaleBlock level="LEVEL R-2" label="" labelBg="#ffffb3ff" />
            <UseScaleBlock level="LEVEL G" label="" labelBg="#d9b3ffff" />
          </VerticalDropdown>
        </HorizontalSidebar>
      </div>
      <div className="use-scale-page-content">
        <TableSection />
      </div>
>>>>>>> Frontend
    </div>
  );
}
