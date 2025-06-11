import React from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVertical as MoreVert,
  Edit,
  Delete,
  Notebook as Robot,
  Eye,
  Calendar,
  GripVertical,
} from "lucide-react";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Report } from "../types";
import { useReportStore } from "../store/reportStore";

interface ReportCardProps {
  report: Report;
  onEdit: (report: Report) => void;
  onView: (report: Report) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onEdit,
  onView,
}) => {
  const { deleteReport, currentUser } = useReportStore();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: report.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      deleteReport(report.id);
    }
    handleMenuClose();
  };

  const getContentPreview = (content: string) => {
    const textContent = content
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return textContent.length > 150
      ? `${textContent.substring(0, 150)}...`
      : textContent;
  };

  const canEdit = currentUser.role === "admin";

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow:
            "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              size='small'
              {...attributes}
              {...listeners}
              sx={{ cursor: "grab", "&:active": { cursor: "grabbing" } }}
            >
              <GripVertical size={16} />
            </IconButton>
            <Typography
              variant='h6'
              component='h2'
              sx={{ fontWeight: 600, lineHeight: 1.3 }}
            >
              {report.title}
            </Typography>
          </Box>
          <IconButton size='small' onClick={handleMenuClick}>
            <MoreVert size={16} />
          </IconButton>
        </Box>

        <Typography
          variant='body2'
          color='text.secondary'
          sx={{ mb: 2, lineHeight: 1.5 }}
        >
          {getContentPreview(report.content)}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 2 }}>
          <Chip
            label={report.status}
            size='small'
            color={report.status === "published" ? "success" : "warning"}
            variant='outlined'
          />
          {report.aiGenerated && (
            <Chip
              label='AI Generated'
              size='small'
              icon={<Robot size={12} />}
              color='secondary'
              variant='outlined'
            />
          )}
          {report.tags.slice(0, 2).map((tag) => (
            <Chip
              key={tag}
              label={tag}
              size='small'
              variant='outlined'
              sx={{ fontSize: "0.75rem" }}
            />
          ))}
          {report.tags.length > 2 && (
            <Chip
              label={`+${report.tags.length - 2}`}
              size='small'
              variant='outlined'
              sx={{ fontSize: "0.75rem" }}
            />
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: "auto" }}>
          <Calendar size={14} />
          <Typography variant='caption' color='text.secondary'>
            Updated {format(new Date(report.updatedAt), "MMM dd, yyyy")}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          size='small'
          startIcon={<Eye size={16} />}
          onClick={() => onView(report)}
          sx={{ mr: "auto" }}
        >
          View
        </Button>
        {canEdit && (
          <Button
            size='small'
            startIcon={<Edit size={16} />}
            variant='outlined'
            onClick={() => onEdit(report)}
          >
            Edit
          </Button>
        )}
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            onView(report);
            handleMenuClose();
          }}
        >
          <Eye size={16} style={{ marginRight: 8 }} />
          View
        </MenuItem>
        {canEdit && [
          <MenuItem
            key='edit'
            onClick={() => {
              onEdit(report);
              handleMenuClose();
            }}
          >
            <Edit size={16} style={{ marginRight: 8 }} />
            Edit
          </MenuItem>,
          <MenuItem
            key='delete'
            onClick={handleDelete}
            sx={{ color: "error.main" }}
          >
            <Delete size={16} style={{ marginRight: 8 }} />
            Delete
          </MenuItem>,
        ]}
      </Menu>
    </Card>
  );
};
