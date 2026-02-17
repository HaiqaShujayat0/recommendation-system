/**
 * Smart mock response engine for GLYERAL AI Chat.
 * Pattern-matches user queries against drug names, clinical topics,
 * and recommendation context to return realistic clinical responses.
 *
 * Replace with real AI backend when ready.
 */

const DRUG_RESPONSES = {
  metformin: {
    why: `Metformin is recommended as **first-line therapy** per ADA 2025 Standards of Care for this patient's profile.\n\n**Key factors:**\n- HbA1c of 8.2% indicates need for effective glycemic control\n- 95% confidence score based on guideline alignment\n- Proven cardiovascular safety profile\n- Low hypoglycemia risk as monotherapy\n- Cost-effective with extensive clinical evidence\n\nThe 1000mg twice daily dosing provides optimal glycemic reduction while minimizing GI side effects through gradual titration.`,
    interactions: `Metformin has a favorable interaction profile with the other recommended medications:\n\n- **+ Farxiga (Dapagliflozin):** Safe and synergistic combination. Complementary mechanisms — Metformin reduces hepatic glucose output while Farxiga promotes renal glucose excretion.\n- **+ Semaglutide:** Well-tolerated combination. Both reduce HbA1c through different pathways.\n- **+ Glimepiride:** Use caution — increased hypoglycemia risk when combined with sulfonylureas.\n\n**Note:** Monitor renal function (eGFR) periodically as Metformin requires eGFR ≥ 30 mL/min.`,
    sideEffects: `Common side effects of Metformin include:\n\n- **GI symptoms** (most common): Nausea, diarrhea, abdominal discomfort — typically resolve within 2-4 weeks\n- **Vitamin B12 deficiency:** Monitor B12 levels annually with long-term use\n- **Lactic acidosis:** Rare but serious — risk increases with renal impairment\n- **Metallic taste:** Usually temporary\n\n**Mitigation strategies:**\n- Start at 500mg and titrate slowly\n- Take with meals\n- Consider extended-release formulation if GI intolerance persists`,
  },
  farxiga: {
    why: `Farxiga (Dapagliflozin) is recommended based on multiple guideline endorsements:\n\n**Primary reasons:**\n- **KDIGO 2024:** Strong recommendation for CKD benefit — reduces progression of kidney disease\n- **AHA Guidelines:** Heart failure protection with proven reduction in hospitalization\n- 88% confidence score reflecting strong multi-guideline support\n\n**Additional benefits:**\n- Weight loss of 2-3 kg typical\n- Blood pressure reduction of 3-5 mmHg\n- Low hypoglycemia risk as an SGLT2 inhibitor`,
    interactions: `Farxiga interaction considerations:\n\n- **+ Metformin:** Excellent combination — complementary mechanisms\n- **+ Insulin (Glargine):** May need insulin dose reduction (10-20%) to prevent hypoglycemia\n- **+ Diuretics:** Monitor for volume depletion and dehydration\n\n**Important monitoring:**\n- Renal function at baseline and periodically\n- Watch for signs of diabetic ketoacidosis (rare but serious)\n- Monitor for genital mycotic infections`,
    sideEffects: `Common side effects of Farxiga:\n\n- **Genital mycotic infections:** More common in females (10-15%)\n- **Urinary tract infections:** Mild increase in risk\n- **Volume depletion:** Especially in elderly or those on diuretics\n- **Diabetic ketoacidosis:** Rare but important to recognize\n\n**Key counseling points:**\n- Maintain adequate hydration\n- Practice good genital hygiene\n- Hold before major surgery or during acute illness`,
  },
  semaglutide: {
    why: `Semaglutide is recommended for its dual benefits:\n\n**Guideline support:**\n- **ADA 2025:** Recommended for patients with overweight/obesity and T2DM\n- **AHA:** Cardiovascular risk reduction demonstrated in SUSTAIN-6 and SELECT trials\n- 88% confidence score\n\n**Expected outcomes:**\n- HbA1c reduction of 1.0-1.5%\n- Weight loss of 5-10% body weight\n- Cardiovascular event reduction\n\nThe titration schedule (0.5mg → 1mg weekly) minimizes GI side effects while achieving therapeutic doses.`,
    interactions: `Semaglutide interaction considerations:\n\n- **+ Metformin:** Safe combination, no dose adjustment needed\n- **+ Glimepiride:** CAUTION — increased hypoglycemia risk. Consider reducing Glimepiride dose by 50%\n- **+ Insulin (Glargine):** May need insulin dose reduction\n- **+ Oral medications:** Semaglutide slows gastric emptying — may affect absorption of other oral drugs\n\n**Recommendation:** If both Semaglutide and Glimepiride are accepted, closely monitor blood glucose.`,
    sideEffects: `Common side effects of Semaglutide:\n\n- **GI symptoms** (most common):\n  - Nausea (15-20%) — usually transient\n  - Vomiting, diarrhea\n  - Decreased appetite (therapeutic in overweight patients)\n- **Injection site reactions:** Mild, infrequent\n- **Pancreatitis:** Rare — monitor for persistent severe abdominal pain\n\n**Mitigation:**\n- Slow titration as prescribed (0.5mg x 4 weeks → 1mg)\n- Eat smaller meals\n- Avoid high-fat foods initially`,
  },
  glargine: {
    why: `Glargine (Insulin) is recommended as basal insulin coverage:\n\n**Clinical rationale:**\n- **ADA 2025:** Basal insulin recommended when HbA1c > 9% or symptomatic hyperglycemia\n- Patient's HbA1c of 8.2% with current therapy gap suggests benefit\n- 78% confidence — slightly lower due to hypoglycemia risk considerations\n\n**Before-dinner dosing rationale:**\n- Targets fasting glucose control\n- 10-unit starting dose is conservative and safe\n- Allows for titration based on fasting glucose readings`,
    interactions: `Glargine interaction profile:\n\n- **+ Metformin:** Safe — Metformin provides insulin-sensitizing effect\n- **+ Farxiga:** May need dose reduction of Glargine by 10-20%\n- **+ Semaglutide:** Additive glucose-lowering — monitor closely\n- **+ Glimepiride:** HIGH RISK — both increase hypoglycemia risk. Not recommended together.\n\n**Critical monitoring:**\n- Fasting blood glucose daily during titration\n- Titrate by 2 units every 3 days to target fasting glucose of 80-130 mg/dL`,
    sideEffects: `Common side effects of Glargine:\n\n- **Hypoglycemia:** Most significant risk — educate patient on recognition and treatment\n- **Weight gain:** Average 1-2 kg in first year\n- **Injection site reactions:** Lipodystrophy with repeated same-site injection\n\n**Safety measures:**\n- Provide glucometer and teach SMBG\n- Prescribe glucagon emergency kit\n- Educate on "Rule of 15" for hypoglycemia management\n- Rotate injection sites`,
  },
  glimepiride: {
    why: `Glimepiride is included as a **second-line alternative** with a lower confidence score:\n\n**Rationale:**\n- 55% confidence — reflects the availability of preferred alternatives\n- Indicated primarily if Metformin is not tolerated\n- Cost-effective sulfonylurea option\n\n**Concerns:**\n- Hypoglycemia risk (especially with insulin or GLP-1 agonists)\n- Weight gain potential\n- Less cardiovascular benefit compared to SGLT2i or GLP-1 RA\n\nThis recommendation carries a **warning status** — consider only if primary options are contraindicated.`,
    interactions: `Glimepiride has several important interactions:\n\n- **+ Insulin (Glargine):** HIGH RISK — significant hypoglycemia risk. Avoid this combination.\n- **+ Semaglutide:** MODERATE RISK — increased hypoglycemia. Reduce Glimepiride dose.\n- **+ Metformin:** Acceptable combination but monitor glucose closely\n- **+ Farxiga:** Generally safe but additive glucose-lowering effect\n\n**Warning:** If the patient accepts both Semaglutide and Glimepiride, strongly recommend dose reduction or discontinuation of Glimepiride.`,
    sideEffects: `Common side effects of Glimepiride:\n\n- **Hypoglycemia:** Most significant concern — risk increases with:\n  - Skipped meals\n  - Excessive exercise\n  - Alcohol consumption\n  - Combination with insulin or GLP-1 agonists\n- **Weight gain:** 2-4 kg typical\n- **GI disturbances:** Mild nausea, rare\n\n**Patient counseling:**\n- Always eat regular meals\n- Carry glucose tablets\n- Take before breakfast as directed\n- Report any episodes of dizziness, sweating, or confusion`,
  },
};

