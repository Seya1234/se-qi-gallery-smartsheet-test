/* =========================================
  SE-QI Toolkit Project Gallery
  script.js â€” Project Data + Filter Logic

  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  HOW TO EDIT PROJECTS
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

  Find the PROJECTS array below.
  Each { } block is one project card.

  For sustainabilityPrinciples â€” pick ONE OR MORE
  from this exact list (copy-paste the text):
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    "Prevention"
    "Stewardship / Appropriateness"
    "Decarbonization / Depollution"
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  For sustainabilityOpportunities â€” each entry needs
  a "name" (from the list below) and an "explanation".
  Pick ONE OR MORE names from this exact list:
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    "Prevention"
    "Stewardship / Appropriateness"
    "Care coordination"
    "Consumables"
    "Waste management"
    "Procurement"
    "Energy"
    "Food"
    "Travel and transportation"
    "Water"
    "Climate resilience and adaptation"
    "Clinical specialty or treatment modality"
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

  âš  IMPORTANT: The filter works by matching the
  text exactly. Copy-paste from the lists above
  â€” do not retype or the filter won't match.

  For domainsOfQuality â€” write any name and
  explanation you like. These are display-only
  and do not affect filtering.
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */

/* ---- PROJECT DATA ---- */
/* ---- PROJECT DATA ---- */
const PROJECTS = [
    {
        id: 1,
        title: "C.A.R.E Collaborative",
        photo: "images/project01.jpg",
        photoAlt: "C.A.R.E Collaborative",
        province: "British Columbia",
        publishedOn: "19 June 2026",
        stage: "Work in progress",
        contactName: "Bianca Grosu",
        email: "bianca.grosu@vch.ca",
        organization: "Vancouver Coastal Health",
        department: "Spread Quality Improvement",
        healthcareSetting: "Long-Term Care - Multi-Site",
        description: "The C.A.R.E. Collaborative is a multi-site QI project implemented across seven long-term care homes in British Columbia and focused on reducing unnecessary and avoidable emergency department transfers from long-term care facilities.",
        cobenefit: `
The SE-QI Toolkit provided a strong foundation for teams beginning their planetary health journey and supported early-stage project planning and implementation.

<br><br>

<strong>Resources identified as particularly valuable:</strong>

<ul>
  <li>
    <a href="https://networks.sustainablehealthcare.org.uk/sites/default/files/resources/3._Sustainable_Care_Pathways_Guidance_-_Emergency_Department_Visit_Module_-_Oct_2015%283%29.pdf" target="_blank" rel="noopener noreferrer">
      Care Pathways: Guidance on Appraising Sustainability - Emergency Department Visit Module (2015)
    </a>
  </li>
  <li>
    <a href="https://www.bcehs.ca/our-services-site/Documents/2023%20BCEHS%20CCAR%20-%20FINAL%20PDF_MC.pdf" target="_blank" rel="noopener noreferrer">
      British Columbia Emergency Health Services 2023 Climate Change Accountability Report
    </a>
  </li>
</ul>
`,
        sustainabilityPrinciples: ["Prevention", "Stewardship / Appropriateness"],
        sustainabilityOpportunities: [
            {
                name: "Prevention",
                explanation:
                    "Avoiding complications and patient deterioration through improved continuity of care."
            },
            {
                name: "Stewardship / Appropriateness",
                explanation:
                    "Avoiding unnecessary hospital-based care and minimizing delays in care delivery."
            },
            {
                name: "Consumables",
                explanation: "Reducing unnecessary resource consumption associated with avoidable acute care utilization."
            },
            {
                name: "Waste management",
                explanation: "Reducing unnecessary medical waste generation associated with avoidable acute care utilization."
            },
            {
                name: "Travel and transportation",
                explanation: "Reducing patient transfers and associated transportation-related emissions."
            },
            {
                name: "Climate resilience and adaptation",
                explanation: "Supporting patient resilience by enabling care within familiar environments and reducing exposure to system-related stressors."
            }
        ],
        metrics: {
            environmental: [
                "Avoided carbon emissions per emergency department admission (based on the NHS ER visit model)",
                "Avoided carbon emissions per trip from long-term care sites to emergency departments (calculated using BC ambulatory emissions and the most common route for each care home)",
                "Carbon emissions per acute care bed day."
            ],
            activity: [
                "Number of avoided emergency department admissions.",
                "Number of avoided trips from long-term care sites to emergency departments."
            ]
        },
        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation:
                    "The reduction in unnecessary emergency department transfers decreases avoidable administrative burden, resource use, and pressure on acute care services."
            },
            {
                name: "Timeliness",
                explanation:
                    "Residents receive more timely care within long-term care settings while reducing pressure and delays within emergency departments."
            },
            {
                name: "Patient-Centredness / Respect",
                explanation: "Supports improved dignity, comfort, and continuity of care by enabling residents to remain within familiar long-term care environments and reducing stressful care transitions."
            }
        ]
    },
    {
        id: 2,
        title: "Waste Segregation in the Operating Room",
        photo: "images/project02.jpg",
        photoAlt: "Waste Segregation in the Operating Room",
        province: "Manitoba",
        publishedOn: "19 June 2026",
        stage: "Work in progress",
        contactName: "Tamara Miller",
        email: "tmiller1@sbgh.mb.ca",
        organization: "St. Boniface Hospital",
        department: "Anesthesiology",
        healthcareSetting: "Anesthesiology Operating Room, Tertiary Care",
        description: "This project aimed to improve waste segregation in the anesthesiology OR at St. Boniface Hospital and reduce unnecessary incineration of medical waste. Previously, a single pharmaceutical waste bin was used for mixed OR waste, which was then transported to Minnesota for high-carbon incineration. However, evidence suggests that most OR waste can instead be autoclaved or landfilled with lower environmental impact and cost. A new segregation system was therefore introduced with separate bins for sharps, pharmaceutical liquids, and general waste, supported by education sessions and ongoing staff coaching.",
        cobenefit: `
<strong>Resources identified as particularly valuable:</strong>

<ul>
  <li>
    <a href="https://greenhealthcare.ca/waste-management-and-reduction/" target="_blank" rel="noopener noreferrer">
      Waste Management and Reduction - The Canadian Coalition for Green Health Care
    </a>
  </li>
  <li>
    <a href="https://www.cmaj.ca/content/195/14/e518#:~:text=In%20a%20recent%20audit%20of,and%20cutlery%20from%20the%20cafeteria" target="_blank" rel="noopener noreferrer">
      Improper disposal of medical waste costs health systems and the environment - CMAJ
    </a>
  </li>
</ul>
`,
        sustainabilityPrinciples: ["Decarbonization / Depollution"],
        sustainabilityOpportunities: [
            {
                name: "Waste management",
                explanation: "Improved organization of medical waste to ensure appropriate disposal pathways."
            },
            {
                name: "Energy",
                explanation: "Reduced energy consumption associated with high-temperature waste incineration, contributing to lower greenhouse gas emissions by diverting waste to lower-impact autoclave or landfill processes."
            },
            {
                name: "Travel and transportation",
                explanation: "Reduced long-distance transport of medical waste to Minnesota for incineration."
            }
        ],
        metrics: {
            environmental: [
                "CO2e emissions from waste incineration before and after implementation of new waste segregation protocol.",
                "Estimated CO2e emissions associated with waste disposal pathways (incineration, autoclave, landfill)."
            ],
            activity: [
                "Weight of waste sent for incineration before and after implementation of the new segregation protocol (over comparable time periods).",
                "Cost savings associated with reduced long-distance transport.",
                "Potential: Fuel consumption avoided through reduced transportation of waste.",
                "Potential: Energy savings from reduced incineration processes."
            ]
        },
        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation: "Reduced unnecessary incineration of medical waste, lowering associated costs, energy use, labour, and transport requirements."
            },
            {
                name: "Safety",
                explanation: "Improved waste segregation practices in the operating room, reducing risks to healthcare workers associated with improper handling and disposal of medical waste."
            }
        ]
    },
    {
        id: 3,
        title: "Decrease of Personal Protective Device Failures",
        photo: "images/project03.png",
        photoAlt: "Decrease of Personal Protective Device Failures",
        province: "British Columbia",
        publishedOn: "19 June 2026",
        stage: "Work in progress",
        contactName: "Ramses Prado",
        email: "ramses.prado@phc.ca ",
        organization: "Providence Health Care",
        department: "Mental Health Program / Psychiatry",
        healthcareSetting: "Acute care",
        description: "An initiative at St. Paul's Hospital aimed to reduce failures of personal protective devices caused by depleted batteries in the Psychiatric Assessment and Stabilization Unit. A structured inventory control and battery replacement process was introduced to improve equipment reliability, enhance staff and patient safety, and reduce disruptions to care.",
        cobenefit: `
The Toolkit supports broader systems thinking by highlighting downstream effects, trade-offs, and co-benefits even in projects with mixed environmental implications.

<br><br>

<strong>Resources identified as particularly valuable:</strong>

<ul>
  <li>
    <a href="https://healthcarelca.com/database" target="_blank" rel="noopener noreferrer">
      Healthcare Life Cycle Analysis (LCA) Database
    </a>
  </li>
</ul>
`,
        sustainabilityPrinciples: ["Prevention", "Stewardship / Appropriateness"],
        sustainabilityOpportunities: [
            {
                name: "Prevention",
                explanation: "Reducing incidents and preventing complications or extended hospital stays related to equipment failure."
            },
            {
                name: "Stewardship / Appropriateness",
                explanation: "Reducing inefficiencies by appropriately using healthcare resources."
            },
            {
                name: "Waste management",
                explanation: "Avoiding waste associated with preventable equipment replacements, resource-intensive emergency responses, or prolonged hospitalizations."
            },
            {
                name: "Climate resilience and adaptation",
                explanation: "Improving reliability of essential equipment and strengthening staff and patient safety during routine and emergency care."
            }
        ],
        metrics: {
            environmental: [
                "Estimated CO2e impact associated with increased battery use, as a potential addressed trade-off."
            ],
            activity: [
                "Comparison of battery usage before and after implementation of the structured replacement schedule."
            ]
        },
        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation: "Ensures optimal use of resources to maximize capacity and reduce inefficiencies, delays, or disruptions caused by equipment failures."
            },
            {
                name: "Safety",
                explanation: "Fosters improved security by ensuring staff and patients are protected through reliable equipment performance."
            },
            {
                name: "Patient-Centredness / Respect",
                explanation: "Promotes respectful, compassionate, and person-centred care by supporting timely responses and reducing stress during patient interactions and emergencies."
            },
            {
                name: "Accessibility",
                explanation: "Allows consistent ability to reach staff in a timely manner when a patient is in need."
            }
        ]
    },
    {
        id: 4,
        title: "Reducing Unnecessary Order Sets and Repeat Testing",
        photo: "images/project04.jpg",
        photoAlt: "Reducing Unnecessary Order Sets and Repeat Testing",
        province: "British Columbia",
        publishedOn: "19 June 2026",
        stage: "Nearly or already complete",
        contactName: "Michael Barrett",
        email: "mbarrett@mun.ca",
        organization: "Quality of Care NL",
        department: "undefined",
        healthcareSetting: "Primary care",
        description: "An early-stage, ongoing project focused on identifying where repetitive and unnecessary laboratory testing can be eliminated. New policy has been introduced to implement \"hard stops\" that prevent physicians from ordering tests earlier than recommended guidelines. The Toolkit will be applied to estimate the carbon emissions associated with avoided testing.",
        cobenefit: `
<strong>Resources identified as particularly valuable:</strong>

<ul>
  <li>
    <a href="https://choosingwiselycanada.org/wp-content/uploads/2017/07/CWC_Pre-Op_Toolkit_v1.2_2017-07-12.pdf" target="_blank" rel="noopener noreferrer">
      Choosing Wisely Canada - Drop the Pre-Op
    </a>
  </li>
  <li>
    <a href="https://choosingwiselycanada.org/wp-content/uploads/2022/10/Choosing-Wisely-Canada-Labs-Recommendations-Full-List.pdf" target="_blank" rel="noopener noreferrer">
      Choosing Wisely Canada - Lab Recommendations
    </a>
  </li>
  <li>
    <a href="https://view.publitas.com/5231e51e-4654-42c2-accd-b722e21f3093/perioperative_estimating-environmental-impacts-of-unnecessary-care/page/1?_gl=1*1yiwipz*_ga*NTQxOTQ2NDA3LjE3MjU2NTgzMzk.*_ga_TRM5NF4JFC*MTcyOTcwMzc4MC42LjEuMTcyOTcwNDIzMy4wLjAuMA" target="_blank" rel="noopener noreferrer">
      CASCADES - Reducing Unnecessary Care: Estimating Environmental Impact
    </a>
  </li>
</ul>
`,
        sustainabilityPrinciples: ["Stewardship / Appropriateness"],
        sustainabilityOpportunities: [
            {
                name: "Stewardship / Appropriateness",
                explanation: "Reducing unnecessary diagnostic testing and supporting appropriate use of laboratory resources."
            },
            {
                name: "Care coordination",
                explanation: "Improving workflows through digitized ordering processes and system-level decision supports."
            },
            {
                name: "Waste management",
                explanation: "Reducing medical and laboratory waste associated with unnecessary or repeat testing."
            }
        ],
        metrics: {
            environmental: [
                "Estimated CO2e emissions avoided through reduced laboratory testing."
            ],
            activity: [
                "Number of unnecessary or repeat laboratory tests avoided."
            ]
        },
        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation: "Minimizes waste of time, effort, and cost for patients and providers by avoiding unnecessary or repeat testing."
            },
            {
                name: "Timeliness",
                explanation: "Reduces delays in care by streamlining test ordering and eliminating unnecessary tests from workflows."
            },
            {
                name: "Effectiveness",
                explanation: "Reduces unnecessary diagnostic testing through improved ordering practices."
            }
        ]
    },
    {
        id: 5,
        title: "HPV Vaccination Catch-Up Post-COVID-19",
        photo: "images/project05.jpg",
        photoAlt: "HPV Vaccination Catch-Up Post-COVID-19",
        province: "Newfoundland and Labrador",
        publishedOn: "19 June 2026",
        stage: "Work in progress",
        contactName: "Resa Belmonte",
        email: "rbelmonte@doctorsofbc.ca",
        organization: "Doctors of BC",
        department: "Practice Support Program",
        healthcareSetting: "Primary care",
        description: "This conceptual project focuses on improving HPV vaccine uptake among individuals who were aged 10-17 during the COVID-19 pandemic and may have missed routine school-based immunizations due to virtual learning and disrupted healthcare access. It is intended to strengthen preventive care delivery and reduce the long-term burden of HPV-related disease and complications.",
        cobenefit: `The Toolkit helped broaden the framing of HPV vaccination QI efforts beyond clinical`,
        sustainabilityPrinciples: ["Prevention", "Stewardship / Appropriateness"],
        sustainabilityOpportunities: [
            {
                name: "Prevention",
                explanation: "Health promotion and primary prevention through improving HPV vaccination coverage and reducing the future burden of HPV-related disease."
            },
            {
                name: "Stewardship / Appropriateness",
                explanation: "Supporting appropriate use of healthcare resources by preventing avoidable future diagnostic and treatment needs associated with HPV-related complications, thereby reducing unnecessary medical waste, transportation emissions, and healthcare costs."
            },
            {
                name: "Climate resilience and adaptation",
                explanation: "Supporting long-term population health resilience through preventive care and improved immunization coverage."
            }
        ],
        metrics: {
            environmental: [
                "CO2e of HPV vaccination delivery versus CO2e of cervical cancer treatments potentially avoided."
            ],
            activity: [
                "Increase in HPV vaccination uptake among cohorts who missed school-based vaccination programs during the COVID-19 pandemic.",
                "Incidence of cervical cancer pre- and post-improved HPV vaccine uptake.",
                "Downstream cost savings from avoided future health expenditures related to HPV-associated disease."
            ]
        },
        domainsOfQuality: [
            {
                name: "Timeliness",
                explanation: "Addresses delays in immunization coverage resulting from the COVID-19 pandemic."
            },
            {
                name: "Equity",
                explanation: "Supports improved access to HPV vaccination for youth who were disproportionately impacted by pandemic-related immunization disruptions."
            }
        ]
    },
    {
        id: 6,
        title: "Implementation of Rigid Sterilization Containers",
        photo: "images/project06.png",
        photoAlt: "Implementation of Rigid Sterilization Containers",
        province: "Nova Scotia",
        publishedOn: "19 June 2026",
        stage: "Not started - ideation",
        contactName: "Mary Lynn VanTassel",
        email: "sustainability@iwk.nshealth.ca",
        organization: "IWK Health",
        department: "Health System Sustainability",
        healthcareSetting: "Acute care, ambulatory care",
        description: "A transition from single-use blue wrap to reusable rigid sterilization containers for surgical instrument sterilization is currently being implemented across women's and children's operating rooms, and various ambulatory and inpatient units. The initiative includes procurement of over 1,200 containers and associated accessories (covers, baskets, liners, tags, etc.), totaling more than 8,000 items.",
        cobenefit: `Step 2 of the Toolkit provided clear direction on how and where sustainability could be integrated into the project by mapping opportunities to relevant environmental impact areas.`,
        sustainabilityPrinciples: [
            "Decarbonization / Depollution",
            "Prevention",
            "Stewardship / Appropriateness"
        ],
        sustainabilityOpportunities: [
            {
                name: "Prevention",
                explanation: "Reducing infection risk from compromised wraps and avoiding surgical delays caused by torn blue wrap."
            },
            {
                name: "Stewardship / Appropriateness",
                explanation: "Improving efficiency in sterile processing and reducing ergonomic strain for medical reprocessing staff."
            },
            {
                name: "Consumables",
                explanation: "Reducing reliance on single-use blue wrap and associated disposable materials through reusable rigid containers."
            },
            {
                name: "Waste management",
                explanation: "Reducing amount of waste generated in operating rooms, as well as, ambulatory and inpatient units."
            },
            {
                name: "Climate resilience and adaptation",
                explanation: "Improving supply resilience and workflow reliability by reducing reliance on single-use sterile wrap materials."
            }
        ],
        metrics: {
            environmental: [
                "Reduction in CO2e emissions associated with decreased use of single-use sterilization products."
            ],
            activity: [
                "Reduction in procurement and use of disposable materials.",
                "Reduction in disposable waste generation."
            ]
        },
        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation: "Minimizes time and effort required in sterile processing, enabling faster and more streamlined workflow."
            },
            {
                name: "Safety",
                explanation: "Avoids wrap tears that can compromise sterility or increase infection risk, and reduces ergonomic injury risk for staff due to labour-intensive processes."
            }
        ]
    },
    {
        id: 7,
        title: "Prompting Re-Assessment of Antidepressant Prescriptions",
        photo: "images/project07.jpg",
        photoAlt: "Prompting Re-Assessment of Antidepressant Prescriptions",
        province: "Ontario",
        publishedOn: "19 June 2026",
        stage: "Work in progress",
        contactName: "Margarita Lam Antoniades",
        email: "margarita.lam-antoniades@unityhealth.to",
        organization: "Unity Health Toronto and University of Toronto",
        department: "Family and Community Medicine",
        healthcareSetting: "Family Medicine",
        description: "This initiative aims to promote reassessment of antidepressant prescriptions in primary care for patients who have been on treatment for over one year, addressing potential inappropriate long-term prescribing and reflexive renewal by family physicians. Clinical recommendations typically support reassessment after six months of remission, though this is often missed in practice.",
        cobenefit: `The Toolkit helps users clearly visualize or conceptualize how their project contributes to sustainability outcomes.`,
        sustainabilityPrinciples: [
            "Stewardship / Appropriateness"
        ],
        sustainabilityOpportunities: [
            {
                name: "Stewardship / Appropriateness",
                explanation: "Avoids unnecessary long-term antidepressant use through improved reassessment, reducing over-treatment and supporting optimal, evidence-based prescribing practices."
            },
            {
                name: "Waste management",
                explanation: "Reduces pharmaceutical waste through decreased inappropriate prescriptions and refills."
            }
        ],
        metrics: {
            environmental: [
                "Estimated CO2e associated with antidepressant medication use avoided (based on number of treatment-days avoided or units deprescribed)."
            ],
            activity: [
                "Percentage of antidepressant prescriptions reassessed over one year.",
                "Number and proportion of reassessments resulting in deprescribing or dose reduction (when clinically appropriate).",
                "Number of antidepressant prescription refills avoided."
            ]
        },
        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation: "Reduces potentially unnecessary prescribing and associated use of healthcare resources."
            },
            {
                name: "Safety",
                explanation: "Supports identification of medication burden, adverse effects, and risks associated with prolonged antidepressant use."
            },
            {
                name: "Patient-Centredness / Respect",
                explanation: "Encourages shared decision-making aligned with patient goals, preferences, and treatment needs."
            },
            {
                name: "Effectiveness",
                explanation: "Promotes evidence-based reassessment to ensure ongoing treatment benefit outweighs harm."
            }
        ]
    },
    {
        id: 8,
        title: "Reducing the Climate Impact of Metered-Dose Inhalers",
        photo: "images/project08.jpg",
        photoAlt: "Reducing the Climate Impact of Metered-Dose Inhalers",
        province: "British Columbia",
        publishedOn: "19 June 2026",
        stage: "Work in progress",
        contactName: "Morgan Flynn",
        email: "morgan.flynn@interiorhealth.ca",
        organization: "Interior Health",
        department: "Family Practice",
        healthcareSetting: "Primary Care",
        description: "This project was a collaboration between a primary care pharmacist and a family physician to reduce the environmental impact of inhaler prescribing in primary care. The initiative focused on optimizing respiratory care by assessing whether inhalers were needed, identifying opportunities for deprescribing when clinically appropriate, switching patients to lower-carbon dry powder inhalers, and providing education on inhaler disposal. Patients' experiences with team-based care were also explored, including the role of sustainability considerations and the value of in-depth conversations in healthcare decision-making.",
        cobenefit: `The Toolkit offers helpful reinforcement of existing knowledge and the reminder to consistently apply a sustainability lens when completing quality improvement work.`,
        sustainabilityPrinciples: [
            "Decarbonization / Depollution",
            "Prevention",
            "Stewardship / Appropriateness"
        ],
        sustainabilityOpportunities: [
            {
                name: "Prevention",
                explanation: "Supporting the optimal management of respiratory diseases and avoiding unnecessary or inappropriate treatment."
            },
            {
                name: "Stewardship / Appropriateness",
                explanation: "Reducing unnecessary inhaler prescribing and identifying opportunities for deprescribing to facilitate appropriate treatments and lower overall consumption of medical resources."
            },
            {
                name: "Care coordination",
                explanation: "Testing a more comprehensive and adaptable care approach through team-based care, involving collaboration between physicians, pharmacists, and patients."
            },
            {
                name: "Waste management",
                explanation: "Educating patients on proper inhaler disposal and recycling practices."
            },
            {
                name: "Clinical specialty or treatment modality",
                explanation: "Lowering the carbon footprint of respiratory care by reassessing inhaler prescribing practices from a sustainability-focused lens."
            }
        ],
        metrics: {
            environmental: [
                "Change in overall carbon emissions from inhaler prescribing pre- and post-intervention using life cycle assessment datasets."
            ],
            activity: [
                "EMR-derived prescribing data for inhalers (pre- and post-intervention).",
                "Number of inhaler switches to lower-carbon alternatives where appropriate.",
                "Number of deprescribing actions or prescription reassessments following patient review.",
                "Number of team-based care education sessions completed."
            ]
        },
        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation: "Optimizes healthcare resources by reducing unnecessary prescribing, as well as deprescribing when appropriate."
            },
            {
                name: "Patient-Centredness / Respect",
                explanation: "Supports shared decision-making that incorporates patient lifestyle, preferences, and perspectives on environmental sustainability into their respiratory care."
            },
            {
                name: "Appropriateness",
                explanation: "Ensures treatment decisions align with individual patients' health goals through personalized assessment and education."
            },
            {
                name: "Accessibility",
                explanation: "Improves access to respiratory care expertise, education, and pharmacist-led support within primary care."
            }
        ]
    },
    {
        id: 11,
        title: "Digitizing Lab Results in Nephrology Services",
        photo: "images/project11.jpg",
        photoAlt: "Digitizing Lab Results in Nephrology Services",
        province: "British Columbia",
        publishedOn: "19 June 2026",
        stage: "Nearly or already complete",
        contactName: "Nicole Terhune",
        email: "nicole.terhune@interiorhealth.ca",
        organization: "Interior Health",
        department: "Nephrology",
        healthcareSetting: "Outpatient Renal Clinic",

        description: "This initiative was undertaken within an outpatient renal clinic to reduce paper waste by digitizing the receipt of community laboratory blood work results. The previous fax-based process generated approximately 70–120 pages per day, including cover sheets and duplicate reports that were routinely discarded. Nicole Terhune participated in the SE-QI pilot after learning about the Toolkit through a newsletter update. While the initiative primarily focused on improving staff efficiency, sustainability was recognized as an important co-benefit, and the Toolkit provided additional support for evaluating and communicating its environmental impacts.",

        cobenefit: `The most valuable aspect of the Toolkit was its guidance for identifying and quantifying environmental impacts within quality improvement projects, particularly through tools and methods to estimate CO₂e reductions associated with paper use.`,

        sustainabilityPrinciples: [
            "Decarbonization / Depollution",
            "Stewardship / Appropriateness"
        ],

        sustainabilityOpportunities: [
            {
                name: "Care coordination",
                explanation: "Digitizing processes to improve information flow and reduce reliance on paper-based systems."
            },
            {
                name: "Waste management",
                explanation: "Reducing paper use and associated waste through the elimination of printed faxes."
            },
            {
                name: "Energy",
                explanation: "Reducing energy consumption associated with printing, photocopying, and paper handling."
            },
            {
                name: "Staff wellbeing",
                explanation: "Supporting provider resilience through more efficient and streamlined digital workflows."
            }
        ],

        metrics: {
            environmental: [
                "Estimated CO₂e emissions avoided through reduced paper use and elimination of printed faxes.",
                "Nicole's calculations estimated that 26,622 sheets of paper were avoided annually, corresponding to approximately 160 kg CO₂e avoided per year (0.006 kg CO₂e per sheet)."
            ],

            activity: [
                "Reduction in the number of printed pages from faxed community laboratory results.",
                "Nicole's calculations estimated approximately 26,622 avoided printed sheets annually (102 sheets per day × 261 workdays in 2025)."
            ]
        },

        domainsOfQuality: [
            {
                name: "Efficiency",
                explanation: "Improved use of staff time and resources by eliminating duplicate and unnecessary paper-based processes and reducing the need to manage printed faxed results."
            },
            {
                name: "Accessibility",
                explanation: "Facilitated faster and more direct access to laboratory results through digital systems, reducing delays associated with receiving, sorting, and processing faxed documents."
            }
        ]
    },
    {
        id: 9,
        type: "initiative",
        title: "SE-QI Toolkit as an Engagement tool",
        photo: "images/project09.png",
        province: "Ontario",
        publishedOn: "19 June 2026",
        stage: "Work in progress",
        contactName: "John Short",
        email: "climatehealth@northernhealth.ca",
        organization: "Northern Health Authority",
        department: "Energy and Environmental Sustainability",
        healthcareSetting: "",
        sustainabilityPrinciples: [],
        sustainabilityOpportunities: [],
        metrics: {
            environmental: [],
            activity: []
        },
        domainsOfQuality: [],
        cobenefit: "",
        initiativeStage: "Work in progress",
        description: `The initiative involved using the SE-QI Toolkit to support sustainability-focused quality improvement work within Northern Health, particularly in relation to clinical ideas such as reducing single-use materials, such as disposable patient gowns, and improving resource stewardship.`,
        toolkitApplication: `The Toolkit was used during meetings with clinical teams by inputting project ideas and guiding users through Steps 1-3 to explore sustainability opportunities and interpret outputs. It also helped identify relevant resources and demonstrated the Toolkit's accessibility and practical utility for users unfamiliar with the field of planetary health.`,
        toolkitAudienceUptake: `The primary audience has been clinical teams and individuals initiating sustainability-related QI projects. Uptake has been early-stage and exploratory, with the Toolkit mainly used as an engagement and education tool.`,
        mostValuableElements: `Step 2 of the Toolkit was identified as the most valuable component due to its clear, structured presentation of resources that helped avoid unnecessary complexity. It enabled users to efficiently identify relevant pathways and supported quicker decision-making without requiring extensive independent research.`,
        qiIntegration: "Yes",
        qiIntegrationComments: `There is strong potential for the Toolkit to be integrated into routine QI work within Northern Health. Given limited capacity in current care models and few dedicated sustainability roles, the Toolkit could help provide structure and direction for teams pioneering people-oriented clinical sustainability initiatives.`
    },
    {
        id: 10,
        type: "initiative",
        title: "Integrating the SE-QI Toolkit in ONSQIN",
        photo: "images/project10.png",
        province: "British Columbia",
        publishedOn: "19 June 2026",
        stage: "Nearly or already complete",
        contactName: "Pierrette Price-Arsenault",
        email: "ONSQIN@ontariohealth.ca",
        organization: "Ontario Health",
        department: "Ontario Surgical Quality Improvement Network",
        healthcareSetting: "",
        sustainabilityPrinciples: [],
        sustainabilityOpportunities: [],
        metrics: {
            environmental: [],
            activity: []
        },
        domainsOfQuality: [],
        cobenefit: "",
        initiativeStage: "Nearly or already complete",
        description: `An early-stage initiative involving exploration of the SE-QI Toolkit as a potential future resource to be introduced and disseminated to clinicians through Ontario Health's Closing the Quality Gap campaign. The Toolkit has the potential to support surgical quality improvement projects by incorporating a valuable sustainability lens into clinically focused initiatives.`,
        toolkitApplication: `The Toolkit was recently featured at the Ontario Health's Closing the Quality Gap campaign meeting, where its capabilities, resources, and potential for formal integration into educational curricula were discussed.`,
        toolkitAudienceUptake: `The intended audience is ONSQIN members across approximately 55 hospitals in Ontario. Uptake is currently limited to pilot exploration, with initial use focused on testing feasibility and gathering insights to support potential future scaling.`,
        mostValuableElements: `Information on how sustainability outcomes can be incorporated into clinical projects.
Links to credible carbon calculators to aid data collection, measurement, and analysis.`,
        qiIntegration: "No",
        qiIntegrationComments: ""
    }
];

