import React from "react";
import { Box, Avatar, Typography, Chip, Paper, Divider } from "@mui/material";
import { Shield, User, Mail } from "lucide-react";
import { useReportStore } from "../store/reportStore";

export const UserProfile: React.FC = () => {
  const { currentUser, reports, activities } = useReportStore();

  const userReports = reports.filter(
    (report) => report.createdBy === currentUser.id
  );
  const recentActivity = activities.filter(
    (activity) => activity.userId === currentUser.id
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
        <Avatar src={currentUser.avatar} sx={{ width: 64, height: 64 }}>
          <User size={24} />
        </Avatar>
        <Box>
          <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {currentUser.name}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
            <Mail size={14} />
            <Typography variant='body2' color='text.secondary'>
              {currentUser.email}
            </Typography>
          </Box>
          <Box sx={{ mt: 1 }}>
            <Chip
              icon={<Shield size={12} />}
              label={
                currentUser.role.charAt(0).toUpperCase() +
                currentUser.role.slice(1)
              }
              size='small'
              color={currentUser.role === "admin" ? "primary" : "secondary"}
              variant='outlined'
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 2,
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant='h4'
            color='primary.main'
            sx={{ fontWeight: 700 }}
          >
            {userReports.length}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Reports Created
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant='h4'
            color='secondary.main'
            sx={{ fontWeight: 700 }}
          >
            {userReports.filter((r) => r.status === "published").length}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Published
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant='h4' color='info.main' sx={{ fontWeight: 700 }}>
            {recentActivity.length}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Activities
          </Typography>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant='h4'
            color='warning.main'
            sx={{ fontWeight: 700 }}
          >
            {userReports.filter((r) => r.aiGenerated).length}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            AI Generated
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};
