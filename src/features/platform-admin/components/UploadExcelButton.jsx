import { useState } from "react";
import Button from "../../../components/ui/Button.jsx";
import Modal from "../../../components/ui/Modal.jsx";
import { useToast } from "../../../components/ui/useToast.js";
import { errorText } from "../../../lib/errors.js";
import { uploadExcel } from "../api.js";

export default function UploadExcelButton({ onDone }) {
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");

  async function handleFile(event) {
    const file = event.target.files[0];
    event.target.value = ""; // lets the same file be chosen again
    if (!file) return;

    setBusy(true);
    try {
      const result = await uploadExcel(file);
      const c = result.created ?? {};
      toast(
        `Saved: ${c.houses ?? 0} houses, ${c.projects ?? 0} projects, ${c.teams ?? 0} teams, ${c.members ?? 0} people.`,
        "ok",
      );
      onDone();
    } catch (err) {
      if (err.code === "UPLOAD_HAS_ERRORS")
        setProblem(String(err.details ?? err.message));
      else toast(errorText(err), "bad");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <label
        className={`inline-flex cursor-pointer items-center justify-center rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-semibold text-ink hover:bg-panel focus-within:outline-2 focus-within:outline-brand ${
          busy ? "pointer-events-none opacity-50" : ""
        }`}
      >
        {busy ? "Uploading…" : "Upload Excel"}
        <input
          type="file"
          accept=".xlsx"
          className="sr-only"
          onChange={handleFile}
        />
      </label>

      {problem && (
        <Modal
          title="The Excel file has problems"
          onClose={() => setProblem("")}
        >
          <p className="mb-3">
            Nothing was saved. Fix these rows in the sheet and upload it again:
          </p>
          <pre className="max-h-80 overflow-auto rounded-lg bg-panel p-3 text-[13px] whitespace-pre-wrap">
            {problem}
          </pre>
          <div className="mt-3 flex justify-end">
            <Button variant="primary" onClick={() => setProblem("")}>
              Close
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