/* ---- FILTER TAXONOMY ---- */
/* These define the sidebar checkbox groups.
   Filters apply only to regular Projects, not Training & Capacity-Building Initiatives. */
const FILTER_GROUPS = [
    {
        label: "Province / Territory",
        field: "province",
        values: [
            "Alberta",
            "British Columbia",
            "Manitoba",
            "New Brunswick",
            "Newfoundland and Labrador",
            "Nova Scotia",
            "Ontario",
            "Prince Edward Island",
            "Quebec",
            "Saskatchewan"
        ]
    },
    {
        label: "Sustainability Principles",
        field: "sustainabilityPrinciples",
        values: [
            "Prevention",
            "Stewardship / Appropriateness",
            "Decarbonization / Depollution"
        ]
    },
    {
        label: "Sustainability Opportunities",
        field: "sustainabilityOpportunities",
        values: [
            "Prevention",
            "Stewardship / Appropriateness",
            "Care coordination",
            "Consumables",
            "Waste management",
            "Procurement",
            "Energy",
            "Food",
            "Travel and transportation",
            "Water",
            "Climate resilience and adaptation",
            "Clinical specialty or treatment modality"
        ]
    }
];

const REGULAR_PROJECTS = PROJECTS.filter(project => project.type !== "initiative");
const INITIATIVES = PROJECTS.filter(project => project.type === "initiative");

