import { format, subDays, addDays, startOfMonth } from 'date-fns';

const startDate = new Date('2025-10-01');
const salespersons = ['Rajesh Kumar', 'Priya Sharma', 'Amit Singh', 'Neha Patel', 'Vikram Rao'];
const architectFirms = ['Studio Aura', 'Design Matrix', 'Blueprint Co', 'Archform India', 'Vertex Architects', 'Space Lab', 'Creative Constructs'];
const architectNames = ['Ar. Sunita Mehta', 'Ar. Ravi Pillai', 'Ar. Anjali Gupta', 'Ar. Deepak Sharma', 'Ar. Pooja Nair', 'Ar. Karthik Iyer'];
const leadSources = ['Website', 'Social Media', 'Google Ads', 'Referral', 'Email Campaign'];
const invitationCategories = ['Cold Calls', 'Existing Relationships', 'Events', 'Referrals'];

// Helper to generate random date in range
const rndDate = (start, end) => {
  const s = start.getTime(), e = end.getTime();
  return new Date(s + Math.random() * (e - s));
};
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const fmtDate = d => format(d, 'yyyy-MM-dd');

// Generate 3 months of data
const months = [
  { start: new Date('2025-10-01'), end: new Date('2025-10-31'), label: 'Oct 2025' },
  { start: new Date('2025-11-01'), end: new Date('2025-11-30'), label: 'Nov 2025' },
  { start: new Date('2025-12-01'), end: new Date('2025-12-31'), label: 'Dec 2025' },
];

// KPI 1 - Online Lead Conversions
export const seedLeadConversions = () => {
  const data = [];
  months.forEach(m => {
    for (let i = 0; i < 25; i++) {
      const date = rndDate(m.start, m.end);
      const converted = Math.random() > 0.4;
      data.push({
        id: `lead_${m.label}_${i}`,
        kpiType: 'online_lead',
        date: fmtDate(date),
        leadSource: pick(leadSources),
        leadName: `Lead ${i + 1} (${m.label})`,
        contact: `+91 9${rnd(100000000, 999999999)}`,
        status: converted ? 'Converted' : pick(['Qualified', 'In Progress', 'Cold']),
        convertedToVisit: converted,
        salesperson: pick(salespersons),
        ecId: 'EC001',
        createdAt: date.toISOString(),
      });
    }
  });
  return data;
};

// KPI 2 - Architect Invitations
export const seedArchitectInvitations = () => {
  const data = [];
  months.forEach(m => {
    for (let i = 0; i < 20; i++) {
      const date = rndDate(m.start, m.end);
      const planned = addDays(date, rnd(3, 14));
      const visited = Math.random() > 0.3;
      data.push({
        id: `arch_${m.label}_${i}`,
        kpiType: 'architect_invitation',
        date: fmtDate(date),
        architectName: pick(architectNames),
        firmName: pick(architectFirms),
        invitationCategory: pick(invitationCategories),
        plannedVisitDate: fmtDate(planned),
        actualVisitDate: visited ? fmtDate(addDays(planned, rnd(-2, 5))) : null,
        status: visited ? 'Visited' : pick(['Scheduled', 'Pending', 'Rescheduled']),
        convertedToVisit: visited,
        salesperson: pick(salespersons),
        ecId: 'EC001',
        createdAt: date.toISOString(),
      });
    }
  });
  return data;
};

// KPI 3 - Footfall Customers
export const seedFootfall = () => {
  const data = [];
  const customerTypes = ['New', 'Repeat', 'Referral', 'Walk-in'];
  const purposes = ['Product Enquiry', 'Purchase', 'After Sales', 'General Browse', 'Specification Review'];
  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  months.forEach(m => {
    for (let day = 1; day <= 30; day++) {
      const date = new Date(m.start.getFullYear(), m.start.getMonth(), day);
      if (date > m.end) break;
      const count = rnd(3, 12);
      for (let i = 0; i < count; i++) {
        const timeIn = pick(timeSlots);
        const timeInHour = parseInt(timeIn);
        const timeOut = `${timeInHour + rnd(1, 3)}:${pick(['00', '30'])}`;
        data.push({
          id: `footfall_${fmtDate(date)}_${i}`,
          type: 'customer',
          date: fmtDate(date),
          name: `Customer ${i + 1}`,
          contact: `+91 9${rnd(100000000, 999999999)}`,
          customerType: pick(customerTypes),
          timeIn,
          timeOut,
          purpose: pick(purposes),
          salesperson: pick(salespersons),
          ecId: 'EC001',
        });
      }
    }
  });
  return data;
};

// KPI 4 - Showroom Upkeep
export const seedShowroomScores = () => {
  const data = [];
  const parameters = ['Cleanliness', 'Lighting', 'Display Arrangement', 'Ambience', 'Working Equipment', 'Safety'];
  months.forEach(m => {
    for (let day = 1; day <= 30; day++) {
      const date = new Date(m.start.getFullYear(), m.start.getMonth(), day);
      if (date > m.end || date.getDay() === 0) continue;
      parameters.forEach(param => {
        data.push({
          id: `showroom_${fmtDate(date)}_${param}`,
          date: fmtDate(date),
          parameter: param,
          score: rnd(6, 10),
          remarks: rnd(1, 10) > 7 ? 'Minor issue noted, corrected.' : 'All good.',
          photoUrl: null,
          checkedBy: 'Sanju Gupta',
          ecId: 'EC001',
        });
      });
    }
  });
  return data;
};

