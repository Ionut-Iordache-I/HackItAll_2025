import React, { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  CssBaseline,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

function AccessibilityDashboard() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [disabilityType, setDisabilityType] = useState('visual');
  const [darkMode, setDarkMode] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/dev/website', {
        url,
        mapping: {
          "meta-viewport-large": 2,
          "link-in-text-block": 3,
          "color-contrast": 5
        },
      });

      console.log(response)

      setReport(response.data);
    } catch (error) {
      console.error('Error fetching accessibility report', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 5 }}>
        <Typography variant="h4" gutterBottom>
          Accessibility Dashboard
        </Typography>

        <FormControlLabel
          control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
          label="Dark Mode"
        />

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Enter URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="disability-label">Disability Type</InputLabel>
            <Select
              labelId="disability-label"
              value={disabilityType}
              label="Disability Type"
              onChange={(e) => setDisabilityType(e.target.value)}
            >
              <MenuItem value="visual">Visual Impairment</MenuItem>
              <MenuItem value="motor">Motor Disability</MenuItem>
              <MenuItem value="cognitive">Cognitive Disability</MenuItem>
              <MenuItem value="hearing">Hearing Impairment</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Test URL
          </Button>
        </Box>

        {report && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Accessibility Issues
            </Typography>
            <List>
              {report.violations.map((violation, index) => (
                <ListItem key={index} alignItems="flex-start">
                  <ListItemText
                    primary={violation.id}
                    secondary={violation.description}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default AccessibilityDashboard;