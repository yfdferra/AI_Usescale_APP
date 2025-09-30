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

const NOAI = "LEVEL N";
const TO_NULL = [
  "instruction",
  "example",
  "declaration",
  "version",
  "purpose",
  "key_prompts",
];

export default function UseScalePage({
  usescale_id,
  template_title,
  subject_id,
  onLogout,
}) {
  const [pendingRowIdx, setPendingRowIdx] = useState(null);

  // old hardcoded levels//
  /*
  const LEVEL_BASE = {
    "LEVEL N": {
      color: "#ffb3b3",
      data: {
        instruction: "Idea Generation",
        example:
          "'Generate me a list of 10 concerns regarding coral reef sustainability'",
        declaration: "Allowed; all prompts must be submitted",
        version: "	ChatGPT v4.0",
        purpose: "Brainstorm possible issues for research",
        key_prompts:
          "'Generate me a list of 10 concerns regarding coral reef sustainability'",
      },
    },
    "LEVEL R-1": {
      color: "#ffcfb3ff",
      data: {
        instruction: "Research",
        example:
          "'Prompt: summarise the main points of this paper with citations in the format (page number, line number, any figures references)'",
        declaration: "Allowed; must cite sources",
        version: "ChatGPT v4.0",
        purpose: "Assist with summarising external sources",
        key_prompts: "'Summarise the main points of this paper...'",
      },
    },
    "LEVEL R-2": {
      color: "#ffffb3ff",
      data: {
        instruction: "LEVEL R-2 heehee",
        example: "LEVEL R-2 heehee",
        declaration: "LEVEL R-2 heehee",
        version: "LEVEL R-2 heehee",
        purpose: "LEVEL R-2 heehee",
        key_prompts: "LEVEL R-2 heehee",
      },
    },
    "LEVEL G": {
      color: "#d9b3ffff",
      data: {
        instruction: "LEVEL G heehee",
        example: "LEVEL G heehee",
        declaration: "LEVEL G heehee",
        version: "LEVEL G heehee",
        purpose: "LEVEL G heehee",
        key_prompts: "LEVEL G heehee",
      },
    },
  };
  */

  // new state to store fetched entry types and entries
  const [levelsData, setLevelsData] = useState([]);

  const handleLevelClick = (levelKey, entries) => {
    if (pendingRowIdx == null) return;

    // find selected level entry data in db
    const copy = entries.find((e) => e.ai_level == levelKey);
    if (!copy) return;

    const FLAT = {
      level: levelKey,
      label: copy.ai_title,
      ...copy,
    };

    // save as nulls
    if (levelKey === NOAI) {
      for (const k of TO_NULL) {
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

  const handleSaveTemplate = (version) => {
    const payload = {
      usescale_id,
      subject_id,
      version,
      rows: usecase,
    };
    console.log("KMS2:", version);
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
    fetch(`${HOST}/usecase?usescale_id=${usescale_id}`)
      .then((res) => res.json())
      .then((data) => {
        // if the usecase has no rows, initialize with one empty row
        if (!data || data.length === 0) {
          setUsecase([
            {
              id: null,
              level: "",
              instruction: "",
              example: "",
              declaration: "",
              version: "",
              purpose: "",
              key_prompts: "",
            },
          ]);
        } else {
          setUsecase(data);
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
            <VerticalDropdown
              key={entryType.entry_type_id}
              title={entryType.title}
            >
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
                  onClick={() =>
                    handleLevelClick(entry.ai_level, entryType.entries)
                  }
                />
              ))}
            </VerticalDropdown>
          ))}
        </HorizontalSidebar>
      </div>
      <div className="use-scale-page-content">
        <TableSection
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
