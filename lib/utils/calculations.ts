export interface TAMInputs {
  industries: string[];
  roles: string[];
  companySizes: string[];
  geographicFilters: string[];
  dataSource: string;
  customMultiplier?: number;
}

export interface TAMResults {
  baseMarketSize: number;
  estimatedReachable: number;
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  breakdown: {
    byIndustry: Record<string, number>;
    byRole: Record<string, number>;
    byCompanySize: Record<string, number>;
  };
}

// Industry multipliers (global, LinkedIn-reachable professionals)
// Based on ~420-450M decision-makers on LinkedIn globally
const INDUSTRY_MULTIPLIERS: Record<string, number> = {
  Technology: 18000000, // software, IT services, SaaS, infra
  Healthcare: 14000000, // excludes frontline-only workers
  Finance: 11000000, // banking, fintech, insurance, accounting
  Manufacturing: 16000000, // ops, engineering, management-heavy
  Retail: 13000000, // corporate + ops, not store clerks
  Education: 9000000, // admin, leadership, private edu
  Real_Estate: 7000000,
  Consulting: 6000000,
  Marketing: 9000000, // specialists + leadership
  Sales: 15000000, // includes SDRs → VPs
};

// Role multipliers (global, decision-grade professionals currently in seat)
// Aligned with LinkedIn Sales Navigator ranges and executive-to-firm ratios
const ROLE_MULTIPLIERS: Record<string, number> = {
  CEO: 420000,
  CTO: 280000,
  CFO: 350000,
  COO: 300000,
  VP_Sales: 650000,
  Sales_Director: 1100000,
  CMO: 220000,
  VP_Marketing: 520000,
  Marketing_Director: 980000,
  VP_Engineering: 400000,
};

// Company size multipliers (global distribution)
// Mid-market (11-200) represents most B2B buyers
const COMPANY_SIZE_MULTIPLIERS: Record<string, number> = {
  "1-10": 0.18,
  "11-50": 0.24,
  "51-200": 0.26,
  "201-1000": 0.20,
  "1000+": 0.12,
};

// Data source multipliers (realistic reachable fraction)
// Accounts for filters, activity, geography, and seniority constraints
const DATA_SOURCE_MULTIPLIERS: Record<string, number> = {
  LinkedIn: 0.65,
  Industry_databases: 0.55,
  Public_records: 0.50,
  Custom: 0.45,
};

// Confidence interval ranges (reality-based market sizing)
const CONFIDENCE_RANGE = {
  conservative: 0.65,
  expected: 1.0,
  aggressive: 1.35,
};

export function calculateTAM(inputs: TAMInputs): TAMResults {
  let baseMarketSize = 0;
  const breakdown = {
    byIndustry: {} as Record<string, number>,
    byRole: {} as Record<string, number>,
    byCompanySize: {} as Record<string, number>,
  };

  // Calculate base market size using intersection approach to avoid double-counting
  const industryTotal = inputs.industries.reduce(
    (sum, industry) => sum + (INDUSTRY_MULTIPLIERS[industry] || 5000000),
    0
  );
  const roleTotal = inputs.roles.reduce(
    (sum, role) => sum + (ROLE_MULTIPLIERS[role] || 400000),
    0
  );
  const companySizeTotal = inputs.companySizes.reduce(
    (sum, size) => sum + (COMPANY_SIZE_MULTIPLIERS[size] || 0.2),
    0
  );

  // Use minimum to avoid double-counting (industry and role overlap)
  // Adjusted by company size distribution and custom multiplier
  baseMarketSize =
    Math.min(industryTotal, roleTotal) *
    (companySizeTotal || 1) *
    (inputs.customMultiplier || 1);

  // Apply data source adjustment (realistic reachable fraction)
  const dataSourceMultiplier =
    DATA_SOURCE_MULTIPLIERS[inputs.dataSource] || DATA_SOURCE_MULTIPLIERS.Custom;
  const estimatedReachable = baseMarketSize * dataSourceMultiplier;

  // Calculate confidence intervals (reality-based ranges)
  const confidenceInterval = {
    lower: estimatedReachable * CONFIDENCE_RANGE.conservative,
    upper: estimatedReachable * CONFIDENCE_RANGE.aggressive,
  };

  // Calculate breakdowns (applying data source multiplier for consistency)
  inputs.industries.forEach((industry) => {
    breakdown.byIndustry[industry] =
      (INDUSTRY_MULTIPLIERS[industry] || 5000000) * dataSourceMultiplier;
  });

  inputs.roles.forEach((role) => {
    breakdown.byRole[role] =
      (ROLE_MULTIPLIERS[role] || 400000) * dataSourceMultiplier;
  });

  inputs.companySizes.forEach((size) => {
    breakdown.byCompanySize[size] =
      baseMarketSize * (COMPANY_SIZE_MULTIPLIERS[size] || 0.2);
  });

  return {
    baseMarketSize: Math.round(baseMarketSize),
    estimatedReachable: Math.round(estimatedReachable),
    confidenceInterval: {
      lower: Math.round(confidenceInterval.lower),
      upper: Math.round(confidenceInterval.upper),
    },
    breakdown,
  };
}