let activeFilters = {
    province: new Set(),
    sustainabilityPrinciples: new Set(),
    sustainabilityOpportunities: new Set()
};

function buildFilters() {
    const sidebar = document.getElementById("filterSidebar");
    if (!sidebar) return;

    sidebar.innerHTML = "";

    FILTER_GROUPS.forEach(group => {
        const section = document.createElement("div");
        section.className = "filter-group";

        const heading = document.createElement("h3");
        heading.className = "filter-group-heading";
        heading.textContent = group.label;
        section.appendChild(heading);

        group.values.forEach(value => {
            const label = document.createElement("label");
            label.className = "filter-checkbox-label";

            const input = document.createElement("input");
            input.type = "checkbox";
            input.className = "filter-checkbox";
            input.value = value;
            input.dataset.field = group.field;
            input.addEventListener("change", onFilterChange);

            label.appendChild(input);
            label.appendChild(document.createTextNode(" " + value));
            section.appendChild(label);
        });

        sidebar.appendChild(section);
    });
}

function onFilterChange(e) {
    const field = e.target.dataset.field;
    const value = e.target.value;

    if (!activeFilters[field]) return;

    if (e.target.checked) {
        activeFilters[field].add(value);
    } else {
        activeFilters[field].delete(value);
    }

    renderProjects();
    renderInitiatives();
    updateActiveCount();
}

