import React from "react";
import {
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Chip,
} from "@mui/material";
import {
  FileText,
  Edit,
  Notebook as Robot,
  Move,
  Calendar,
  Activity as ActivityIcon,
} from "lucide-react";
import { format } from "date-fns";
import { useReportStore } from "../store/reportStore";

const getActivityIcon = (action: string) => {
  switch (action) {
    case "created":
      return <FileText size={16} />;
    case "edited":
      return <Edit size={16} />;
    case "ai_generated":
    case "ai_summarized":
      return <Robot size={16} />;
    case "reordered":
      return <Move size={16} />;
    default:
      return <ActivityIcon size={16} />;
  }
};

const getActivityColor = (action: string) => {
  switch (action) {
    case "created":
      return "success";
    case "edited":
      return "primary";
    case "ai_generated":
    case "ai_summarized":
      return "secondary";
    case "reordered":
      return "info";
    default:
      return "default";
  }
};

const getActivityText = (action: string) => {
  switch (action) {
    case "created":
      return "Created report";
    case "edited":
      return "Edited report";
    case "ai_generated":
      return "Generated content with AI";
    case "ai_summarized":
      return "Summarized with AI";
    case "reordered":
      return "Reordered reports";
    default:
      return action;
  }
};

export const ActivityFeed: React.FC = () => {
  const { activities, reports } = useReportStore();

  const getReportTitle = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    return report?.title || "Unknown Report";
  };

  if (activities.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center" }}>
        <ActivityIcon size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
        <Typography variant='body2' color='text.secondary'>
          No activity yet. Start creating and editing reports to see activity
          here.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 0, maxHeight: 400, overflow: "auto" }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography
          variant='h6'
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <ActivityIcon size={20} />
          Recent Activity
        </Typography>
      </Box>

      <List sx={{ py: 0 }}>
        {activities.slice(0, 10).map((activity) => (
          <ListItem
            key={activity.id}
            sx={{ py: 1.5, borderBottom: 1, borderColor: "divider" }}
          >
            <ListItemAvatar>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: `${getActivityColor(activity.action)}.main`,
                  color: "white",
                }}
              >
                {getActivityIcon(activity.action)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography variant='body2'>
                    {getActivityText(activity.action)}
                  </Typography>
                  <Chip
                    label={getReportTitle(activity.reportId)}
                    size='small'
                    variant='outlined'
                    sx={{ fontSize: "0.7rem", height: 20 }}
                  />
                </Box>
              }
              secondary={
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mt: 0.5,
                  }}
                >
                  <Calendar size={12} />
                  <Typography variant='caption' color='text.secondary'>
                    {format(new Date(activity.timestamp), "MMM dd, yyyy HH:mm")}
                  </Typography>
                  {activity.details && (
                    <Typography
                      variant='caption'
                      color='text.secondary'
                      sx={{ ml: 1 }}
                    >
                      • {activity.details}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};
