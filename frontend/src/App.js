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
import { CircularProgress } from '@mui/material';

function AccessibilityDashboard() {
  const [url, setUrl] = useState('');
  const [report, setReport] = useState(null);
  const [disabilityType, setDisabilityType] = useState('visual');
  const [darkMode, setDarkMode] = useState(false);
  const [percentage, setPercentage] = useState(null);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8081/dev/website', {
        url,
        "disability": disabilityType
      });

      console.log(response)

      setReport(response.data);
      setPercentage(response.data.percent);
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
              <MenuItem value="blindness">Blindness</MenuItem>
              <MenuItem value="low_vision">Low Vision</MenuItem>
              <MenuItem value="red_color_blindness">Red Color Blindness</MenuItem>
              <MenuItem value="green_color_blindness">Green Color Blindness</MenuItem>
              <MenuItem value="blue_color_blindness">Blue Color Blindness</MenuItem>
              <MenuItem value="night_blindness">Night Blindness</MenuItem>
              <MenuItem value="dyslexia">Dyslexia</MenuItem>
              <MenuItem value="adhd">ADHD</MenuItem>
              <MenuItem value="autism">Autism</MenuItem>
              <MenuItem value="memory_impairments">Memory Impairments</MenuItem>
              <MenuItem value="intellectual_disabilities">Intellectual Disabilities</MenuItem>
              <MenuItem value="limited_dexterity">Limited Dexterity</MenuItem>
              <MenuItem value="paralysis">Paralysis</MenuItem>
              <MenuItem value="tremors">Tremors</MenuItem>
              <MenuItem value="amputation">Amputation</MenuItem>
              <MenuItem value="deafness">Deafness</MenuItem>
              <MenuItem value="hard_hearing">Hard Hearing</MenuItem>
              <MenuItem value="tinnitus">Tinnitus</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" color="primary" type="submit" fullWidth>
            Check URL
          </Button>
        </Box>

        {percentage !== null && (
  <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={3}>
    <Typography variant="body1" sx={{ mb: 1 }}>
      Accessibility Score: {percentage}%
    </Typography>
    <Box position="relative" display="inline-flex">
      <CircularProgress variant="determinate" value={percentage} size={100} />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" component="div" color="textSecondary">
          {`${percentage}%`}
        </Typography>
      </Box>
    </Box>
  </Box>
)}

        {report && (
  <Paper elevation={3} sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>
      Accessibility Issues
    </Typography>

    {Object.entries(report.violationDetails).map(([violationKey, violationData]) => (
      <Box key={violationKey} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold">
          ❌ {violationData.id} ({violationData.impact})
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>{violationData.description}</Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          <strong>More Info:</strong>{' '}
          <a href={violationData.helpUrl} target="_blank" rel="noopener noreferrer">
            {violationData.help}
          </a>
        </Typography>

        {violationData.nodes.map((node, index) => (
          <Box key={index} sx={{ mt: 2, p: 1, backgroundColor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Target:</strong> {node.target?.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>HTML:</strong> <code>{node.html}</code>
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              <strong>Failure Summary:</strong><br />
              {node.failureSummary}
            </Typography>

            {/* Show color-contrast data if available */}
            {node.any?.[0]?.data?.contrastRatio && (
              <Box sx={{ mt: 1, fontSize: '0.875rem' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Contrast Details:</strong>
                </Typography>
                <ul>
                  <li>Foreground Color: {node.any[0].data.fgColor}</li>
                  <li>Background Color: {node.any[0].data.bgColor}</li>
                  <li>Contrast Ratio: {node.any[0].data.contrastRatio}</li>
                  <li>Expected: {node.any[0].data.expectedContrastRatio}</li>
                  <li>Font Size: {node.any[0].data.fontSize}</li>
                  <li>Font Weight: {node.any[0].data.fontWeight}</li>
                </ul>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    ))}
  </Paper>
)}
      </Container>
    </ThemeProvider>
  );
}

export default AccessibilityDashboard;