export interface ROIInputs {
  leads: number;
  outreachFrequency: "daily" | "weekly" | "monthly";
  campaignDuration: number; // in months
  openRate: number; // percentage
  replyRate: number; // percentage
  meetingBookedRate: number; // percentage
  meetingShowRate: number; // percentage
  dealCloseRate: number; // percentage
  averageDealValue: number; // ACV
  contractLength: number; // in months
  customerLTV?: number; // optional override
  costPerLead: number;
  toolCosts: number; // monthly
  timeCosts: number; // total
  otherExpenses: number;
}

export interface ROIResults {
  totalRevenue: number;
  totalCosts: number;
  roi: number; // percentage
  roiMultiple: number;
  revenuePerLead: number;
  costPerAcquisition: number;
  breakEvenLeads: number;
  funnelBreakdown: {
    opens: number;
    replies: number;
    meetingsBooked: number;
    meetingsShown: number;
    dealsClosed: number;
  };
}

export function calculateROI(inputs: ROIInputs): ROIResults {
  // Calculate funnel conversions
  const opens = inputs.leads * (inputs.openRate / 100);
  const replies = opens * (inputs.replyRate / 100);
  const meetingsBooked = replies * (inputs.meetingBookedRate / 100);
  const meetingsShown = meetingsBooked * (inputs.meetingShowRate / 100);
  const dealsClosed = meetingsShown * (inputs.dealCloseRate / 100);

  // Calculate revenue
  const ltv = inputs.customerLTV || inputs.averageDealValue * (inputs.contractLength / 12);
  const totalRevenue = dealsClosed * ltv;

  // Calculate costs
  const frequencyMultiplier =
    inputs.outreachFrequency === "daily"
      ? 30
      : inputs.outreachFrequency === "weekly"
      ? 4
      : 1;
  const totalToolCosts = inputs.toolCosts * inputs.campaignDuration;
  const totalCosts =
    inputs.leads * inputs.costPerLead +
    totalToolCosts +
    inputs.timeCosts +
    inputs.otherExpenses;

  // Calculate ROI metrics
  const roi = totalCosts > 0 ? ((totalRevenue - totalCosts) / totalCosts) * 100 : 0;
  const roiMultiple = totalCosts > 0 ? totalRevenue / totalCosts : 0;
  const revenuePerLead = inputs.leads > 0 ? totalRevenue / inputs.leads : 0;
  const costPerAcquisition = dealsClosed > 0 ? totalCosts / dealsClosed : 0;

  // Calculate break-even point
  const revenuePerDeal = ltv;
  const conversionRate = dealsClosed / inputs.leads;
  const breakEvenLeads =
    conversionRate > 0
      ? totalCosts / (revenuePerDeal * conversionRate)
      : Infinity;

  return {
    totalRevenue: Math.round(totalRevenue),
    totalCosts: Math.round(totalCosts),
    roi: Math.round(roi * 100) / 100,
    roiMultiple: Math.round(roiMultiple * 100) / 100,
    revenuePerLead: Math.round(revenuePerLead * 100) / 100,
    costPerAcquisition: Math.round(costPerAcquisition * 100) / 100,
    breakEvenLeads: Math.round(breakEvenLeads),
    funnelBreakdown: {
      opens: Math.round(opens),
      replies: Math.round(replies),
      meetingsBooked: Math.round(meetingsBooked),
      meetingsShown: Math.round(meetingsShown),
      dealsClosed: Math.round(dealsClosed),
    },
  };
}