const GENERAL_RESPONSES = {
  summary: (recs) => {
    if (!recs?.length) return "No recommendations have been generated yet. Please generate recommendations first, and I can help you understand them.";
    const medList = recs.map(r => `- **${r.med}** (${r.dose}) — ${r.confidence}% confidence`).join('\n');
    return `Here's a summary of the current recommendations:\n\n${medList}\n\n**Overall approach:** This is a multi-target therapy strategy combining first-line Metformin with cardio-renal protective agents (Farxiga, Semaglutide) and basal insulin support. Glimepiride is included as a fallback option.\n\nWould you like me to explain any specific recommendation in detail?`;
  },
  interactions: (recs) => {
    if (!recs?.length) return "No recommendations available to analyze interactions.";
    return `**Drug Interaction Analysis:**\n\nI've analyzed the ${recs.length} recommended medications for potential interactions:\n\n**Safe combinations:**\n- Metformin + Farxiga: Synergistic, no dose adjustment\n- Metformin + Semaglutide: Safe, complementary mechanisms\n\n**Requires monitoring:**\n- Farxiga + Glargine: May need 10-20% insulin dose reduction\n- Semaglutide + Glargine: Additive hypoglycemia risk\n\n**Caution advised:**\n- Semaglutide + Glimepiride: Increased hypoglycemia — reduce Glimepiride dose\n- Glargine + Glimepiride: HIGH RISK — avoid concurrent use\n\n**Recommendation:** If all medications are accepted, consider dropping Glimepiride to avoid stacking hypoglycemia risk.`;
  },
  confidence: () => {
    return `**Understanding Confidence Scores:**\n\nThe confidence percentage reflects how strongly the AI recommends each medication based on:\n\n1. **Guideline alignment** (40% weight) — How well the drug matches ADA, KDIGO, AHA guidelines for this patient\n2. **Patient-specific factors** (30% weight) — Lab values, comorbidities, current medications\n3. **Safety profile** (20% weight) — Contraindications, interaction risk, adverse effect probability\n4. **Clinical evidence** (10% weight) — Recent trial data and real-world evidence\n\n**Score interpretation:**\n- **90-100%:** Strong recommendation, first-line choice\n- **70-89%:** Good recommendation, well-supported\n- **50-69%:** Conditional recommendation, consider alternatives\n- **Below 50%:** Weak recommendation, use only if alternatives unavailable`;
  },
  guidelines: () => {
    return `**Referenced Clinical Guidelines:**\n\nThe recommendations reference these evidence-based guidelines:\n\n- **ADA 2025** — American Diabetes Association Standards of Medical Care\n- **KDIGO 2024** — Kidney Disease: Improving Global Outcomes clinical practice guideline for diabetes management in CKD\n- **AHA** — American Heart Association guidelines for cardiovascular risk management in diabetes\n\nEach medication card shows which specific guidelines support that recommendation. The AI cross-references patient data against all applicable guidelines to generate the confidence score.`;
  },
};

