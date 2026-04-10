import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Stack,
  Typography
} from "@mui/material";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { projects } from "../data/portfolioData";

const projectLensNotes = [
  "Built to translate a technical workflow into something intuitive and dependable for real users.",
  "Focuses on measurable usefulness first, then layers thoughtful implementation and polish.",
  "Balances engineering clarity with experimentation to keep both performance and creativity in view.",
  "Keeps scope practical while still showing craftsmanship in architecture, UI, and delivery flow."
];

const projectHeroQuotes = [
  "Deployment is where every TODO turns into a personality test; these builds survived the mood swings.",
  "Local success is cute, but post-deploy stability is the real flex every developer respects.",
  "After deployment, users find edge cases faster than any test suite; these projects learned to handle it.",
  "The code looked perfect before shipping, then production gave feedback in all caps; this is the improved version.",
  "Anyone can ship v1, but surviving post-deploy fixes without rewriting everything is where the craft shows."
];

export default function ProjectsPage({ onGoHome }) {
  const projectHeroQuote = useMemo(() => {
    return projectHeroQuotes[Math.floor(Math.random() * projectHeroQuotes.length)];
  }, []);

  return (
    <Box className="page-shell projects-shell editorial-shell">
      <Container maxWidth="xl">
        <Box className="projects-hero projects-hero-editorial">
          <Box>
            <Box className="projects-kicker-row">
              <IconButton className="projects-back-icon" onClick={onGoHome} aria-label="Back to home">
                <ArrowLeft size={16} />
              </IconButton>
              <Typography className="section-eyebrow">Projects</Typography>
            </Box>
            <Typography component="h1" className="section-title projects-title-editorial">
              <span className="projects-title-line">Projects that ship,</span>
              <span className="projects-title-line">skills that hold up.</span>
            </Typography>
          </Box>
          <Box className="projects-hero-side">
            <Typography className="section-subtitle">{projectHeroQuote}</Typography>
          </Box>
        </Box>

        <Stack spacing={3.2}>
          {projects.map((project, index) => (
            <Card
              key={project.title}
              component={motion.div}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className={`project-card project-card-editorial ${index % 2 === 1 ? "project-card-offset" : ""}`}
            >
              <CardContent>
                <Box className="project-layout project-layout-editorial">
                  <Box className="project-index-block">
                    <Typography className="project-index">0{index + 1}</Typography>
                    <Chip label={project.category} className="project-category" />
                  </Box>
                  <Box>
                    <Typography className="project-title">{project.title}</Typography>
                    <Typography className="project-description">{project.description}</Typography>
                    <Box className="chip-wrap project-chip-wrap" sx={{ mt: 2.5 }}>
                      {project.tech.map((item) => (
                        <Chip key={item} label={item} />
                      ))}
                    </Box>
                  </Box>
                  <Stack justifyContent="space-between" alignItems={{ xs: "flex-start", lg: "flex-end" }} gap={2}>
                    <Box className="project-meta-stack">
                      <Typography className="mini-heading">Project Lens</Typography>
                      <Typography className="project-side-note project-side-note-editorial">
                        {projectLensNotes[index % projectLensNotes.length]}
                      </Typography>
                      <Box className="project-metric-row">
                        <Typography>Stack depth</Typography>
                        <Typography>{project.tech.length} tools</Typography>
                      </Box>
                    </Box>
                    <Button href={project.link} target="_blank" rel="noopener noreferrer" variant="contained" endIcon={<ExternalLink size={18} />}>
                      Open GitHub
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
