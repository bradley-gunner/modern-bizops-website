import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Modern BizOps | Revenue Growth Coaching for SMBs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const [cormorantFont, jostFont, headshotData, logoData] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/cormorantgaramond/v21/co3umX5slCNuHLi8bLeY9MK7whWMhyjypVO7abI26QOD_iE9GnM.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/jost/v20/92zPtBhPNqw79Ij1E865zBUv7myjJQVG.ttf"
    ).then((res) => res.arrayBuffer()),
    readFile(join(process.cwd(), "public/images/bradley-headshot-og.jpg")),
    readFile(join(process.cwd(), "public/logos/logo-og.png")),
  ]);

  const headshotSrc = `data:image/jpeg;base64,${headshotData.toString("base64")}`;
  const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: "#0E1F38",
          padding: "50px 60px",
          position: "relative",
        }}
      >
        {/* Amber accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1200px",
            height: "6px",
            display: "flex",
            background: "linear-gradient(90deg, #C85D0A 0%, #E8873A 100%)",
          }}
        />

        {/* Main content area */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            height: "100%",
          }}
        >
          {/* Top: Logo */}
          <img
            src={logoSrc}
            style={{
              height: "80px",
              width: "220px",
              alignSelf: "flex-start",
            }}
          />

          {/* Middle: Headline + headshot side by side */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              paddingRight: "140px",
            }}
          >
            {/* Headline */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
              }}
            >
              <span
                style={{
                  fontFamily: '"Cormorant Garamond"',
                  fontSize: "72px",
                  fontWeight: 600,
                  color: "#F6F2EB",
                  lineHeight: 1.1,
                  letterSpacing: "-2px",
                }}
              >
                Grow Your Revenue
              </span>
              <span
                style={{
                  fontFamily: '"Cormorant Garamond"',
                  fontSize: "72px",
                  fontWeight: 600,
                  color: "#F6F2EB",
                  lineHeight: 1.1,
                  letterSpacing: "-2px",
                }}
              >
                Without Growing
              </span>
              <span
                style={{
                  fontFamily: '"Cormorant Garamond"',
                  fontSize: "72px",
                  fontWeight: 600,
                  color: "#F6F2EB",
                  lineHeight: 1.1,
                  letterSpacing: "-2px",
                }}
              >
                Your Headcount
              </span>
            </div>

            {/* Headshot */}
            <img
              src={headshotSrc}
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "110px",
                border: "4px solid #C85D0A",
                flexShrink: 0,
              }}
            />
          </div>

          {/* Bottom: Name + title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontFamily: '"Jost"',
                fontSize: "20px",
                fontWeight: 400,
                color: "#F6F2EB",
              }}
            >
              Bradley de Wet
            </span>
            <span
              style={{
                fontFamily: '"Jost"',
                fontSize: "20px",
                fontWeight: 400,
                color: "#4A5568",
              }}
            >
              |
            </span>
            <span
              style={{
                fontFamily: '"Jost"',
                fontSize: "20px",
                fontWeight: 400,
                color: "#E8873A",
              }}
            >
              Revenue Growth Coach
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Cormorant Garamond",
          data: cormorantFont,
          style: "normal",
          weight: 600,
        },
        {
          name: "Jost",
          data: jostFont,
          style: "normal",
          weight: 400,
        },
      ],
    }
  );
}