function projectMatchesFilters(project) {
    const provinceFilters = activeFilters.province;
    const principleFilters = activeFilters.sustainabilityPrinciples;
    const opportunityFilters = activeFilters.sustainabilityOpportunities;

    if (provinceFilters.size > 0) {
        if (!provinceFilters.has(project.province)) return false;
    }

    if (principleFilters.size > 0) {
        const projectPrinciples = project.sustainabilityPrinciples || [];
        const match = [...principleFilters].some(f => projectPrinciples.includes(f));
        if (!match) return false;
    }

    if (opportunityFilters.size > 0) {
        const projectOpportunities = project.sustainabilityOpportunities || [];
        const opportunityNames = projectOpportunities.map(o => o.name);
        const match = [...opportunityFilters].some(f => opportunityNames.includes(f));
        if (!match) return false;
    }

    return true;
}

function renderProjects() {
    const grid = document.getElementById("projectGrid");
    const emptyState = document.getElementById("emptyState");
    const countEl = document.getElementById("projectCount");
    if (!grid) return;

    const visibleProjects = REGULAR_PROJECTS.filter(projectMatchesFilters);

    grid.innerHTML = "";

    if (visibleProjects.length === 0) {
        if (emptyState) emptyState.style.display = "flex";
    } else {
        if (emptyState) emptyState.style.display = "none";
        visibleProjects.forEach((project, index) => {
            grid.appendChild(buildTile(project, index));
        });
    }

    if (countEl) {
        countEl.textContent = `${visibleProjects.length} of ${REGULAR_PROJECTS.length}`;
    }
}

