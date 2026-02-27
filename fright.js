const fileInput = document.getElementById('file-input');
const asciiOutput = document.getElementById('ascii-output');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const ASCII_CHARS = '@%#*+=-:. ';

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            renderImageToAscii(img);
        };
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

function renderImageToAscii(img) {
    const maxWidth = 300;
    const scale = maxWidth / img.width;
    const width = maxWidth;
    const height = Math.floor(img.height * scale * 0.85);

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(img, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    const { data } = imageData;

    let ascii = ``;

    for (let y = 0; y < height; y++) {
        let row = ``;
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const brightness = (r + g + b) / 3;

            const charIndex = Math.floor(
                (brightness / 255) * (ASCII_CHARS.length - 1)
            );
            row += ASCII_CHARS[charIndex];
        }
        ascii += row + '\n';
    }
    asciiOutput.textContent = ascii;
}