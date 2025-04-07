const fs = require("fs");
const path = require("path");

function generateRoutes() {
  const pagesDir = path.join(process.cwd(), "src", "app");
  const outputFile = path.join(process.cwd(), "generated", "routes.json");
  const validRoutes = new Set(["/"]);

  function scanDirectory(dir, currentPath = "") {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip private routes and special directories
        if (
          !file.startsWith("_") &&
          !file.startsWith(".") &&
          file !== "node_modules"
        ) {
          // NEW: Completely ignore route group parentheses
          const isRouteGroup = file.startsWith("(") && file.endsWith(")");
          const cleanDirName = isRouteGroup ? "" : file;

          scanDirectory(
            fullPath,
            isRouteGroup ? currentPath : `${currentPath}/${cleanDirName}`
          );
        }
      } else if (file.match(/^page\.(tsx|js|mjs|jsx)$/)) {
        let route = currentPath || "/";

        // Format the route
        route =
          route
            .replace(/\[([^\]]+)\]/g, ":$1") // [id] → :id
            .replace(/\/+/g, "/") // Remove duplicate slashes
            .replace(/\/$/, "") || "/"; // Remove trailing slash

        // NEW: Only add if not empty (for route groups)
        if (route !== "/" || currentPath === "") {
          validRoutes.add(route);
        }
      }
    });
  }

  scanDirectory(pagesDir);

  // Create generated directory if needed
  if (!fs.existsSync(path.dirname(outputFile))) {
    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  }

  fs.writeFileSync(
    outputFile,
    JSON.stringify(Array.from(validRoutes).sort(), null, 2)
  );
  console.log(`Generated ${validRoutes.size} clean routes`);
}

generateRoutes();
