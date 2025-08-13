import { Box, Typography, Paper, Button, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import { Bubbles } from "../components/Bubbles";

export const WallOfFame = () => {
  const navigate = useNavigate();

  const donationFollowers = [
    "@simping.sam",
    "@skzd.fx",
    "@cpu_neppu",
    "Sexy Albino",
    "@serpentkingnick",
    "@jordan2236228837",
    "@tinklewad",
    "@inevitableikari",
    "Rhett McCutcheon",
    "Eric Hernandez",
  ];

  const champions = [
    "@petacekfetacek",
    "@martinooski",
    "@realisticallyjai",
    "@pandamonium124",
  ];

  const friendsOfPage = [
    "@minifiguremerc",
  ];

  const friendlyGlow = keyframes`
    0% { text-shadow: 0 0 6px rgba(255, 182, 193, 0.7), 0 0 12px rgba(255, 182, 193, 0.5); }
    50% { text-shadow: 0 0 15px rgba(255, 192, 203, 1), 0 0 30px rgba(255, 192, 203, 0.8); }
    100% { text-shadow: 0 0 6px rgba(255, 182, 193, 0.7), 0 0 12px rgba(255, 182, 193, 0.5); }
  `;

  const pastBosses = [
    "@liauo09",
    "LeBron James",
    "@janmevius",
    "@rmaanomaly",
    "Sneaky Golem in the Pocket",
    "@tinklewad",
    "@cpu_neppu",
    "@inevitableikari",
  ];

  const goldGlow = keyframes`
    0% { text-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 0 0 12px rgba(255, 215, 0, 0.4); }
    50% { text-shadow: 0 0 12px rgba(255, 215, 0, 1), 0 0 24px rgba(255, 215, 0, 0.8); }
    100% { text-shadow: 0 0 6px rgba(255, 215, 0, 0.6), 0 0 12px rgba(255, 215, 0, 0.4); }
  `;

  const diamondGlow = keyframes`
    0% { text-shadow: 0 0 6px rgba(180, 70, 70, 0.6), 0 0 12px rgba(180, 70, 70, 0.4); }
    50% { text-shadow: 0 0 12px rgba(220, 90, 90, 1), 0 0 24px rgba(220, 90, 90, 0.8); }
    100% { text-shadow: 0 0 6px rgba(180, 70, 70, 0.6), 0 0 12px rgba(180, 70, 70, 0.4); }
  `;

  const redGlow = keyframes`
    0% { box-shadow: 0 0 10px 4px rgba(180, 0, 0, 0.6); }
    50% { box-shadow: 0 0 18px 6px rgba(255, 0, 0, 0.9); }
    100% { box-shadow: 0 0 10px 4px rgba(180, 0, 0, 0.6); }
  `;

  const championsGlow = keyframes`
    0% { text-shadow: 0 0 6px rgba(0, 230, 255, 0.7), 0 0 12px rgba(0, 230, 255, 0.5); }
    50% { text-shadow: 0 0 15px rgba(0, 255, 255, 1), 0 0 30px rgba(0, 255, 255, 0.8); }
    100% { text-shadow: 0 0 6px rgba(0, 230, 255, 0.7), 0 0 12px rgba(0, 230, 255, 0.5); }
  `;

  const sinisterGlow = keyframes`
    0% { text-shadow: 0 0 6px rgba(120, 0, 0, 0.7), 0 0 12px rgba(180, 0, 0, 0.5); }
    50% { text-shadow: 0 0 15px rgba(255, 0, 0, 1), 0 0 30px rgba(255, 0, 0, 0.8); }
    100% { text-shadow: 0 0 6px rgba(120, 0, 0, 0.7), 0 0 12px rgba(180, 0, 0, 0.5); }
  `;

  // Background texture for Past Bosses - subtle smoky effect with CSS gradients
  const smokyTexture = `
    radial-gradient(circle at 30% 30%, rgba(80,0,0,0.6) 0%, transparent 70%),
    radial-gradient(circle at 70% 70%, rgba(40,0,0,0.7) 0%, transparent 80%),
    repeating-radial-gradient(circle, transparent 0 4px, rgba(80,0,0,0.2) 5px 8px)
  `;

  const topDonators = ["@cpu_neppu", "@skzd.fx", "@simping.sam"];

  const redCarpetPattern = `
    repeating-linear-gradient(
      45deg,
      rgba(150, 0, 0, 0.25),
      rgba(150, 0, 0, 0.25) 5px,
      rgba(120, 0, 0, 0.15) 5px,
      rgba(120, 0, 0, 0.15) 10px
    )
  `;

  return (
    <>
      <Bubbles colour="rgba(225, 218, 167, 1)" />

      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          px: 2,
          py: 6,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {/* Donations Section */}
        <Box
          sx={{
            backgroundColor: "#690000",
            borderRadius: "20px",
            border: "2px solid #b22222",
            p: 4,
            position: "relative",
            animation: `${redGlow} 3s infinite ease-in-out`,
            backgroundImage: redCarpetPattern,
            backgroundSize: "20px 20px",
            color: "white",
            boxShadow: "0 0 15px 5px rgba(255, 0, 0, 0.5)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              textAlign: "center",
              background: "linear-gradient(90deg, #ff8400, #b57c12)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
            }}
          >
            Wall of Fame (Donations)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.85,
              mb: 4,
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
              fontWeight: 500,
            }}
          >
            These amazing people have supported me and my work. Your names will forever shine here. Thank you!
          </Typography>

          <Paper
            sx={{
              backgroundColor: "#7a1212",
              borderRadius: 3,
              p: 4,
              mx: "auto",
              boxShadow: "0 0 10px 2px rgba(180, 0, 0, 0.8)",
            }}
            elevation={6}
          >
            <Grid
              container
              spacing={3}
              sx={{
                alignItems: "stretch",
              }}
            >
              {donationFollowers.map((name, index) => {
                const isTop = topDonators.includes(name);

                let glowAnim = diamondGlow;
                let color = "#f7c29e"; // warm soft goldish-red tone
                let label = null;

                if (isTop) {
                  glowAnim = goldGlow;
                  color = "#FFD700";
                  label = "TOP DONATOR";
                }

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={index}
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        color,
                        fontWeight: 600,
                        animation: `${glowAnim} 2s infinite ease-in-out`,
                        minHeight: "40px",
                      }}
                    >
                      {name}
                    </Typography>
                    {label && (
                      <Typography
                        variant="caption"
                        sx={{
                          color,
                          fontFamily: "'Courier New', Courier, monospace",
                          fontWeight: "bold",
                          fontSize: "0.7rem",
                          letterSpacing: 1.5,
                          textTransform: "uppercase",
                          mt: 0.5,
                        }}
                      >
                        {label}
                      </Typography>
                    )}
                  </Grid>
                );
              })}
            </Grid>
          </Paper>
        </Box>

        <Box
          sx={{
            backgroundColor: "#f5f0e6",
            color: "#5b4636",
            borderRadius: "20px",
            border: "2px solid #e6d5b8",
            p: 4,
            fontFamily: "'Quicksand', cursive",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              textAlign: "center",
              background: "linear-gradient(90deg, #905618ff, #b57c12)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: 2,
            }}
          >
            Friends of the Page
          </Typography>
          <p>
            People I'm a huge fan of and have had the pleasure of working with!
          </p>
          
          <Paper
            sx={{
              backgroundColor: "#e6d5b8", // Golden sand beige
              borderRadius: 3,
              p: 4,
              mx: "auto",
              boxShadow: "0 0 15px rgba(230, 213, 184, 0.7)",
            }}
            elevation={8}
          >
            <Grid
              container
              spacing={3}
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {friendsOfPage.map((friend, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#a57255ff",
                      fontWeight: 700,
                      animation: `${friendlyGlow} 3s ease-in-out infinite`,
                      minHeight: "40px",
                      textShadow: "0 0 8px #f2d39bff",
                    }}
                  >
                    {friend}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>
            

        <Box
          sx={{
            backgroundColor: "#001f2d",
            color: "#a1e8ff",
            borderRadius: "20px",
            border: "2px solid #00dfff",
            p: 4,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              mb: 2,
              textAlign: "center",
              color: "#00e5ff",
              textShadow: "0 0 10px #00e5ff",
              letterSpacing: 1,
            }}
          >
            Wall of Fame (Champions)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.7,
              mb: 4,
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            Champions that have fought their way to victory in past tournaments.
          </Typography>

          <Paper
            sx={{
              backgroundColor: "#003a52",
              borderRadius: 3,
              p: 4,
              mx: "auto",
              boxShadow: "0 0 15px #00dfff",
            }}
            elevation={12}
          >
            <Grid
              container
              spacing={3}
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {champions.map((champion, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#00e5ff",
                      fontWeight: 700,
                      animation: `${championsGlow} 3s ease-in-out infinite`,
                      minHeight: "40px",
                      textShadow: "0 0 10px #00e5ff",
                    }}
                  >
                    {champion}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        <Box
          sx={{
            backgroundColor: "#0a0000",
            color: "#ff3e3e",
            borderRadius: "20px",
            border: "2px solid #8b0000",
            p: 4,
            backgroundImage: smokyTexture,
            boxShadow: "0 0 20px 6px rgba(255, 0, 0, 0.7)",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              mb: 2,
              textAlign: "center",
              color: "#ff3e3e",
              letterSpacing: 2,
              textShadow: "0 0 15px #ff3e3e",
              fontFamily: "'Impact', 'Arial Black', sans-serif",
            }}
          >
            Wall of Fame (Past Bosses)
          </Typography>
          <Typography
            variant="body1"
            sx={{
              opacity: 0.75,
              mb: 4,
              textAlign: "center",
              maxWidth: 600,
              mx: "auto",
              fontStyle: "italic",
              fontWeight: 600,
              letterSpacing: 1,
              textShadow: "0 0 10px #aa0000",
            }}
          >
            Legendary overlords whose shadows still haunt the battlegrounds.
          </Typography>

          <Paper
            sx={{
              backgroundColor: "#1a0000",
              borderRadius: 3,
              p: 4,
              mx: "auto",
              boxShadow: "0 0 20px 8px rgba(255, 0, 0, 0.9)",
            }}
            elevation={16}
          >
            <Grid
              container
              spacing={3}
              sx={{
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {pastBosses.map((boss, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#ff3e3e",
                      fontWeight: 800,
                      animation: `${sinisterGlow} 3s ease-in-out infinite`,
                      minHeight: "40px",
                      textShadow: "0 0 12px #ff1a1a",
                      fontFamily: "'Impact', 'Arial Black', sans-serif",
                    }}
                  >
                    {boss}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate("/")}
          sx={{
            borderColor: "#E32636",
            color: "#E32636",
            backgroundColor: "#1a1a1a",
            mb: 3,
            mt: 3,
            "&:hover": {
              backgroundColor: "rgba(255, 215, 0, 0.1)",
              borderColor: "#d76770ff",
            },
          }}
        >
          ← Back
        </Button>
      </Box>
    </>
  );
};