function renderInitiatives() {
    const grid = document.getElementById("initiativeGrid");
    const section = document.getElementById("initiativesSection");
    if (!grid) return;

    const visibleInitiatives = INITIATIVES.filter(projectMatchesFilters);

    grid.innerHTML = "";

    if (section) {
        section.style.display = visibleInitiatives.length === 0 ? "none" : "";
    }

    visibleInitiatives.forEach((initiative, index) => {
        grid.appendChild(buildTile(initiative, index));
    });
}
function getStageClass(stage) {
    if (!stage) return "stage-unknown";

    const normalized = stage.toLowerCase();

    if (normalized.includes("not started")) {
        return "stage-not-started";
    }

    if (normalized.includes("work in progress")) {
        return "stage-progress";
    }

    if (normalized.includes("complete")) {
        return "stage-complete";
    }

    return "stage-unknown";
}

function getStageLabel(project) {
    return project.type === "initiative" ? "Initiative Stage" : "Project Stage";
}

function buildStageBadge(stage) {
    if (!stage) return "";

    return `
    <span class="stage-badge ${getStageClass(stage)}">
      ${stage}
    </span>
  `;
}

function buildMailLink(project) {
    if (!project.email || !project.contactName) return "";

    return `
      <a href="mailto:${project.email}" class="contact-button">
        Email ${project.contactName}
      </a>
    `;
}



