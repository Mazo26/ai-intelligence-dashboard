import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  Fab,
  Drawer,
  IconButton,
  useTheme,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Plus,
  Menu as MenuIcon,
  BarChart3,
  Settings,
  LogOut,
  User,
} from "lucide-react";

import { theme } from "./theme/theme";
import { useReportStore } from "./store/reportStore";
import { SearchFilter } from "./components/SearchFilter";
import { ReportCard } from "./components/ReportCard";
import { ReportEditor } from "./components/ReportEditor";
import { ActivityFeed } from "./components/ActivityFeed";
import { UserProfile } from "./components/UserProfile";
import { Report } from "./types";

function App() {
  const theme_mui = useTheme();

  const { getFilteredReports, reorderReports, currentUser } = useReportStore();

  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [editorMode, setEditorMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] =
    useState<null | HTMLElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const filteredReports = getFilteredReports();

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderReports(active.id as string, over.id as string);
    }
  };

  const handleCreateReport = () => {
    setSelectedReport(null);
    setEditorMode("create");
    setEditorOpen(true);
  };

  const handleEditReport = (report: Report) => {
    setSelectedReport(report);
    setEditorMode("edit");
    setEditorOpen(true);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setEditorMode("view");
    setEditorOpen(true);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const sidebarContent = (
    <Box sx={{ width: 350, p: 2, height: "100%", overflow: "auto" }}>
      <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Box sx={{ mb: 3 }}>
        <UserProfile />
      </Box>

      <Box sx={{ mb: 3 }}>
        <ActivityFeed />
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <AppBar
          position='fixed'
          sx={{
            zIndex: theme_mui.zIndex.drawer + 1,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            boxShadow: "0 4px 20px 0 rgba(0,0,0,0.12)",
          }}
        >
          <Toolbar>
            <IconButton
              color='inherit'
              edge='start'
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ mr: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <BarChart3 size={24} style={{ marginRight: 12 }} />
            <Typography
              variant='h6'
              component='div'
              sx={{ flexGrow: 1, fontWeight: 600 }}
            >
              AI Intelligence Dashboard
            </Typography>

            <Button
              color='inherit'
              startIcon={<Plus size={18} />}
              onClick={handleCreateReport}
              sx={{
                mr: 2,
                bgcolor: "rgba(255, 255, 255, 0.1)",
                "&:hover": { bgcolor: "rgba(255, 255, 255, 0.2)" },
                display: { xs: "none", sm: "flex" },
              }}
              disabled={currentUser.role === "viewer"}
            >
              Create Report
            </Button>

            <Avatar
              src={currentUser.avatar}
              onClick={handleProfileMenuOpen}
              sx={{ cursor: "pointer", width: 36, height: 36 }}
            >
              <User size={18} />
            </Avatar>

            <Menu
              anchorEl={profileMenuAnchor}
              open={Boolean(profileMenuAnchor)}
              onClose={handleProfileMenuClose}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleProfileMenuClose}>
                <User size={16} style={{ marginRight: 8 }} />
                Profile
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <Settings size={16} style={{ marginRight: 8 }} />
                Settings
              </MenuItem>
              <MenuItem onClick={handleProfileMenuClose}>
                <LogOut size={16} style={{ marginRight: 8 }} />
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Drawer
          variant='permanent'
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: 350,
              boxSizing: "border-box",
              mt: "64px",
              height: "calc(100vh - 64px)",
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
        >
          {sidebarContent}
        </Drawer>

        <Drawer
          variant='temporary'
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: 350,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          {sidebarContent}
        </Drawer>

        <Box
          component='main'
          sx={{
            flexGrow: 1,
            ml: { md: "350px" },
            mt: "64px",
            p: 3,
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Container maxWidth='xl'>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant='h4'
                sx={{
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  mb: 1,
                }}
              >
                Welcome back, {currentUser.name}!
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Manage your reports and leverage AI-powered insights
              </Typography>
            </Box>

            <SearchFilter />

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredReports.map((r) => r.id)}
                strategy={verticalListSortingStrategy}
              >
                <Grid container spacing={3}>
                  {filteredReports.map((report) => (
                    <Grid item xs={12} sm={6} lg={4} key={report.id}>
                      <ReportCard
                        report={report}
                        onEdit={handleEditReport}
                        onView={handleViewReport}
                      />
                    </Grid>
                  ))}
                </Grid>
              </SortableContext>
            </DndContext>

            {filteredReports.length === 0 && (
              <Box
                sx={{
                  textAlign: "center",
                  py: 8,
                  background:
                    "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
                  borderRadius: 3,
                  border: "2px dashed",
                  borderColor: "primary.main",
                }}
              >
                <BarChart3
                  size={64}
                  style={{ opacity: 0.3, marginBottom: 16 }}
                />
                <Typography variant='h6' sx={{ mb: 1 }}>
                  No reports found
                </Typography>
                <Typography
                  variant='body2'
                  color='text.secondary'
                  sx={{ mb: 3 }}
                >
                  Create your first report to get started with AI-powered
                  insights
                </Typography>
                {currentUser.role === "admin" && (
                  <Button
                    variant='contained'
                    startIcon={<Plus size={18} />}
                    onClick={handleCreateReport}
                    size='large'
                  >
                    Create Your First Report
                  </Button>
                )}
              </Box>
            )}
          </Container>
        </Box>

        {currentUser.role === "admin" && (
          <Fab
            color='primary'
            onClick={handleCreateReport}
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              display: { sm: "none" },
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            <Plus size={24} />
          </Fab>
        )}

        <ReportEditor
          open={editorOpen}
          onClose={() => setEditorOpen(false)}
          report={selectedReport}
          mode={editorMode}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;
