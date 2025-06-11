/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Save, X, Notebook as Robot, FileText } from "lucide-react";
import { Report } from "../types";
import { useReportStore } from "../store/reportStore";
import { openaiService } from "../services/openaiService";
import { RichTextEditor } from "./RichTextEditor";

interface ReportEditorProps {
  open: boolean;
  onClose: () => void;
  report?: Report | null;
  mode: "create" | "edit" | "view";
}

export const ReportEditor: React.FC<ReportEditorProps> = ({
  open,
  onClose,
  report,
  mode,
}) => {
  const {
    addReport,
    updateReport,
    addActivity,
    currentUser,
    aiLoading,
    setAiLoading,
  } = useReportStore();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "draft" as "draft" | "published",
    tags: [] as string[],
  });

  const [newTag, setNewTag] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [summary, setSummary] = useState("");

  useEffect(() => {
    if (report && open) {
      setFormData({
        title: report.title,
        content: report.content,
        status: report.status,
        tags: [...report.tags],
      });
      setSummary(report.aiSummary || "");
    } else if (open && mode === "create") {
      setFormData({
        title: "",
        content: "",
        status: "draft",
        tags: [],
      });
      setSummary("");
    }
  }, [report, open, mode]);

  const handleSave = () => {
    if (!formData.title.trim()) return;

    if (mode === "edit" && report) {
      updateReport(report.id, formData);
    } else if (mode === "create") {
      addReport({
        ...formData,
        createdBy: currentUser.id,
      });
    }

    onClose();
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleGenerateReport = async () => {
    if (!aiPrompt.trim()) return;

    setAiLoading(true);
    try {
      const generatedContent = await openaiService.generateReport(aiPrompt);
      setFormData({
        ...formData,
        content: generatedContent,
        title:
          formData.title ||
          `AI Generated Report - ${new Date().toLocaleDateString()}`,
      });
      setShowAiPrompt(false);
      setAiPrompt("");

      if (report) {
        addActivity({
          reportId: report.id,
          action: "ai_generated",
          userId: currentUser.id,
          details: `Generated content from prompt: "${aiPrompt.substring(
            0,
            50
          )}..."`,
        });
      }
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSummarizeContent = async () => {
    if (!formData.content.trim()) return;

    setAiLoading(true);
    try {
      const generatedSummary = await openaiService.summarizeContent(
        formData.content
      );
      setSummary(generatedSummary);

      if (report) {
        updateReport(report.id, { aiSummary: generatedSummary });
        addActivity({
          reportId: report.id,
          action: "ai_summarized",
          userId: currentUser.id,
        });
      }
    } catch (error) {
      console.error("Error summarizing content:", error);
    } finally {
      setAiLoading(false);
    }
  };

  const isReadOnly = mode === "view" || currentUser.role === "viewer";
  const canUseAI = currentUser.role === "admin";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='lg'
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3, minHeight: "80vh" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          borderRadius: "12px 12px 0 0",
        }}
      >
        <FileText size={24} />
        {mode === "create"
          ? "Create New Report"
          : mode === "edit"
          ? "Edit Report"
          : "View Report"}
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          mt: 3,
          overflow: "auto",
          maxHeight: "calc(100vh - 200px)",
        }}
      >
        <TextField
          label='Report Title'
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          fullWidth
          disabled={isReadOnly}
          variant='outlined'
        />

        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label='Status'
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as any })
              }
              disabled={isReadOnly}
            >
              <MenuItem value='draft'>Draft</MenuItem>
              <MenuItem value='published'>Published</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
              {formData.tags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={isReadOnly ? undefined : () => handleRemoveTag(tag)}
                  size='small'
                  color='primary'
                  variant='outlined'
                />
              ))}
            </Box>
            {!isReadOnly && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size='small'
                  placeholder='Add tag...'
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                />
                <Button onClick={handleAddTag} variant='outlined' size='small'>
                  Add
                </Button>
              </Box>
            )}
          </Box>
        </Box>

        {canUseAI && !isReadOnly && (
          <Paper sx={{ p: 2, bgcolor: "grey.50", borderRadius: 2 }}>
            <Typography
              variant='subtitle2'
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              <Robot size={16} />
              AI Assistant
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Button
                variant='outlined'
                size='small'
                startIcon={<Robot size={16} />}
                onClick={() => setShowAiPrompt(true)}
                disabled={aiLoading}
              >
                Generate Draft
              </Button>
              <Button
                variant='outlined'
                size='small'
                startIcon={<FileText size={16} />}
                onClick={handleSummarizeContent}
                disabled={aiLoading || !formData.content.trim()}
              >
                Summarize Content
              </Button>
              {aiLoading && <CircularProgress size={20} />}
            </Box>
          </Paper>
        )}

        {showAiPrompt && (
          <Paper
            sx={{
              p: 2,
              border: "2px solid",
              borderColor: "primary.main",
              borderRadius: 2,
            }}
          >
            <Typography variant='subtitle2' sx={{ mb: 1 }}>
              Describe what you want the report to be about:
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder='e.g., Analyze Q4 sales performance with focus on regional trends and customer segments...'
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Button onClick={() => setShowAiPrompt(false)}>Cancel</Button>
              <Button
                variant='contained'
                onClick={handleGenerateReport}
                disabled={!aiPrompt.trim() || aiLoading}
              >
                Generate Report
              </Button>
            </Box>
          </Paper>
        )}

        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <RichTextEditor
            value={formData.content}
            onChange={(content) => setFormData({ ...formData, content })}
            disabled={isReadOnly}
            placeholder='Start writing your report content...'
            minHeight={400}
          />
        </Box>

        {summary && (
          <Paper
            sx={{
              p: 2,
              bgcolor: "info.50",
              borderRadius: 2,
              border: "1px solid",
              borderColor: "info.200",
            }}
          >
            <Typography variant='subtitle2' sx={{ mb: 1, color: "info.main" }}>
              AI Summary:
            </Typography>
            <div dangerouslySetInnerHTML={{ __html: summary }} />
          </Paper>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 1 }}>
        <Button onClick={onClose} startIcon={<X size={16} />}>
          {mode === "view" ? "Close" : "Cancel"}
        </Button>
        {!isReadOnly && (
          <Button
            onClick={handleSave}
            variant='contained'
            startIcon={<Save size={16} />}
            disabled={!formData.title.trim()}
          >
            {mode === "create" ? "Create Report" : "Save Changes"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
