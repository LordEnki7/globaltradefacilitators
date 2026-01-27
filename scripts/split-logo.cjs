const sharp = require('sharp');
const path = require('path');

async function splitLogo() {
  const inputPath = path.join(__dirname, '../attached_assets/logos_for_this_app_1769477935936.png');
  const outputDir = path.join(__dirname, '../client/src/assets');
  
  const image = sharp(inputPath);
  const metadata = await image.metadata();
  
  console.log('Image dimensions:', metadata.width, 'x', metadata.height);
  
  const height = metadata.height;
  const width = metadata.width;
  
  const logo1Height = Math.floor(height * 0.22);
  const logo2Height = Math.floor(height * 0.28);
  const logo3Height = height - logo1Height - logo2Height;
  
  await sharp(inputPath)
    .extract({ left: 0, top: 0, width: width, height: logo1Height })
    .toFile(path.join(outputDir, 'logo-globe-airplane.png'));
  console.log('Created logo-globe-airplane.png (top logo)');
  
  await sharp(inputPath)
    .extract({ left: 0, top: logo1Height, width: width, height: logo2Height })
    .toFile(path.join(outputDir, 'logo-globe-shield.png'));
  console.log('Created logo-globe-shield.png (middle logo)');
  
  await sharp(inputPath)
    .extract({ left: 0, top: logo1Height + logo2Height, width: width, height: logo3Height })
    .toFile(path.join(outputDir, 'logo-ship-main.png'));
  console.log('Created logo-ship-main.png (bottom/main logo)');
  
  console.log('Done! Three logos created in client/src/assets/');
}

splitLogo().catch(console.error);