const FALLBACK_RESPONSES = [
  "I can help you with questions about the recommended medications, drug interactions, clinical guidelines, or confidence scores. Could you be more specific about what you'd like to know?",
  "That's an interesting question. While I can provide clinical decision support for the current recommendations, I'd suggest consulting specialized resources for that topic. Is there anything about the recommended drugs I can help with?",
  "I'm focused on helping you evaluate the current medication recommendations. Try asking about a specific drug (e.g., 'Tell me about Metformin'), interactions, or guidelines.",
];

/**
 * Get a smart mock response based on user message and current recommendations.
 * @param {string} message - The user's message
 * @param {Array} recommendations - Current medication recommendations
 * @returns {{ response: string, delay: number }}
 */
export function getMockResponse(message, recommendations) {
  const recs = recommendations || [];
  const lower = message.toLowerCase().trim();

  // Check for drug-specific queries
  for (const [drugKey, responses] of Object.entries(DRUG_RESPONSES)) {
    if (lower.includes(drugKey)) {
      if (lower.includes('why') || lower.includes('reason') || lower.includes('recommend') || lower.includes('rationale')) {
        return { response: responses.why, delay: 1200 };
      }
      if (lower.includes('interact') || lower.includes('combination') || lower.includes('combine')) {
        return { response: responses.interactions, delay: 1400 };
      }
      if (lower.includes('side effect') || lower.includes('adverse') || lower.includes('risk') || lower.includes('safety')) {
        return { response: responses.sideEffects, delay: 1300 };
      }
      // Default to "why" if just the drug name is mentioned
      return { response: responses.why, delay: 1100 };
    }
  }

  // Check for general queries
  if (lower.includes('summar') || lower.includes('overview') || lower.includes('all recommendation')) {
    return { response: GENERAL_RESPONSES.summary(recs), delay: 1500 };
  }
  if (lower.includes('interact') || lower.includes('combination') || lower.includes('together')) {
    return { response: GENERAL_RESPONSES.interactions(recs), delay: 1600 };
  }
  if (lower.includes('confidence') || lower.includes('score') || lower.includes('percent')) {
    return { response: GENERAL_RESPONSES.confidence(), delay: 1200 };
  }
  if (lower.includes('guideline') || lower.includes('ada') || lower.includes('kdigo') || lower.includes('aha') || lower.includes('evidence')) {
    return { response: GENERAL_RESPONSES.guidelines(), delay: 1100 };
  }

  // Fallback
  const fallback = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
  return { response: fallback, delay: 900 };
}

/**
 * Generate quick action chips based on current recommendations.
 * @param {Array} recommendations - Current medication recommendations
 * @returns {Array<{ label: string, message: string }>}
 */
export function getQuickChips(recommendations) {
  const recs = recommendations || [];
  const chips = [
    { label: 'Summarize all', message: 'Give me a summary of all recommendations' },
    { label: 'Check interactions', message: 'Are there any drug interactions I should know about?' },
    { label: 'Explain scores', message: 'How are the confidence scores calculated?' },
  ];

  // Add drug-specific chips for top 2 recommendations
  const topRecs = [...recs].sort((a, b) => b.confidence - a.confidence).slice(0, 2);
  topRecs.forEach(rec => {
    chips.push({
      label: `Why ${rec.med}?`,
      message: `Why was ${rec.med} recommended for this patient?`,
    });
  });

  return chips;
}