/* =========================================
 TILE BEAUTIFY — replace your existing buildTile()
 function in script.js with this one.
 Everything else in script.js stays the same.
 ========================================= */

function buildTile(project, index) {
    const article = document.createElement("article");
    const isInitiative = project.type === "initiative";

    article.className = isInitiative ? "project-tile initiative-tile" : "project-tile";
    article.setAttribute("tabindex", "0");
    article.setAttribute("role", "button");
    article.setAttribute("aria-label", "View details for " + project.title);
    article.style.animationDelay = index * 0.07 + "s";

    if (isInitiative) {
        article.dataset.type = "initiative";
    } else if (project.sustainabilityPrinciples && project.sustainabilityPrinciples[0]) {
        article.dataset.principle = project.sustainabilityPrinciples[0];
    }

    const imgWrap = document.createElement("div");
    imgWrap.className = "tile-image";

    if (project.photo) {
        const img = document.createElement("img");
        img.src = project.photo;
        img.alt = project.photoAlt || project.title;
        img.loading = "lazy";
        imgWrap.appendChild(img);
    } else {
        imgWrap.classList.add("tile-image--placeholder");
        imgWrap.innerHTML = placeholderSVG(project.id);
    }

    const footer = document.createElement("div");
    footer.className = "tile-footer";

    if (isInitiative) {
        const label = document.createElement("span");
        label.className = "tile-type-label";
        label.textContent = "Training & Capacity-Building";
        footer.appendChild(label);
    }

    const titleEl = document.createElement("h2");
    titleEl.className = "tile-title";
    titleEl.textContent = project.title;
    footer.appendChild(titleEl);

    article.appendChild(imgWrap);
    article.appendChild(footer);

    article.addEventListener("click", () => openModal(project));
    article.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(project);
        }
    });

    return article;
}

