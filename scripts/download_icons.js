const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join(process.cwd(), 'public', 'images', 'categories');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const list = [
  { name: 'elektronik.png', url: 'https://pngimg.com/uploads/headphones/headphones_PNG7648.png' },
  { name: 'fashion-pria.png', url: 'https://pngimg.com/uploads/polo_shirt/polo_shirt_PNG8166.png' },
  { name: 'fashion-wanita.png', url: 'https://pngimg.com/uploads/women_bag/women_bag_PNG6418.png' },
  { name: 'kecantikan.png', url: 'https://pngimg.com/uploads/perfume/perfume_PNG10283.png' },
  { name: 'komputer.png', url: 'https://pngimg.com/uploads/macbook/macbook_PNG8.png' },
  { name: 'rumah-tangga.png', url: 'https://pngimg.com/uploads/sofa/sofa_PNG6959.png' },
  { name: 'makanan.png', url: 'https://pngimg.com/uploads/burger_sandwich/burger_sandwich_PNG4114.png' },
  { name: 'olahraga.png', url: 'https://pngimg.com/uploads/basketball/basketball_PNG1102.png' },
  { name: 'ibu-bayi.png', url: 'https://pngimg.com/uploads/baby_bottle/baby_bottle_PNG24.png' },
  { name: 'hobi.png', url: 'https://pngimg.com/uploads/photo_camera/photo_camera_PNG7847.png' },
  { name: 'otomotif.png', url: 'https://pngimg.com/uploads/car_wheel/car_wheel_PNG23315.png' },
  { name: 'buku.png', url: 'https://pngimg.com/uploads/book/book_PNG2116.png' }
];

function download(item) {
  return new Promise((resolve) => {
    const dest = path.join(dir, item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          const stats = fs.statSync(dest);
          console.log('SAVED ' + item.name + ' (' + stats.size + ' bytes)');
          resolve(true);
        });
      } else {
        console.log('FAILED ' + item.name + ': ' + res.statusCode);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log('ERR ' + item.name + ': ' + err.message);
      resolve(false);
    });
  });
}

Promise.all(list.map(download)).then(() => console.log('ALL DOWNLOADS FINISHED'));
