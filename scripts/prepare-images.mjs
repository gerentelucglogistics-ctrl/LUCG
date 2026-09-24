// Genera las imágenes optimizadas del sitio a partir de los originales del sitio anterior.
import sharp from "sharp";
import { readFileSync } from "node:fs";

const SRC = process.argv[2];
const OUT = "public/img";

const crops = [
  ["fondo.jpeg", "hero-operario", null],
  ["foto-principal.png", "puerto", null],
  ["foto-principal-6.png", "bodega", { left: 535, top: 0, width: 291, height: 465 }],
  ["foto-principal-7.png", "camion", { left: 40, top: 175, width: 450, height: 245 }],
  ["foto-principal-8.png", "furgon", { left: 480, top: 15, width: 346, height: 215 }],
  ["foto-principal-9.png", "embalaje", { left: 470, top: 0, width: 356, height: 360 }],
  ["foto-principal-13.png", "equipo", { left: 490, top: 0, width: 336, height: 390 }],
  ["foto-principal-12.png", "escaneo", { left: 530, top: 20, width: 296, height: 420 }],
  ["foto-principal-4.png", "operario-puerto", { left: 0, top: 0, width: 215, height: 465 }],
];

for (const [file, name, region] of crops) {
  let img = sharp(`${SRC}/${file}`);
  if (region) img = img.extract(region);
  await img.webp({ quality: 82 }).toFile(`${OUT}/${name}.webp`);
}

// Logo: versión a color y versión para fondos oscuros (azul -> blanco)
const svg = readFileSync("brand/LUCG_Logistics_logo_transparente.svg", "utf8");

const svgWhite = svg.replaceAll("#011C52", "#FFFFFF");
await sharp(Buffer.from(svg)).trim().resize({ width: 520 }).webp({ quality: 90 }).toFile(`${OUT}/logo.webp`);
await sharp(Buffer.from(svgWhite)).trim().resize({ width: 520 }).webp({ quality: 90 }).toFile(`${OUT}/logo-blanco.webp`);
await sharp(Buffer.from(svg)).trim().resize({ width: 512, height: 512, fit: "contain", background: "#ffffff" }).png().toFile("src/app/icon.png");
await sharp(Buffer.from(svg)).trim().resize({ width: 180, height: 180, fit: "contain", background: "#ffffff" }).png().toFile("src/app/apple-icon.png");
console.log("ok");

// Galería del blog: piezas gráficas originales
for (let i = 1; i <= 13; i++) {
  await sharp(`${SRC}/foto-principal-${i}.png`).webp({ quality: 85 }).toFile(`${OUT}/galeria/pieza-${i}.webp`);
}

// Imagen para compartir en redes (Open Graph) 1200×630
const og = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs><linearGradient id="g" x1="0" x2="1"><stop offset="0.35" stop-color="#010f2e"/><stop offset="1" stop-color="#010f2e" stop-opacity="0.2"/></linearGradient></defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect y="618" width="1200" height="12" fill="#da6106"/>
  <text x="80" y="370" font-family="Montserrat, Arial, sans-serif" font-size="54" font-weight="800" fill="#fff">Logística que mueve</text>
  <text x="80" y="432" font-family="Montserrat, Arial, sans-serif" font-size="54" font-weight="800" fill="#fff">tu empresa</text>
  <text x="80" y="494" font-family="Montserrat, Arial, sans-serif" font-size="54" font-weight="800" fill="#f07412">hacia adelante</text>
  <text x="80" y="550" font-family="Arial, sans-serif" font-size="24" fill="#ffffffb3">Almacenamiento · Transporte · Distribución</text>
</svg>`);
const logoOg = await sharp(Buffer.from(svgWhite)).trim().resize({ width: 380 }).png().toBuffer();
await sharp(`${SRC}/fondo.jpeg`)
  .resize(1200, 630, { fit: "cover", position: "right" })
  .composite([{ input: og }, { input: logoOg, left: 80, top: 70 }])
  .jpeg({ quality: 85 })
  .toFile("src/app/opengraph-image.jpg");