function placeholderSVG(id) {
    const palettes = [
        { bg: "#d4f2ee", icon: "#1a7a6e" },
        { bg: "#dcf5e7", icon: "#2d7d4e" },
        { bg: "#dbeafe", icon: "#2563eb" },
        { bg: "#ede9fe", icon: "#7c3aed" },
        { bg: "#fef9c3", icon: "#ca8a04" },
        { bg: "#ffedd5", icon: "#ea580c" }
    ];
    const p = palettes[(id - 1) % palettes.length];

    return `
    <div class="placeholder-graphic" style="background:${p.bg}">
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="6" y="10" width="36" height="28" rx="4" stroke="${p.icon}" stroke-width="2"/>
        <circle cx="16" cy="20" r="4" stroke="${p.icon}" stroke-width="2"/>
        <path d="M6 34l10-10 8 8 6-6 12 8" stroke="${p.icon}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span style="color:${p.icon}">Photo Coming Soon</span>
    </div>`;
}

function openModal(project) {
    const overlay = document.getElementById("modalOverlay");
    const body = document.getElementById("modalBody");
    if (!overlay || !body) return;

    body.innerHTML = buildModalHTML(project);
    overlay.classList.add("modal--open");
    document.body.classList.add("modal-active");

    const closeBtn = overlay.querySelector(".modal-close");
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    const overlay = document.getElementById("modalOverlay");
    if (!overlay) return;

    overlay.classList.remove("modal--open");
    document.body.classList.remove("modal-active");
}
const INFO_PANEL_ICONS = {
    building: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21V7.5L12 3l8 4.5V21" />
      <path d="M9 21v-6h6v6" />
      <path d="M8 10h.01M12 10h.01M16 10h.01M8 13h.01M16 13h.01" />
    </svg>
  `,
    people: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16 11a4 4 0 1 0-8 0" />
      <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
      <path d="M18 8a3 3 0 0 1 3 3" />
      <path d="M21 21v-1a5 5 0 0 0-3-4.5" />
      <path d="M6 8a3 3 0 0 0-3 3" />
      <path d="M3 21v-1a5 5 0 0 1 3-4.5" />
    </svg>
  `,
    hospital: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M9 21v-5h6v5" />
      <path d="M12 7v5" />
      <path d="M9.5 9.5h5" />
      <path d="M7.5 14h.01M16.5 14h.01" />
    </svg>
  `,
    mapPin: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  `,
    calendar: `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  `
};

function buildInfoItem(icon, label, value) {
    return `
    <div class="info-panel-row">
      <div class="info-panel-icon" aria-hidden="true">${icon}</div>
      <div class="info-panel-copy">
        <span class="info-panel-label">${label}</span>
        <span class="info-panel-value">${value || "-"}</span>
      </div>
    </div>
  `;
}

function buildProjectInfoPanel(p) {
    const stageValue = buildStageBadge(p.stage || p.initiativeStage);

    const thirdItem = p.type === "initiative"
        ? buildInfoItem(INFO_PANEL_ICONS.hospital, "Initiative Type", "Training & Capacity-Building")
        : buildInfoItem(INFO_PANEL_ICONS.hospital, "Healthcare Setting", p.healthcareSetting || "-");

    return `
    <section class="info-panel">
      <div class="info-panel-header">
        <div class="info-panel-title-wrap">
  <h2 class="info-panel-title">${p.title}</h2>
</div>
        ${stageValue}
      </div>

      <div class="info-panel-list">
          ${buildInfoItem(INFO_PANEL_ICONS.building, "Organization", p.organization)}
          ${buildInfoItem(INFO_PANEL_ICONS.people, "Department", p.department)}
          ${thirdItem}
          ${buildInfoItem(INFO_PANEL_ICONS.mapPin, "Province / Territory", p.province)}
          ${buildInfoItem(INFO_PANEL_ICONS.calendar, "Published On", p.publishedOn || "To be added")}
      </div>
    </section>
  `;
}

