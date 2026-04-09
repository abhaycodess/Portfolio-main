import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Copy,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Target
} from "lucide-react";
import {
  featuredProject,
  goals,
  personalInfo,
  photographyDescription,
  photos,
  statHighlights,
  strengths,
  techGroups
} from "../data/portfolioData";
import PhotoCarousel from "../components/PhotoCarousel";
import ImagePreviewModal from "../components/ImagePreviewModal";

const cardMotion = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: "easeOut" } }
};

function MotionCard({ children, className = "", ...props }) {
  return (
    <Card
      component={motion.div}
      variants={cardMotion}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className={className}
      {...props}
    >
      {children}
    </Card>
  );
}

export default function HomePage({ onNavigateProjects, onScrollReady }) {
  const [typedName, setTypedName] = useState("");
  const [contactOpen, setContactOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [snackbar, setSnackbar] = useState("");
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  useEffect(() => {
    let index = 0;
    setTypedName("");
    const timer = window.setInterval(() => {
      index += 1;
      setTypedName(personalInfo.name.slice(0, index));
      if (index >= personalInfo.name.length) {
        window.clearInterval(timer);
      }
    }, 85);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (onScrollReady) {
      onScrollReady();
    }
  }, [onScrollReady]);

  const currentPhoto = useMemo(() => {
    if (previewIndex === null) {
      return null;
    }
    return photos[previewIndex];
  }, [previewIndex]);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(personalInfo.phone);
      setSnackbar("Phone number copied to clipboard.");
    } catch {
      setSnackbar("Unable to copy the phone number on this device.");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const subject = encodeURIComponent(formState.subject);
    const body = encodeURIComponent(
      `Hi Abhay,\n\nName: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}\n\nBest regards`
    );
    window.location.href = `mailto:${personalInfo.email}?subject=${subject}&body=${body}`;
    setContactOpen(false);
    setSnackbar("Opening your email client.");
  };

  return (
    <Box className="page-shell editorial-shell">
      <Container maxWidth="xl">
        <Box id="home" className="hero-section hero-editorial section-anchor">
          <motion.div
            className="hero-copy"
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Chip
              icon={<Sparkles size={16} />}
              label="Creative developer with a cinematic visual language"
              className="glow-chip"
            />
            <Typography className="hero-kicker">{personalInfo.heroIntro}</Typography>
            <Typography className="hero-lead">{personalInfo.heroLead}</Typography>
            <Typography component="h1" className="hero-title editorial-title">
              {typedName}
              <Box component="span" className="cursor-blink">
                |
              </Box>
            </Typography>
            <Typography className="hero-role">{personalInfo.role}</Typography>
            <Typography className="hero-description hero-description-wide">{personalInfo.statement}</Typography>
            <Box className="hero-annotation">
              <Typography className="mini-heading">Editorial Note</Typography>
              <Typography>He treats every build like a published spread: narrative first, interaction second, polish always.</Typography>
            </Box>

            <Box className="hero-mini-grid">
              <Box className="hero-mini-card">
                <Typography className="mini-heading">Current Focus</Typography>
                <Typography>Modern web interfaces, AI-led products, and visual storytelling that feels crafted.</Typography>
              </Box>
              <Box className="hero-mini-card hero-mini-card-accent hero-mini-card-location">
                <Stack direction="row" spacing={0.75} alignItems="center" className="mini-heading mini-heading-location">
                  <MapPin size={14} />
                  <Typography component="span" className="mini-heading-text">
                    Based In
                  </Typography>
                </Stack>
                <Typography>{personalInfo.location}</Typography>
              </Box>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.2} className="hero-actions hero-actions-editorial">
              <Button variant="contained" size="large" onClick={onNavigateProjects} endIcon={<ArrowRight size={18} />}>
                View Projects
              </Button>
              <Button variant="outlined" size="large" onClick={() => setContactOpen(true)}>
                Contact Him
              </Button>
            </Stack>
          </motion.div>

          <motion.div
            className="hero-visual-stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.15 }}
          >
            <Box className="hero-rhythm-lines" />
            <Box className="hero-stage-frame main-frame">
              <Avatar src={personalInfo.profileImage} alt={personalInfo.name} className="profile-avatar large" />
              <Box className="hero-stage-caption">
                <Typography className="mini-heading">Portrait</Typography>
                <Typography>{personalInfo.name}</Typography>
              </Box>
            </Box>
            <Box className="hero-stage-quote">
              <Typography className="mini-heading">Approach</Typography>
              <Typography>Build with clarity. Design with rhythm. Ship with intent.</Typography>
            </Box>
          </motion.div>
        </Box>

        <Box className="stats-strip stats-editorial">
          {statHighlights.map((stat) => (
            <motion.div key={stat.label} variants={cardMotion} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <Box className="stat-card stat-card-editorial">
                <Typography className="stat-value">{stat.value}</Typography>
                <Typography className="stat-label">{stat.label}</Typography>
              </Box>
            </motion.div>
          ))}
        </Box>

        <Box className="section-transition" aria-hidden="true" />

        <Box id="about" className="section-block section-anchor about-editorial">
          <Box className="section-heading editorial-heading">
            <Typography className="section-eyebrow">About</Typography>
            <Typography component="h2" className="section-title">
              Technical depth with an eye for form, pacing, and atmosphere
            </Typography>
            <Typography className="section-subtitle">
              He is building a portfolio that reflects both sides of the work: problem solving in software and composition in visual storytelling.
            </Typography>
          </Box>

          <Box className="three-grid editorial-grid">
            <MotionCard className="glass-card editorial-card tall-card">
              <CardContent>
                <Typography className="card-kicker">Who He Is</Typography>
                <Typography className="card-title">{personalInfo.name}</Typography>
                <Typography className="card-subtitle">{personalInfo.education}</Typography>
                <Typography className="card-body">{personalInfo.aboutDescription}</Typography>
              </CardContent>
            </MotionCard>

            <MotionCard className="glass-card editorial-card">
              <CardContent>
                <Typography className="card-kicker">Tech Stack</Typography>
                <Stack spacing={2.2} sx={{ mt: 2 }}>
                  {techGroups.map((group) => (
                    <Box key={group.title} className="stack-group">
                      <Typography className="mini-heading">{group.title}</Typography>
                      <Box className="chip-wrap">
                        {group.items.map((item) => (
                          <Chip key={item} label={item} />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </MotionCard>

            <MotionCard className="glass-card editorial-card">
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" marginBottom={2}>
                  <Target size={18} />
                  <Typography className="card-kicker">Career Goals</Typography>
                </Stack>
                <Stack spacing={1.3}>
                  {goals.map((goal) => (
                    <Box key={goal} className="goal-item">
                      <Box className="goal-dot" />
                      <Typography>{goal}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </MotionCard>
          </Box>

          <Box className="strengths-grid strengths-editorial">
            {strengths.map((strength, index) => (
              <motion.div key={strength.title} variants={cardMotion} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <Box className="strength-card strength-card-editorial">
                  <Typography className="strength-index">0{index + 1}</Typography>
                  <Typography className="mini-heading">{strength.title}</Typography>
                  <Typography>{strength.description}</Typography>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        <Box className="section-transition" aria-hidden="true" />

        <Box id="featured-project" className="section-block section-anchor">
          <Box className="featured-editorial-shell">
            <Box className="featured-project-intro">
              <Typography className="section-eyebrow">{featuredProject.eyebrow}</Typography>
              <Typography component="h2" className="section-title">
                {featuredProject.title}
              </Typography>
              <Typography className="section-subtitle">{featuredProject.subtitle}</Typography>
            </Box>

            <MotionCard className="feature-spotlight feature-spotlight-editorial">
              <CardContent>
                <Box className="feature-layout feature-layout-editorial">
                  <Box>
                    <Typography className="feature-number">01</Typography>
                    <Typography className="feature-copy">{featuredProject.description}</Typography>
                    <Box className="chip-wrap feature-chip-wrap" sx={{ mt: 3 }}>
                      {featuredProject.stack.map((item) => (
                        <Chip key={item} label={item} />
                      ))}
                    </Box>
                  </Box>
                  <Stack spacing={2}>
                    {featuredProject.details.map((detail) => (
                      <Box key={detail.label} className="detail-panel detail-panel-editorial">
                        <Typography className="mini-heading">{detail.label}</Typography>
                        <Typography>{detail.value}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 4 }}>
                  <Button
                    href={featuredProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                    endIcon={<ExternalLink size={18} />}
                  >
                    View on GitHub
                  </Button>
                  <Button variant="outlined" onClick={onNavigateProjects}>
                    See More Projects
                  </Button>
                </Stack>
              </CardContent>
            </MotionCard>
          </Box>
        </Box>

        <Box className="section-transition" aria-hidden="true" />

        <Box id="photography" className="section-block section-anchor">
          <Box className="section-heading editorial-heading wide-heading">
            <Typography className="section-eyebrow">Creative Vision</Typography>
            <Typography component="h2" className="section-title">
              A photography section that feels like a curated spread, not just a gallery dump
            </Typography>
            <Typography className="section-subtitle">{photographyDescription}</Typography>
          </Box>

          <Box className="carousel-attention-note" role="note" aria-label="Photography viewing tip">
            <Typography className="carousel-attention-kicker">Viewer Advisory</Typography>
            <Typography className="carousel-attention-text">
              Mobile is cute. Desktop is where these frames stop being photos and start being cinema.
            </Typography>
          </Box>

          <PhotoCarousel photos={photos} onPhotoClick={setPreviewIndex} />
        </Box>

        <Box className="section-transition" aria-hidden="true" />

        <Box id="contact" className="section-block section-anchor">
          <MotionCard className="contact-panel contact-panel-editorial">
            <CardContent>
              <Box className="contact-layout contact-layout-editorial">
                <Box>
                  <Typography className="section-eyebrow">Contact</Typography>
                  <Typography component="h2" className="section-title compact">
                    Open to collaboration across product, AI, and creative work
                  </Typography>
                  <Typography className="section-subtitle compact">
                    Reach out for projects, internships, collaborations, or anything at the intersection of technology and visual direction.
                  </Typography>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mt: 3 }}>
                    <Button variant="contained" onClick={() => setContactOpen(true)}>
                      Connect with him
                    </Button>
                    <Button href={`mailto:${personalInfo.email}`} variant="outlined">
                      Email Directly
                    </Button>
                  </Stack>
                </Box>
                <Stack spacing={1.5}>
                  <Box className="social-card social-card-editorial">
                    <Mail size={18} />
                    <Link href={`mailto:${personalInfo.email}`} underline="none">
                      {personalInfo.email}
                    </Link>
                  </Box>
                  <Box className="social-card social-card-editorial">
                    <Github size={18} />
                    <Link href={personalInfo.github} target="_blank" rel="noopener noreferrer" underline="none">
                      GitHub Profile
                    </Link>
                  </Box>
                  <Box className="social-card social-card-editorial">
                    <Linkedin size={18} />
                    <Link href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" underline="none">
                      LinkedIn Profile
                    </Link>
                  </Box>
                  <Box className="social-card social-card-editorial action-card" onClick={handleCopyPhone}>
                    <Phone size={18} />
                    <Typography>{personalInfo.phone}</Typography>
                    <Copy size={16} />
                  </Box>
                </Stack>
              </Box>
            </CardContent>
          </MotionCard>
        </Box>
      </Container>

      <Dialog open={contactOpen} onClose={() => setContactOpen(false)} maxWidth="sm" fullWidth PaperProps={{ className: "dialog-shell" }}>
        <DialogTitle>Send him a message</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} className="contact-form">
            <TextField
              label="Your Name"
              value={formState.name}
              onChange={(event) => setFormState({ ...formState, name: event.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Email Address"
              type="email"
              value={formState.email}
              onChange={(event) => setFormState({ ...formState, email: event.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Subject"
              value={formState.subject}
              onChange={(event) => setFormState({ ...formState, subject: event.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Your Message"
              value={formState.message}
              onChange={(event) => setFormState({ ...formState, message: event.target.value })}
              required
              fullWidth
              multiline
              minRows={5}
            />
            <Button type="submit" variant="contained">
              Send Message
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ImagePreviewModal
        open={previewIndex !== null}
        src={currentPhoto?.src ?? ""}
        title={currentPhoto?.title ?? ""}
        index={previewIndex}
        total={photos.length}
        onPrev={() => setPreviewIndex((current) => (current - 1 + photos.length) % photos.length)}
        onNext={() => setPreviewIndex((current) => (current + 1) % photos.length)}
        onClose={() => setPreviewIndex(null)}
      />

      <Snackbar open={Boolean(snackbar)} autoHideDuration={2500} onClose={() => setSnackbar("")}>
        <Alert severity="info" variant="filled" onClose={() => setSnackbar("")}>
          {snackbar}
        </Alert>
      </Snackbar>
    </Box>
  );
}
