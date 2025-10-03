import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import HorizontalSidebar from "../components/HorizontalSidebar";
import VerticalDropdown from "../components/VerticalDropdown";
import UseScaleBlock from "../components/UseScaleBlock";
import Textbox from "../components/Textbox";
import HOST from "../GLOBALS/Globals";

import FilterSearchBar from "../components/FilterSearchBar";
import TableSection from "../components/TableSection";
import "./UseScalePage.css";

const NOAI = "LEVEL N";
const TO_NULL = ["instruction", "example", "declaration", "version", "purpose", "key_prompts"];

export default function UseScalePage({
  isBaseTemplate,
  userId,
  userType,
  template_title,
  subject_id,
  onLogout,
}) {
  console.log("Tablesection userTtype:", userType);
  console.log("Tablesection userid:", userId);
  const [pendingRowIdx, setPendingRowIdx] = useState(null);

  // new state to store fetched entry types and entries
  const [levelsData, setLevelsData] = useState([]);

  // get usescale id from the url
  const {id: usescale_id} = useParams();
  


  const handleLevelClick = (levelKey, entries) => {
    if (pendingRowIdx == null) return;

    // find selected level entry data in db
    const copy = entries.find((e => e.ai_level == levelKey));
    if (!copy) return;

    const FLAT = {
      level: levelKey,
      label: copy.ai_title,
      ...copy,
    };

    // save as nulls
    if (levelKey === NOAI) {
      for (const k of TO_NULL) {
        if (k === "instruction") continue;
        FLAT[k] = null;
      }
    }

    setUsecase((prev) => {
      if (!Array.isArray(prev) || !prev[pendingRowIdx]) return prev;
      const next = prev.slice(); // create copy
      if (!next[pendingRowIdx]) return prev;

      // Keep ID
      const keep = next[pendingRowIdx].id ? { id: next[pendingRowIdx].id } : {};
      // Replace
      next[pendingRowIdx] = { ...keep, ...FLAT };
      return next;
    });

    setPendingRowIdx(null); // empty the row
  };

  const handleSaveTemplate = (currentTitle) => {
    if (!usecase || !Array.isArray(usecase)) {
      console.error("No data to save.");
      return;
    }

    const payload = {
      usescale_id,
      subject_id,
      title: currentTitle, // update function to save the title as well
      rows: usecase,
    };

    fetch(`${HOST}/save_template`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert("Template saved successfully!");
        } else {
          console.error("Error saving template:", data.error);
          alert("Failed to save template.");
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
        alert("Failed to save template due to a network error.");
      });
  };

  const handleFilterChange = () => {};
  const handleSearch = () => {};
  const [open, setOpen] = useState(false);

  // fetch usecase rows for table
  console.log("UseScalePage for ID:", usescale_id);
  var [usecase, setUsecase] = React.useState(null);
  useEffect(() => {
    if (!usescale_id) return;

    fetch(`${HOST}/usecase?usescale_id=${usescale_id}`)
      .then((res) => res.json())
      .then((data) => {
        // if the usecase has no rows, initialize with one empty row
        if (!data || data.length === 0) {
          setUsecase([{ 
            id: null, 
            ai_title: "", 
            level: "", 
            instruction: "", 
            example: "", 
            declaration: "", 
            version: "", 
            purpose: "", 
            key_prompts: "" 
          }]);
        } else {
          // map each row to include 'label' initialized from ai_title
          const mapped = data.map(row => ({
            ...row,
            label: row.ai_title || ""
          }));
          setUsecase(mapped);
        }
        console.log("Fetched data:", data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [usescale_id]);

  // fetch dynamic levels (entry type and entries) from db
  useEffect(() => {
    fetch(`${HOST}/entries`)
      .then((res) => res.json())
      .then((data) => {
        setLevelsData(data);
        console.log("Fetched levels data:", data);
      })
      .catch((error) => console.error("Error fetching levels:", error));
  }, []);

  return (
    <div className="use-scale-page">
      <Sidebar onLogout={onLogout} />
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
          {/* Render dropdowns dynamically from db*/}
          {levelsData.map((entryType) => (
            <VerticalDropdown key={entryType.entry_type_id} title={entryType.title}>
              {entryType.entries.map((entry) => (
                <UseScaleBlock
                  key={entry.ai_level + entryType.entry_type_id}
                  level={entry.ai_level}
                  label={entry.ai_title}
                  labelBg={
                    entry.ai_level === "LEVEL N" // chooses the colour based on the level type
                      ? "#ffb3b3"
                      : entry.ai_level === "LEVEL R-1"
                      ? "#ffcfb3ff"
                      : entry.ai_level === "LEVEL R-2"
                      ? "#ffffb3ff"
                      : "#d9b3ffff"
                  }
                  entry_type_id = {entryType.entry_type_id}
                  onClick={() => handleLevelClick(entry.ai_level, entryType.entries)}
                />
              ))}
            </VerticalDropdown>
          ))}
        </HorizontalSidebar>
      </div>
      <div className="use-scale-page-content">
        <TableSection
          isBaseTemplate={isBaseTemplate}
          userId={userId}
          userType={userType}
          tableData={usecase}
          subjectId={subject_id}
          initialTitle={template_title}
          toHighlight={pendingRowIdx}
          onChangeScale={(rowIdx) => setPendingRowIdx(rowIdx)}
          onRowsChange={(nextRows) => setUsecase(nextRows)}
          onSaveTemplate={handleSaveTemplate}
          levelsData={levelsData} // <-- pass levelsData for drag-and-drop
        />
      </div>
    </div>
  );
}
