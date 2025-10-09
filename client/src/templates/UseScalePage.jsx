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
const TO_NULL = [
  "instruction",
  "example",
  "declaration",
  "version",
  "purpose",
  "key_prompts",
];

export default function UseScalePage({
  isBaseTemplate,
  userId,
  userType,
  template_title,
  subject_id,
  onLogout,
}) {
  const [pendingRowIdx, setPendingRowIdx] = useState(null);

  // new state to store fetched entry types and entries
  const [levelsData, setLevelsData] = useState([]);

  // get usescale id from the url
  const { id: usescale_id } = useParams();

  const [searchTerm, setSearchTerm] = useState("");

  const [usecase, setUsecase] = useState(null);
  const [editingScale, setEditingScale] = useState(null);
  const [editedLevel, setEditedLevel] = useState("");
  const [editedLabel, setEditedLabel] = useState("");

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

  const [subjectName, setSubjectName] = useState("");
  const [subjectYear, setSubjectYear] = useState("");
  const [subjectSemester, setSubjectSemester] = useState("");

  const updateSubjectDetails = (name, year, semester) => {
    // console.log("Updating subject details:", { name, year, semester });
    setSubjectName(name);
    setSubjectYear(year);
    setSubjectSemester(semester);
  };

  const [subjectNameFromDB, setSubjectNameFromDB] = useState("");
  const [subjectYearFromDB, setSubjectYearFromDB] = useState("");
  const [subjectSemesterFromDB, setsubjectSemesterFromDB] = useState("");
  useEffect(() => {
    fetch(HOST + `/get_subject_info?subject_id=${subject_id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setSubjectNameFromDB(data.subject_name || "");
          setSubjectYearFromDB(data.subject_year || "");
          setsubjectSemesterFromDB(data.subject_semester || "");
        } else {
          console.error("Error fetching subject info:", data.error);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, [subject_id]);

  const handleSaveTemplate = async (currentTitle) => {
    if (!usecase || !Array.isArray(usecase)) {
      console.error("No data to save.");
      return;
    }

    try {
      // 1. Check if subject exists
      const checkResponse = await fetch(`${HOST}/check_in_subjects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectName, subjectYear, subjectSemester }),
      });
      const checkData = await checkResponse.json();
      console.log("Check subject response:", checkData);

      let finalSubjectId = subject_id;

      if (!checkData.exists) {
        // Ask user if they want to create a new subject
        const confirmCreate = window.confirm(
          "Subject does not exist. Create a new subject?"
        );
        if (!confirmCreate) return;

        const createResponse = await fetch(`${HOST}/create_subject`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subjectName,
            subjectYear,
            subjectSemester,
            userId,
            usescale_id,
          }),
        });
        const createData = await createResponse.json();
        finalSubjectId = createData.subject_id;
      }
      if (!finalSubjectId) {
        finalSubjectId = subject_id;
      }
      // 2. Build payload **after finalSubjectId is set**
      const savePayload = {
        usescale_id,
        subject_id: finalSubjectId,
        title: currentTitle,
        rows: usecase,
      };

      // 3. Save template
      const saveResponse = await fetch(`${HOST}/save_template`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savePayload),
      });
      const saveData = await saveResponse.json();

      if (saveData.success) {
        alert("Template saved successfully!");
      } else {
        console.error("Error saving template:", saveData.error);
        alert("Failed to save template.");
      }
    } catch (error) {
      console.error("Error in saving process:", error);
      alert("An error occurred. Check console for details.");
    }
  };

  const [open, setOpen] = useState(false);

  // fetch usecase rows for table
  useEffect(() => {
    if (!usescale_id) return;

    fetch(`${HOST}/usecase?usescale_id=${usescale_id}`)
      .then((res) => res.json())
      .then((data) => {
        // if the usecase has no rows, initialize with one empty row
        if (!data || data.length === 0) {
          setUsecase([
            {
              id: null,
              ai_title: "",
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
          // map each row to include 'label' initialized from ai_title
          const mapped = data.map((row) => ({
            ...row,
            label: row.ai_title || "",
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

  const handleFilterChange = () => {};
  const handleSearch = (value) => setSearchTerm(value.toLowerCase());
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
            filterOptions={["All"]}
            onFilterChange={handleFilterChange}
            onSearch={handleSearch}
          />
          {(() => {
            // filter the levels based on search term
            const filteredLevels = levelsData.map((entryType) => {
        const filteredEntries = entryType.entries.filter((entry) =>
          entry.ai_title.toLowerCase().includes(searchTerm)
        );
        return { ...entryType, filteredEntries };
      });

          // check if any results exist
          const hasResults = filteredLevels.some(
        (level) => level.filteredEntries.length > 0
      );

      if (!hasResults) {
        return <div className="no-results">No results found</div>;
      }

      // render the filtered levels
      return filteredLevels.map((entryType) => {
        if (entryType.filteredEntries.length === 0) return null;

        return (
          <VerticalDropdown
            key={entryType.entry_type_id}
            title={entryType.title}
            expanded={searchTerm.length > 0}>
              {entryType.filteredEntries.map((entry) => (
                <UseScaleBlock
                    key={`${entry.ai_level}-${entryType.entry_type_id}`}
                    level={entry.ai_level}
                    label={entry.ai_title}
                    labelBg={
                      entry.ai_level === "LEVEL N"
                        ? "#ffb3b3"
                        : entry.ai_level === "LEVEL R-1"
                        ? "#ffcfb3ff"
                        : entry.ai_level === "LEVEL R-2"
                        ? "#ffffb3ff"
                        : "#d9b3ffff"
                    }
                    entry_type_id={entryType.entry_type_id}
                    isAdmin={userType === "admin"}
                    onClick={() => handleLevelClick(entry.ai_level, entryType.filteredEntries)}
                    onEditClick={() => {
                      setEditingScale(entry);
                      setEditedLevel(entry.ai_level);
                      setEditedLabel(entry.ai_title);
                    }}
                  />
                ))}
              </VerticalDropdown>
            );
            });
          })()}
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
          onUpdateSubjectDetails={updateSubjectDetails}
        />
      </div>

      {editingScale && (
  <div className="modal-overlay">
    <div className="modal">
      <h3>Edit Scale</h3>
      <p>Entry Type: {editingScale.entry_type_id}</p>

      <input
        type="text"
        value={editedLevel}
        onChange={(e) => setEditedLevel(e.target.value)}
        placeholder="Level"
      />
      <input
        type="text"
        value={editedLabel}
        onChange={(e) => setEditedLabel(e.target.value)}
        placeholder="Label"
      />

      <div className="modal-buttons">
        <button
          onClick={async () => {
            try {
              const res = await fetch(`${HOST}/update_scale`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  entry_type_id: editingScale.entry_type_id,
                  level: editedLevel,
                  label: editedLabel,
                }),
              });
              const data = await res.json();
              if (data.success) {
                setLevelsData((prev) =>
                  prev.map((et) => ({
                    ...et,
                    entries: et.entries.map((e) =>
                      e.entry_type_id === editingScale.entry_type_id &&
                      e.ai_level === editingScale.ai_level
                        ? { ...e, ai_level: editedLevel, ai_title: editedLabel }
                        : e
                    ),
                  }))
                );
                setEditingScale(null);
              } else {
                alert("Failed to update scale: " + data.error);
              }
            } catch (err) {
              console.error(err);
              alert("Error updating scale");
            }
          }}
        >
          Save
        </button>
        <button onClick={() => setEditingScale(null)}>Cancel</button>
      </div>
    </div>
  </div>
)}

    </div>
  );

  
}