function buildModalHTML(p) {
    const photoHTML = p.photo
        ? `<div class="modal-photo-wrap">
         <img class="modal-photo" src="${p.photo}" alt="${p.photoAlt || p.title}" />
         <div class="modal-photo-gradient"></div>
       </div>`
        : `<div class="modal-photo-wrap modal-photo-wrap--placeholder">
         <div class="modal-photo modal-photo--placeholder">${placeholderSVG(p.id)}</div>
       </div>`;

    if (p.type === "initiative") {
        return `
      ${photoHTML}
      <div class="modal-content-body modal-content-body--initiative">
        ${buildProjectInfoPanel(p)}

        <section class="modal-section">
          <h3 class="modal-section-heading">Initiative Description</h3>
          <p>${p.description}</p>
        </section>

        <section class="modal-section">
          <h3 class="modal-section-heading">Toolkit Application</h3>
          <p>${p.toolkitApplication}</p>
        </section>

        <section class="modal-section">
          <h3 class="modal-section-heading">Toolkit Audience & Uptake</h3>
          <p>${p.toolkitAudienceUptake}</p>
        </section>

        <section class="modal-section">
          <h3 class="modal-section-heading">Most Valuable Toolkit Elements</h3>
          <p>${p.mostValuableElements}</p>
        </section>

        <section class="modal-section learn-more-section">
          <h3 class="modal-section-heading">Learn More</h3>
          <p>
            For questions about this initiative or to connect with the project team, use the email link below.
          </p>
          ${buildMailLink(p)}
        </section>
      </div>
    `;
    }

    const principleTagsHTML = (p.sustainabilityPrinciples || [])
        .map(tag => `<span class="tag tag--teal" data-principle="${tag}">${tag}</span>`)
        .join("");

    const opportunitiesHTML = (p.sustainabilityOpportunities || [])
        .map(opportunity => `
      <div class="detail-item">
        <span class="detail-item-name">${opportunity.name}</span>
        <p class="detail-item-desc">${opportunity.explanation}</p>
      </div>`)
        .join("");

    const envMetrics = ((p.metrics && p.metrics.environmental) || [])
        .map(metric => `<li>${metric}</li>`)
        .join("");

    const actMetrics = ((p.metrics && p.metrics.activity) || [])
        .map(metric => `<li>${metric}</li>`)
        .join("");

    const domainsHTML = (p.domainsOfQuality || [])
        .map(domain => `
      <div class="detail-item">
        <span class="detail-item-name">${domain.name}</span>
        <p class="detail-item-desc">${domain.explanation}</p>
      </div>`)
        .join("");

    return `
    ${photoHTML}
    <div class="modal-content-body">
      ${buildProjectInfoPanel(p)}

      <section class="modal-section">
        <h3 class="modal-section-heading">Project Description</h3>
        <p>${p.description}</p>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Sustainability Principles</h3>
        <div class="tag-row">${principleTagsHTML}</div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Sustainability Opportunities</h3>
        <div class="detail-list">${opportunitiesHTML}</div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Metrics</h3>
        <div class="metrics-grid">
          <div class="metrics-col">
            <h4 class="metrics-col-heading metrics-col-heading--env">Environmental</h4>
            <ul class="metrics-list metrics-list--env">${envMetrics}</ul>
          </div>
          <div class="metrics-col">
            <h4 class="metrics-col-heading metrics-col-heading--act">Activity</h4>
            <ul class="metrics-list metrics-list--act">${actMetrics}</ul>
          </div>
        </div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Domains of Quality</h3>
        <div class="detail-list">${domainsHTML}</div>
      </section>

      <section class="modal-section">
        <h3 class="modal-section-heading">Most Valuable SE-QI Toolkit Resources</h3>
        <div class="cobenefit-text">${p.cobenefit}</div>
      </section>

      <section class="modal-section learn-more-section">
        <h3 class="modal-section-heading">Learn More</h3>
        <p>
          For questions about this initiative or to connect with the project team, use the email link below.
        </p>
        ${buildMailLink(p)}
      </section>
    </div>
  `;
}


    
function updateActiveCount() {
    const total =
        activeFilters.province.size +
        activeFilters.sustainabilityPrinciples.size +
        activeFilters.sustainabilityOpportunities.size;

    const badge = document.getElementById("filterBadge");
    const clearBtn = document.getElementById("clearFilters");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (badge) {
        badge.dataset.count = total;
        badge.textContent = total;
    }
    if (clearBtn) {
        clearBtn.classList.toggle("btn-clear--visible", total > 0);
    }
    if (sidebarToggle) {
        sidebarToggle.setAttribute("aria-expanded",
            document.body.classList.contains("sidebar-active") ? "true" : "false");
    }
}

function clearAllFilters() {
    activeFilters.province.clear();
    activeFilters.sustainabilityPrinciples.clear();
    activeFilters.sustainabilityOpportunities.clear();
    document.querySelectorAll(".filter-checkbox").forEach(cb => { cb.checked = false; });
    renderProjects();
    renderInitiatives();
    updateActiveCount();
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    const toggle = document.getElementById("sidebarToggle");

    sidebar && sidebar.classList.toggle("sidebar--open");
    overlay && overlay.classList.toggle("sidebar-overlay--open");
    document.body.classList.toggle("sidebar-active");

    if (toggle) {
        toggle.setAttribute("aria-expanded", document.body.classList.contains("sidebar-active") ? "true" : "false");
    }
}

async function initPDFViewer() {
    const container = document.getElementById("pdfContainer");
    const loading = document.getElementById("pdfLoading");
    if (!container || !window.pdfjsLib) return;

    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

    try {
        const pdf = await window.pdfjsLib.getDocument("dashboard.pdf").promise;
        if (loading) loading.remove();

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const containerWidth = container.clientWidth || 900;
            const baseViewport = page.getViewport({ scale: 1 });
            const scale = (containerWidth / baseViewport.width) * 2;
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = "100%";
            canvas.style.display = "block";
            if (pageNum > 1) canvas.style.borderTop = "1px solid #e5e7eb";

            container.appendChild(canvas);
            await page.render({ canvasContext: ctx, viewport }).promise;
        }
    } catch (err) {
        if (loading) {
            loading.innerHTML =
                '<p style="color:#6b7280;padding:32px">Could not load PDF. ' +
                '<a href="dashboard.pdf" download style="color:#182F51;font-weight:600">Download instead</a></p>';
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    buildFilters();
    renderProjects();
    renderInitiatives();
    updateActiveCount();
    initPDFViewer();

    document.getElementById("modalClose")?.addEventListener("click", closeModal);
    document.getElementById("modalOverlay")?.addEventListener("click", e => {
        if (e.target === e.currentTarget) closeModal();
    });

    document.getElementById("clearFilters")?.addEventListener("click", clearAllFilters);
    document.getElementById("clearFiltersEmpty")?.addEventListener("click", clearAllFilters);

    document.getElementById("sidebarToggle")?.addEventListener("click", toggleSidebar);
    document.getElementById("sidebarOverlay")?.addEventListener("click", toggleSidebar);

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
    });
});

/* ---- Scroll-to-top button ---- */
(function () {
    const btn = document.getElementById("scrollTopBtn");
    if (!btn) return;

    window.addEventListener("scroll", () => {
        btn.classList.toggle("btn-scroll-top--visible", window.scrollY > 320);
    }, { passive: true });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
})();
