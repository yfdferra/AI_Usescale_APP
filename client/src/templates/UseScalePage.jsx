import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import HorizontalSidebar from "../components/HorizontalSidebar";
import VerticalDropdown from "../components/VerticalDropdown";
import UseScaleBlock from "../components/UseScaleBlock";
import Textbox from "../components/Textbox";
import HOST from "../GLOBALS/Globals";

import FilterSearchBar from "../components/FilterSearchBar";
import TableSection from "../components/TableSection";
import "./UseScalePage.css";

export default function UseScalePage({ usescale_id }) {
  const handleFilterChange = () => {};
  const handleSearch = () => {};
  const [open, setOpen] = useState(false);
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
        <TableSection tableData={usecase} />
      </div>
    </div>
  );
}
