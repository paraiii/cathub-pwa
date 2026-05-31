import fs from 'fs';

const text = fs.readFileSync('initial_data.json', 'utf-8');
const objects = [];
let depth = 0;
let start = 0;
for (let i = 0; i < text.length; i++) {
  if (text[i] === '{') {
    if (depth === 0) start = i;
    depth++;
  } else if (text[i] === '}') {
    depth--;
    if (depth === 0) {
      objects.push(JSON.parse(text.substring(start, i + 1)));
    }
  }
}

const weights = [];
const vomits = [];

objects.forEach(item => {
  if (!item.type) return;
  
  const ts = Number(item.timestamp);
  let dateStr = new Date().toISOString();
  if (ts && !isNaN(ts)) {
    dateStr = new Date(ts).toISOString();
  } else if (item.createTime && item.createTime.$date) {
    dateStr = item.createTime.$date;
  }
  
  if (item.type === 'weight') {
    weights.push({
      id: item._id,
      weight: item.value || 0,
      date: dateStr
    });
  } else if (item.type === 'vomit') {
    vomits.push({
      id: item._id,
      description: item.note || '',
      date: dateStr
    });
  }
});

fs.writeFileSync('src/data.json', JSON.stringify({ weights, vomits }, null, 2));
console.log('Processed', weights.length, 'weights and', vomits.length, 'vomits.');