// KPI 5 - Data Management
export const seedDataMgmt = () => {
  const data = [];
  const reportTypes = [
    { type: 'Daily Report', dueTime: '10:00 AM', frequency: 'daily' },
    { type: 'Weekly MIS', dueTime: '12:00 PM Monday', frequency: 'weekly' },
    { type: 'Monthly Report', dueTime: '2nd of Month', frequency: 'monthly' },
  ];
  months.forEach(m => {
    // Daily reports
    for (let day = 1; day <= 31; day++) {
      const date = new Date(m.start.getFullYear(), m.start.getMonth(), day);
      if (date > m.end || date.getDay() === 0) continue;
      const onTime = Math.random() > 0.2;
      data.push({
        id: `datamgmt_daily_${fmtDate(date)}`,
        reportType: 'Daily Report',
        dueDate: fmtDate(date),
        submissionDate: fmtDate(date),
        status: onTime ? 'On Time' : Math.random() > 0.5 ? 'Late' : 'Missing',
        submittedBy: 'Sanju Gupta',
        ecId: 'EC001',
      });
    }
    // Weekly MIS
    for (let week = 0; week < 4; week++) {
      const date = new Date(m.start.getFullYear(), m.start.getMonth(), 7 * week + 1);
      if (date > m.end) break;
      data.push({
        id: `datamgmt_weekly_${fmtDate(date)}`,
        reportType: 'Weekly MIS',
        dueDate: fmtDate(date),
        submissionDate: fmtDate(date),
        status: Math.random() > 0.15 ? 'On Time' : 'Late',
        submittedBy: 'Sanju Gupta',
        ecId: 'EC001',
      });
    }
    // Monthly
    data.push({
      id: `datamgmt_monthly_${m.label}`,
      reportType: 'Monthly Report',
      dueDate: fmtDate(new Date(m.start.getFullYear(), m.start.getMonth(), 2)),
      submissionDate: fmtDate(new Date(m.start.getFullYear(), m.start.getMonth(), rnd(2, 4))),
      status: Math.random() > 0.2 ? 'On Time' : 'Late',
      submittedBy: 'Sanju Gupta',
      ecId: 'EC001',
    });
  });
  return data;
};

// KPI 6 - Presentation Skills
export const seedPresentationSkills = () => {
  const data = [];
  const topics = ['Glass Types & Properties', 'Solar Control Glass', 'Acoustic Glass', 'Safety Glass', 'Decorative Glass', 'Installation Techniques', 'Customer Handling'];
  const certs = ['Completed', 'In Progress', null];
  months.forEach(m => {
    salespersons.forEach(sp => {
      const sessions = rnd(1, 3);
      for (let i = 0; i < sessions; i++) {
        const date = rndDate(m.start, m.end);
        data.push({
          id: `presentation_${m.label}_${sp}_${i}`,
          date: fmtDate(date),
          salesperson: sp,
          trainingTopic: pick(topics),
          assessmentScore: rnd(55, 98),
          certification: pick(certs),
          nextTrainingDue: fmtDate(addDays(date, 30)),
          ecId: 'EC001',
        });
      }
    });
  });
  return data;
};

// KPI 7 - Architect Feedback
export const seedArchitectFeedback = () => {
  const data = [];
  months.forEach(m => {
    for (let i = 0; i < 15; i++) {
      const date = rndDate(m.start, m.end);
      const rating = rnd(3, 5);
      const category = rating >= 4 ? 'Positive' : rating === 3 ? 'Neutral' : 'Negative';
      const feedbacks = {
        Positive: ['Excellent product knowledge and hospitality!', 'Very impressed with the display setup.', 'Great experience overall. Will recommend.'],
        Neutral: ['Good visit, could be more organized.', 'Average experience, expected more variety.'],
        Negative: ['Needs improvement in response time.', 'Product info could be better explained.'],
      };
      data.push({
        id: `archfeedback_${m.label}_${i}`,
        type: 'architect',
        date: fmtDate(date),
        name: pick(architectNames),
        firmName: pick(architectFirms),
        rating,
        feedbackText: pick(feedbacks[category]),
        parameters: {
          productKnowledge: rnd(3, 5),
          presentation: rnd(3, 5),
          hospitality: rnd(3, 5),
          overallExperience: rating,
        },
        category,
        salesperson: pick(salespersons),
        ecId: 'EC001',
      });
    }
  });
  return data;
};

