import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  COMPANY_KPIs,
  DEPTS,
  EMPLOYEES,
  DEPT_STATS,
  TREND_DATA,
  PILLARS,
  TIER_COLOR,
  TIER_BG,
} from './data.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/data', (req, res) => {
  res.json({ COMPANY_KPIs, DEPTS, EMPLOYEES, DEPT_STATS, TREND_DATA, PILLARS, TIER_COLOR, TIER_BG });
});

app.get('/api/employees/:id', (req, res) => {
  const emp = EMPLOYEES.find(e => e.id === Number(req.params.id));
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json(emp);
});

app.get('/api/departments/:dept', (req, res) => {
  const dept = req.params.dept;
  const emps = EMPLOYEES.filter(e => e.dept === dept);
  if (!emps.length) return res.status(404).json({ error: 'Department not found' });
  res.json({ dept, employees: emps, stat: DEPT_STATS.find(d => d.dept === dept) });
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
