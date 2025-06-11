import React, { useRef, useCallback, useEffect } from "react";
import { Box, Paper, IconButton, Divider, Tooltip } from "@mui/material";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Quote,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
  minHeight?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Start writing...",
  minHeight = 300,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  }, [onChange]);

  const executeCommand = useCallback(
    (command: string, value?: string) => {
      if (disabled) return;

      document.execCommand(command, false, value);
      editorRef.current?.focus();
      handleInput();
    },
    [disabled, handleInput]
  );

  const insertLink = useCallback(() => {
    if (disabled) return;

    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  }, [disabled, executeCommand]);

  const formatBlock = useCallback(
    (tag: string) => {
      if (disabled) return;

      executeCommand("formatBlock", tag);
    },
    [disabled, executeCommand]
  );

  const toolbarButtons = [
    { icon: Bold, command: "bold", tooltip: "Bold" },
    { icon: Italic, command: "italic", tooltip: "Italic" },
    { icon: Underline, command: "underline", tooltip: "Underline" },
    { divider: true },
    { icon: AlignLeft, command: "justifyLeft", tooltip: "Align Left" },
    { icon: AlignCenter, command: "justifyCenter", tooltip: "Align Center" },
    { icon: AlignRight, command: "justifyRight", tooltip: "Align Right" },
    { divider: true },
    { icon: List, command: "insertUnorderedList", tooltip: "Bullet List" },
    {
      icon: ListOrdered,
      command: "insertOrderedList",
      tooltip: "Numbered List",
    },
    { divider: true },
    {
      icon: Quote,
      command: "formatBlock",
      value: "blockquote",
      tooltip: "Quote",
    },
    { icon: Link, action: insertLink, tooltip: "Insert Link" },
  ];

  const headingButtons = [
    { label: "H1", value: "h1" },
    { label: "H2", value: "h2" },
    { label: "H3", value: "h3" },
    { label: "P", value: "p" },
  ];

  if (disabled) {
    return (
      <Paper
        sx={{
          p: 2,
          minHeight,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "grey.50",
          overflow: "auto",
        }}
      >
        <div
          dangerouslySetInnerHTML={{ __html: value }}
          style={{
            minHeight: minHeight - 32,
            lineHeight: 1.6,
            color: "#666",
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        />
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          bgcolor: "grey.50",
          borderBottom: "1px solid",
          borderColor: "divider",
          flexWrap: "wrap",
          gap: 0.5,
        }}
      >
        {headingButtons.map((heading) => (
          <Tooltip key={heading.value} title={`Format as ${heading.label}`}>
            <IconButton
              size='small'
              onClick={() => formatBlock(heading.value)}
              sx={{
                minWidth: 32,
                height: 32,
                fontSize: "0.75rem",
                fontWeight: 600,
              }}
            >
              {heading.label}
            </IconButton>
          </Tooltip>
        ))}

        <Divider orientation='vertical' flexItem sx={{ mx: 0.5 }} />

        {toolbarButtons.map((button, index) => {
          if (button.divider) {
            return (
              <Divider
                key={index}
                orientation='vertical'
                flexItem
                sx={{ mx: 0.5 }}
              />
            );
          }

          const IconComponent = button.icon!;

          return (
            <Tooltip key={index} title={button.tooltip}>
              <IconButton
                size='small'
                onClick={() => {
                  if (button.action) {
                    button.action();
                  } else if (button.command) {
                    if (button.value) {
                      executeCommand(button.command, button.value);
                    } else {
                      executeCommand(button.command);
                    }
                  }
                }}
                sx={{ width: 32, height: 32 }}
              >
                <IconComponent size={16} />
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>

      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        sx={{
          p: 2,
          minHeight,
          outline: "none",
          lineHeight: 1.6,
          fontSize: "14px",
          fontFamily: "inherit",
          flex: 1,
          overflow: "auto",
          wordBreak: "break-word",
          overflowWrap: "break-word",
          "&:empty::before": {
            content: `"${placeholder}"`,
            color: "text.secondary",
            fontStyle: "italic",
          },
          "& h1": {
            fontSize: "2rem",
            fontWeight: 700,
            margin: "1rem 0 0.5rem 0",
            lineHeight: 1.2,
          },
          "& h2": {
            fontSize: "1.5rem",
            fontWeight: 600,
            margin: "1rem 0 0.5rem 0",
            lineHeight: 1.3,
          },
          "& h3": {
            fontSize: "1.25rem",
            fontWeight: 600,
            margin: "1rem 0 0.5rem 0",
            lineHeight: 1.4,
          },
          "& p": {
            margin: "0.5rem 0",
          },
          "& ul, & ol": {
            margin: "0.5rem 0",
            paddingLeft: "2rem",
          },
          "& blockquote": {
            margin: "1rem 0",
            padding: "0.5rem 1rem",
            borderLeft: "4px solid",
            borderColor: "primary.main",
            bgcolor: "grey.50",
            fontStyle: "italic",
          },
          "& a": {
            color: "primary.main",
            textDecoration: "none",
            "&:hover": {
              textDecoration: "underline",
            },
          },
        }}
      />
    </Paper>
  );
};
