/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Search, SortAsc, SortDesc } from "lucide-react";
import { useReportStore } from "../store/reportStore";

export const SearchFilter: React.FC = () => {
  const {
    searchQuery,
    filterStatus,
    sortBy,
    sortOrder,
    setSearchQuery,
    setFilterStatus,
    setSortBy,
    setSortOrder,
  } = useReportStore();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        mb: 3,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: 2,
      }}
    >
      <Box
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
      >
        <TextField
          placeholder='Search reports...'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant='outlined'
          size='small'
          sx={{
            minWidth: 300,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "white",
              borderRadius: 2,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size='small' sx={{ minWidth: 120 }}>
          <InputLabel
            sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
          >
            Status
          </InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            label='Status'
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            <MenuItem value='all'>All</MenuItem>
            <MenuItem value='draft'>Draft</MenuItem>
            <MenuItem value='published'>Published</MenuItem>
          </Select>
        </FormControl>

        <FormControl size='small' sx={{ minWidth: 120 }}>
          <InputLabel
            sx={{ color: "white", "&.Mui-focused": { color: "white" } }}
          >
            Sort By
          </InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            label='Sort By'
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              color: "white",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.3)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255, 255, 255, 0.5)",
              },
              "& .MuiSvgIcon-root": {
                color: "white",
              },
            }}
          >
            <MenuItem value='updatedAt'>Last Updated</MenuItem>
            <MenuItem value='createdAt'>Created Date</MenuItem>
            <MenuItem value='title'>Title</MenuItem>
          </Select>
        </FormControl>

        <IconButton
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
          sx={{
            color: "white",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          {sortOrder === "asc" ? <SortAsc size={20} /> : <SortDesc size={20} />}
        </IconButton>
      </Box>
    </Paper>
  );
};
