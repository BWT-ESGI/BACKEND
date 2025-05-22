export const COMMON_FILES = [
    "README.md",
    "package.json",
    "requirements.txt",
    "main.py",
    "index.js",
    "src/index.js",
    "src/main.py",
    "Makefile",
    "Dockerfile",
    ".gitignore",
    "setup.py",
    "pom.xml",
    "build.gradle",
    "composer.json",
    "tsconfig.json",
    "public/index.html",
];

export const COMMON_ARCHITECTURES = [
    {
        name: "Node.js (Express)",
        structure: [
            "src/",
            "src/routes/",
            "src/controllers/",
            "src/models/",
            "package.json",
            "README.md",
        ],
    },
    {
        name: "Python (Flask)",
        structure: [
            "app.py",
            "requirements.txt",
            "templates/",
            "static/",
            "README.md",
        ],
    },
    {
        name: "React (Vite)",
        structure: [
            "src/",
            "src/App.jsx",
            "src/main.jsx",
            "public/",
            "package.json",
            "README.md",
        ],
    },
    {
        name: "Java (Maven)",
        structure: [
            "src/main/java/",
            "src/test/java/",
            "pom.xml",
            "README.md",
        ],
    },
];
