/**
 * 产品批量导入脚本
 * 
 * 功能：
 * - 扫描本地图片文件夹，按产品编码分组
 * - 自动生成日式珠宝产品名称和描述
 * - 批量调用 API 创建产品
 * 
 * 使用方法：
 *   node scripts/import-products.js
 * 
 * 配置说明：
 * - LOCAL_MODE=true  → 图片从本地后端服务器访问（用于本地测试）
 * - LOCAL_MODE=false → 图片从 Cloudflare R2 访问（用于生产环境）
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// ============================================================
// 配置区域 - 根据环境修改这里
// ============================================================

const CONFIG = {
  // 本地测试模式（true）或生产模式（false）
  LOCAL_MODE: false,

  // 本地后端地址
  LOCAL_API_URL: 'http://localhost:5005',

  // 生产环境 Railway 后端地址
  PROD_API_URL: 'https://website-jp-production.up.railway.app',

  // Cloudflare R2 公开 URL
  R2_BASE_URL: 'https://pub-26122746ac38472a89d42469ee48555f.r2.dev',

  // 本地图片文件夹路径
  IMAGE_BASE_DIR: '/Users/niuyonggang/Desktop/代理商提供图',

  // 管理员账号
  ADMIN_EMAIL: 'admin@kashiwagi-design.com',
  ADMIN_PASSWORD: 'Admin123456',

  // 产品价格（日元）
  DEFAULT_PRICE: 15000,

  // 每批导入数量（避免 API 过载）
  BATCH_SIZE: 10,

  // 批次间隔（毫秒）
  BATCH_DELAY: 500,
};

// ============================================================
// 产品名称生成器
// ============================================================

const NAME_COMPONENTS = {
  '耳环': {
    prefixes: ['桜雫', '月露', '花蝶', '星砂', '梅花', '雪華', '蓮露', '竹風', '霞光', '海波',
               '春霖', '秋風', '冬雪', '夏蛍', '玉露', '珠光', '絹雲', '風花', '水鏡', '光彩'],
    suffix: '耳飾り',
    category_cn: '耳环'
  },
  '戒指': {
    prefixes: ['竹節', '梅花', '月光', '桜環', '雪輪', '松葉', '鶴翼', '蓮華', '波紋', '風雅',
               '霜花', '春暁', '秋月', '玉環', '珠輪', '絲帯', '光環', '影輪', '雲紋', '花環'],
    suffix: 'リング',
    category_cn: '戒指'
  },
  '项链': {
    prefixes: ['鶴首', '蓮華', '桃花', '波紋', '月弦', '星鎖', '雪花', '梅鎖', '玉緒', '珠鎖',
               '春糸', '秋鎖', '風緒', '霞鎖', '光緒', '影鎖', '雲緒', '花鎖', '絹緒', '蝶鎖'],
    suffix: 'ネックレス',
    category_cn: '项链'
  },
  '手链手镯': {
    prefixes: ['竹露', '流星', '花環', '月弧', '桜環', '雪帯', '風帯', '霞帯', '春帯', '秋帯',
               '玉帯', '珠帯', '絹帯', '光帯', '影帯', '雲帯', '梅帯', '蓮帯', '鶴帯', '波帯'],
    suffix: 'ブレスレット',
    category_cn: '手链手镯'
  },
  '胸针': {
    prefixes: ['梅花', '蝶々', '桜花', '鶴翔', '蓮花', '菊花', '百合', '藤花', '椿花', '萩花',
               '牡丹', '桃花', '杏花', '菖蒲', '紫陽', '撫子', '山茶', '水仙', '薔薇', '芙蓉'],
    suffix: 'ブローチ',
    category_cn: '胸针'
  },
  '套装': {
    prefixes: ['花蝶', '春霞', '月桜', '雪月', '風花', '星露', '梅雨', '秋霖', '竹風', '蓮月',
               '玉桜', '珠月', '絹花', '光桜', '影月', '雲花', '霞月', '春月', '秋花', '冬桜'],
    suffix: 'セット',
    category_cn: '套装'
  }
};

// 描述模板
const DESCRIPTION_TEMPLATES = {
  '耳环': [
    '以日本传统美学为灵感，精选优质材料手工打造。轻盈垂坠的设计，随步伐律动如花瓣飘落，诠释"一期一会"的独特风情。',
    '融合日式枯山水意境与现代首饰工艺，每一处细节都经过匠人的精心雕琢。佩戴时散发低调而优雅的光泽，令人过目难忘。',
    '采用传统工艺与现代设计完美结合，呈现出日本花道的禅意之美。精致的造型让每一次佩戴都成为与美好的相遇。',
    '源自日本自然景观的设计灵感，将四季之美凝固于方寸之间。质感细腻，工艺精湛，是日常佩戴与特殊场合的绝佳之选。',
  ],
  '戒指': [
    '以日本传统纹样为设计原点，融入现代简约美学，打造出兼具文化底蕴与时尚感的戒指。每一枚都是匠心独运的艺术品。',
    '参考日本庭园中的自然元素，将竹、石、水的意境凝练成优雅的指环。哑光质感温润如玉，适合各种场合的日常佩戴。',
    '灵感来源于日本古典文学中的美学意象，将"物哀"与"侘寂"的哲学融入首饰设计。独特的造型让手指更显纤细优雅。',
    '采用精密铸造工艺，复刻日本传统纹饰中的经典图案。可单枚佩戴彰显个性，也可多枚叠戴演绎层次之美。',
  ],
  '项链': [
    '将日本传统结绳艺术"组紐"的美感融入现代项链设计，精致的链条与吊坠相互呼应，展现出东方女性的含蓄之美。',
    '以日本四季更迭为灵感，每款项链都承载着对自然之美的致敬。佩戴时如同将一段美好时光定格于颈间，诗意盎然。',
    '融合京都传统工坊的制作理念，每条项链都经过多道工序精心完成。简约而不失精致，彰显佩戴者的独特品味。',
    '汲取日本海滨与山林的自然气息，将有机曲线与几何美学巧妙结合。轻盈的重量与精美的工艺，让佩戴成为一种享受。',
  ],
  '手链手镯': [
    '以日本传统染织艺术为灵感，将细腻的纹样转化为手腕间的装饰语言。精致的做工让每一次手部动作都充满优雅气质。',
    '参考日本茶道美学中对器物的精致追求，将简约与精美完美融合。适合日常佩戴，也是馈赠亲友的绝佳礼物。',
    '灵感源自日本传统节庆中的装饰元素，融入现代简约设计语言。佩戴时如同腕间流动的诗行，优雅而富有韵律感。',
    '采用轻量化设计理念，确保长时间佩戴的舒适感。精致的细节处理彰显日本工匠精神，令手腕增添迷人光彩。',
  ],
  '胸针': [
    '以日本传统纹样中的花卉元素为原型，通过精细的金工技艺呈现出栩栩如生的立体感。别于胸前，犹如一幅流动的画作。',
    '融合日本传统服饰文化中的装饰美学，将古典纹样以现代手法重新诠释。一枚别致的胸针，让整体造型瞬间提升格调。',
    '汲取日本庭园四季之美，将自然界中的花鸟虫鱼凝练为精美的胸针设计。别具匠心的造型，彰显佩戴者的独特审美。',
    '每一枚胸针都是工匠逐一手工完成的艺术品，承载着对日本美学传统的深刻理解与传承。佩戴即是与美的对话。',
  ],
  '套装': [
    '精心搭配的耳环与项链（或戒指）套装，设计语言高度统一，整体感强烈。适合特殊场合佩戴，让造型更加完整精致。',
    '以日本传统"和"之美学为设计核心，将多件首饰融为一体的搭配方案。套装中的每件单品既可独立佩戴，又可组合出不同的层次美感。',
    '专为追求整体搭配感的佩戴者设计，套装中的每件首饰在设计细节上相互呼应。一套在手，轻松实现从日常到晚宴的多场景佩戴。',
    '汲取日本传统婚仪服饰中的装饰美学，将繁复的古典元素提炼为现代简约的套装设计。礼盒包装精美，是馈赠的理想选择。',
  ],
};

// ============================================================
// 工具函数
// ============================================================

let nameIndexes = {};
let descIndexes = {};

function generateName(category, productCode) {
  const comp = NAME_COMPONENTS[category];
  if (!comp) return productCode;

  if (!nameIndexes[category]) nameIndexes[category] = 0;
  const prefix = comp.prefixes[nameIndexes[category] % comp.prefixes.length];
  nameIndexes[category]++;

  return `${prefix}${comp.suffix}（${productCode}）`;
}

function generateDescription(category) {
  const templates = DESCRIPTION_TEMPLATES[category];
  if (!templates) return '精选优质材料，匠心工艺打造，展现日式美学的精髓。';

  if (!descIndexes[category]) descIndexes[category] = 0;
  const desc = templates[descIndexes[category] % templates.length];
  descIndexes[category]++;
  return desc;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// 图片扫描：按产品编码分组
// ============================================================

function scanImages(imageBaseDir) {
  const products = [];

  for (const series of ['RA', 'RG']) {
    const seriesDir = path.join(imageBaseDir, series);
    if (!fs.existsSync(seriesDir)) continue;

    for (const category of ['耳环', '戒指', '项链', '手链手镯', '胸针', '套装']) {
      const categoryDir = path.join(seriesDir, category);
      if (!fs.existsSync(categoryDir)) continue;

      const files = fs.readdirSync(categoryDir)
        .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort();

      // 按产品编码分组（去掉 -1 -2 -3 数字后缀）
      const productMap = new Map();

      for (const file of files) {
        const nameWithoutExt = file.replace(/\.[^.]+$/, '');
        // 提取产品编码：去掉末尾的 -数字
        const productCode = nameWithoutExt.replace(/-\d+$/, '');

        if (!productMap.has(productCode)) {
          productMap.set(productCode, []);
        }
        productMap.get(productCode).push(file);
      }

      // 构建产品列表
      for (const [productCode, imageFiles] of productMap) {
        // 主图优先（没有 -数字 后缀的文件排在前面）
        const sortedImages = imageFiles.sort((a, b) => {
          const aIsMain = !a.replace(/\.[^.]+$/, '').match(/-\d+$/);
          const bIsMain = !b.replace(/\.[^.]+$/, '').match(/-\d+$/);
          if (aIsMain && !bIsMain) return -1;
          if (!aIsMain && bIsMain) return 1;
          return a.localeCompare(b);
        });

        products.push({
          productCode,
          series,
          category,
          imageFiles: sortedImages,
        });
      }
    }
  }

  return products;
}

// ============================================================
// 构建图片 URL
// ============================================================

function buildImageUrl(series, category, filename) {
  if (CONFIG.LOCAL_MODE) {
    return `${CONFIG.LOCAL_API_URL}/uploads/products/${series}/${category}/${filename}`;
  } else {
    return `${CONFIG.R2_BASE_URL}/${series}/${category}/${filename}`;
  }
}

// ============================================================
// API 调用
// ============================================================

function httpRequest(url, options, body) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https');
    const client = isHttps ? https : http;
    const urlObj = new URL(url);

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = client.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function login() {
  const apiUrl = CONFIG.LOCAL_MODE ? CONFIG.LOCAL_API_URL : CONFIG.PROD_API_URL;
  const res = await httpRequest(
    `${apiUrl}/api/users/login`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: CONFIG.ADMIN_EMAIL, password: CONFIG.ADMIN_PASSWORD }
  );

  if (res.status !== 200 || !res.data.success) {
    throw new Error(`登录失败: ${JSON.stringify(res.data)}`);
  }

  return res.data.token;
}

async function createProduct(token, productData) {
  const apiUrl = CONFIG.LOCAL_MODE ? CONFIG.LOCAL_API_URL : CONFIG.PROD_API_URL;
  const res = await httpRequest(
    `${apiUrl}/api/products`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    },
    productData
  );
  return res;
}

// ============================================================
// 主程序
// ============================================================

async function main() {
  console.log('========================================');
  console.log('  柏木设计 · 产品批量导入工具');
  console.log('========================================');
  console.log(`  模式: ${CONFIG.LOCAL_MODE ? '本地测试' : '生产环境'}`);
  console.log(`  API : ${CONFIG.LOCAL_MODE ? CONFIG.LOCAL_API_URL : CONFIG.PROD_API_URL}`);
  console.log('');

  // 1. 扫描图片
  console.log('📂 正在扫描图片文件夹...');
  const products = scanImages(CONFIG.IMAGE_BASE_DIR);
  console.log(`✅ 共发现 ${products.length} 个产品\n`);

  // 统计
  const stats = {};
  for (const p of products) {
    const key = `${p.series}/${p.category}`;
    stats[key] = (stats[key] || 0) + 1;
  }
  for (const [key, count] of Object.entries(stats)) {
    console.log(`   ${key}: ${count} 个`);
  }
  console.log('');

  // 2. 登录获取 token
  console.log('🔐 正在登录管理员账号...');
  let token;
  try {
    token = await login();
    console.log('✅ 登录成功\n');
  } catch (err) {
    console.error('❌ 登录失败，请确认后端服务已启动！');
    console.error(err.message);
    process.exit(1);
  }

  // 3. 批量创建产品
  console.log('📦 开始批量导入产品...\n');
  let successCount = 0;
  let failCount = 0;
  const errors = [];

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const imageUrls = p.imageFiles.map(f => buildImageUrl(p.series, p.category, f));
    const productName = generateName(p.category, p.productCode);
    const description = generateDescription(p.category);

    const productData = {
      name: productName,
      description: description,
      price: CONFIG.DEFAULT_PRICE,
      category: p.category,
      imageUrls: imageUrls,
      inStock: 10,
      featured: Math.random() < 0.2, // 随机20%设为精选
      tags: [p.series, p.productCode, p.category],
      material: p.series === 'RA' ? '925纯银' : '18K镀金',
    };

    const res = await createProduct(token, productData);

    if (res.status === 201 && res.data.success) {
      successCount++;
      process.stdout.write(`\r  进度: ${i + 1}/${products.length}  ✅ 成功: ${successCount}  ❌ 失败: ${failCount}`);
    } else {
      failCount++;
      errors.push({ code: p.productCode, error: res.data?.error || '未知错误' });
      process.stdout.write(`\r  进度: ${i + 1}/${products.length}  ✅ 成功: ${successCount}  ❌ 失败: ${failCount}`);
    }

    // 每批间隔一下，避免 API 过载
    if ((i + 1) % CONFIG.BATCH_SIZE === 0) {
      await sleep(CONFIG.BATCH_DELAY);
    }
  }

  // 4. 结果汇总
  console.log('\n\n========================================');
  console.log('  导入完成！');
  console.log('========================================');
  console.log(`  ✅ 成功: ${successCount} 个产品`);
  console.log(`  ❌ 失败: ${failCount} 个产品`);

  if (errors.length > 0) {
    console.log('\n  失败详情:');
    errors.slice(0, 10).forEach(e => console.log(`    - ${e.code}: ${e.error}`));
    if (errors.length > 10) console.log(`    ... 以及其他 ${errors.length - 10} 个错误`);
  }

  console.log('\n  打开浏览器访问查看结果:');
  if (CONFIG.LOCAL_MODE) {
    console.log('  http://localhost:3001/products');
  } else {
    console.log('  https://miiqee.com/products');
  }
  console.log('========================================\n');
}

main().catch(err => {
  console.error('\n❌ 程序异常退出:', err.message);
  process.exit(1);
});
