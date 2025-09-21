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
const TO_NULL = ["instruction", "example", "declaration", "version", "purpose", "key_prompts"];

export default function UseScalePage({
  usescale_id,
  template_title,
  subject_id,
  onLogout,
}) {
  const [pendingRowIdx, setPendingRowIdx] = useState(null);

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

  const handleLevelClick = (levelKey, lable) => {
    if (pendingRowIdx == null) return;
    const copy = LEVEL_BASE[levelKey];
    if (!copy) return;

    const FLAT = {
      level: levelKey,
      label: lable || "",
      ...copy.data,
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

  const handleSaveTemplate = () => {
    if (!usecase || !Array.isArray(usecase)) {
      console.error("No data to save.");
      return;
    }

    const payload = {
      usescale_id,
      subject_id,
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
  var [usecase, setUsecase] = React.useState(null);
  useEffect(() => {
    fetch(`${HOST}/usecase?usescale_id=${usescale_id}`)
      .then((res) => res.json())
      .then((data) => {
        setUsecase(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [usescale_id]);
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
          <VerticalDropdown title="Written Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock
              level="LEVEL N"
              label="NO AI"
              labelBg="#ffb3b3"
              onClick={() => handleLevelClick("LEVEL N", "NO AI")}
            />
            <UseScaleBlock
              level="LEVEL R-1"
              label="Some AI"
              labelBg="#ffcfb3ff"
              onClick={() => handleLevelClick("LEVEL R-1", "Some AI")}
            />
            <UseScaleBlock
              level="LEVEL R-2"
              label="More AI"
              labelBg="#ffffb3ff"
              onClick={() => handleLevelClick("LEVEL R-2", "More AI")}
            />
            <UseScaleBlock
              level="LEVEL G"
              label="Generative AI"
              labelBg="#d9b3ffff"
              onClick={() => handleLevelClick("LEVEL G", "Generative AI")}
            />
          </VerticalDropdown>

          <VerticalDropdown title="Coding Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock
              level="LEVEL N"
              label="NO AI"
              labelBg="#ffb3b3"
              onClick={() => handleLevelClick("LEVEL N", "NO AI")}
            />
            <UseScaleBlock
              level="LEVEL R-1"
              label="Some AI"
              labelBg="#ffcfb3ff"
              onClick={() => handleLevelClick("LEVEL R-1", "Some AI")}
            />
            <UseScaleBlock
              level="LEVEL R-2"
              label="More AI"
              labelBg="#ffffb3ff"
              onClick={() => handleLevelClick("LEVEL R-2", "More AI")}
            />
            <UseScaleBlock
              level="LEVEL G"
              label="Generative AI"
              labelBg="#d9b3ffff"
              onClick={() => handleLevelClick("LEVEL G", "Generative AI")}
            />
          </VerticalDropdown>

          <VerticalDropdown title="Oral Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock
              level="LEVEL N"
              label="NO AI"
              labelBg="#ffb3b3"
              onClick={() => handleLevelClick("LEVEL N", "NO AI")}
            />
            <UseScaleBlock
              level="LEVEL R-1"
              label="Some AI"
              labelBg="#ffcfb3ff"
              onClick={() => handleLevelClick("LEVEL R-1", "Some AI")}
            />
            <UseScaleBlock
              level="LEVEL R-2"
              label="More AI"
              labelBg="#ffffb3ff"
              onClick={() => handleLevelClick("LEVEL R-2", "More AI")}
            />
            <UseScaleBlock
              level="LEVEL G"
              label="Generative AI"
              labelBg="#d9b3ffff"
              onClick={() => handleLevelClick("LEVEL G", "Generative AI")}
            />
          </VerticalDropdown>

          <VerticalDropdown title="Presentation Assessments">
            {/* Any dropdown content here */}
            <UseScaleBlock
              level="LEVEL N"
              label="NO AI"
              labelBg="#ffb3b3"
              onClick={() => handleLevelClick("LEVEL N", "NO AI")}
            />
            <UseScaleBlock
              level="LEVEL R-1"
              label="Some AI"
              labelBg="#ffcfb3ff"
              onClick={() => handleLevelClick("LEVEL R-1", "Some AI")}
            />
            <UseScaleBlock
              level="LEVEL R-2"
              label="More AI"
              labelBg="#ffffb3ff"
              onClick={() => handleLevelClick("LEVEL R-2", "More AI")}
            />
            <UseScaleBlock
              level="LEVEL G"
              label="Generative AI"
              labelBg="#d9b3ffff"
              onClick={() => handleLevelClick("LEVEL G", "Generative AI")}
            />
          </VerticalDropdown>
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
        />
      </div>
    </div>
  );
}