// KPI 8 - Expenses
export const seedExpenses = () => {
  const data = [];
  const categories = [
    { name: 'Utilities', budget: 25000 },
    { name: 'Maintenance', budget: 15000 },
    { name: 'Hospitality', budget: 20000 },
    { name: 'Marketing Materials', budget: 30000 },
    { name: 'Miscellaneous', budget: 10000 },
  ];
  months.forEach(m => {
    categories.forEach(cat => {
      const entries = rnd(2, 5);
      const budgetPer = Math.floor(cat.budget / entries);
      for (let i = 0; i < entries; i++) {
        const date = rndDate(m.start, m.end);
        const actual = Math.floor(budgetPer * (0.7 + Math.random() * 0.6));
        data.push({
          id: `expense_${m.label}_${cat.name}_${i}`,
          date: fmtDate(date),
          category: cat.name,
          description: `${cat.name} expense ${i + 1} - ${m.label}`,
          budgetAmount: budgetPer,
          actualAmount: actual,
          variance: budgetPer - actual,
          approvedBy: 'Sanju Gupta',
          ecId: 'EC001',
        });
      }
    });
  });
  return data;
};

// KPI 9 - Audit Scores
export const seedAuditScores = () => {
  const data = [];
  const parameters = ['Compliance', 'Documentation', 'Safety', 'Display Standards', 'Customer Service'];
  const auditorNames = ['Mr. Anil Verma', 'Ms. Rekha Nair', 'Mr. Suresh Pillai'];
  months.forEach((m, mi) => {
    const auditDate = new Date(m.start.getFullYear(), m.start.getMonth(), rnd(10, 20));
    const auditor = pick(auditorNames);
    parameters.forEach(param => {
      const maxScore = 20;
      const score = rnd(13, 20);
      data.push({
        id: `audit_${m.label}_${param}`,
        date: fmtDate(auditDate),
        auditorName: auditor,
        parameter: param,
        score,
        maxScore,
        findings: score < 15 ? `Improvement needed in ${param.toLowerCase()}` : 'Satisfactory',
        actionTaken: score < 15 ? 'Action plan initiated' : 'No action required',
        ecId: 'EC001',
      });
    });
  });
  return data;
};

// KPI 10 - Salesperson Performance
export const seedSalesPlans = () => {
  const targetAreas = ['Lead Generation', 'Conversion Rate', 'Revenue', 'Architect Visits', 'Customer NPS', 'Training Completion', 'Footfall', 'Follow-ups', 'New Accounts', 'Proposals Sent'];
  return salespersons.map((sp, idx) => ({
    id: `salesplan_${sp.replace(' ', '_')}`,
    salespersonId: `SP00${idx + 1}`,
    salespersonName: sp,
    lines: Array.from({ length: 20 }, (_, i) => {
      const targetVal = rnd(20, 100);
      const actualVal = Math.floor(targetVal * (0.6 + Math.random() * 0.6));
      const achievement = Math.min(Math.round((actualVal / targetVal) * 100), 150);
      return {
        lineNo: i + 1,
        targetArea: targetAreas[i % targetAreas.length],
        targetMetric: i % 2 === 0 ? 'Count' : 'Percentage',
        targetValue: targetVal,
        actualValue: actualVal,
        achievementPct: achievement,
        status: achievement >= 90 ? 'On Track' : achievement >= 70 ? 'At Risk' : 'Below Target',
        remarks: achievement >= 90 ? 'Excellent performance' : achievement >= 70 ? 'Needs attention' : 'Action required',
      };
    }),
    ecId: 'EC001',
  }));
};

// KPI 11 - Customer Feedback
export const seedCustomerFeedback = () => {
  const data = [];
  const feedbackTexts = [
    'Amazing showroom experience! Very knowledgeable staff.',
    'Good product range but staff took time to respond.',
    'Excellent display and ambience. Will come back.',
    'Average experience. The staff was helpful but busy.',
    'Very impressed with the variety of glass products.',
    'Great hospitality and detailed product explanation.',
    'Showroom is well-maintained. Staff is courteous.',
    'Could improve on response time but overall good.',
  ];
  months.forEach(m => {
    for (let i = 0; i < 30; i++) {
      const date = rndDate(m.start, m.end);
      const rating = rnd(3, 5);
      data.push({
        id: `custfeedback_${m.label}_${i}`,
        type: 'customer',
        date: fmtDate(date),
        name: `Customer ${i + 1}`,
        contact: `+91 9${rnd(100000000, 999999999)}`,
        rating,
        feedbackText: pick(feedbackTexts),
        parameters: {
          productDisplay: rnd(3, 5),
          staffBehavior: rnd(3, 5),
          responseTime: rnd(2, 5),
          solutionProvided: rnd(3, 5),
          overallExperience: rating,
        },
        staffAttended: pick(salespersons),
        ecId: 'EC001',
      });
    }
  });
  return data;
};

// Aggregate all seed data
export const ALL_SEED_DATA = {
  leadConversions: seedLeadConversions(),
  architectInvitations: seedArchitectInvitations(),
  footfall: seedFootfall(),
  showroomScores: seedShowroomScores(),
  dataMgmt: seedDataMgmt(),
  presentationSkills: seedPresentationSkills(),
  architectFeedback: seedArchitectFeedback(),
  expenses: seedExpenses(),
  auditScores: seedAuditScores(),
  salesPlans: seedSalesPlans(),
  customerFeedback: seedCustomerFeedback(),
};

export default ALL_SEED_DATA;
