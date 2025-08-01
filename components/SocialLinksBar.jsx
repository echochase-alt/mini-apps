import { Instagram, Coffee, Favorite, MusicNote } from '@mui/icons-material';
import { Box, Grid, Typography, Link as MuiLink, Divider } from '@mui/material';

const socialLinks = [
  {
    icon: <Instagram fontSize="large" />,
    label: 'Instagram',
    href: 'https://www.instagram.com/echocodez',
  },
  {
    icon: <MusicNote fontSize="large" />,
    label: 'TikTok',
    href: 'https://www.tiktok.com/@echo_codez',
  },
  {
    icon: <Favorite fontSize="large" />,
    label: 'Patreon',
    href: 'https://www.patreon.com/echocodez',
  },
  {
    icon: <Coffee fontSize="large" />,
    label: 'Buy Me a Coffee',
    href: 'https://www.buymeacoffee.com/echocodez',
  },
];

export function SocialLinksBar() {
  return (
    <Box sx={{ width: '100%', marginTop: '50px' }}>
      <Divider
        sx={{
          marginBottom: 3,
          fontSize: '0.8rem',
          fontFamily: '"Inter", sans-serif',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.8)',
          '&::before, &::after': {
            borderColor: 'rgba(255,255,255,0.2)',
          },
        }}
      >
        SOCIAL LINKS
      </Divider>

      <Grid container justifyContent="center" spacing={4}>
        {socialLinks.map((link, i) => (
          <Grid item key={i} sx={{ textAlign: 'center' }}>
            <MuiLink
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              underline="none"
              color="inherit"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s, color 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                  color: '#ffecb3', // soft warm highlight
                },
              }}
            >
              {link.icon}
              <Typography variant="caption" sx={{ marginTop: 0.5, fontSize: '0.75rem' }}>
                {link.label}
              </Typography>
            </MuiLink>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
