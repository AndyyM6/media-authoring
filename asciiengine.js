const fileInput = document.getElementById('file-input');
const asciiOutput = document.getElementById('ascii-output');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ASCII_CHARS = '@%#*+=-:. ';

let loadedImages = {};

const IMAGES = {
    start: "images/Polaroid.Vec.png",
    scene1: "images/Polaroid.Vec.Pic.png",
    scene2: "images/empty.png",
    scene3: "images/face-polaroid.png",
    scene4: "images/hand-polaroid.png",
}

window.addEventListener("load", () => {
    const keys = Object.keys(IMAGES);
    let loaded = 0;

    keys.forEach(key => {
        const img = new Image();
        img.crossOrigin = "anonymous"
        img.src = IMAGES[key];
        img.onload = () => {
            loadedImages[key] = img;
            loaded++;
            if (loaded === keys.length) {
                renderImageToAscii(loadedImages.start);
            }
        }
    })
});

let baseAscii = [];
let currentAscii = [];
let prevAscii = null;
let running = false;
let startTime = 0;

let eyeState = "open";
let eyeProgress = 0;


let currentDistortion = "none";

function renderImageToAscii(img) {
    baseAscii = [];
    const maxWidth = 300;
    const scale = maxWidth / img.width;
    const width = maxWidth;
    const height = Math.floor(img.height * scale * 0.85);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    let ascii = [];

    for (let y = 0; y < height; y++) {
        let row = [];
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const brightness = (r + g + b) / 3;
            const charIndex = Math.floor(
                (brightness / 255) * (ASCII_CHARS.length - 1)
            );
            row.push(ASCII_CHARS[charIndex]);
        }
        baseAscii.push(row);
    }
    if (!running) {
        running = true;
        startTime = performance.now();
        animate();
    }
}

function contrastShear(ascii, t, amount = 0.15) {
    return ascii.map(row =>
        row.map(ch => {
            const brightness = ch.charCodeAt(0) / 255;
            const shear = Math.sin(t * 0.001) * amount;
            const boosted = brightness + (brightness > 0.5 ? shear : -shear);
            const clamped = Math.max(0, Math.min(1, boosted));
            return brightnessToChar(clamped);
        })
    );
}

function characterDrift(ascii, t, speed = 0.5) {
    const offset = Math.floor(Math.tan(t * 0.05) * speed);
    return ascii.map(row => {
        const copy = [...row];
        return copy.slice(offset).concat(copy.slice(0, offset));
    });
}

function pulseBloom(ascii, t, intensity = 0.5) {
    const pulse = (Math.cos(t * 0.002) + 1) * 0.5 * intensity;
    return ascii.map(row =>
        row.map(ch => {
            const b = ch.charCodeAt(0) / 255;
            const boosted = Math.min(1, b + pulse);
            return brightnessToChar(boosted);
        })
    );
}

function jitterEcho(ascii, prevAscii, t, strength = 0.2) {
    if (!prevAscii) return ascii;
    return ascii.map((row, y) =>
        row.map((ch, x) => {
            return Math.random() < strength ? prevAscii[y][x] : ch;
        })
    );
}

function noiseSurge(ascii, t, probability = 0.02) {
    const noiseChars = ['#', '%', '@', '*', '+', '=', '.'];
    return ascii.map(row =>
        row.map(ch => {
            if (Math.random() < probability) {
                return noiseChars[Math.floor(Math.random() * noiseChars.length)];
            }
            return ch;
        })
    );
}

function depthCollapse(ascii, t, threshold = 0.5) {
    return ascii.map(row =>
        row.map(ch => {
            const b = ch.charCodeAt(0) / 255;
            return b > threshold ? ' ' : '#';
        })
    );
}

function glyphInfection(ascii, t, glyph = '%', spreadChance = 0.21) {
    return ascii.map((row, y) =>
        row.map((ch, x) => {
            if (ch === glyph) return glyph;

            const neighbors = [
                ascii[y]?.[x - 1],
                ascii[y]?.[x + 1],
                ascii[y - 1]?.[x],
                ascii[y + 1]?.[x]
            ];

            if (neighbors.includes(glyph) && Math.random() < spreadChance) {
                return glyph;
            }

            return ch;
        })
    );
}

function scanlineTear(ascii, t, strength = 5) {
    return ascii.map((row, y) => {
        const shouldTear = (y + Math.floor(t * 0.01)) % 20 === 0;
        if (!shouldTear) return row;

        const offset = Math.floor(Math.sin(t * 0.005) * strength);
        const copy = [...row];
        return copy.slice(offset).concat(copy.slice(0, offset));
    });
}

function rainFall(ascii, t) {
    const speed = 0.3;
    const intensity = 0.15;
    const height = ascii.length;
    const width = ascii[0].length;

    for (let x = 0; x < width; x++) {
        if (Math.random() < intensity) {
            const offset = Math.floor((t * speed + x * 13) % height);
            ascii[offset][x] = "|";
        }
    }
    return ascii;
}

const BAYER_4x4 = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
];

function ditherBayer(ascii, t) {
    const h = ascii.length;
    const w = ascii[0].length;

    return ascii.map((row, y) =>
        row.map((ch, x) => {
            const b = ch.charCodeAt(0) / 255;

            const threshold = BAYER_4x4[y % 4][x % 4] / 16;
            const adjusted = b + threshold * 0.1; // subtle

            return brightnessToChar(Math.min(1, adjusted));
        })
    );
}

function brightnessToChar(b) {
    const chars = " .:-=+*#%@";
    return chars[Math.floor(b * (chars.length - 1))];
}

const distortions = {
    none: (ascii, t) => ascii,

    contrastShear,
    characterDrift,
    jitterEcho: (ascii, t) => jitterEcho(ascii, prevAscii, t),
    noiseSurge,
    glyphInfection,
    scanlineTear,
    pulseBloom,
    depthCollapse,
    ditherBayer,
    rainFall,
}

function animate() {
    const t = performance.now() - startTime;

    // Start with base ASCII
    let ascii = baseAscii.map(row => [...row]);

    // Apply ONLY the selected distortion
    const distortionFn = distortions[currentDistortion];
    ascii = distortionFn(ascii, t);

    prevAscii = ascii;

    asciiOutput.textContent = ascii.map(row => row.join("")).join("\n");

    requestAnimationFrame(animate);
}

document.querySelectorAll("#poem .option").forEach(span => {
    span.addEventListener("click", () => {
        const distortion = span.dataset.distortion;
        currentDistortion = distortion;
    })
})

document.querySelectorAll(".imgTrigger").forEach(span => {
    span.addEventListener("click", () => {
        const key = span.dataset.image;
        const img = loadedImages[key];
        if (img) {
            renderImageToAscii(img);
        }
    });
});
