import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  Container,
  CssBaseline,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ChevronDown, ChevronUp, Menu as MenuIcon, MoonStar, SunMedium } from "lucide-react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { personalInfo } from "./data/portfolioData";
import HomePage from "./sections/HomePage";
import ProjectsPage from "./sections/ProjectsPage";

const sections = [
  { label: "Home", id: "home" },
  { label: "About", id: "about" },
  { label: "Featured", id: "featured-project" },
  { label: "Photography", id: "photography" },
  { label: "Contact", id: "contact" }
];

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState(() => localStorage.getItem("portfolio-theme") || "light");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [resumeAnchor, setResumeAnchor] = useState(null);
  const [mobileResumeOpen, setMobileResumeOpen] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: mode === "dark" ? "#ff8d5d" : "#d95d39" },
          secondary: { main: mode === "dark" ? "#d8d1bf" : "#1b1b18" },
          background: {
            default: mode === "dark" ? "#111111" : "#f6f0e7",
            paper: mode === "dark" ? "rgba(23, 23, 22, 0.88)" : "rgba(255, 252, 247, 0.9)"
          },
          text: {
            primary: mode === "dark" ? "#f4efe8" : "#171714",
            secondary: mode === "dark" ? "#cbc1b1" : "#575046"
          },
          divider: mode === "dark" ? "rgba(244, 239, 232, 0.12)" : "rgba(23, 23, 20, 0.1)"
        },
        typography: {
          fontFamily: '"Manrope", sans-serif',
          h1: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
          h2: { fontFamily: '"Syne", sans-serif', fontWeight: 800 },
          h3: { fontFamily: '"Syne", sans-serif', fontWeight: 700 },
          button: { textTransform: "none", fontWeight: 700 }
        },
        shape: { borderRadius: 28 },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                paddingInline: 22,
                paddingBlock: 12
              }
            }
          },
          MuiChip: {
            styleOverrides: {
              root: {
                borderRadius: 999,
                fontWeight: 700
              }
            }
          }
        }
      }),
    [mode]
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("portfolio-theme", mode);
  }, [mode]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);

  const scrollToSection = useCallback((sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const navigateSection = useCallback(
    (sectionId) => {
      setDrawerOpen(false);
      setMobileResumeOpen(false);
      if (location.pathname !== "/") {
        sessionStorage.setItem("pending-section", sectionId);
        navigate("/");
        return;
      }
      scrollToSection(sectionId);
    },
    [location.pathname, navigate, scrollToSection]
  );

  const flushPendingSection = useCallback(() => {
    const target = sessionStorage.getItem("pending-section");
    if (!target) {
      return;
    }
    sessionStorage.removeItem("pending-section");
    window.setTimeout(() => scrollToSection(target), 150);
  }, [scrollToSection]);

  const navItems = (
    <>
      {sections.map((section) => (
        <Button key={section.id} color="inherit" onClick={() => navigateSection(section.id)}>
          {section.label}
        </Button>
      ))}
      <Button color="inherit" onClick={() => navigate("/projects")}>
        Projects
      </Button>
      <Button color="inherit" onClick={(event) => setResumeAnchor(event.currentTarget)}>
        Resume
      </Button>
    </>
  );

  return (

    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className={`app-root ${mode}`}>
        <Box className="ambient ambient-one" />
        <Box className="ambient ambient-two" />
        <Box className="grid-noise" />

        <AppBar position="sticky" elevation={0} className="topbar">
          <Container maxWidth="xl">
            <Toolbar disableGutters className="toolbar-shell">
              <Typography component="button" type="button" onClick={() => navigate("/")} className="brand-mark brand-button">
                My Portfolio
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" className="desktop-nav">
                {navItems}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center">
                {location.pathname === "/projects" && (
                  <IconButton color="inherit" className="mobile-only mobile-back-button" onClick={() => navigate("/")}>
                    <ArrowLeft size={20} />
                  </IconButton>
                )}
                <IconButton color="inherit" onClick={() => setMode((current) => (current === "dark" ? "light" : "dark"))}>
                  {mode === "dark" ? <SunMedium size={20} /> : <MoonStar size={20} />}
                </IconButton>
                <IconButton color="inherit" className="mobile-only mobile-menu-button" onClick={() => setDrawerOpen(true)}>
                  <MenuIcon size={20} />
                </IconButton>
              </Stack>
            </Toolbar>
          </Container>
        </AppBar>

        <Menu
          anchorEl={resumeAnchor}
          open={Boolean(resumeAnchor)}
          onClose={() => setResumeAnchor(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 2,
              minWidth: 180,
              width: 192,
              borderRadius: 3,
              p: 0.5,
              boxShadow: 24,
              border: (theme) =>
                theme.palette.mode === 'dark'
                  ? '1.5px solid rgba(63,63,70,0.32)'
                  : '1.5px solid rgba(255,255,255,0.20)',
              bgcolor: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'rgba(24,24,27,0.80)'
                  : 'rgba(255,255,255,0.80)',
              backdropFilter: (theme) =>
                theme.palette.mode === 'dark'
                  ? 'blur(16px)'
                  : 'blur(8px)',
              transition: 'all 150ms cubic-bezier(.4,0,.2,1)',
              animation: 'resumeDropdownFadeIn 150ms cubic-bezier(.4,0,.2,1)'
            }
          }}
          MenuListProps={{
            sx: {
              p: 0,
            }
          }}
        >
          <style>
            {`
              @keyframes resumeDropdownFadeIn {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
              }
            `}
          </style>
          <MenuItem
            component={Link}
            href={personalInfo.resumes[0].href}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
            onClick={() => setResumeAnchor(null)}
            sx={{
              width: '100%',
              px: 4,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderRadius: 3,
              fontSize: '0.95rem',
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? '#e4e4e7'
                  : '#374151',
              fontWeight: 500,
              transition: 'all 150ms',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(39,39,42,0.95)'
                    : 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M17.5 6.5 6.5 17.5"/></svg>
            <span>View Resume</span>
          </MenuItem>
          <MenuItem
            component={Link}
            href={personalInfo.resumes[0].href}
            download
            underline="none"
            onClick={() => setResumeAnchor(null)}
            sx={{
              width: '100%',
              px: 4,
              py: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              borderRadius: 3,
              fontSize: '0.95rem',
              color: (theme) =>
                theme.palette.mode === 'dark'
                  ? '#e4e4e7'
                  : '#374151',
              fontWeight: 500,
              transition: 'all 150ms',
              '&:hover': {
                bgcolor: (theme) =>
                  theme.palette.mode === 'dark'
                    ? 'rgba(39,39,42,0.95)'
                    : 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
            <span>Download Resume</span>
          </MenuItem>
        </Menu>

        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ className: "mobile-drawer" }}>
          <Box sx={{ width: 280, p: 2 }}>
            <List>
              <ListItemButton
                onClick={() => {
                  if (location.pathname === "/projects") {
                    navigate("/");
                  }
                  setDrawerOpen(false);
                  setMobileResumeOpen(false);
                }}
              >
                <ArrowLeft size={16} style={{ marginRight: 10 }} />
                <ListItemText primary={location.pathname === "/projects" ? "Back to Home" : "Close Menu"} />
              </ListItemButton>
              {sections.map((section) => (
                <ListItemButton key={section.id} onClick={() => navigateSection(section.id)}>
                  <ListItemText primary={section.label} />
                </ListItemButton>
              ))}
              <ListItemButton onClick={() => { setDrawerOpen(false); setMobileResumeOpen(false); navigate("/projects"); }}>
                <ListItemText primary="Projects" />
              </ListItemButton>
              <ListItemButton onClick={() => setMobileResumeOpen((open) => !open)} className="mobile-resume-toggle">
                <ListItemText primary="Resume" />
                {mobileResumeOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </ListItemButton>
              <Collapse in={mobileResumeOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <ListItemButton
                    component={Link}
                    href={personalInfo.resumes[0].href}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="none"
                    className="mobile-resume-item"
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      px: 2.5,
                      py: 1.2,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      letterSpacing: '0.01em',
                      '&:hover': {
                        background: (theme) => theme.palette.mode === 'dark' ? '#2a1a13' : '#f6e7d7',
                      }
                    }}
                  >
                    <ListItemText primary="View Resume" />
                  </ListItemButton>
                  <ListItemButton
                    component={Link}
                    href={personalInfo.resumes[0].href}
                    download
                    underline="none"
                    className="mobile-resume-item"
                    onClick={() => setDrawerOpen(false)}
                    sx={{
                      borderRadius: 2,
                      px: 2.5,
                      py: 1.2,
                      fontWeight: 700,
                      fontSize: '1.05rem',
                      letterSpacing: '0.01em',
                      '&:hover': {
                        background: (theme) => theme.palette.mode === 'dark' ? '#2a1a13' : '#f6e7d7',
                      }
                    }}
                  >
                    <ListItemText primary="Download Resume" />
                  </ListItemButton>
                </List>
              </Collapse>
            </List>
          </Box>
        </Drawer>

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <HomePage onNavigateProjects={() => navigate("/projects")} onScrollReady={flushPendingSection} />
                </motion.div>
              }
            />
            <Route
              path="/projects"
              element={
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ProjectsPage onGoHome={() => navigate("/")} />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>

        <Box component="footer" className="footer-bar">
          <Typography>
              {`(c) 2026 ${personalInfo.name}.`}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
