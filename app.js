/* ==========================================
   RESUME JOB SEARCH OS - INTERACTIVE APPS JS
   Core Controller and SPA Engine with Firestore Integrations
   ========================================== */

// --- SEED DATA & IN-MEMORY STATE STORE ---
const STATE = {
  activeProfile: 'raghav_dharani',
  activeTab: 'dashboard',
  activeEditorTab: 'resume',
  activeContextTab: 'evidence',
  pipelineRunning: false,
  pipelineStep: 0,
  
  // Audits & Score State
  recruiterScore: 0,
  hmScore: 0,
  defensibilityScore: 0,
  atsScore: 0,

  // Phase 2 Authentication & Admin states
  currentUser: null,
  currentUserDoc: null,
  isAdmin: false,
  isAuthModeSignup: false,
  unsubUserDoc: null, // Unsubscriber for real-time user document listener
  unsubAdminList: null, // Unsubscriber for real-time admin grid list
  
  // Multi-Application State Per Candidate
  jobApplications: {},
  activeApplicationId: null,
  
  // Candidate Data Context Database (Used as Local seed & fallback cache)
  profiles: {
    raghav_dharani: {
      name: "Raghav Dharani",
      fullNameOption: "Raghavendran Dharani",
      location: "New York, NY",
      phone: "929-260-8138",
      email: "raghav.dr@gmail.com",
      linkedin: "linkedin.com/in/raghavdharani",
      visaStatus: "US Citizen",
      preferredLength: 2,
      sourceResumes: [
        {
          id: "raghav_master",
          name: "Raghav Master Resume.md",
          content: `## RAGHAV DHARANI\nNew York, NY  |  929-260-8138  |  raghav.dr@gmail.com  |  linkedin.com/in/raghavdharani\n\n### PROFESSIONAL SUMMARY\nProduct leader with 10+ years building enterprise SaaS platforms from the ground up - taking products from concept to measurable adoption across AI-enabled workflow systems, operational decision platforms, and B2B2C SaaS in retail and financial services. Experienced in translating complex behavior into structured, scalable product capabilities.\n\n### CORE STRENGTHS\nNew Product Development · AI-Enabled Platforms · B2B2C Enterprise SaaS · Behavioral Workflow Systems · Prototype-Led Discovery · Solution Design · API-First Architecture\n\n### PROFESSIONAL EXPERIENCE\n**Senior Product Manager**  \n*KWI | 2025 - Present*\n* Took a Transfers Operations application from problem discovery through launch - achieving 70% client migration from legacy to new workflows within 2 months of launch and reducing transfer error and exception rates by 30%.\n* Introduced AI-assisted, spec-driven development using Claude and Cursor to build working prototypes before engineering engagement, reducing clarification cycles by 25%.\n\n**Senior Product Manager**  \n*Upshop | 2022 - 2025*\n* Built a mobile-first B2B2C store operations platform from the ground up, taken from concept through launch across 100+ grocery retail locations.\n* Drove 40% increase in user engagement by replacing paper-based store processes with a unified mobile experience.\n* Reduced overproduction by 18% and improved forecast accuracy using ML demand signals.\n\n**Lead Product Manager**  \n*360insights | 2019 - 2022*\n* Owned roadmap for an enterprise SaaS platform serving 100+ clients across channel operations and claims workflows.\n* Led rebuild of claims platform that doubled processing throughput and cut manual review effort by 50%.`
        }
      ],
      targetRoles: [
        "Senior Product Manager",
        "Lead Product Manager",
        "Group Product Manager",
        "Principal Product Manager",
        "Senior AI Technical Product Manager"
      ],
      evidence: [
        {
          claim: "Introduced AI-assisted, spec-driven development using Claude and Cursor to build prototypes before engineering engagement.",
          source: "Raghav_Dharani_Resume.pdf, KWI experience",
          status: "confirmed",
          usable_for_roles: ["Senior AI Technical PM", "AI PM", "Technical PM"],
          interview_defense: "Explain how prototypes and specs were created before engineering, how they reduced ambiguity, and how this became a product team practice."
        },
        {
          claim: "Launched ML-powered grocery ordering and replenishment workflows using demand signals to guide frontline decisions.",
          source: "Raghav_Dharani_Resume.pdf, Upshop experience",
          status: "confirmed",
          usable_for_roles: ["AI PM", "Retail Tech PM", "Senior PM"],
          interview_defense: "Frame as product ownership of ML-enabled recommendations, not ML engineering ownership."
        },
        {
          claim: "Led a claims platform rebuild that doubled processing throughput and reduced manual review effort by 50%.",
          source: "Raghav_Dharani_Resume.pdf, 360insights experience",
          status: "confirmed",
          usable_for_roles: ["B2B SaaS PM", "Platform Modernization PM", "Workflow PM"],
          interview_defense: "Discuss workflow architecture, process redesign, throughput improvement, and manual review reduction without overstating direct insurance expertise."
        }
      ],
      metrics: [
        { metric: "70% client migration within 2 months", source: "KWI Transfers Operations", status: "confirmed" },
        { metric: "30% reduction in transfer errors and exceptions", source: "KWI Transfers Operations", status: "confirmed" },
        { metric: "Clarification cycles reduced by 25%", source: "KWI AI-assisted spec practice", status: "confirmed" },
        { metric: "Rework reduced by 20% to 30%", source: "KWI AI-assisted spec practice", status: "confirmed" },
        { metric: "18% reduction in overproduction", source: "Upshop grocery ordering and replenishment", status: "confirmed" },
        { metric: "40% increase in user engagement", source: "Upshop store operations platform", status: "confirmed" },
        { metric: "Claims processing throughput doubled", source: "360insights platform rebuild", status: "confirmed" },
        { metric: "Manual review effort reduced by 50%", source: "360insights platform rebuild", status: "confirmed" }
      ],
      extrapolations: [
        {
          claim: "Designed product workflows to influence user behavior and drive action completion.",
          source: "Raghav approval in Left Field Labs Senior AI PM package",
          status: "approved_extrapolation",
          interview_defense: "Tie to Upshop store operations workflows, frontline adoption, and workflow design choices that guided users toward required actions."
        },
        {
          claim: "Worked in compliance-adjacent store operations environments at Upshop.",
          source: "Raghav approval in Left Field Labs Senior AI PM package",
          status: "approved_extrapolation",
          interview_defense: "Use only for Upshop store operations, waste audits, and operational controls. Do not tie to 360insights or direct insurance compliance."
        },
        {
          claim: "Built prototypes for live stakeholder validation using Claude and Cursor.",
          source: "Raghav approval in Left Field Labs Senior AI Technical Product Manager package, 2026-05-25",
          status: "approved_extrapolation",
          usable_for_roles: [
            "Senior AI Technical Product Manager",
            "AI Product Manager",
            "Technical Product Manager",
            "Platform Modernization Product Manager"
          ],
          interview_defense: "Explain which stakeholders reviewed prototypes, what decisions the prototypes clarified, and how they improved specs and engineering handoff."
        }
      ],
      // Simulated dynamic claims awaiting approval (Unapproved)
      pendingClaims: [
        {
          id: 'claim_personalization',
          proposed: "Spearheaded early discovery for an AI-native customer personalization engine, accelerating shopping basket conversion by 14%.",
          safer: "Led collaborative discovery workshops with store managers to refine core mobile ordering workflows, contributing to a 40% increase in store user engagement.",
          risk: "Moderate",
          reason: "There is no evidence Raghav owned customer conversion engines, only operational store workflows at Upshop.",
          question: "Did your Upshop store operations cover consumer personalization, or should we keep focus on B2B frontline operations?",
          status: "pending"
        },
        {
          id: 'claim_ml_design',
          proposed: "Architected a multi-layer deep learning model in PyTorch to automate inventory restocking decisions at store level.",
          safer: "Launched ML-powered replenishment workflows that delivered stocking recommendations using demand signals, reducing overproduction by 18%.",
          risk: "Very High",
          reason: "Invents hands-on ML model design skills (PyTorch) which Raghav does not possess. Raghav is a PM, not an ML Engineer.",
          question: "Did you perform hands-on ML model development, or did you own the product requirements and workflow integration?",
          status: "pending"
        }
      ],
      resumeMarkdown: `## RAGHAV DHARANI
New York, NY  |  929-260-8138  |  raghav.dr@gmail.com  |  linkedin.com/in/raghavdharani

### PROFESSIONAL SUMMARY
Product leader with 10+ years building enterprise SaaS platforms from the ground up - taking products from concept to measurable adoption across AI-enabled workflow systems, operational decision platforms, and B2B2C SaaS in retail and financial services. Experienced in translating complex behavior into structured, scalable product capabilities.

### CORE STRENGTHS
New Product Development · AI-Enabled Platforms · B2B2C Enterprise SaaS · Behavioral Workflow Systems · Prototype-Led Discovery · Solution Design · API-First Architecture

### PROFESSIONAL EXPERIENCE
**Senior Product Manager**  
*KWI | 2025 - Present*
* Took a Transfers Operations application from problem discovery through launch - achieving 70% client migration from legacy to new workflows within 2 months of launch and reducing transfer error and exception rates by 30%.
* Introduced AI-assisted, spec-driven development using Claude and Cursor to build working prototypes before engineering engagement, reducing clarification cycles by 25%.
* [PENDING_CLAIM_1]

**Senior Product Manager**  
*Upshop | 2022 - 2025*
* Built a mobile-first B2B2C store operations platform from the ground up, taken from concept through launch across 100+ grocery retail locations.
* [PENDING_CLAIM_2]
* Drove 40% increase in user engagement by replacing paper-based store processes with a unified mobile experience.
* Reduced overproduction by 18% and improved forecast accuracy using ML demand signals.

**Lead Product Manager**  
*360insights | 2019 - 2022*
* Owned roadmap for an enterprise SaaS platform serving 100+ clients across channel operations and claims workflows.
* Led rebuild of claims platform that doubled processing throughput and cut manual review effort by 50%.`,
      coverLetter: `Dear Hiring Team,

I am writing to express my strong interest in the Product Management role. With over 10 years of experience building enterprise SaaS platforms and operational workflow systems at KWI, Upshop, and 360insights, I specialize in translating complex operational problems into scalable products.

At Upshop, I pioneered the integration of ML demand signals directly into frontline store workflows, reducing overproduction by 18%. Additionally, at KWI, I established an AI-assisted prototyping practice that compressed discovery cycles by 25%. 

I am eager to bring this same outcome-driven product leadership to your team.

Sincerely,
Raghav Dharani`,
      outreach: `Subject: Spec-Driven Product Leadership / Raghav Dharani

Hi,

I came across your Senior Product Manager opening and wanted to reach out. I have built enterprise SaaS platforms for the last decade, focusing on operational workflows and AI/ML system integrations at KWI and Upshop. 

Most recently at KWI, I designed store transfers operations workflows that achieved 70% customer migration within 2 months while establishing an AI-assisted prototyping methodology.

I'd love to discuss how my background in de-risking complex platforms can contribute to your goals.

Best,
Raghav`
    },
    
    aatmika_natarajan: {
      name: "Aatmika Natarajan",
      fullNameOption: "Aatmika Natarajan",
      location: "New Jersey, NJ",
      phone: "201-555-0192",
      email: "aatmika.nat@gmail.com",
      linkedin: "linkedin.com/in/aatmikanatarajan",
      visaStatus: "Canadian Citizen (Eligible for TN Visa)",
      preferredLength: 3,
      sourceResumes: [
        {
          id: "aatmika_master",
          name: "Aatmika Master Resume.txt",
          content: `PROFESSIONAL SUMMARY 
SAP Technical Consultant with over 18 years of experience, including 8+ years of experience in S/4 HANA. Proven expertise in ABAP 7.4, Integration architecture, SAP Gateway services, and HANA database performance optimization. Adept at leading SAP implementation projects across manufacturing, retail, and consumer goods industries. A strong mentor and leader with experience in architecting and delivering solutions for SAP Implementations, Upgrades, Data Migrations, Middleware Integrations.

KEY SKILLS
• SAP S/4 HANA Brownfield & Greenfield Implementation.  
• ABAP 7.4 & ABAP OO RICEFW 
• Restful ABAP Programming 
• Integration with SAP PI, TM, SRM (data mapping with ECC) 
• SAP OData Services, Proxy’s 
• Interfaces like IDOC’s, Bapi’s, RFC’s 
• Enhancement Framework 
• Worked extensively in P2P (PP), OTC (SD, MM & EWM) and FICO 
• ABAP for Data Archiving PBS to ILM  
• SAP BTP Platform & CPI: SAP BTP services and CPI.  
• Performance Optimization of FI extract report, Archiving tool ILM, BW Reporting  
• Agile Methodologies: 3+ years of extensive experience in working on Sprints  
• Technical Leadership: Proven ability to mentor and manage teams, driving innovation and fostering collaboration. 
• Regular Development activities like Effort estimation, technical design Spec Documentation, collaborating with cross functional teams, Unit Testing, Peer Code review according to best practices, Smoke test, cut-over activities etc. 
• Experienced in ticketing tools like CHARM, Clarity, Jira etc 
• Worked with AI tools like Co-pilot, Joules, ChatGPT etc. 

WORK EXPERIENCE  
SAP ABAP Developer (Permanent) 
Maple Leaf Foods, Toronto 
Nov 2019 – Present 
(In-house IT team – S/4 HANA 1909 to 2023 upgrades) 
• Developed and enhanced multiple SAP ABAP objects across SD, MM, FI/CO, WM, and TM modules, ensuring alignment with SAP Clean Core principles. Delivered both traditional RICEF developments and modern RAP/Fiori-based applications. 
• Designed and modified ABAP-SmartForms, SAPscript, and Adobe Forms, including Manual Cheque, Cashed Cheque, CAFS, and Customer Invoice forms, during the transition between banking service providers for Accounts Receivable and Treasury teams. 
• Core ABAP developer for the S/4 HANA 1909 Brownfield Migration and subsequent upgrades (to 2023): 
o Executed ABAP SPDD/SPAU adjustments, applied ATC Quick Fixes, and resolved syntax and performance inconsistencies caused by migration. 
o Analyzed and implemented SAP Notes for converting the table like MATDOC and ACDOCA to suit SAP HANA version 1909; fixed ABAP code issues caused due to EDI mapping mismatch for the MATNR field length expansion across SRM, APO, and TM systems. 
o Supported SUM/SAINT upgrades, collaborated closely with Basis and Security teams, and participated in smoke testing and cutover activities. 
• Worked on ABAP on S/4 HANA Clean-Core initiatives, refactoring legacy custom code to standard-compliant solutions. Supported Recipe Development processes using SAP BTP-based extensions. 
• Developed a Fiori Elements application using RAP (unmanaged save) for Purchase Order Release (Approve/Reject) functionality, leveraging standard BAPIs and modern ABAP RESTful Programming Model design patterns. 
• Built RF Gun (ABAP-WM) programs for the Bradford plant, streamlining warehouse operations and creating custom nodes in /SCWM/MON to enhance warehouse monitoring capabilities. 
• Resolved complex ABAP-EDI integration issues between SAP and external systems (OTC, IBP, TM, SRM) by analyzing and reconfiguring IDoc mappings in the outbound basic type IDocs processing routines- outbound DESADV IDocs for international shipment processing. 
• Enhanced Web Service Proxy interfaces for TM portal integrations to improve reliability and data flow consistency. 
• Rewrote legacy ABAP data archival programs (PBS to ILM) for tables like SD_VBAK, SD_VBRK, FI_DOCUMENT, and MM_MATBEL.  
• Developed ABAP custom analytical tools: 
o Automated Inventory Tool - enhanced MB52 functionality with HU summary and live inventory visibility. 
o Reusable ABAP OO-based Job Submission Utility – enabled users to export results in XLSX/CSV formats to both Presentation and Application servers using advanced binary stream handling. 

SAP ABAP Consultant (Contract with IDC Technologies) Siemens, Oakville  
Jun 2018 – Nov. 2019 
J2S Project – Siemens 
• Developed mass data tools (BAPI/BDC) for efficient parent-child change number tracking, DIR uploads, and ALV-based daily sales and BOM change log reporting. 
• Enhanced SAP functionalities (CC01/02, CO02, COOIS/COHV) for production orders, BOM, and confirmations using BADIs, user exits, and performance tuning. 
• Debugged and changed Customer statements forms using RFKORD11 for AR , created Customer invoices using smartforms and Payment print notice  
• Created programs for General Ledger mass data upload for FB01/02 transaction codes; Journal entries data upload 
• Automated workflows (ECM/ECR), pricing routines for order confirmations, and custom SAP Script for production orders. 
• Streamlined HR processes by automating pay result data collection and CAT2/3/5/7/9 front-end screens. 
Imall Interface Enhancements: (Agile Methodology – 2 week Sprint) 
• Enhanced sales order (SAPMV45A) to add "Market Facing Number" and "Vendor Number" fields in the item overview and additional data tabs. Updated VBAP structures and implemented BADI MV45AFZZ to ensure accurate data flow and storage. 
• Developed tools to update sales order line items for rebate claims and bank search strategies, automating MFN2 and MLFB updates for Imall Interface. Modified Imall /Compass interface objects to handle new fields using BAPI_SALESORDERCRTFRMDAT2 for OTC module. Built an interactive ALV report to manage sales and production order user status changes. 
• Automated mass updates of sales and production order statuses while dynamically blocking production order components using STATUS_CHANGE_EXTERN and MD_RESET_KZEAR_RESB. 
• Designed a custom tool (ZIOMRESOLVE) to process IDOCs dynamically. Automated error resolution for failed IDOCs (invalid materials, unit mismatches, pricing errors) and reprocessed them using BDC (VA01) or BAPI_SALESORDER_CHANGE. Developed a log report to track error corrections and IDOC reprocessing through ALV. 
• Created a VOFM pricing routine for ZMLC condition type based on sales office and order type. 
• Enhanced Quotation (VA23) and Inbound Delivery (VL33N) Smart Forms to dynamically populate additional line-item data and terms based on sales/purchase organizations. 
• Improved reporting by enabling email attachments in Excel and PDF formats. 
• Played a key role in the Re-Org 2020 project for Siemens, enhancing financial programs to support changes in profit center and division structures, improving financial reporting accuracy and compliance with organizational requirements. 

ABAP Team Lead (Permanent) Accenture Solutions Pvt Ltd, Bangalore Jan 2014 – Jan 2018 
• Led the ABAP on S/4 HANA on-premise implementation project for the Kirloskar Group. Facilitated client discussions for interface development and workflow technical solutions, providing expertise in SAP integration and project management.  
• Managed a team of size 5, responsible for the development of 170 ABAP objects, ensuring on-time delivery, rigorous quality control, and optimal alignment with strategic business needs.  
Global Ownership of SAP Applications: 
• Served as Managed Service Owner (MSO) for PP, QM, and WM applications across EMEA, APAC, and NA regions. Led escalation management for live production systems, addressing critical issues under tight SLAs and coordinating with business stakeholders, third-party vendors, and plant managers to ensure uninterrupted operations. Conducted weekly SLA reviews with client leadership to track performance and drive continuous improvement. 
Leadership and Team Development: 
• Directed a team of 17-20 members, conducting comprehensive performance appraisals to assess and enhance individual contributions. Fostered a high-performance culture through mentorship, skill development, and constructive feedback, enabling consistent delivery of high-quality solutions within challenging timelines. 
Strategic Process Improvements: 
• Spearheaded process optimization initiatives across 27 Managed Service Owners, introducing 3 innovative solutions that reduced effort by 140 man-days and improved project efficiency. 

ABAP Module Lead (Permanent) Mindtree Ltd, Bangalore Aug 2011- Jan 2014 
• Maintenance Project for Tata Global Beverages (Client place Onsite) Production Planning RICEFW estimations, change requests, and incident resolution, while facilitating L2 meetings with UK business leaders to ensure alignment, transparency, and seamless project delivery.  
• SAP Implementation for Al-Ghanim (Client place Onsite, Middle East) Migrated live data into production systems using BDC and BAPI for Material Master, service orders, and business partner updates as Data migration expert. SAP Implementation Pilot for Unilever Data migration and conversion for Unilever’s SAP IS-RETAIL implementation for customer, salesman, and service master data using BAPI’s. Custom enhancements to streamline delivery, billing, and stock processes ( Order to case cycle OTC) 

Application Developer-ABAP (Permanent) IBM, Bangalore Jan 2007 – Aug 2011 
• Shell (Energy & Utilities, Oil and Gas Downstream) project - ABAP Debugging, Performance Optimization for BW data extraction reports thus reducing runtime from 24 hours to just over 2 hours, IDOC processing and material document generation. Quality reviewed peer code, and developed technical specifications, ensuring adherence to best practices and performance benchmarks.  
• Changes related to invoice memos, credit/debit memos, and purchase orders using SAP SCRIPTS and Smartforms for SAP Implementation for Hitachi Metals (Automotive Manufacturing). 

PROFESSIONAL ACHIEVEMENTS & RECOGNITIONS  
• Reduction of Person-Days Effort: Led performance tuning initiatives that reduced the runtime of long-running BW extraction reports from 24 hours to just 2 hours and 42 minutes, delivering immense value to the client by streamlining data operations.  
• SME Activities: Trained new hires in ABAP and contributed to the design of ABAP materials for new joiners at Accenture India.  
• Won ACE award among PRODUCTS Industry group (Accenture) for resolving long pending complex issues and handling responsibilities outside the given role  

SAP TRAINING ATTENDED 
• SAP S/4 ABAP on HANA 
• SAP BTP Cockpit 
• Restful ABAP Programming 
• Fiori Bootcamp  

EDUCATION  
• Bachelor of Engineering in Electronics & Communication 
• Anna University, India`
        }
      ],
      targetRoles: [
        "SAP Technical Consultant",
        "SAP ABAP Developer",
        "SAP Integration Consultant",
        "SAP BTP Technical Specialist"
      ],
      evidence: [
        {
          claim: "Led migration of legacy SAP ERP systems to S/4HANA using standard conversion tools.",
          source: "Aatmika_Technical_Resume.txt",
          status: "confirmed",
          usable_for_roles: ["SAP Technical Consultant", "SAP ABAP Developer"],
          interview_defense: "Explain standard conversion tools, SPAU/SPDD remediation, and data validation processes."
        }
      ],
      metrics: [
        { metric: "Reduced database load times by 35% after custom OData optimization", source: "Client X Project", status: "confirmed" },
        { metric: "Successfully remediated 400+ custom ABAP objects during S/4HANA migration", source: "S/4HANA Conversion", status: "confirmed" }
      ],
      extrapolations: [],
      pendingClaims: [
        {
          id: 'claim_sap_btp',
          proposed: "Independently designed a custom cloud integration flow on SAP BTP from scratch using CPI for a global supply chain client.",
          safer: "Collaborated on custom integration flows using SAP BTP CPI templates to synchronize inventory transactions.",
          risk: "Moderate",
          reason: "Prior roles show template-based and joint delivery experience rather than sole architectural ownership of cloud CPI models.",
          question: "Did you construct the BTP integration flow independently, or work alongside a principal architect?",
          status: "pending"
        }
      ],
      resumeMarkdown: `# Aatmika Natarajan

Queens, NY | +1 (647) 628-2990 | aatmika.n@gmail.com  
linkedin.com/in/aatmika-natarajan-ab468612  
SAP ABAP Developer | Order to Cash, Production Planning, RICEF, S/4HANA

## Professional Summary

SAP ABAP Technical Consultant with 18+ years of experience delivering RICEF development, S/4HANA migration support, production planning enhancements, Order to Cash integrations, forms, IDocs, BAPIs, BADIs, user exits, and performance-tuned ABAP solutions across manufacturing, consumer goods, retail, food and beverage, automotive, and energy environments.

Strong manufacturing and inventory management background ranging from production orders, process orders, BOM explosion, engineering change workflows, routing, goods movement, warehouse execution, and plant-facing support. Experienced in translating business process requirements into scalable ABAP designs, coordinating with Basis and functional teams through transports, cutover, smoke testing, hypercare, and post-go-live support, with hands-on ECC to S/4HANA brownfield migration experience.

## Core Strengths

SAP ABAP & RICEF: ABAP OO | Reports | Interfaces | Conversions | Enhancements | Forms | ALV | Dialog Programming | Module Pool | Performance Tuning  
S/4HANA & Modern SAP: S/4HANA Brownfield Migration | SPDD/SPAU | ATC Quick Fixes | CDS Views | RAP | Fiori Elements | BTP | CPI | Clean Core | SAP Gateway | SAP NetWeaver  
Manufacturing & Supply Chain: Production Planning | Production Orders | Process Orders | BOM Explosion | Routing | Goods Movement | WM/EWM | PP/QM/WM | Discrete Manufacturing  
Integration & Order to Cash: IDoc | BAPI | BDC | RFC | OData | Web Service Proxies | SAP PI | TM | SRM | APO | IBP | Sales Orders | DESADV  
Forms & Tools: Smart Forms | SAPscript | Adobe Forms | CHARM | Clarity | Jira | Remedy | Postman | Eclipse ADT

## Professional Experience

### SAP ABAP Developer | Maple Leaf Foods, Toronto | 2019 - Present

- Deliver SAP ABAP solutions across SD, WM, EWM, TM, and PP-adjacent manufacturing processes, combining traditional RICEF development with modern S/4HANA, RAP/Fiori, CDS, and Clean Core practices.
- Design a goods movement cockpit for process-order execution: upon scanning a process order number from the printed process order document, the cockpit retrieves relevant process order details, BOM explosion details, goods issue, goods issue reversal, goods receipt, goods receipt reversal, and process logs.
- Built RF Gun ABAP programs for the Bradford plant to support Order to Cash warehouse execution flows, including goods receipt, goods receipt reversal, goods issue, goods issue reversal, and shipping activities.
- Created custom warehouse monitoring capabilities in \`/SCWM/MON\` and improved inventory visibility through HU summary and live inventory details.
- Served as a core ABAP developer for ECC to S/4HANA 1909 brownfield migration and subsequent upgrades to 2023, executing SPDD/SPAU/SPAU_ENH adjustments, applying ATC quick fixes in Eclipse ADT, resolving syntax and performance issues, and supporting SUM/SAINT activities.
- Ran and analyzed S/4HANA readiness activities including simplification-check findings, custom code analysis, SAP Notes, deprecated function review, and conversion-impact remediation ahead of SUM execution.
- Prepared custom code and finance/logistics objects for S/4HANA conversion by addressing MATDOC and ACDOCA impacts, applying ATC quick fixes, and replacing selected Open SQL logic with CDS-view-based approaches.
- Remediated ABAP and EDI mapping issues caused by MATNR field length expansion across SRM, APO, TM, and related systems while coordinating with Basis, Security, and functional teams through smoke testing and cutover.
- Advanced S/4HANA Clean Core initiatives by refactoring legacy custom code to standard-compliant solutions, supporting code pushdown patterns, and reducing unnecessary custom logic where standard or extension-based approaches were more appropriate.
- Supported BTP/CPI extension work for recipe development processes, helping keep S/4HANA core processes cleaner while enabling required business functionality.
- Built a Fiori Elements application using RAP unmanaged save for purchase order release approval and rejection, calling standard BAPIs and applying ABAP RESTful Programming Model design patterns.
- Designed and modified Smart Forms, SAPscript, and Adobe Forms for manual cheque, cashed cheque, CAFS, and customer invoice processes during a banking service provider transition for Accounts Receivable and Treasury teams.
- Resolved ABAP-EDI integration issues between SAP and external systems across Order to Cash, IBP, TM, and SRM by analyzing outbound IDoc processing routines, DESADV shipment flows, and mapping inconsistencies.
- Enhanced Web Service Proxy interfaces for TM portal integrations and maintained OData services to improve shipping-notification reliability and data-flow consistency.
- Rewrote legacy ABAP archival programs from PBS to ILM structures for \`SD_VBAK\`, \`SD_VBRK\`, \`FI_DOCUMENT\`, and \`MM_MATBEL\`, coordinating with SD, FI, PP, MM, Basis, and functional leadership to protect data integrity.
- Engineered reusable ABAP OO utilities, including an automated MB52-style inventory tool and a job-submission utility that exports custom report outputs in XLSX and CSV formats to presentation and application servers.

### SAP ABAP Consultant | Siemens / Tata Consultancy Services, Oakville | 2018 - 2019

- Delivered ABAP development for Siemens engineering and manufacturing processes across PP, QM, MM, PS, SD, FI/CO, and HR, with emphasis on production orders, BOMs, engineering change workflows, order confirmations, and Order to Cash integration.
- Created mass upload and update tools using BAPI, BDC, interactive ALV, and dialog programming for parent-child change number tracking, DIR uploads, and engineering change management.
- Built BOM change log reporting using ALV and parallel cursor techniques, including \`SPBT_INITIALIZE\`, start-new-task processing, and end-of-task handling for improved reporting performance.
- Enhanced production and engineering transactions including \`CC01\`, \`CC02\`, \`CO02\`, \`COOIS\`, \`COHV\`, and Siemens-provided production-order workflows, including support for production-order and discrete manufacturing scenarios.
- Enhanced \`COOIS\` and \`COHV\` header, operations, and confirmations views to display BOM, personnel, and material details using BADI \`CL_EX_WORKORDER_INFOSYSTEM\`.
- Configured and enhanced engineering-change and production-order process support around Siemens manufacturing workflows, including BOM explosion visibility, routing context, and user-provided \`COR1\` / \`COR2\` process exposure.
- Supported production-order and engineering-change workflows involving ECM/ECR processes, production-order banners, order confirmations, and SAPscript changes for manufacturing documentation.
- Automated order-to-manufacturing workflow-forward reporting for custom ECM/ECR processes, allowing workflow to move to the next available user and display processing logs.
- Enhanced sales order screen \`SAPMV45A\` with market-facing number, vendor number, product number, and product print number fields, updating \`VBAP\`, append structures, flow logic, and BADI \`MV45AFZZ\`.
- Modified IMALL / Compass interface objects using \`BAPI_SALESORDERCRTFRMDAT2\` to handle new sales-order fields and support Order to Cash interface changes.
- Built interactive ALV reports to update sales order and production order user status dynamically, including component blocking and withdrawn status handling through \`STATUS_CHANGE_EXTERN\` and \`MD_RESET_KZEAR_RESB\`.
- Designed custom IDoc resolution tool \`ZIOMRESOLVE\` to read failed order IDocs, identify invalid material, unit mismatch, minimum quantity, pricing, and material-mapping issues, and reprocess sales orders using BDC \`VA01\` or \`BAPI_SALESORDER_CHANGE\`.
- Created VOFM pricing routines for ZMLC condition type and enhanced quotation \`VA23\` and inbound delivery \`VL33N\` Smart Forms to populate additional line-item data and terms based on sales and purchase organizations.
- Supported routing and discrete manufacturing-related SAP processes, strengthening technical alignment between engineering change records, production orders, BOM information, and downstream Order to Cash execution.

### ABAP Team Lead | Accenture Solutions Pvt. Ltd., Bangalore | 2014 - 2018

- Led ABAP delivery for an S/4HANA on-premise implementation for Kirloskar Group, managing a team of five developers responsible for 170 ABAP objects and coordinating interface, workflow, technical design, peer review, and delivery activities.
- Served as Managed Service Owner and escalation SPOC for PP, QM, and WM applications across EMEA, APAC, and North America for Henkel Consumer Goods, supporting business continuity, SLA/KPI issues, rollout hypercare, and live production incidents.
- Managed escalation calls involving third parties, business IT teams, plant managers, SMEs, and global business stakeholders for manufacturing and warehouse applications.
- Estimated RICEF objects, enhancement requests, change deliveries, and quality checks using Remedy and change request tooling for PP, QM, and WM applications.
- Led weekly SLA reviews with client business heads and supported process improvement initiatives across a large managed services environment.
- Led a team of 17 to 20 members over three years, supporting delivery quality, mentoring, professional development, and performance appraisal activities.
- Helped implement three new solutions that saved 140 man-days of effort across managed service operations.

### ABAP Module Lead | Mindtree Ltd., Bangalore | 2011 - 2014

- Delivered Production Planning RICEF estimations, change requests, and incident resolution for Tata Global Beverages, supporting PP, QM, MM, and SD processes and facilitating L2 meetings with UK business leaders.
- Created complex forecast reports for Production Planning using ALV and classical reporting, including performance tuning of existing reports.
- Built customized module pool screens for tea blending production and quality-check activities in a manufacturing process environment.
- Supported SAP implementation for Al-Ghanim in the Middle East across PP, QM, MM, SD, FI, CRM, and IS-Retail, including data migration, testing, cutover, go-live, and post-go-live hypercare.
- Migrated live data into production systems using BDC and BAPI for Material Master, service orders, and business partner updates, including \`MM01\`, \`MM02\`, service order creation, \`IW32\`, and BP uploads.
- Implemented enhancements for business partner screens, functional location equipment assignment, service order exits, delivery creation checks, stock quantity validation, and routing-related manufacturing processes.
- Participated in techno-functional testing, UAT, regression testing, cutover, go-live, and four weeks of post-go-live hypercare for implementation work.
- Created Purchase Order print, delivery print, and credit/debit memo forms using Smart Forms.
- Supported Unilever SAP IS-Retail implementation pilot by building BAPI-based conversion upload reports for customer master, salesman master, contract, service master, and initial stock creation using \`XD01\`, \`PA30\`, \`VA42\`, \`AC02\`, and \`MB1C\`.

### Application Developer - ABAP | IBM, Bangalore | 2007 - 2011

- Delivered ABAP debugging, performance optimization, IDoc processing, material document generation, technical specifications, and peer-code quality reviews across energy, utilities, oil and gas, and manufacturing implementation projects.
- Tuned BW data extraction reports for Shell, improving long-running report performance through ABAP remediation, query review, and runtime analysis.
- Supported SAP implementation for Hitachi Metals in the automotive manufacturing industry, developing invoice memo, credit/debit memo, scheduling agreement, and purchase order outputs using SAPscript and Smart Forms.
- Developed interactive reports for purchasing data and supported manufacturing-related purchasing and document-output requirements.

## Professional Achievements

- Reduced runtime of long-running BW extraction reports from 24 hours to approximately 2 hours and 42 minutes through ABAP performance tuning, technical remediation, and query optimization.
- Trained new hires in ABAP and contributed to ABAP learning materials for new joiners at Accenture India.
- Won ACE award within Accenture's Products industry group for resolving long-pending complex issues and handling responsibilities beyond the assigned role.

## Education

Bachelor of Engineering in Electronics and Communication, Anna University, India

## SAP Training

SAP S/4 ABAP on HANA | SAP BTP Cockpit | RESTful ABAP Programming | Fiori Bootcamp | SAP Cloud CL400`,
      coverLetter: `Dear Hiring Team,

I am writing to express my interest in the SAP Technical Consultant position. With a strong track record of custom ABAP OO development, S/4HANA migration remediation, and integration engineering, I specialize in building robust enterprise services.

During my time at Tech Mahindra, I played a critical role in S/4HANA cutover preparations, remediating more than 400 custom objects. I am eager to apply my integration and development expertise to your upcoming SAP modernizations.

Sincerely,
Aatmika Natarajan`,
      outreach: `Subject: SAP S/4HANA Technical Consultant / Aatmika Natarajan

Hi,

I came across your SAP ABAP opening. I am a technical consultant specialized in S/4HANA conversion projects, ABAP OO development, and BTP CPI integrations. 

I've successfully remediated 400+ custom objects during large-scale migrations, and would love to bring this migration and performance tuning expertise to your team.

Best,
Aatmika`
    }
  }
};

// --- MOCK SAMPLE JOB DESCRIPTIONS ---
const MOCK_JDS = {
  retail_pm: `Senior Product Manager - Retail Systems & Intelligent Merchandising
Company: Left Field Labs (Client: Major US Grocery & Fashion Retailer)
Location: New York, NY (Hybrid)

Role Overview:
We are looking for a Senior Product Manager to lead development of our next-generation store operations and merchandising systems. In this role, you will take ownership of our transfers and replenishment workflows, building intelligent products that guide frontline store decisions.

Ideal Candidate:
* 8+ years as an Enterprise Product Manager, preferably in retail technology or complex operational software.
* Proven track record of launching ML-powered workflows or intelligent recommendations that influence user actions.
* Experience building prototypes (using AI tools like Claude/Cursor) to de-risk design cycles before engineering handoff is highly desired.
* High credibility: Able to present clear product narratives, handle complex stakeholder requirements, and run customer-centric discovery.
* Technically competent: Solid understanding of REST APIs, system integrations, and data pipeline flows.`,
  
  sap_tech: `SAP Technical Consultant - S/4HANA & CPI Integration
Company: global System Integrator
Location: New Jersey (Onsite)

Requirements:
* 5+ years of hands-on SAP Technical ABAP development experience.
* Solid experience in S/4HANA migration remediation (SPAU/SPDD).
* Hands-on knowledge of SAP BTP, CPI integration flow designs, and custom OData gateways.
* Excellent understanding of RICEFW objects (IDocs, BAPIs, BDCs).`
};

// --- DOM ELEMENTS REGISTER ---
const DOM = {
  profileDropdown: document.getElementById('profileDropdown'),
  briefName: document.getElementById('briefName'),
  briefTitle: document.getElementById('briefTitle'),
  briefEvidenceCount: document.getElementById('briefEvidenceCount'),
  briefVisaLength: document.getElementById('briefVisaLength'),
  
  // Navigation Links
  navDashboard: document.getElementById('navDashboard'),
  navContext: document.getElementById('navContext'),
  navEditor: document.getElementById('navEditor'),
  navAudits: document.getElementById('navAudits'),
  
  // Workspace Sections
  pageDashboard: document.getElementById('pageDashboard'),
  pageContext: document.getElementById('pageContext'),
  pageEditor: document.getElementById('pageEditor'),
  pageAudits: document.getElementById('pageAudits'),
  
  // Staging Inputs
  jdInput: document.getElementById('jdInput'),
  btnSampleJDRetail: document.getElementById('btnSampleJDRetail'),
  btnRunTailoring: document.getElementById('btnRunTailoring'),
  pipelineStatus: document.getElementById('pipelineStatus'),
  pipelineTrack: document.getElementById('pipelineTrack'),
  
  // Claim Approvals
  claimsReviewSection: document.getElementById('claimsReviewSection'),
  claimsReviewContainer: document.getElementById('claimsReviewContainer'),
  
  // Scoreboard
  scoreboardSection: document.getElementById('scoreboardSection'),
  gaugeRecruiter: document.getElementById('gaugeRecruiter'),
  gaugeHM: document.getElementById('gaugeHM'),
  gaugeDefensibility: document.getElementById('gaugeDefensibility'),
  gaugeATS: document.getElementById('gaugeATS'),
  
  // Split Editor
  editorTabs: document.getElementById('editorTabs'),
  editorTextarea: document.getElementById('editorTextarea'),
  resumePreview: document.getElementById('resumePreview'),
  pageBoundingCount: document.getElementById('pageBoundingCount'),
  
  // Modals
  defensibilityModal: document.getElementById('defensibilityModal'),
  btnViewDefensibility: document.getElementById('btnViewDefensibility'),
  btnCloseDefensibilityModal: document.getElementById('btnCloseDefensibilityModal'),
  btnCloseDefensibility: document.getElementById('btnCloseDefensibility'),
  defensibilityQAContainer: document.getElementById('defensibilityQAContainer'),
  
  newProfileModal: document.getElementById('newProfileModal'),
  btnCancelProfile: document.getElementById('btnCancelProfile'),
  btnSaveProfile: document.getElementById('btnSaveProfile'),
  profileNameInput: document.getElementById('profileNameInput'),
  profileRoleInput: document.getElementById('profileRoleInput'),
  profileVisaInput: document.getElementById('profileVisaInput'),
  profileLengthInput: document.getElementById('profileLengthInput'),
  
  // Export buttons
  btnDownloadResume: document.getElementById('btnDownloadResume'),
  btnDownloadPackage: document.getElementById('btnDownloadPackage'),
  exportOptionsModal: document.getElementById('exportOptionsModal'),
  btnCloseExportModal: document.getElementById('btnCloseExportModal'),
  exportDocumentTypeName: document.getElementById('exportDocumentTypeName'),
  btnExportMarkdown: document.getElementById('btnExportMarkdown'),
  btnExportPDF: document.getElementById('btnExportPDF'),
  btnCancelExport: document.getElementById('btnCancelExport'),
  
  // Multi-Application Selector elements
  applicationDropdown: document.getElementById('applicationDropdown'),
  btnNewApplication: document.getElementById('btnNewApplication'),
  newApplicationModal: document.getElementById('newApplicationModal'),
  btnCloseApplicationModal: document.getElementById('btnCloseApplicationModal'),
  appCompanyInput: document.getElementById('appCompanyInput'),
  appRoleInput: document.getElementById('appRoleInput'),
  btnCancelApplication: document.getElementById('btnCancelApplication'),
  btnSaveApplication: document.getElementById('btnSaveApplication'),
  
  // Guided Wizard elements
  wizardCard: document.getElementById('wizardCard'),
  wizardStepIndicator: document.getElementById('wizardStepIndicator'),
  wizardCompany: document.getElementById('wizardCompany'),
  wizardRole: document.getElementById('wizardRole'),
  wizardResumeSelect: document.getElementById('wizardResumeSelect'),
  newResumeName: document.getElementById('newResumeName'),
  newResumeText: document.getElementById('newResumeText'),
  btnUploadResume: document.getElementById('btnUploadResume'),
  btnCreateScratchResume: document.getElementById('btnCreateScratchResume'),
  wizardHighlights: document.getElementById('wizardHighlights'),
  wizardAvoids: document.getElementById('wizardAvoids'),
  pageCountSlider: document.getElementById('pageCountSlider'),
  pageCountValue: document.getElementById('pageCountValue'),
  wizardClaimsContainer: document.getElementById('wizardClaimsContainer'),
  completedRecruiterScore: document.getElementById('completedRecruiterScore'),
  completedHMScore: document.getElementById('completedHMScore'),
  completedATSScore: document.getElementById('completedATSScore'),
  btnUnlockEditor: document.getElementById('btnUnlockEditor'),
  btnWizardBack: document.getElementById('btnWizardBack'),
  btnWizardNext: document.getElementById('btnWizardNext'),
  btnWizardExecute: document.getElementById('btnWizardExecute'),
  btnWizardFinalize: document.getElementById('btnWizardFinalize'),
  
  // Context Library
  contextTabs: document.querySelectorAll('[data-context-tab]'),
  contextTable: document.getElementById('contextTable'),
  
  // API Key inputs
  apiKeyBanner: document.getElementById('apiKeyBanner'),
  apiKeyInput: document.getElementById('apiKeyInput'),
  btnSaveApiKey: document.getElementById('btnSaveApiKey'),
  
  // Recruiter/HM Audit
  simRecruiterText: document.getElementById('simRecruiterText'),
  simHMText: document.getElementById('simHMText'),

  // Phase 2 Auth & Admin elements
  authScreen: document.getElementById('authScreen'),
  authEmail: document.getElementById('authEmail'),
  authPassword: document.getElementById('authPassword'),
  btnAuthAction: document.getElementById('btnAuthAction'),
  btnAuthToggle: document.getElementById('btnAuthToggle'),
  authTitle: document.getElementById('authTitle'),
  authSubtitle: document.getElementById('authSubtitle'),
  authToggleText: document.getElementById('authToggleText'),
  approvalScreen: document.getElementById('approvalScreen'),
  userPendingEmail: document.getElementById('userPendingEmail'),
  btnSignOutPending: document.getElementById('btnSignOutPending'),
  navAdmin: document.getElementById('navAdmin'),
  btnSignOut: document.getElementById('btnSignOut'),
  pageAdmin: document.getElementById('pageAdmin'),
  adminUserTableBody: document.getElementById('adminUserTableBody'),
  btnGoogleAuth: document.getElementById('btnGoogleAuth'),
  btnAppleAuth: document.getElementById('btnAppleAuth')
};

// --- INITIALIZE & CONTROLLER ---
function init() {
  bindEvents();
  checkCloudStatus();
  checkApiKeyStatus();
  initFirebaseAuthentication();
  initWizard();
}

// Bind interactive event listeners
function bindEvents() {
  // Dropdown Profiler
  DOM.profileDropdown.addEventListener('change', (e) => {
    if (e.target.value === 'new_profile') {
      openModal(DOM.newProfileModal);
      e.target.value = STATE.activeProfile; // revert temporarily
    } else {
      STATE.activeProfile = e.target.value;
      loadProfileBrief(STATE.activeProfile);
      loadContextTable();
      updateEditorContent();
      resetSimulations();
      
      // Load target applications list for selected profile
      if (typeof preseedDefaultApplications === 'function') {
        preseedDefaultApplications();
        renderApplicationsList();
        loadActiveApplicationData();
        updateWizardUI();
      }
    }
  });

  // Sidebar Nav Links
  DOM.navDashboard.addEventListener('click', () => switchPage('dashboard', DOM.navDashboard));
  DOM.navContext.addEventListener('click', () => {
    switchPage('context', DOM.navContext);
    loadContextTable();
  });
  DOM.navEditor.addEventListener('click', () => {
    switchPage('editor', DOM.navEditor);
    updateEditorContent();
  });
  DOM.navAudits.addEventListener('click', () => switchPage('audits', DOM.navAudits));

  // Load Retail Job Description
  if (DOM.btnSampleJDRetail) {
    DOM.btnSampleJDRetail.addEventListener('click', () => {
      if (STATE.activeProfile === 'raghav_dharani') {
        DOM.jdInput.value = MOCK_JDS.retail_pm;
      } else {
        DOM.jdInput.value = MOCK_JDS.sap_tech;
      }
    });
  }

  // Run Tailoring Agent Pipeline
  if (DOM.btnRunTailoring) {
    DOM.btnRunTailoring.addEventListener('click', () => {
      if (STATE.pipelineRunning) return;
      if (!DOM.jdInput.value.trim()) {
        alert("Please paste or load a Job Description first!");
        return;
      }
      runAgentPipelineSim();
    });
  }

  // Split-Screen Workspace Tabs
  DOM.editorTabs.addEventListener('click', (e) => {
    if (e.target.classList.contains('pane-tab')) {
      if (e.target.classList.contains('locked')) {
        alert("Access to this output tab is locked by the Administrator.");
        return;
      }
      document.querySelectorAll('#editorTabs .pane-tab').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      STATE.activeEditorTab = e.target.dataset.editorTab;
      updateEditorContent();
      updateExportButtonText();
    }
  });

  DOM.editorTextarea.addEventListener('input', () => {
    const content = DOM.editorTextarea.value;
    const app = getActiveApplication();
    const prof = STATE.profiles[STATE.activeProfile];
    if (STATE.activeEditorTab === 'resume') {
      if (app) app.tailoredResume = content;
      else prof.resumeMarkdown = content;
    } else if (STATE.activeEditorTab === 'cover') {
      if (app) app.coverLetter = content;
      else prof.coverLetter = content;
    } else if (STATE.activeEditorTab === 'outreach') {
      if (app) app.outreach = content;
      else prof.outreach = content;
    } else if (STATE.activeEditorTab === 'interview') {
      if (app) app.customInterviewPrep = content;
    } else if (STATE.activeEditorTab === 'audit') {
      if (app) app.customAuditTrail = content;
    }
    
    renderResumePreview(content);
  });

  // Modal actions
  DOM.btnViewDefensibility.addEventListener('click', () => {
    loadDefensibilityQA();
    openModal(DOM.defensibilityModal);
  });
  DOM.btnCloseDefensibilityModal.addEventListener('click', () => closeModal(DOM.defensibilityModal));
  DOM.btnCloseDefensibility.addEventListener('click', () => closeModal(DOM.defensibilityModal));
  
  DOM.btnCancelProfile.addEventListener('click', () => closeModal(DOM.newProfileModal));
  DOM.btnSaveProfile.addEventListener('click', saveNewProfile);


  // Export Modal Close Handlers
  if (DOM.btnCloseExportModal) {
    DOM.btnCloseExportModal.addEventListener('click', () => closeModal(DOM.exportOptionsModal));
  }
  if (DOM.btnCancelExport) {
    DOM.btnCancelExport.addEventListener('click', () => closeModal(DOM.exportOptionsModal));
  }

  // Export Modal choice selections
  if (DOM.btnExportMarkdown) {
    DOM.btnExportMarkdown.addEventListener('click', () => {
      const content = DOM.editorTextarea.value || '';
      const tabName = STATE.activeEditorTab;
      let filename = "document.md";
      const app = getActiveApplication();
      const prefix = app ? `${app.company.replace(/[^a-z0-9_-]/gi, '_')}_${app.role.replace(/[^a-z0-9_-]/gi, '_')}` : "workspace";
      
      if (tabName === "resume") filename = `${prefix}_tailored_resume.md`;
      else if (tabName === "cover") filename = `${prefix}_cover_letter.md`;
      else if (tabName === "outreach") filename = `${prefix}_outreach_note.md`;
      else if (tabName === "interview") filename = `${prefix}_interview_prep.md`;
      else if (tabName === "audit") filename = `${prefix}_claims_audit_trail.md`;
      
      const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      closeModal(DOM.exportOptionsModal);
    });
  }

  if (DOM.btnExportPDF) {
    DOM.btnExportPDF.addEventListener('click', () => {
      closeModal(DOM.exportOptionsModal);
      setTimeout(() => {
        window.print();
      }, 300);
    });
  }

  // Download export PDF opens dynamic Options Modal
  DOM.btnDownloadResume.addEventListener('click', () => {
    const tabName = STATE.activeEditorTab;
    let typeName = "Tailored Resume";
    if (tabName === "cover") typeName = "Cover Letter";
    else if (tabName === "outreach") typeName = "Outreach Note";
    else if (tabName === "interview") typeName = "Interview Prep";
    else if (tabName === "audit") typeName = "Audit Trail";
    
    if (DOM.exportDocumentTypeName) {
      DOM.exportDocumentTypeName.textContent = typeName;
    }
    openModal(DOM.exportOptionsModal);
  });

  // Compile and trigger direct Markdown file download of the full Job Search collateral package
  DOM.btnDownloadPackage.addEventListener('click', () => {
    const app = getActiveApplication();
    const prof = STATE.profiles[STATE.activeProfile];
    
    if (!app) {
      alert("Please select a Job Application context first to download the package!");
      return;
    }
    
    let packageContent = `# JOB APPLICATION PACKAGE\n`;
    packageContent += `Generated: ${new Date().toLocaleDateString()}\n`;
    packageContent += `Candidate: ${prof.name}\n`;
    packageContent += `Company: ${app.company}\n`;
    packageContent += `Role: ${app.role}\n\n`;
    packageContent += `========================================================================\n\n`;
    
    // Section 1: Tailored Resume
    packageContent += `# SECTION 1: TAILORED RESUME\n\n`;
    packageContent += (app.tailoredResume || `*(No tailored resume drafted yet)*`) + `\n\n`;
    packageContent += `========================================================================\n\n`;
    
    // Section 2: Cover Letter
    packageContent += `# SECTION 2: COVER LETTER\n\n`;
    packageContent += (app.coverLetter || `*(No cover letter drafted yet)*`) + `\n\n`;
    packageContent += `========================================================================\n\n`;
    
    // Section 3: Outreach Note
    packageContent += `# SECTION 3: OUTREACH NOTE\n\n`;
    packageContent += (app.outreach || `*(No outreach notes drafted yet)*`) + `\n\n`;
    packageContent += `========================================================================\n\n`;
    
    // Section 4: Interview Prep
    packageContent += `# SECTION 4: INTERVIEW PREP\n\n`;
    if (app.customInterviewPrep) {
      packageContent += app.customInterviewPrep + `\n\n`;
    } else if (app.defensibilityQA && app.defensibilityQA.length > 0) {
      app.defensibilityQA.forEach((qa, idx) => {
        packageContent += `### Q${idx+1}: ${qa.question}\n\n**Why They Ask**: ${qa.whyTheyAsk}\n\n**Defense Strategy**: ${qa.defenseStrategy}\n\n`;
      });
    } else {
      packageContent += `*(No interview prep generated yet)*\n\n`;
    }
    packageContent += `========================================================================\n\n`;
    
    // Section 5: Audit Trail
    packageContent += `# SECTION 5: CLAIMS AUDIT TRAIL\n\n`;
    if (app.customAuditTrail) {
      packageContent += app.customAuditTrail + `\n\n`;
    } else {
      packageContent += `- **Profile**: ${prof.name}\n- **Target Application**: ${app.company} - ${app.role}\n\n`;
      const claimsList = app.pendingClaims || [];
      if (claimsList.length === 0) {
        packageContent += `*No unapproved stretch claims found. All wording is 100% verified and true.*\n\n`;
      } else {
        claimsList.forEach(claim => {
          const decision = app.claimDecisions[claim.id] || 'pending';
          packageContent += `### Claim ID: ${claim.id}\n- **Proposed**: "${claim.proposed}"\n- **Safer Wording**: "${claim.safer}"\n- **Risk Level**: ${claim.risk}\n- **User Decision**: **${decision.toUpperCase()}**\n- **Concern**: ${claim.reason}\n\n`;
        });
      }
    }
    
    // Let's trigger a real download!
    const blob = new Blob([packageContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const filename = `${app.company.replace(/[^a-z0-9_-]/gi, '_')}_${app.role.replace(/[^a-z0-9_-]/gi, '_')}_package.md`;
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Successfully packaged and downloaded your job search collateral as ${filename}!`);
  });

  // API Key Saving
  DOM.btnSaveApiKey.addEventListener('click', () => {
    const key = DOM.apiKeyInput.value.trim();
    if (!key) {
      alert("Please enter a valid API key!");
      return;
    }
    localStorage.setItem('gemini_api_key', key);
    DOM.apiKeyBanner.style.display = 'none';
    alert("Google AI Studio Key saved securely in your browser!");
  });

  // Candidate Context sub-tabs
  document.querySelectorAll('[data-context-tab]').forEach(tab => {
    tab.addEventListener('click', (e) => {
      document.querySelectorAll('[data-context-tab]').forEach(t => t.classList.remove('active'));
      e.target.classList.add('active');
      STATE.activeContextTab = e.target.dataset.contextTab;
      loadContextTable();
    });
  });

  // Phase 2 Authentication & Admin Event Listeners
  DOM.btnAuthAction.addEventListener('click', handleAuthAction);
  DOM.btnAuthToggle.addEventListener('click', toggleAuthMode);
  DOM.btnSignOut.addEventListener('click', handleSignOut);
  DOM.btnSignOutPending.addEventListener('click', handleSignOut);
  DOM.btnGoogleAuth.addEventListener('click', handleGoogleOAuth);
  DOM.btnAppleAuth.addEventListener('click', handleAppleOAuth);
  DOM.navAdmin.addEventListener('click', () => {
    switchPage('admin', DOM.navAdmin);
    loadAdminUserGrid();
  });
}

// --- PROFILE LOADING & SWAP LOGIC ---
function loadProfileBrief(profileSlug) {
  const prof = STATE.profiles[profileSlug];
  DOM.briefName.textContent = prof.name;
  DOM.briefTitle.textContent = prof.targetRoles[0];
  
  const evCount = prof.evidence.length;
  const metCount = prof.metrics.length;
  DOM.briefEvidenceCount.textContent = `${evCount} Confirmed Core Claims / ${metCount} Confirmed Metrics`;
  
  const visa = prof.visaStatus || "Not Specified";
  const length = prof.preferredLength || 2;
  DOM.briefVisaLength.textContent = `${visa} | ${length} Page${length > 1 ? 's' : ''} Target`;
  
  // Update header dropdown values in case we added one
  DOM.profileDropdown.value = profileSlug;
}

// Switch SPA Page
function switchPage(pageName, navElement) {
  STATE.activeTab = pageName;
  
  // Hide all sections
  DOM.pageDashboard.style.display = 'none';
  DOM.pageContext.style.display = 'none';
  DOM.pageEditor.style.display = 'none';
  DOM.pageAudits.style.display = 'none';
  if (DOM.pageAdmin) DOM.pageAdmin.style.display = 'none';
  
  // Remove active sidebar link classes
  document.querySelectorAll('.sidebar .nav-item').forEach(el => el.classList.remove('active'));
  
  // Show target page
  if (pageName === 'dashboard') DOM.pageDashboard.style.display = 'grid';
  else if (pageName === 'context') DOM.pageContext.style.display = 'grid';
  else if (pageName === 'editor') DOM.pageEditor.style.display = 'grid';
  else if (pageName === 'audits') DOM.pageAudits.style.display = 'grid';
  else if (pageName === 'admin' && DOM.pageAdmin) DOM.pageAdmin.style.display = 'grid';
  
  navElement.classList.add('active');
}

// Check API Key visibility
function checkApiKeyStatus() {
  const key = window.firebaseConfig?.geminiApiKey || localStorage.getItem('gemini_api_key');
  if (key) {
    DOM.apiKeyBanner.style.display = 'none';
  } else {
    DOM.apiKeyBanner.style.display = 'flex';
  }
}

// --- ACTIVE AGENT PIPELINE SIMULATOR / LIVE AI RUN ---
function runAgentPipelineSim() {
  const jdText = DOM.jdInput.value.trim();
  if (!jdText) {
    alert("Please paste or load a Job Description first!");
    return;
  }

  STATE.pipelineRunning = true;
  STATE.pipelineStep = 0;
  if (DOM.btnRunTailoring) DOM.btnRunTailoring.disabled = true;
  DOM.pipelineStatus.textContent = "Status: Initializing Live AI Connection...";
  
  // Reset nodes
  document.querySelectorAll('.pipeline-node').forEach(node => {
    node.classList.remove('active', 'completed');
  });

  // Check if API Key is available
  const apiKey = window.firebaseConfig?.geminiApiKey || localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    // Fallback: Run simulated pipeline preview
    runSimulationFallback();
    return;
  }

  // --- LIVE AI EXECUTION PATH (PARALLEL EXECUTION & ANIMATION) ---
  const steps = [
    { node: 'profile', label: '1. Profile Manager: Checking data isolation barriers...', ms: 800 },
    { node: 'jd', label: '2. JD Analyst: Extracting target outcomes and must-haves...', ms: 1000 },
    { node: 'positioning', label: '3. Positioning Strategist: Calibrating narrative spine...', ms: 900 },
    { node: 'architecture', label: '4. Resume Architect: Constructing layout blueprints...', ms: 1100 }
  ];

  runStepAnimation(0);

  async function runStepAnimation(i) {
    if (i >= steps.length) {
      DOM.pipelineStatus.textContent = "Status: Truth Auditor: Contacting Google Gemini 1.5 Flash...";
      document.querySelector('.pipeline-node[data-node="truth"]').classList.add('active');
      
      try {
        await executeLiveGeminiTailoring(apiKey, jdText);
      } catch (err) {
        console.error("Live AI tailoring failed:", err);
        alert(`Live AI processing failed: ${err.message}\nFalling back to simulated pipeline preview.`);
        runSimulationFallback();
      }
      return;
    }

    const s = steps[i];
    DOM.pipelineStatus.textContent = `Status: ${s.label}`;
    const nodeEl = document.querySelector(`.pipeline-node[data-node="${s.node}"]`);
    if (nodeEl) nodeEl.classList.add('active');

    setTimeout(() => {
      if (nodeEl) {
        nodeEl.classList.remove('active');
        nodeEl.classList.add('completed');
      }
      runStepAnimation(i + 1);
    }, s.ms);
  }
}

// Live AI REST Call
async function executeLiveGeminiTailoring(apiKey, jdText) {
  const p = STATE.profiles[STATE.activeProfile];
  
  const systemPrompt = `You are a team of 19 specialized recruitment, copywriting, and technical auditing agents. Your task is to analyze the target Job Description (JD) and the candidate's core profile, and produce a fully tailored resume package.
You must return your entire output as a single, valid JSON document matching this exact schema:
{
  "atsScore": number (0 to 100),
  "hmScore": number (0 to 100),
  "recruiterScore": number (0 to 100),
  "defensibilityScore": number (0 to 100),
  "tailoredResume": "String (Markdown formatted tailored resume, placing [PENDING_CLAIM_1] and [PENDING_CLAIM_2] in specific bullet locations for any unapproved high-risk claims that need user confirmation)",
  "coverLetter": "String (Markdown cover letter)",
  "outreachNote": "String (Outreach message text)",
  "simRecruiterReport": "String (HTML styled report explaining recruiter 30s impression, checklist, concerns, and overall shortlist probability)",
  "simHMReport": "String (HTML styled report explaining hiring manager credibility checks, domain alignment, and risk calibration)",
  "pendingClaims": [
    {
      "id": "claim_1",
      "proposed": "String (The high-impact rephrase or stretch bullet containing PyTorch, personalization, or similar unconfirmed skills)",
      "safer": "String (The safer, confirmed core reframe that has 100% truth basis)",
      "risk": "String ('Moderate' or 'Very High')",
      "reason": "String (Explanation of why this stretch claim is flagged by the Truth Auditor)",
      "question": "String (A direct, targeted question asking candidate if they can defend this exact claim)"
    }
  ],
  "defensibilityQA": [
    {
      "question": "String (Tough, technical interview question testing the tailored resume claims)",
      "whyTheyAsk": "String (Why the interviewer is asking this question)",
      "defenseStrategy": "String (Strategic advice for the candidate to answer truthfully and defensively)"
    }
  ]
}

Candidate Context:
Name: ${p.name}
Role Archetype: ${p.targetRoles[0]}
Location: ${p.location}
Phone: ${p.phone}
Email: ${p.email}
LinkedIn: ${p.linkedin}

Factual Evidence Bank:
${JSON.stringify(p.evidence, null, 2)}

Approved Metrics:
${JSON.stringify(p.metrics, null, 2)}

Approved Extrapolations:
${JSON.stringify(p.extrapolations, null, 2)}

Target Job Description:
${jdText}

Follow all core guidelines:
1. Optimize for Hiring Manager credibility and Recruiter screen shortlist.
2. Anti-Overfitting: Avoid direct keyword stuffing. Keep phrasing natural and human.
3. Identify 1 or 2 strategic stretches that would help matching but present interview risk, place them in pendingClaims, and inject the placeholder [PENDING_CLAIM_1] or [PENDING_CLAIM_2] in the tailored resume where they belong.
4. Ensure the tailoredResume markdown includes the candidate header, professional summary, strengths, experience, and bulleted accomplishments.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: systemPrompt
        }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const result = await response.json();
  const text = result.candidates[0].content.parts[0].text;
  
  const parsedData = JSON.parse(text.trim());
  
  // Set dynamic scores
  STATE.atsScore = parsedData.atsScore || 85;
  STATE.hmScore = parsedData.hmScore || 80;
  STATE.recruiterScore = parsedData.recruiterScore || 80;
  STATE.defensibilityScore = parsedData.defensibilityScore || 70;
  
  p.resumeMarkdown = parsedData.tailoredResume;
  p.coverLetter = parsedData.coverLetter;
  p.outreach = parsedData.outreachNote;
  p.pendingClaims = parsedData.pendingClaims || [];
  
  // Store live auditor reports
  STATE.liveRecruiterReport = parsedData.simRecruiterReport;
  STATE.liveHMReport = parsedData.simHMReport;
  STATE.liveDefensibilityQA = parsedData.defensibilityQA;

  completeLiveAgentPipeline();
}

// Complete Live Pipeline Execution
function completeLiveAgentPipeline() {
  document.querySelector('.pipeline-node[data-node="truth"]').classList.remove('active');
  document.querySelector('.pipeline-node[data-node="truth"]').classList.add('completed');
  
  // Run remaining complete animations rapidly
  const rest = ['credibility', 'simulator', 'packages'];
  let delay = 300;
  rest.forEach((node, idx) => {
    setTimeout(() => {
      const nodeEl = document.querySelector(`.pipeline-node[data-node="${node}"]`);
      if (nodeEl) {
        nodeEl.classList.add('completed');
      }
      if (idx === rest.length - 1) {
        DOM.pipelineStatus.textContent = "Status: Live AI Tailoring Complete. Audits Loaded.";
        if (DOM.btnRunTailoring) DOM.btnRunTailoring.disabled = false;
        STATE.pipelineRunning = false;
        
        DOM.scoreboardSection.style.display = 'block';
        
        animateGauge(DOM.gaugeRecruiter, STATE.recruiterScore, 'hsl(250, 89%, 65%)');
        animateGauge(DOM.gaugeHM, STATE.hmScore, 'hsl(190, 90%, 50%)');
        animateGauge(DOM.gaugeDefensibility, STATE.defensibilityScore, 'hsl(150, 86%, 43%)');
        animateGauge(DOM.gaugeATS, STATE.atsScore, 'hsl(32, 95%, 55%)');
        
        DOM.claimsReviewSection.style.display = 'block';
        renderPendingClaims();
        
        // Load live generated simulator reviews
        DOM.simRecruiterText.innerHTML = STATE.liveRecruiterReport;
        DOM.simHMText.innerHTML = STATE.liveHMReport;
        
        alert("🚀 Live AI Analysis & Tailoring Complete!\n\n1. Target Job Description analyzed in real-time.\n2. Cloud Evidence and Metrics mapped to resume.\n3. Strategic claim stretches isolated for your approval.");
      }
    }, delay);
    delay += 300;
  });
}

// Fallback Simulation Pipeline
function runSimulationFallback() {
  const steps = [
    { node: 'profile', label: '1. Profile Manager checking isolation limits...', ms: 800 },
    { node: 'jd', label: '2. JD Analyst scanning filters and level signals...', ms: 1000 },
    { node: 'positioning', label: '3. Positioning Strategist selecting target domains...', ms: 900 },
    { node: 'architecture', label: '4. Resume Architect reframing bullet outlines...', ms: 1200 },
    { node: 'truth', label: '5. Truth Auditor validating metric bounds...', ms: 1000 },
    { node: 'credibility', label: '6. Credibility Auditor searching for JD echoes...', ms: 1100 },
    { node: 'simulator', label: '7. Simulators evaluating recruiter 30s read...', ms: 800 },
    { node: 'packages', label: '8. Packaging Agent creating collateral links...', ms: 700 }
  ];

  function runStep(i) {
    if (i >= steps.length) {
      completeAgentPipeline();
      return;
    }

    const s = steps[i];
    DOM.pipelineStatus.textContent = `Status: ${s.label}`;
    const nodeEl = document.querySelector(`.pipeline-node[data-node="${s.node}"]`);
    if (nodeEl) nodeEl.classList.add('active');

    setTimeout(() => {
      if (nodeEl) {
        nodeEl.classList.remove('active');
        nodeEl.classList.add('completed');
      }
      runStep(i + 1);
    }, s.ms);
  }

  runStep(0);
}

// Agent pipeline finishes
function completeAgentPipeline() {
  STATE.pipelineRunning = false;
  if (DOM.btnRunTailoring) DOM.btnRunTailoring.disabled = false;
  DOM.pipelineStatus.textContent = "Status: Execution Completed. Audits Ready.";
  
  // Load simulation scoreboard
  DOM.scoreboardSection.style.display = 'block';
  
  // Trigger dynamic score gauges animations
  animateGauge(DOM.gaugeRecruiter, 88, 'hsl(250, 89%, 65%)');
  animateGauge(DOM.gaugeHM, 82, 'hsl(190, 90%, 50%)');
  animateGauge(DOM.gaugeDefensibility, 70, 'hsl(150, 86%, 43%)'); // Starts moderate due to pending approvals
  animateGauge(DOM.gaugeATS, 92, 'hsl(32, 95%, 55%)');

  // Trigger claim review board
  DOM.claimsReviewSection.style.display = 'block';
  renderPendingClaims();
  
  // Populate Simulator Reports
  loadSimReports();
  
  // Highlight Split Screen navigation
  alert("Pipeline execution completed successfully!\n\n1. Skeptical Simulator audits generated.\n2. Extrapolations requiring approval listed below.\n3. Draft documents staged in the Split Workspace.");
}

function animateGauge(element, targetValue, color) {
  let val = 0;
  element.style.setProperty('--color', color);
  
  const timer = setInterval(() => {
    if (val >= targetValue) {
      clearInterval(timer);
    } else {
      val++;
      element.textContent = `${val}%`;
      element.style.setProperty('--percentage', `${val * 3.6}deg`);
      element.dataset.score = val;
    }
  }, 15);
}

function resetSimulations() {
  DOM.scoreboardSection.style.display = 'none';
  DOM.claimsReviewSection.style.display = 'none';
  
  DOM.simRecruiterText.textContent = "Execute the pipeline first to generate simulation analysis.";
  DOM.simHMText.textContent = "Execute the pipeline first to generate simulation analysis.";
}

// --- DYNAMIC CLAIMS APPROVAL COMPONENT ---
function renderPendingClaims() {
  const prof = STATE.profiles[STATE.activeProfile];
  DOM.claimsReviewContainer.innerHTML = '';
  
  const activeClaims = prof.pendingClaims.filter(c => c.status === 'pending');
  
  if (activeClaims.length === 0) {
    DOM.claimsReviewContainer.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--text-muted);">All strategic claims approved! Audit trail successfully logged.</div>`;
    return;
  }

  activeClaims.forEach(claim => {
    const card = document.createElement('div');
    card.className = 'claim-card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span class="claim-badge ${claim.risk === 'Very High' ? 'high-risk' : 'extrapolation'}">${claim.risk} Risk Stretch</span>
        <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Reason: ${claim.reason}</span>
      </div>
      
      <div style="font-weight: 600; color: var(--accent-cyan); font-size: 0.95rem; margin-top: 0.25rem;">
        <i class="fa-solid fa-circle-question"></i> ${claim.question}
      </div>
      
      <div class="claim-comparison">
        <div class="wording-panel">
          <div class="wording-panel-title">Proposed Bullet (Strategic Extrapolation)</div>
          <div class="wording-text">${claim.proposed}</div>
        </div>
        
        <div class="wording-panel">
          <div class="wording-panel-title">Safer Alternative (Confirmed Core Reframe)</div>
          <div class="wording-text">${claim.safer}</div>
        </div>
      </div>
      
      <div class="claim-actions">
        <button class="btn-reject" onclick="handleClaimDecision('${claim.id}', 'rejected')"><i class="fa-solid fa-shield"></i> Use Safer Option</button>
        <button class="btn-approve" onclick="handleClaimDecision('${claim.id}', 'approved')"><i class="fa-solid fa-check"></i> Approve Proposed</button>
      </div>
    `;
    DOM.claimsReviewContainer.appendChild(card);
  });
}

// Handle Approve or Reject decisions (updates audit trail and score)
window.handleClaimDecision = function(claimId, decision) {
  const prof = STATE.profiles[STATE.activeProfile];
  const claimIdx = prof.pendingClaims.findIndex(c => c.id === claimId);
  if (claimIdx === -1) return;
  
  const claim = prof.pendingClaims[claimIdx];
  claim.status = decision;
  
  // Log into active candidate audit state
  if (decision === 'approved') {
    // Add to approved extrapolations list
    prof.extrapolations.push({
      claim: claim.proposed,
      source: `User Approved in active dashboard session`,
      status: 'approved_extrapolation',
      interview_defense: claim.reason
    });
    // Write dynamically to Firebase if online!
    pushDecisionToCloud(STATE.activeProfile, claim, 'approved');
    
    // Boost defensibility marginally if approved because the candidate is asserting readiness to defend
    const currentDefVal = parseInt(DOM.gaugeDefensibility.dataset.score);
    animateGauge(DOM.gaugeDefensibility, Math.min(currentDefVal + 10, 95), 'hsl(150, 86%, 43%)');
  } else {
    // Reverted to safer, boost credibility and defensibility because we removed the stretch risk!
    pushDecisionToCloud(STATE.activeProfile, claim, 'rejected');
    
    const currentHM = parseInt(DOM.gaugeHM.dataset.score);
    const currentDef = parseInt(DOM.gaugeDefensibility.dataset.score);
    animateGauge(DOM.gaugeHM, Math.min(currentHM + 6, 98), 'hsl(190, 90%, 50%)');
    animateGauge(DOM.gaugeDefensibility, Math.min(currentDef + 15, 98), 'hsl(150, 86%, 43%)');
  }
  
  // Re-render dashboard claims cards
  renderPendingClaims();
  
  // Re-write tailored resume draft dynamically in editor based on decision!
  updateResumeDraftOnDecision();
};

function updateResumeDraftOnDecision() {
  const app = getActiveApplication();
  const prof = STATE.profiles[STATE.activeProfile];
  
  let resText = app ? app.tailoredResume : prof.resumeMarkdown;
  if (!resText) return;
  
  const claims = app ? app.pendingClaims : prof.pendingClaims;
  const decisions = app ? app.claimDecisions : {};
  
  // Loop over pending claims and substitute placeholders
  if (claims) {
    claims.forEach((c, idx) => {
      const placeholder = `[PENDING_CLAIM_${idx + 1}]`;
      if (resText.includes(placeholder)) {
        const decision = decisions[c.id] || c.status;
        const finalWording = decision === 'approved' ? c.proposed : c.safer;
        resText = resText.replace(placeholder, finalWording);
      }
    });
  }
  
  if (app) app.tailoredResume = resText;
  else prof.resumeMarkdown = resText;
  
  // If we are currently viewing the resume editor, reload it
  if (STATE.activeEditorTab === 'resume') {
    DOM.editorTextarea.value = resText;
  }
  renderResumePreview(resText);
}

// --- LIVE WORKSPACE SPLIT-SCREEN EDITOR ---
function updateEditorContent() {
  const app = getActiveApplication();
  const prof = STATE.profiles[STATE.activeProfile];
  
  // Make sure template placeholders are replaced if some claims have decisions
  let content = '';
  if (STATE.activeEditorTab === 'resume') {
    // Update draft with decisions made so far
    updateResumeDraftOnDecision();
    content = app ? app.tailoredResume : prof.resumeMarkdown;
  } else if (STATE.activeEditorTab === 'cover') {
    content = app ? app.coverLetter : prof.coverLetter;
  } else if (STATE.activeEditorTab === 'outreach') {
    content = app ? app.outreach : prof.outreach;
  } else if (STATE.activeEditorTab === 'interview') {
    if (app) {
      if (app.customInterviewPrep) {
        content = app.customInterviewPrep;
      } else if (app.defensibilityQA && app.defensibilityQA.length > 0) {
        content = `# Interview Defensibility Prep - Q&A\n\n`;
        app.defensibilityQA.forEach((qa, idx) => {
          content += `### Q${idx+1}: ${qa.question}\n\n**Why They Ask**: ${qa.whyTheyAsk}\n\n**Defense Strategy**: ${qa.defenseStrategy}\n\n`;
        });
      } else {
        content = `# Interview Defensibility Prep\n\nNo defensibility questions generated yet. Complete Step 3 in the wizard to trigger agent analysis.`;
      }
    } else {
      content = `# Interview Defensibility Prep\n\nSelect a job application to load customized interview prep notes.`;
    }
  } else if (STATE.activeEditorTab === 'audit') {
    if (app) {
      if (app.customAuditTrail) {
        content = app.customAuditTrail;
      } else {
        let auditMarkdown = `# Claims Approval Audit Trail\n\n- **Date**: ${new Date().toLocaleDateString()}\n- **Profile**: ${prof.name}\n- **Target Application**: ${app.company} - ${app.role}\n\n## Claims Audited:\n\n`;
        
        const claimsList = app.pendingClaims || [];
        if (claimsList.length === 0) {
          auditMarkdown += `*No unapproved stretch claims found. All wording is 100% verified and true.*`;
        } else {
          claimsList.forEach(claim => {
            const decision = app.claimDecisions[claim.id] || 'pending';
            auditMarkdown += `### Claim ID: ${claim.id}\n- **Proposed**: "${claim.proposed}"\n- **Safer Wording**: "${claim.safer}"\n- **Risk Level**: ${claim.risk}\n- **User Decision**: **${decision.toUpperCase()}**\n- **Concern**: ${claim.reason}\n\n`;
          });
        }
        content = auditMarkdown;
      }
    } else {
      content = `# Claims Approval Audit Trail\n\nSelect a job application to load claim decisions and audit trail logs.`;
    }
  }
  
  DOM.editorTextarea.value = content || '';
  renderResumePreview(content || '');
  updateExportButtonText();
}

function updateExportButtonText() {
  if (!DOM.btnDownloadResume) return;
  const tab = STATE.activeEditorTab;
  let label = "Export Tailored Resume";
  if (tab === "cover") label = "Export Cover Letter";
  else if (tab === "outreach") label = "Export Outreach Note";
  else if (tab === "interview") label = "Export Interview Prep";
  else if (tab === "audit") label = "Export Audit Trail";
  
  DOM.btnDownloadResume.innerHTML = `<i class="fa-solid fa-file-pdf"></i> ${label}`;
}

// Custom Markdown rendering parser for preview letter pane
function renderResumePreview(markdown) {
  if (!markdown) {
    DOM.resumePreview.innerHTML = '';
    return;
  }

  // Parse markdown bold (**text**), italics (*text*), and code (`text`) inline
  function parseInline(text) {
    return text
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/_([^_]+)_/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.05); padding: 2px 4px; border-radius: 3px; font-family: monospace; font-size: 0.9em; color: #d63384;">$1</code>');
  }

  const lines = markdown.split('\n');
  let html = '';
  let inBullets = false;
  let hasHeaderClosed = false;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inBullets) { html += '</ul>'; inBullets = false; }
      html += '<div style="height: 0.4rem;"></div>'; // Spacing
      return;
    }

    // Candidate H1 Name
    if (trimmed.startsWith('# ') && !hasHeaderClosed) {
      if (inBullets) { html += '</ul>'; inBullets = false; }
      html += `<div class="preview-header" style="text-align: center; border-bottom: 2px solid #222; padding-bottom: 0.6rem; margin-bottom: 0.8rem; display: flex; flex-direction: column; gap: 0.25rem;">
                <div class="preview-name" style="font-size: 1.8rem; font-weight: bold; font-family: 'Georgia', serif; color: #111;">${parseInline(trimmed.substring(2))}</div>`;
    }
    // Any lines before ## are inside the header! (Pre-closing bug fix)
    else if (!hasHeaderClosed && !trimmed.startsWith('## ') && !trimmed.startsWith('### ')) {
      if (trimmed.includes('|') && (trimmed.toLowerCase().includes('manager') || trimmed.toLowerCase().includes('developer') || trimmed.toLowerCase().includes('consultant') || trimmed.toLowerCase().includes('architect'))) {
        html += `<div class="preview-title" style="font-size: 0.85rem; font-weight: bold; text-transform: uppercase; color: #444; letter-spacing: 0.5px; margin-top: 0.1rem; font-family: var(--font-body);">${parseInline(trimmed)}</div>`;
      } else if (trimmed.toLowerCase().includes('manager') || trimmed.toLowerCase().includes('developer') || trimmed.toLowerCase().includes('consultant') || trimmed.toLowerCase().includes('architect') || trimmed.toLowerCase().includes('archetype') || trimmed.toLowerCase().includes('specialist')) {
        html += `<div class="preview-title" style="font-size: 0.85rem; font-weight: bold; text-transform: uppercase; color: #444; letter-spacing: 0.5px; margin-top: 0.1rem; font-family: var(--font-body);">${parseInline(trimmed)}</div>`;
      } else {
        html += `<div class="preview-contact" style="font-size: 0.78rem; color: #555; font-family: var(--font-body);">${parseInline(trimmed)}</div>`;
      }
    }
    // Section Header (H2)
    else if (trimmed.startsWith('## ')) {
      if (inBullets) { html += '</ul>'; inBullets = false; }
      // If we were inside the header, close it
      if (html.includes('preview-header') && !hasHeaderClosed) {
        html += `</div>\n<!-- end header -->`;
        hasHeaderClosed = true;
      }
      html += `<div class="preview-section" style="margin-top: 1rem; display: flex; flex-direction: column; gap: 0.3rem;">
                <div class="preview-section-title" style="font-weight: bold; border-bottom: 1.5px solid #222; text-transform: uppercase; font-size: 0.82rem; padding-bottom: 2px; color: #111; letter-spacing: 0.5px; font-family: var(--font-body);">${parseInline(trimmed.substring(3))}</div>
              </div>`;
    }
    // Experience / Project Header (H3)
    else if (trimmed.startsWith('### ')) {
      if (inBullets) { html += '</ul>'; inBullets = false; }
      if (html.includes('preview-header') && !hasHeaderClosed) {
        html += `</div>\n<!-- end header -->`;
        hasHeaderClosed = true;
      }
      
      // Let's parse split experience line (e.g. KWI | Senior PM | 2025)
      const parts = trimmed.substring(4).split('|').map(p => p.trim());
      if (parts.length >= 2) {
        const titleAndCompany = parts.slice(0, parts.length - 1).join(' | ');
        const dateStr = parts[parts.length - 1];
        html += `<div class="preview-experience-item" style="margin-top: 0.6rem;">
                  <div class="preview-exp-header" style="display: flex; justify-content: space-between; font-weight: bold; font-size: 0.82rem; color: #111; font-family: 'Georgia', serif;">
                    <span>${parseInline(titleAndCompany)}</span>
                    <span style="font-weight: 600; font-family: var(--font-body); font-size: 0.78rem;">${parseInline(dateStr)}</span>
                  </div>
                </div>`;
      } else {
        html += `<div class="preview-experience-item" style="margin-top: 0.6rem;">
                  <div class="preview-exp-header" style="font-weight: bold; font-size: 0.82rem; color: #111; font-family: 'Georgia', serif;">
                    <span>${parseInline(trimmed.substring(4))}</span>
                  </div>
                </div>`;
      }
    }
    // Bullet Items (starts with "- " or "* " or "• ")
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      if (html.includes('preview-header') && !hasHeaderClosed) {
        html += `</div>\n<!-- end header -->`;
        hasHeaderClosed = true;
      }
      if (!inBullets) {
        html += `<ul class="preview-bullets" style="margin-top: 0.2rem; margin-left: 1.25rem; padding-left: 0; list-style-type: disc; display: flex; flex-direction: column; gap: 0.25rem; font-family: 'Georgia', serif;">`;
        inBullets = true;
      }
      const bulletContent = trimmed.substring(2);
      html += `<li class="preview-bullet" style="font-size: 0.8rem; color: #222; line-height: 1.4;">${parseInline(bulletContent)}</li>`;
    }
    // Standard paragraphs
    else {
      if (html.includes('preview-header') && !hasHeaderClosed) {
        html += `</div>\n<!-- end header -->`;
        hasHeaderClosed = true;
      }
      if (inBullets) { html += '</ul>'; inBullets = false; }
      
      // If it's a bold line like **Company** or *Sub-info*
      if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
        html += `<div class="preview-exp-sub" style="font-weight: bold; font-size: 0.8rem; color: #333; margin-top: 0.2rem; font-family: 'Georgia', serif;">${parseInline(trimmed)}</div>`;
      } else if (trimmed.startsWith('*') && trimmed.endsWith('*')) {
        html += `<div class="preview-exp-sub" style="font-style: italic; font-size: 0.8rem; color: #555; margin-top: 0.1rem; font-family: 'Georgia', serif;">${parseInline(trimmed)}</div>`;
      } else {
        html += `<div style="margin-top: 0.3rem; font-size: 0.8rem; color: #222; line-height: 1.4; text-align: justify; font-family: 'Georgia', serif;">${parseInline(trimmed)}</div>`;
      }
    }
  });

  if (inBullets) { html += '</ul>'; }
  if (html.includes('preview-header') && !hasHeaderClosed) {
    html += `</div>\n<!-- end header -->`;
  }
  
  DOM.resumePreview.innerHTML = html;
  
  // Page indicator update
  const pxHeight = DOM.resumePreview.scrollHeight;
  const pages = Math.ceil(pxHeight / 900);
  const maxPages = STATE.activeProfile === 'aatmika_natarajan' ? 3 : 2;
  DOM.pageBoundingCount.textContent = `${pages} / ${maxPages} Page${pages > 1 ? 's' : ''} Used`;
}

// --- CONTEXT LIBRARY JSON TABLE EDITOR ---
function loadContextTable() {
  const prof = STATE.profiles[STATE.activeProfile];
  let data = [];
  
  if (STATE.activeContextTab === 'evidence') {
    data = prof.evidence;
  } else if (STATE.activeContextTab === 'metrics') {
    data = prof.metrics;
  } else if (STATE.activeContextTab === 'extrapolations') {
    data = prof.extrapolations;
  }
  
  if (data.length === 0) {
    DOM.contextTable.innerHTML = `<tr><td style="padding: 1.5rem; text-align: center; color: var(--text-muted);">No records found under this context category.</td></tr>`;
    return;
  }
  
  let headerHtml = '<thead><tr style="border-bottom: 2px solid var(--border-glass); color: var(--text-primary); font-weight: bold;">';
  const keys = Object.keys(data[0]);
  keys.forEach(k => {
    headerHtml += `<th style="padding: 0.75rem; text-transform: capitalize;">${k.replace(/_/g, ' ')}</th>`;
  });
  headerHtml += '</tr></thead><tbody>';
  
  let bodyHtml = '';
  data.forEach((row, rIdx) => {
    bodyHtml += `<tr style="border-bottom: 1px solid var(--border-glass); color: var(--text-secondary);">`;
    keys.forEach(k => {
      let val = row[k];
      if (Array.isArray(val)) {
        val = val.join(', ');
      }
      bodyHtml += `<th style="padding: 0.75rem; font-weight: normal; font-size: 0.85rem;">${val}</th>`;
    });
    bodyHtml += `</tr>`;
  });
  
  DOM.contextTable.innerHTML = headerHtml + bodyHtml + '</tbody>';
}

// --- CLOUD FIRESTORE INTEGRATION STATUS ---
function checkCloudStatus() {
  // Check if Firebase script bound correctly
  setTimeout(() => {
    if (window.db) {
      console.log("Interactive Database Connection established in UI.");
      loadCloudDataAndRefresh(); // Load metrics silently in the background
    } else {
      console.log("No dynamic Cloud database connected. Running in offline fallback cache.");
    }
  }, 1000);
}

async function handleCloudMigration() {
  if (!window.db) {
    alert("Firebase database connection not initialized yet! Ensure index.html loads modular scripts correctly.");
    return;
  }
  
  DOM.btnMigrateToCloud.disabled = true;
  DOM.btnMigrateToCloud.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Syncing Active Data...`;
  
  try {
    const { doc, setDoc, addDoc, collection } = window.firebaseHelpers;
    const slugs = Object.keys(STATE.profiles);
    
    for (const slug of slugs) {
      const p = STATE.profiles[slug];
      
      // 1. Create Base User Profile Document
      await setDoc(doc(window.db, "users", slug), {
        name: p.name,
        fullNameOption: p.fullNameOption,
        location: p.location,
        phone: p.phone,
        email: p.email,
        linkedin: p.linkedin,
        targetRoles: p.targetRoles
      });
      
      // 2. Upload Evidence Sub-collection
      for (const ev of p.evidence) {
        await addDoc(collection(window.db, "users", slug, "evidence"), ev);
      }
      
      // 3. Upload Metrics Sub-collection
      for (const met of p.metrics) {
        await addDoc(collection(window.db, "users", slug, "metrics"), met);
      }

      // 4. Upload Extrapolations Sub-collection
      for (const ex of p.extrapolations) {
        await addDoc(collection(window.db, "users", slug, "extrapolations"), ex);
      }
      
      console.log(`Successfully migrated profile & nested context sub-collections for slug: ${slug}`);
    }
    
    DOM.btnMigrateToCloud.innerHTML = `<i class="fa-solid fa-cloud-circle-check"></i> Cloud Sync Active`;
    DOM.btnMigrateToCloud.style.background = 'var(--color-success)';
    
    alert("🚀 Magic Cloud Migration Complete!\n\nAll candidate records, evidence metrics, and approved extrapolations are successfully written and secured under your Google Firestore cloud database! Your UI is now 100% cloud-synced.");
    
    // Read directly from Cloud Firestore to build proof of synchronization
    await loadCloudDataAndRefresh();
    
  } catch (error) {
    console.error("Migration failure details:", error);
    DOM.btnMigrateToCloud.disabled = false;
    DOM.btnMigrateToCloud.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Retry Sync`;
    alert(`Sync failed: ${error.message}\nMake sure your Firestore database in your console has rules set to allow public read/writes during testing!`);
  }
}

// Pull synced cloud metrics to refresh UI state
async function loadCloudDataAndRefresh() {
  const { getDocs, collection } = window.firebaseHelpers;
  const snapshot = await getDocs(collection(window.db, "users", STATE.activeProfile, "metrics"));
  
  if (!snapshot.empty) {
    const cloudMetrics = [];
    snapshot.forEach(doc => cloudMetrics.push(doc.data()));
    // Replace cache
    STATE.profiles[STATE.activeProfile].metrics = cloudMetrics;
    loadProfileBrief(STATE.activeProfile);
    loadContextTable();
  }
}

// Programmatic write for decisions
async function pushDecisionToCloud(userSlug, claim, decision) {
  if (!window.db) return;
  try {
    const { addDoc, collection } = window.firebaseHelpers;
    await addDoc(collection(window.db, "users", userSlug, "decisions_audit"), {
      claimId: claim.id,
      proposedWording: claim.proposed,
      saferAlternative: claim.safer,
      userDecision: decision,
      timestamp: new Date().toISOString()
    });
    console.log("Decision successfully written to cloud audit trail.");
  } catch (err) {
    console.error("Error writing decision to cloud:", err);
  }
}

// --- SIMULATION REPORTS PANE ---
function loadSimReports() {
  const prof = STATE.profiles[STATE.activeProfile];
  
  if (STATE.activeProfile === 'raghav_dharani') {
    DOM.simRecruiterText.innerHTML = `
      <p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Overall Impression: Strong Senior Product Leader Alignment</p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <li><strong>First 30s Read</strong>: Summary is crisp, immediately highlights 10+ years enterprise SaaS, AI workflow, and store ops platform building, matching the Left Field Labs JD perfectly.</li>
        <li><strong>Frictional Signals</strong>: The prototyping focus (Claude/Cursor) is heavily favored in early resume sections.</li>
        <li><strong>Shortlist Confidence</strong>: Very High (88%). Highly attractive match.</li>
      </ul>
    `;
    
    DOM.simHMText.innerHTML = `
      <p style="color: var(--color-warning); font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Critical Risks: AI & ML Extrapolations Need Calibration</p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <li><strong>Credibility Checks</strong>: Metrics regarding KWI transfers (70% migration in 2 months) are proportional and believable.</li>
        <li><strong>Domain Overclaim Warning</strong>: The proposed PyTorch ML architecture bullet is a massive red flag. A seasoned HM will easily tear this apart during technical screens, noting standard PM background without hands-on engineering tenure. <em>Recommendation: Revert to ML replenishment workflow reframe.</em></li>
        <li><strong>Hiring Manager Score</strong>: 82% (Credibility boosted by de-escalating PyTorch claims).</li>
      </ul>
    `;
  } else {
    // Aatmika Natarajan
    DOM.simRecruiterText.innerHTML = `
      <p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Overall Impression: Excellent SAP ABAP Developer Profile</p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <li><strong>First 30s Read</strong>: Standard conversion tools, SPAU/SPDD remediation, and Order to Cash custom object experiences are prominently featured.</li>
        <li><strong>Shortlist Confidence</strong>: High (86%). Strong match for hands-on ABAP/CPI developer requirements.</li>
      </ul>
    `;
    
    DOM.simHMText.innerHTML = `
      <p style="color: var(--color-warning); font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Integration Architecture Claims Checked</p>
      <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
        <li><strong>Credibility Checks</strong>: Remediating 400+ custom objects is highly defensible and matches typical S/4HANA migration scale.</li>
        <li><strong>BTP CPI Warning</strong>: Custom CPI flow architecture stretch claims create minor technical screen risks. <em>Recommendation: Position as collaborative template integration.</em></li>
        <li><strong>Hiring Manager Score</strong>: 84%.</li>
      </ul>
    `;
  }
}

// --- INTERVIEW DEFENSIBILITY Q&A LIST ---
function loadDefensibilityQA() {
  const prof = STATE.profiles[STATE.activeProfile];
  DOM.defensibilityQAContainer.innerHTML = '';
  
  if (STATE.activeProfile === 'raghav_dharani') {
    DOM.defensibilityQAContainer.innerHTML = `
      <div class="qa-item">
        <div class="qa-q">Q1: "You mention introducing spec-driven, AI-assisted development before engineering is engaged. Walk us through a specific feature spec you built with Claude/Cursor and how it de-risked the engineering cycle."</div>
        <div class="qa-explain">Why they ask: Testing whether this was actual prototyping or just high-level prompt generation.</div>
        <div class="qa-defense"><strong>Defense Strategy</strong>: Discuss the Transfers Operations platform at KWI. Explain how you generated functional HTML/JS prototypes in Claude to validate store transfer exceptions with retail business leaders, saving 2-3 weeks of engineering alignment.</div>
      </div>
      <div class="qa-item">
        <div class="qa-q">Q2: "You launched an ML-powered Grocery Ordering system at Upshop. How did you handle ML model thresholds and recommendations that store frontline workers disagreed with?"</div>
        <div class="qa-explain">Why they ask: Probing the depth of ML product integration and real-world user adoption.</div>
        <div class="qa-defense"><strong>Defense Strategy</strong>: Frame as product ownership of the operational interface. Explain that ML recommended order quantities were overlaid with manual review overlays, which built frontline worker trust while driving 18% overproduction reductions.</div>
      </div>
    `;
  } else {
    DOM.defensibilityQAContainer.innerHTML = `
      <div class="qa-item">
        <div class="qa-q">Q1: "What was the most challenging ABAP object you remediated during the SPAU/SPDD phase of the S/4HANA conversion, and how did you resolve conflicts?"</div>
        <div class="qa-explain">Why they ask: Checking hands-on technical depth in standard SAP migration routines.</div>
        <div class="qa-defense"><strong>Defense Strategy</strong>: Discuss the remediation of custom user exit codes in Order to Cash. Walk through checking SAP standard modification notes, isolating custom routines, and testing gateways.</div>
      </div>
    `;
  }
}

// --- MODALS HELPER UTILS ---
function openModal(modalEl) {
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
}

// Save New Candidate Profile
function saveNewProfile() {
  const name = DOM.profileNameInput.value.trim();
  const role = DOM.profileRoleInput.value.trim();
  const visa = DOM.profileVisaInput.value.trim() || "US Citizen";
  const length = parseInt(DOM.profileLengthInput.value) || 2;
  
  if (!name || !role) {
    alert("Please fill in Name and Target Role!");
    return;
  }
  
  const slug = name.toLowerCase().replace(/ /g, '_');
  
  STATE.profiles[slug] = {
    name: name,
    fullNameOption: name,
    location: "New York, NY",
    phone: "212-555-0100",
    email: `${slug}@domain.com`,
    linkedin: `linkedin.com/in/${slug}`,
    visaStatus: visa,
    preferredLength: length,
    targetRoles: [role],
    evidence: [],
    metrics: [],
    extrapolations: [],
    pendingClaims: [],
    resumeMarkdown: `## ${name.toUpperCase()}\nNew York, NY | ${slug}@domain.com\n\n### PROFESSIONAL SUMMARY\nExperienced ${role} with a proven track record.`,
    coverLetter: `Dear Hiring Team,\n\nI am thrilled to apply for the ${role} position...`,
    outreach: `Hi,\n\nI noticed you are hiring a ${role}...`
  };
  
  // Add new select option in header
  const opt = document.createElement('option');
  opt.value = slug;
  opt.textContent = `${name} (${role})`;
  DOM.profileDropdown.insertBefore(opt, DOM.profileDropdown.lastElementChild);
  
  // Update state
  STATE.activeProfile = slug;
  loadProfileBrief(slug);
  loadContextTable();
  updateEditorContent();
  resetSimulations();
  
  closeModal(DOM.newProfileModal);
  
  // Reset form
  DOM.profileNameInput.value = '';
  DOM.profileRoleInput.value = '';
  
  alert(`Candidate Profile for ${name} successfully initialized and isolated under users/${slug}/!`);
}

// --- PHASE 2 AUTHENTICATION & MULTI-TENANT ACCESS CONTROLLERS ---

function initFirebaseAuthentication() {
  if (!window.firebase) {
    console.error("Firebase SDK not found! Auth feature disabled.");
    return;
  }
  
  firebase.auth().onAuthStateChanged(async (user) => {
    console.log("🔥 [Auth Router] onAuthStateChanged fired. User:", user ? user.email : "Signed Out");
    
    // Unsubscribe from any previous listeners to prevent redundant triggers
    if (STATE.unsubUserDoc) {
      STATE.unsubUserDoc();
      STATE.unsubUserDoc = null;
    }
    if (STATE.unsubAdminList) {
      STATE.unsubAdminList();
      STATE.unsubAdminList = null;
    }

    if (!user) {
      // User is signed out. Reset states.
      STATE.currentUser = null;
      STATE.currentUserDoc = null;
      STATE.isAdmin = false;
      
      // Enforce showing Login Overlay
      DOM.authScreen.classList.add('active');
      DOM.authScreen.style.opacity = '1';
      DOM.authScreen.style.pointerEvents = 'all';
      
      // Hide active workspace hold overlay
      DOM.approvalScreen.classList.remove('active');
      
      // Reset sidebar admin link visibility
      DOM.navAdmin.style.display = 'none';
      return;
    }

    // User is signed in. Let's fetch/seed their user document in Firestore.
    STATE.currentUser = user;
    const uid = user.uid;
    console.log("🔥 [Auth Router] User signed in. UID:", uid);
    
    // Real-time listener on user status document to unlock or lock screens instantly
    STATE.unsubUserDoc = db.collection("users").doc(uid).onSnapshot(async (docSnap) => {
      console.log("🔥 [Auth Router] user doc snapshot triggered. Exists:", docSnap.exists);
      
      if (!docSnap.exists) {
        // Document does not exist yet. Seed a default pending candidate record.
        const defaultDoc = {
          email: user.email || "google-user@domain.com",
          role: "user",
          status: "pending",
          allowedOutputs: ["resume"]
        };
        console.log("🔥 [Auth Router] Seeding new user record in Firestore:", defaultDoc);
        try {
          await db.collection("users").doc(uid).set(defaultDoc);
          console.log("🔥 [Auth Router] Seeding successful.");
        } catch (err) {
          console.error("🔥 [Auth Router] Seeding failed with error:", err);
        }
        return; // onSnapshot will trigger again once written
      }

      const userData = docSnap.data();
      STATE.currentUserDoc = userData;
      console.log("🔥 [Auth Router] Loaded User Data:", userData);
      
      // Redirect pending or deactivated users
      if (userData.status === "pending") {
        console.log("🔥 [Auth Router] Routing to Pending hold screen.");
        DOM.userPendingEmail.textContent = user.email || "your email";
        DOM.authScreen.classList.remove('active');
        DOM.authScreen.style.opacity = '';
        DOM.authScreen.style.pointerEvents = '';
        
        DOM.approvalScreen.classList.add('active');
        DOM.approvalScreen.style.opacity = '1';
        DOM.approvalScreen.style.pointerEvents = 'all';
        return;
      }
      
      if (userData.status === "deactivated") {
        console.log("🔥 [Auth Router] Routing to Deactivated hold screen.");
        DOM.userPendingEmail.innerHTML = `${user.email} <br><br><span style="color: var(--color-danger); font-weight: bold;"><i class="fa-solid fa-ban"></i> Account Deactivated</span>`;
        DOM.authScreen.classList.remove('active');
        DOM.authScreen.style.opacity = '';
        DOM.authScreen.style.pointerEvents = '';
        
        DOM.approvalScreen.classList.add('active');
        DOM.approvalScreen.style.opacity = '1';
        DOM.approvalScreen.style.pointerEvents = 'all';
        return;
      }

      if (userData.status === "active") {
        console.log("🔥 [Auth Router] Routing to Active dashboard screen.");
        // Unlock workspace dashboard! Hide overlays
        DOM.authScreen.classList.remove('active');
        DOM.authScreen.style.opacity = '';
        DOM.authScreen.style.pointerEvents = '';
        
        DOM.approvalScreen.classList.remove('active');
        DOM.approvalScreen.style.opacity = '';
        DOM.approvalScreen.style.pointerEvents = '';
        
        // Enforce output restrictions (lock tabs) based on allowedOutputs array
        applyTabLocks(userData.allowedOutputs || ["resume"]);

        // Check if user is Admin in `/admins/{uid}` or has role: 'admin' in user document, or email matches Raghav
        const adminDoc = await db.collection("admins").doc(uid).get();
        if (adminDoc.exists || userData.role === "admin" || user.email === 'raghav.dr@gmail.com' || uid === 'Rj86y19xQgbqELD33oi8RY7Shqv1') {
          STATE.isAdmin = true;
          DOM.navAdmin.style.display = 'flex';
          
          // Admins can see the profile dropdown.
          document.getElementById('globalProfileSelector').style.display = 'flex';
          
          // Admins have all allowed outputs unlocked
          applyTabLocks(["resume", "cover_letter", "outreach", "interview_prep", "audit_trail"]);
          
          // Collapse directly into standard Raghav profile to ensure no data loss
          STATE.activeProfile = 'raghav_dharani';
          
          // Seed local state with cloud-migrated users if available
          await loadCloudDataAndRefresh();
        } else {
          STATE.isAdmin = false;
          DOM.navAdmin.style.display = 'none';
          
          // Standard User: Set activeProfile slug to their UID to isolate their data
          STATE.activeProfile = uid;
          
          // Build standard single-user tenant profile object if not already cached
          if (!STATE.profiles[uid]) {
            STATE.profiles[uid] = {
              name: user.email.split('@')[0],
              fullNameOption: user.email.split('@')[0],
              location: "New York, NY",
              phone: "555-0100",
              email: user.email,
              linkedin: "linkedin.com",
              targetRoles: ["Candidate User Profile"],
              evidence: [],
              metrics: [],
              extrapolations: [],
              pendingClaims: [],
              resumeMarkdown: `## ${user.email.split('@')[0].toUpperCase()}\n${user.email}\n\n### PROFESSIONAL SUMMARY\nWelcome to your personalized Job Search OS dashboard! Execute the pipeline to analyze JDs.`,
              coverLetter: `Dear Hiring Team,\n\nI am thrilled to apply for the position...`,
              outreach: `Hi,\n\nI noticed you are hiring...`
            };
          }
          
          // Hide profile dropdown for standard isolated candidate
          document.getElementById('globalProfileSelector').style.display = 'none';
          
          // Fetch isolated tenant sub-collections from Firestore
          await syncTenantDataFromCloud(uid);
        }

        // Load dashboard metrics/table context
        loadProfileBrief(STATE.activeProfile);
        loadContextTable();
        updateEditorContent();
      }
    }, (error) => {
      console.error("User doc listener error:", error);
    });
  });
}

function applyTabLocks(allowedOutputs) {
  const tabs = document.querySelectorAll('#editorTabs .pane-tab');
  tabs.forEach(tab => {
    const tabName = tab.dataset.editorTab;
    
    // Check if the tab name is in allowedOutputs:
    // "resume", "cover", "outreach" map to "resume", "cover_letter", "outreach"
    let isAllowed = false;
    if (tabName === "resume" && allowedOutputs.includes("resume")) isAllowed = true;
    if (tabName === "cover" && allowedOutputs.includes("cover_letter")) isAllowed = true;
    if (tabName === "outreach" && allowedOutputs.includes("outreach")) isAllowed = true;
    if (tabName === "interview" && allowedOutputs.includes("interview_prep")) isAllowed = true;
    if (tabName === "audit" && allowedOutputs.includes("audit_trail")) isAllowed = true;
    
    if (!isAllowed) {
      tab.classList.add('locked');
      tab.title = "Access locked by Administrator";
      
      // If the locked tab was the active one, switch to 'resume'
      if (STATE.activeEditorTab === tabName) {
        STATE.activeEditorTab = 'resume';
        document.querySelectorAll('#editorTabs .pane-tab').forEach(t => {
          if (t.dataset.editorTab === 'resume') t.classList.add('active');
          else t.classList.remove('active');
        });
        updateEditorContent();
      }
    } else {
      tab.classList.remove('locked');
      tab.title = "";
    }
  });
}

async function syncTenantDataFromCloud(uid) {
  try {
    // Sync Evidence Subcollection
    const evSnap = await db.collection("users").doc(uid).collection("evidence").get();
    if (!evSnap.empty) {
      const items = [];
      evSnap.forEach(doc => items.push(doc.data()));
      STATE.profiles[uid].evidence = items;
    }
    
    // Sync Metrics Subcollection
    const metSnap = await db.collection("users").doc(uid).collection("metrics").get();
    if (!metSnap.empty) {
      const items = [];
      metSnap.forEach(doc => items.push(doc.data()));
      STATE.profiles[uid].metrics = items;
    }

    // Sync Extrapolations Subcollection
    const exSnap = await db.collection("users").doc(uid).collection("extrapolations").get();
    if (!exSnap.empty) {
      const items = [];
      exSnap.forEach(doc => items.push(doc.data()));
      STATE.profiles[uid].extrapolations = items;
    }
    
    // Sync User-Level Source Resumes Subcollection
    const resSnap = await db.collection("users").doc(uid).collection("source_resumes").get();
    if (!resSnap.empty) {
      const items = [];
      resSnap.forEach(doc => {
        const d = doc.data();
        items.push({ id: doc.id, name: d.name, content: d.content });
      });
      STATE.profiles[uid].sourceResumes = items;
      loadSourceResumesSelect();
    }
  } catch (error) {
    console.error("Error syncing isolated user subcollections:", error);
  }
}

function toggleAuthMode(e) {
  if (e) e.preventDefault();
  STATE.isAuthModeSignup = !STATE.isAuthModeSignup;
  
  if (STATE.isAuthModeSignup) {
    DOM.authTitle.textContent = "Create Account";
    DOM.authSubtitle.textContent = "Register to start building tailored application packages.";
    DOM.btnAuthAction.innerHTML = `<i class="fa-solid fa-user-plus"></i> Register & Set Profile`;
    DOM.authToggleText.textContent = "Already have an account?";
    DOM.btnAuthToggle.textContent = "Login Here";
  } else {
    DOM.authTitle.textContent = "Access Locked Workspace";
    DOM.authSubtitle.textContent = "Login to synchronize your credentials and evidence.";
    DOM.btnAuthAction.innerHTML = `<i class="fa-solid fa-right-to-bracket"></i> Login to Workspace`;
    DOM.authToggleText.textContent = "New to Resume OS?";
    DOM.btnAuthToggle.textContent = "Create Account";
  }
}

async function handleAuthAction() {
  const email = DOM.authEmail.value.trim();
  const password = DOM.authPassword.value.trim();
  
  if (!email || !password) {
    alert("Please enter both email and password!");
    return;
  }
  
  if (password.length < 6) {
    alert("Password must be at least 6 characters!");
    return;
  }
  
  DOM.btnAuthAction.disabled = true;
  const originalHtml = DOM.btnAuthAction.innerHTML;
  DOM.btnAuthAction.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;
  
  try {
    if (STATE.isAuthModeSignup) {
      // Create user account
      const credential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      // Initialize their database profile
      const uid = credential.user.uid;
      const defaultDoc = {
        email: email,
        role: "user",
        status: "pending",
        allowedOutputs: ["resume"]
      };
      await db.collection("users").doc(uid).set(defaultDoc);
      alert("Registration successful! Your account is currently Awaiting Approval.");
    } else {
      // Sign in user account
      await firebase.auth().signInWithEmailAndPassword(email, password);
    }
  } catch (error) {
    console.error("Auth operation failed:", error);
    alert(`Authentication Error: ${error.message}`);
  } finally {
    DOM.btnAuthAction.disabled = false;
    DOM.btnAuthAction.innerHTML = originalHtml;
  }
}

function handleSignOut() {
  if (confirm("Are you sure you want to sign out?")) {
    firebase.auth().signOut()
      .then(() => {
        // Reload page to wipe local state clean and secure credentials
        window.location.reload();
      })
      .catch(err => {
        console.error("Sign out error:", err);
      });
  }
}

function loadAdminUserGrid() {
  if (!STATE.isAdmin) return;
  DOM.adminUserTableBody.innerHTML = `<tr><td colspan="5" style="padding: 2rem; text-align: center;"><i class="fa-solid fa-spinner fa-spin"></i> Fetching active users...</td></tr>`;

  // Start real-time listener on the entire users collection to reflect status and checkbox shifts live
  if (STATE.unsubAdminList) {
    STATE.unsubAdminList();
    STATE.unsubAdminList = null;
  }

  STATE.unsubAdminList = db.collection("users").onSnapshot((snapshot) => {
    DOM.adminUserTableBody.innerHTML = '';
    
    if (snapshot.empty) {
      DOM.adminUserTableBody.innerHTML = `<tr><td colspan="5" style="padding: 2rem; text-align: center; color: var(--text-muted);">No users found in database.</td></tr>`;
      return;
    }

    snapshot.forEach(doc => {
      const u = doc.data();
      const uid = doc.id;
      
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid var(--border-glass)';
      tr.style.color = 'var(--text-secondary)';
      
      const isUserActive = u.status === 'active';
      const isResumeChecked = u.allowedOutputs && u.allowedOutputs.includes('resume') ? 'checked' : '';
      const isCoverChecked = u.allowedOutputs && u.allowedOutputs.includes('cover_letter') ? 'checked' : '';
      const isOutreachChecked = u.allowedOutputs && u.allowedOutputs.includes('outreach') ? 'checked' : '';

      tr.innerHTML = `
        <td style="padding: 0.75rem; font-weight: 500; color: var(--text-primary);">${u.email}</td>
        <td style="padding: 0.75rem;"><span class="label-mini" style="background-color: var(--border-glass); padding: 0.2rem 0.5rem; border-radius: 4px;">${u.role || 'user'}</span></td>
        <td style="padding: 0.75rem;">
          <span class="status-pill ${u.status || 'pending'}">${u.status || 'pending'}</span>
        </td>
        <td style="padding: 0.75rem; text-align: center;">
          <div class="allowed-outputs-flex">
            <label><input type="checkbox" data-uid="${uid}" data-output="resume" ${isResumeChecked}> Resume</label>
            <label><input type="checkbox" data-uid="${uid}" data-output="cover_letter" ${isCoverChecked}> Cover Letter</label>
            <label><input type="checkbox" data-uid="${uid}" data-output="outreach" ${isOutreachChecked}> Outreach</label>
          </div>
        </td>
        <td style="padding: 0.75rem; text-align: right;">
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end; align-items: center;">
            <span class="form-label" style="margin-right: 0.25rem;">Activated</span>
            <label class="switch">
              <input type="checkbox" class="toggle-status" data-uid="${uid}" ${isUserActive ? 'checked' : ''}>
              <span class="slider"></span>
            </label>
          </div>
        </td>
      `;
      DOM.adminUserTableBody.appendChild(tr);
    });

    // Bind event listeners for dynamic status toggles
    document.querySelectorAll('.toggle-status').forEach(toggle => {
      toggle.addEventListener('change', async (e) => {
        const uid = e.target.dataset.uid;
        const newStatus = e.target.checked ? 'active' : 'deactivated';
        try {
          await db.collection("users").doc(uid).update({ status: newStatus });
          console.log(`User status updated to ${newStatus} for ${uid}`);
        } catch (err) {
          console.error("Failed to update user status:", err);
          alert("Error: Insufficient Firestore Permissions to update status!");
          e.target.checked = !e.target.checked; // revert
        }
      });
    });

    // Bind event listeners for output permission checkboxes
    document.querySelectorAll('.allowed-outputs-flex input[type="checkbox"]').forEach(chk => {
      chk.addEventListener('change', async (e) => {
        const uid = e.target.dataset.uid;
        const outputType = e.target.dataset.output;
        
        // Find the user document data to get their current allowedOutputs
        try {
          const userDoc = await db.collection("users").doc(uid).get();
          if (userDoc.exists) {
            let allowed = userDoc.data().allowedOutputs || [];
            if (e.target.checked) {
              if (!allowed.includes(outputType)) allowed.push(outputType);
            } else {
              allowed = allowed.filter(o => o !== outputType);
            }
            await db.collection("users").doc(uid).update({ allowedOutputs: allowed });
            console.log(`User output permissions updated for ${uid}:`, allowed);
          }
        } catch (err) {
          console.error("Failed to update output permissions:", err);
          alert("Error: Insufficient Firestore Permissions to modify checkboxes!");
          e.target.checked = !e.target.checked; // revert
        }
      });
    });

  }, (error) => {
    console.error("Admin user list listener error:", error);
    DOM.adminUserTableBody.innerHTML = `<tr><td colspan="5" style="padding: 2rem; text-align: center; color: var(--color-danger);"><i class="fa-solid fa-triangle-exclamation"></i> Error loading user records. Insufficient role permissions.</td></tr>`;
  });
}

// Run App
async function handleGoogleOAuth() {
  if (!window.firebase) return;
  try {
    DOM.btnGoogleAuth.disabled = true;
    DOM.btnGoogleAuth.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Google`;
    
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    
    await firebase.auth().signInWithPopup(provider);
    console.log("Google OAuth login successful.");
  } catch (err) {
    console.error("Google OAuth login failed:", err);
    if (window.location.protocol === 'file:') {
      alert("⚠️ Social OAuth (Google/Apple) requires running your app on a local server (e.g. by running 'npx http-server' in your terminal) due to browser security restrictions on direct file:// openings. \n\nPlease run a local server, or sign in using email and password!");
    } else {
      alert(`Google Sign-In Error: ${err.message}`);
    }
  } finally {
    DOM.btnGoogleAuth.disabled = false;
    DOM.btnGoogleAuth.innerHTML = `<i class="fa-brands fa-google" style="color: #ea4335;"></i> Google`;
  }
}

async function handleAppleOAuth() {
  if (!window.firebase) return;
  try {
    DOM.btnAppleAuth.disabled = true;
    DOM.btnAppleAuth.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Apple`;
    
    const provider = new firebase.auth.OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    
    await firebase.auth().signInWithPopup(provider);
    console.log("Apple OAuth login successful.");
  } catch (err) {
    console.error("Apple OAuth login failed:", err);
    if (window.location.protocol === 'file:') {
      alert("⚠️ Social OAuth (Google/Apple) requires running your app on a local server (e.g. by running 'npx http-server' in your terminal) due to browser security restrictions on direct file:// openings. \n\nPlease run a local server, or sign in using email and password!");
    } else {
      alert(`Apple Sign-In Error: ${err.message}`);
    }
  } finally {
    DOM.btnAppleAuth.disabled = false;
    DOM.btnAppleAuth.innerHTML = `<i class="fa-brands fa-apple" style="color: var(--text-primary);"></i> Apple`;
  }
}

// Run App
window.onload = init;

/* ==========================================================================
   GUIDED TAILORING WIZARD & MULTI-APPLICATION STATE MANAGER
   ========================================================================== */

function initWizard() {
  console.log("🧙‍♂️ [Wizard] Initializing Guided Wizard & Multi-Application state...");
  
  // Make sure default state is set up
  if (!STATE.jobApplications) STATE.jobApplications = {};
  
  // Create default preseeded applications if they don't exist
  preseedDefaultApplications();
  
  // Load applications list
  renderApplicationsList();
  
  // Bind UI Events
  bindWizardEvents();
  
  // Initial draw
  updateWizardUI();
}

function preseedDefaultApplications() {
  // Raghav Dharani default application
  const raghavSlug = 'raghav_dharani';
  if (!STATE.jobApplications[raghavSlug]) {
    STATE.jobApplications[raghavSlug] = [
      {
        id: "left_field_labs_senior_ai_technical_product_manager",
        company: "Left Field Labs",
        role: "Senior AI Technical Product Manager",
        jdText: `# Left Field Labs - Senior AI Technical Product Manager

Source URL: https://careers-leftfieldlabs.icims.com/jobs/7907/senior-ai-technical-product-manager/login?mobile=false&width=1705&height=500&bga=true&needsRedirect=false&jan1offset=-300&jun1offset=-240

Secondary source used for accessible text: LinkedIn indexed posting for Left Field Labs Senior AI Technical Product Manager.

Date added: 2026-05-25

## Role Summary

Left Field Labs is hiring a Senior AI Technical Product Manager to serve as the primary product driver for the illumend initiative, an AI-first partnership acceleration platform focused on insurance compliance and risk management. The role reports directly to the CEO and emphasizes high-velocity product ownership, AI-first product operations, live prototyping, granular development-ready requirements, and simplification of complex B2B workflows into intuitive user experiences.

## Company Context

Left Field Labs is a creative technology agency that builds digital experiences, product innovation, immersive experiences, and applied AI solutions for large brands. The illumend initiative combines insurance compliance expertise with LFL's creative technology and applied AI capabilities.

## Product Context

- AI-first platform
- Insurance compliance and risk management
- B2B workflow complexity
- Consumer-oriented interface for non-insurance professionals
- Behavioral design to drive users toward concrete actions
- Rapid prototyping and technical product execution

## Must-Have Signals

- Senior technical product management experience
- AI-first product operating style
- Ability to use tools such as Claude, ChatGPT, Cursor, or similar for documentation, ticketing, specs, and prototyping
- Strong documentation discipline
- Ability to write detailed PRDs and development-ready tickets
- Comfort with technical requirements, architecture discussions, and engineering execution
- Direct customer discovery, not secondhand requirements gathering
- Ability to simplify dense B2B workflows into intuitive UX
- Lean, startup-style execution with high velocity
- Roadmap planning and long-term product strategy
- Rapid prototyping and experimentation
- Strong user empathy
- Product-led growth, UX, behavioral psychology, activation, engagement, or habit formation exposure

## Nice-To-Have Signals

- Startup product leadership
- Insurance, compliance, risk management, or regulated workflow adjacency
- Experience building new platforms or product lanes
- Experience reporting to or working closely with executive leadership
- Experience bridging complex technical architecture with simple user-facing workflows
- Applied AI product experience

## ATS Keyword Themes

- AI product management
- Technical product management
- Senior Product Manager
- Product strategy
- Roadmap planning
- PRD
- Technical requirements
- Developer tickets
- Live prototyping
- Rapid prototyping
- AI tools
- Claude
- ChatGPT
- Cursor
- Customer discovery
- User research
- UX
- Behavioral psychology
- Product-led growth
- Activation
- Engagement
- Workflow simplification
- B2B SaaS
- Compliance
- Risk management
- Insurance
- Documentation
- Architecture discussions
- Engineering execution

## Recruiter Screen Risks

- The role strongly signals a need for hands-on technical product execution, not just senior stakeholder leadership.
- The posting may favor candidates with a technical or engineering background.
- Insurance compliance is domain-specific, so domain adjacency must be framed carefully.
- AI tool fluency must sound practical and current, not generic.
- The resume needs evidence of prototyping, detailed specs, and delivery artifacts.

## Hiring Manager Risks

- Must show ability to turn complex B2B requirements into simple workflows.
- Must show comfort working directly with customers or users.
- Must show enough technical credibility to participate in architecture and engineering conversations.
- Must avoid sounding like an AI strategist without execution depth.
- Must be defensible on live prototyping and AI-first product workflow claims.

## Recommended Initial Positioning For Raghav

Position Raghav as a senior technical product leader for complex operational platforms who can translate dense B2B workflows into clear product requirements and practical user experiences. Emphasize KWI, Upshop, 360insights, and EdgeVerve selectively:

- KWI for platform modernization, complex retail workflows, technical requirements, spec-driven delivery, and AI-assisted product development if defensible.
- Upshop for AI/ML-assisted ordering recommendations, retail operations workflows, mobile-first store execution, and simplification of operational complexity.
- 360insights for enterprise SaaS, claims workflows, data management, API integrations, and workflow modernization.
- EdgeVerve for AI/ML, RPA, chatbot, automation, and product launch credibility.

Avoid overclaiming insurance expertise unless Raghav confirms direct experience. Use regulated workflow or compliance-adjacent framing only if supported by source resume or approved by Raghav.`,
        sourceResumeId: "raghav_master",
        highlights: "Introduced AI-assisted, spec-driven development using Claude and Cursor to build prototypes before engineering engagement. Achievements in operational store platforms.",
        avoids: "Invents hands-on ML model design skills (PyTorch). Vague AI-native product leader overclaims.",
        maxPageCount: 2,
        currentStep: 1,
        completed: false,
        tailoredResume: `# Raghav Dharani

Senior Product Manager | AI-Assisted Technical Product Delivery | B2B Workflow Platforms

New York, NY | 929-260-8138 | raghav.dr@gmail.com | linkedin.com/in/raghavdharani

## Professional Summary

Senior product leader with 10+ years building enterprise SaaS and operational workflow platforms across retail operations, merchandising, claims automation, and intelligent automation. Strongest in product areas where complex business processes need to become clear product direction, detailed requirements, prototypes, and shipped workflows that improve adoption, accuracy, and operating efficiency.

Hands-on technical product manager who partners closely with engineering, design, data science, business leaders, enterprise buyers, and end users. Uses Claude and Cursor for AI-assisted product discovery and spec-driven execution, including prototypes for live stakeholder validation, scope clarification, and cleaner design-to-build handoff.

## Core Strengths

Product & Delivery: Technical Product Management | PRDs | Developer-Ready Stories | Roadmap Strategy | Customer Discovery | Stakeholder Validation

AI & Technical: AI-Assisted Product Delivery | Claude | Cursor | REST APIs | API-Driven Platforms | Workflow Prototyping | Technical Requirements

Domain & UX: B2B SaaS | Workflow Simplification | Retail Operations | Claims Workflows | Enterprise UX | Workflow Adoption Design

## Professional Experience

### KWI | Senior Product Manager, Enterprise Merchandising Platform | 2025 - Present

- Lead product discovery, requirements, and prototype validation for a modern Transfers Operations application, translating fragmented legacy workflows into a phased platform for transfer visibility, exception management, lifecycle status, and operational controls.
- Introduce AI-assisted, spec-driven product development using Claude and Cursor to create working prototypes, clarify scope earlier, identify edge cases, and reduce avoidable requirement churn before engineering engagement.
- Lead modernization of the core merchandising platform, shaping phased roadmaps across purchasing, item maintenance, and store-transfer workflows while balancing customer adoption, legacy constraints, API dependencies, and delivery sequencing.
- Partner directly with engineering, design, and business leadership to translate ambiguous operational needs into functional specifications, decision frameworks, and implementation-ready stories across a high-complexity retail platform.
- Create structure around legacy workflows by turning transfer, purchasing, and merchandising processes into clearer user experiences and delivery artifacts for cross-functional execution.

### Upshop | Senior Product Manager, Store Operations Platform | 2022 - 2025

- Built a mobile-first B2B store operations platform from concept through launch across 100+ grocery retail locations, designing for enterprise retail buyers while ensuring frontline users could adopt the workflow in daily operations.
- Launched a grocery ordering and replenishment system powered by ML-based demand signals, giving store teams data-driven production and stocking recommendations that reduced overproduction by 18% and improved forecast accuracy.
- Designed product workflows that guided frontline teams toward required operating actions, increasing engagement by 40% by replacing fragmented, paper-based store processes with a unified mobile-native experience.
- Introduced waste audit and loss prevention workflows from scratch in a compliance-adjacent store operations context, reducing inventory shrink by 12% across retail networks within 6 months of launch.
- Designed and launched external REST APIs that enabled enterprise clients to connect POS, ERP, and supply-chain systems, expanding the platform's role within broader enterprise technology ecosystems.
- Led product discovery and solution design directly with enterprise customers and store-level end users, using first-hand workflow insight to shape roadmap decisions and exceed deployment performance targets by 30%+.

### 360insights | Lead Product Manager, Channel Incentive and Claims Platform | 2019 - 2022

- Owned roadmap and execution for an enterprise SaaS platform serving 100+ clients across channel operations, claims workflows, and data management in a complex multi-stakeholder environment.
- Led a ground-up rebuild of the claims platform that doubled processing throughput and cut manual review effort by 50% through workflow architecture improvements and process redesign.
- Built data ingestion and API-driven onboarding workflows that reduced enterprise client implementation timelines by 35% and improved customer time-to-value.
- Improved client NPS from 6.5 to 8.5 through targeted investments in reporting transparency, workflow visibility, operational performance tooling, and clearer customer-facing feedback loops.
- Influenced senior stakeholders on roadmap and system design decisions in a financially driven, compliance-sensitive environment through structured product narratives and clear tradeoff framing.

### EdgeVerve Systems | Product Manager, AI and Intelligent Automation Platform | 2016 - 2019

- Led product development for an enterprise intelligent automation platform, defining workflow automation, classification, routing, exception handling, and monitoring capabilities for SLA-driven business processes.
- Drove a 50% increase in platform adoption by defining routing, exception handling, monitoring, AI classification, and decision logic capabilities for production workflows aligned to enterprise SLAs.
- Contributed to Forrester Wave Strong Performer recognition in the 2017 RPA category by shaping product narratives that translated early AI complexity into clear business value for enterprise buyers.

## AI Prototyping And Technical Practice

- Creates AI-assisted PRDs, user flows, acceptance criteria, edge-case matrices, Jira-ready stories, prototype screens, API assumptions, and stakeholder walkthrough artifacts using Claude, Cursor, and related tools.
- Uses prototypes to validate workflow logic, clarify ambiguous requirements, expose exception paths, and align product, engineering, design, and stakeholders before development.
- Applies AI-assisted product practices to organize complex workflow information, identify requirement gaps, compare solution options, and improve the quality of development-ready product artifacts.
- Works across REST API design, event-driven workflow patterns, technical requirements, architecture tradeoffs, integration assumptions, and enterprise platform dependencies.

## Education And Certifications

MBA, Management Development Institute

B.E., R.V. College of Engineering

CSPO, Certified Scrum Product Owner, Scrum Alliance

Pragmatic Marketing, Level II Certified

## Tools And Technical Proficiencies

Jira | Aha! | Figma | Postman | Swagger | Lucidchart | Tableau | Google Analytics | Claude | Cursor | GitHub Copilot | Vercel v0 | REST API Design | Event-Driven Workflow Patterns`,
        coverLetter: `I am interested in the Senior AI Technical Product Manager role at Left Field Labs because it sits directly at the intersection of AI-assisted product execution, technical product craft, and the simplification of complex B2B workflows.

In recent roles, I have led product work across enterprise merchandising, compliance-adjacent store operations, claims workflows, and AI-enabled automation platforms. At KWI, I introduced an AI-assisted, spec-driven product workflow using Claude and Cursor, building prototypes for live stakeholder validation before engineering engagement to reduce ambiguity and accelerate delivery handoff. At Upshop, I launched ML-powered ordering and replenishment workflows for distributed retail teams and designed workflows that influenced frontline behavior and action completion. At 360insights, I helped modernize claims and data workflows across an enterprise SaaS platform.

What I would bring to Left Field Labs is a practical, hands-on product leadership style: close enough to users to understand real workflow behavior, technical enough to work through requirements and architecture tradeoffs with engineering, and structured enough to turn ambiguous product areas into clear, development-ready execution.`,
        outreach: `Hi [Name],

I saw the Senior AI Technical Product Manager role for the illumend initiative at Left Field Labs. My background lines up closely with the role's need for a hands-on product leader who can turn complex B2B workflows into clear requirements, prototypes, and development-ready delivery artifacts.

Most recently at KWI, I introduced AI-assisted, spec-driven product development using Claude and Cursor, building prototypes for live stakeholder validation before engineering engagement to reduce ambiguity and accelerate handoff. I have also led AI/ML-enabled workflow products at Upshop and EdgeVerve, plus claims and data workflow modernization at 360insights.

I would be glad to connect if the team is looking for someone who can operate deeply in product craft, AI-assisted execution, technical requirements, customer discovery, and fast-moving B2B platform delivery.

Best,
Raghav`,
        pendingClaims: JSON.parse(JSON.stringify(STATE.profiles.raghav_dharani.pendingClaims)),
        claimDecisions: {},
        scores: {
          atsScore: 92,
          hmScore: 82,
          recruiterScore: 88,
          defensibilityScore: 70
        },
        simReports: {
          recruiter: `
            <p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Overall Impression: Strong Senior Product Leader Alignment</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>First 30s Read</strong>: Summary is crisp, immediately highlights 10+ years enterprise SaaS, AI workflow, and store ops platform building, matching the Left Field Labs JD perfectly.</li>
              <li><strong>Shortlist Confidence</strong>: Very High (88%). Highly attractive match.</li>
            </ul>
          `,
          hm: `
            <p style="color: var(--color-warning); font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Critical Risks: AI & ML Extrapolations Need Calibration</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Domain Overclaim Warning</strong>: The proposed PyTorch ML architecture bullet is a massive red flag. A seasoned HM will easily tear this apart during technical screens. <em>Recommendation: Revert to ML replenishment workflow reframe.</em></li>
              <li><strong>Hiring Manager Score</strong>: 82%.</li>
            </ul>
          `
        },
        defensibilityQA: [
          {
            question: "Q1: You mention introducing spec-driven, AI-assisted development before engineering is engaged. Walk us through a specific feature spec you built with Claude/Cursor and how it de-risked the engineering cycle.",
            whyTheyAsk: "Testing whether this was actual prototyping or just high-level prompt generation.",
            defenseStrategy: "Discuss the Transfers Operations platform at KWI. Explain how you generated functional HTML/JS prototypes in Claude to validate store transfer exceptions with retail business leaders, saving 2-3 weeks of engineering alignment."
          },
          {
            question: "Q2: You launched an ML-powered Grocery Ordering system at Upshop. How did you handle ML model thresholds and recommendations that store frontline workers disagreed with?",
            whyTheyAsk: "Probing the depth of ML product integration and real-world user adoption.",
            defenseStrategy: "Frame as product ownership of the operational interface. Explain that ML recommended order quantities were overlaid with manual review overlays, which built frontline worker trust while driving 18% overproduction reductions."
          }
        ]
      },
      {
        id: "ai_automation_lending_workflows",
        company: "Applied AI Fintech SaaS",
        role: "Senior Product Manager - AI Automation & Lending Workflows",
        jdText: `# LinkedIn 4418161881 - Senior Product Manager, AI Automation And Lending Workflows

Source: User-provided LinkedIn job description text

Date added: 2026-05-25

## About The Role

Seasoned Senior Product Manager to lead definition and delivery of AI-powered automation capabilities within a vertical SaaS platform. The role sits at the intersection of financial services technology and applied AI and is accountable for translating complex lending workflows into intelligent, scalable product experiences that reduce manual effort for customers.

The ideal candidate has shipped AI features in production, not only prototypes, and understands how to bring models, data pipelines, and UX together into a trustworthy, compliant product. Consumer lending or mortgage software is a strong differentiator.

## Key Responsibilities

- Own product strategy and roadmap for AI automation features.
- Define measurable outcomes such as efficiency gains, error reduction, decision accuracy, automation rates, exception volumes, model drift indicators, and business impact.
- Partner with executive leadership on AI initiatives, product vision, revenue goals, and R&D investment cases.
- Identify high-value automation opportunities across loan origination and account opening lifecycles.
- Conduct discovery with lending operations teams, compliance officers, and technology buyers.
- Synthesize qualitative research, quantitative usage data, and competitive intelligence.
- Maintain feedback loops with design partners and early-access customers.
- Drive execution with engineering, data science, and design using agile and emerging DevAI practices.
- Translate business needs into epics, user stories, acceptance criteria, and supporting documentation.
- Lead rapid prototyping for early validation.
- Balance compliance, security, scalability, and technical feasibility.
- Partner with data scientists and ML engineers on model development, success metrics, and human-in-the-loop review.
- Coordinate with compliance, legal, and information security for regulatory expectations including FCRA, ECOA, fair lending, model risk management, and emerging AI regulation.
- Own launch readiness, GTM coordination, documentation, training, and customer communication.

## Qualifications

- 5+ years product management experience.
- Enterprise AI/ML products in a B2B SaaS environment.
- Customer/user research, usability testing, and product strategy.
- AI-driven prototyping methods.
- Agile methodologies and DevAI practices.
- Storytelling, presentation, cross-functional collaboration, design feedback.
- AI features from concept to production, including model integration, data contracts, and post-launch monitoring.
- Conversational AI, GenAI, automation, and data-driven platforms.
- AI/ML concepts, LLMs, MCPs, GenAI platforms, API integration.
- Responsible AI, model interpretability, bias mitigation, quality/accuracy metrics.
- Collaboration with Data Science and Engineering on training data, model performance, and iterative feedback loops.
- Bachelor's degree required, MBA preferred.
- Computer science background preferred.
- Consumer or mortgage lending software experience is a plus.

## Initial Fit Notes

Strongest Raghav positioning:

- Senior Product Manager for AI-assisted technical product delivery and B2B workflow automation.
- Strong evidence from EdgeVerve for intelligent automation, classification, routing, exception handling, monitoring, and production workflows.
- Strong evidence from Upshop for ML-powered recommendations, operational controls, feedback loops, API integrations, and customer-facing workflow adoption.
- Strong evidence from 360insights for claims workflows, manual review reduction, data ingestion, API onboarding, and financially driven enterprise SaaS.
- Current KWI experience supports AI-assisted product delivery, prototype-led discovery, technical requirements, roadmap sequencing, APIs, and legacy workflow modernization.

## What not to claim:

- Direct consumer lending or mortgage software ownership unless confirmed.
- FCRA, ECOA, fair lending, or model risk management expertise unless confirmed.
- Hands-on ML engineering, LLM architecture, model training ownership, or data science ownership.
- Full ownership of AI model architecture.`,
        sourceResumeId: "raghav_master",
        highlights: "AI-assisted technical product delivery, EdgeVerve chatbot and RPA automation, Upshop recommendation engine, and 360insights enterprise claims platform.",
        avoids: "Direct consumer lending software ownership, mortgage regulations (FCRA, ECOA), or hands-on ML model design.",
        maxPageCount: 2,
        currentStep: 1,
        completed: false,
        tailoredResume: `# Raghav Dharani

Senior Product Manager | AI Automation & B2B Workflow Platforms

New York, NY | 929-260-8138 | raghav.dr@gmail.com | linkedin.com/in/raghavdharani

## Professional Summary

Senior Product Manager with 10+ years building enterprise SaaS, workflow automation, AI-enabled operational products, and integration-heavy B2B platforms across retail operations, claims workflows, intelligent automation, and financial-services-adjacent environments. Strongest in product areas where complex business processes need to become clear product strategy, measurable automation opportunities, development-ready requirements, and scalable customer-facing workflows.

Hands-on technical product leader who partners with engineering, data science, design, enterprise customers, and business stakeholders to define product direction, scope model-enabled workflows, shape feedback loops, and translate ambiguous operational needs into epics, user stories, acceptance criteria, prototypes, API assumptions, and launch-ready documentation.

## Core Strengths

Product & Delivery: Technical Product Management | AI Product Strategy | Roadmap Ownership | PRDs | Epics & User Stories | Customer Discovery | Launch Readiness

AI & Technical: AI-Assisted Product Delivery | Intelligent Automation | ML-Enabled Recommendations | Human-in-the-Loop Workflows | REST APIs | Data & Integration Workflows | Claude | Cursor

Domain & UX: B2B SaaS | Financial Workflow Automation | Claims Workflows | Retail Operations | Workflow Simplification | Exception Management | Enterprise UX

## Professional Experience

### KWI | Senior Product Manager, Enterprise Merchandising Platform | 2025 - Present

- Lead product discovery, requirements, and prototype validation for a modern Transfers Operations application, translating fragmented legacy workflows into a phased platform for transfer visibility, exception management, lifecycle status, and operational controls.
- Introduce AI-assisted, spec-driven product development using Claude and Cursor to create working prototypes, clarify scope earlier, identify edge cases, and reduce avoidable requirement churn before engineering engagement.
- Lead modernization of the core merchandising platform, shaping phased roadmaps across purchasing, item maintenance, and store-transfer workflows while balancing customer adoption, legacy constraints, API dependencies, and delivery sequencing.
- Partner directly with engineering, design, and business leadership to translate ambiguous operational needs into functional specifications, decision frameworks, acceptance criteria, and implementation-ready stories.
- Create structure around legacy workflows by turning transfer, purchasing, and merchandising processes into clearer user experiences, delivery artifacts, and rollout paths for cross-functional execution.

### Upshop | Senior Product Manager, Store Operations Platform | 2022 - 2025

- Built a mobile-first B2B store operations platform from concept through launch across 100+ grocery retail locations, designing for enterprise retail buyers while ensuring frontline users could adopt workflow changes in daily operations.
- Launched ML-powered ordering and replenishment workflows using demand signals to generate production and stocking recommendations, reducing overproduction by 18% and improving forecast accuracy across distributed store teams.
- Partnered with data science, engineering, UX, implementation, and customer teams to translate forecast outputs into usable recommendations, override paths, feedback loops, manager controls, and operating KPIs.
- Designed product workflows that guided frontline teams toward required operating actions, increasing engagement by 40% by replacing fragmented, paper-based store processes with a unified mobile-native experience.
- Introduced waste audit and loss prevention workflows from scratch in a compliance-adjacent store operations context, reducing inventory shrink by 12% across retail networks within 6 months of launch.
- Designed and launched external REST APIs enabling enterprise clients to connect POS, ERP, and supply-chain systems, expanding the platform's role within broader technology ecosystems.

### 360insights | Lead Product Manager, Channel Incentive and Claims Platform | 2019 - 2022

- Owned roadmap and execution for an enterprise SaaS platform serving 100+ clients across channel operations, claims workflows, data management, and financially driven multi-stakeholder processes.
- Led a ground-up rebuild of the claims platform that doubled processing throughput and cut manual review effort by 50% through workflow architecture improvements, exception routing, validation improvements, and process redesign.
- Built data ingestion and API-driven onboarding workflows that reduced enterprise client implementation timelines by 35% and improved customer time-to-value.
- Improved client NPS from 6.5 to 8.5 through targeted investments in reporting transparency, workflow visibility, operational performance tooling, and clearer customer-facing feedback loops.
- Influenced senior stakeholders on roadmap and system design decisions in a financially driven enterprise environment through structured product narratives, prioritization frameworks, and tradeoff framing.

### EdgeVerve Systems | Product Manager, AI and Intelligent Automation Platform | 2016 - 2019

- Led product development for an enterprise intelligent automation platform, defining workflow automation, classification, routing, exception handling, monitoring, and operational governance capabilities for SLA-driven business processes.
- Partnered with engineering and data science teams to integrate ML classification, NLP, chatbot, and decision-logic capabilities into automation workflows while keeping product requirements grounded in enterprise customer needs.
- Drove a 50% increase in platform adoption by defining routing, exception handling, monitoring, AI classification, and decision logic capabilities for production workflows aligned to enterprise SLAs.
- Contributed to Forrester Wave Strong Performer recognition in the 2017 RPA category by shaping product narratives that translated early AI complexity into clear business value for enterprise buyers.

## AI Product And Technical Practice

- Creates AI-assisted PRDs, user flows, acceptance criteria, edge-case matrices, Jira-ready stories, prototype screens, API assumptions, and stakeholder walkthrough artifacts using Claude, Cursor, and related tools.
- Uses prototypes to validate workflow logic, clarify ambiguous requirements, expose exception paths, and align product, engineering, design, data science, and business stakeholders before development.
- Defines product-level success signals for AI-enabled workflows, including recommendation acceptance, exception volume, override behavior, operational efficiency, adoption, and customer impact.
- Works across REST API design, event-driven workflow patterns, data ingestion workflows, technical requirements, architecture tradeoffs, integration assumptions, and enterprise platform dependencies.

## Education And Certifications

MBA, Management Development Institute

B.E., R.V. College of Engineering

CSPO, Certified Scrum Product Owner, Scrum Alliance

Pragmatic Marketing, Level II Certified

## Tools And Technical Proficiencies

Jira | Aha! | Figma | Postman | Swagger | Lucidchart | Tableau | Google Analytics | Claude | Cursor | GitHub Copilot | Vercel v0 | REST API Design | Event-Driven Workflow Patterns | API Integrations`,
        coverLetter: `Dear Hiring Team,

I am writing to express my strong interest in the Product Management role. With over 10 years of experience building enterprise SaaS platforms and operational workflow systems at KWI, Upshop, and 360insights, I specialize in translating complex operational problems into scalable products.

At Upshop, I pioneered the integration of ML demand signals directly into frontline store workflows, reducing overproduction by 18%. Additionally, at KWI, I established an AI-assisted prototyping practice that compressed discovery cycles by 25%. 

I am eager to bring this same outcome-driven product leadership to your team.

Sincerely,
Raghav Dharani`,
        outreach: `Subject: Spec-Driven Product Leadership / Raghav Dharani

Hi,

I came across your Senior Product Manager opening and wanted to reach out. I have built enterprise SaaS platforms for the last decade, focusing on operational workflows and AI/ML system integrations at KWI and Upshop. 

Most recently at KWI, I designed store transfers operations workflows that achieved 70% customer migration within 2 months while establishing an AI-assisted prototyping methodology.

I'd love to discuss how my background in de-risking complex platforms can contribute to your goals.

Best,
Raghav`,
        pendingClaims: JSON.parse(JSON.stringify(STATE.profiles.raghav_dharani.pendingClaims)),
        claimDecisions: {},
        scores: {
          atsScore: 88,
          hmScore: 80,
          recruiterScore: 84,
          defensibilityScore: 72
        },
        simReports: {
          recruiter: `
            <p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Overall Impression: Excellent Applied AI PM Alignment</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Shortlist Confidence</strong>: High (84%). Great match for applied AI integrations in B2B SaaS.</li>
            </ul>
          `,
          hm: `
            <p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Technical & Platform Credibility Verified</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Credibility Checks</strong>: Experience at EdgeVerve and Upshop demonstrates practical understanding of model iteration loops.</li>
            </ul>
          `
        },
        defensibilityQA: [
          {
            question: "Q1: Explain how you designed user feedback loops to retrain your ML recommendation systems at Upshop.",
            whyTheyAsk: "Testing depth in practical model performance monitoring.",
            defenseStrategy: "Discuss logging store manager edits to the ML order spec. The delta between ML suggestion and manager override was streamed to retrain the core linear demand models."
          }
        ]
      }
    ];
  }

  // Aatmika Natarajan default application
  const aatmikaSlug = 'aatmika_natarajan';
  if (!STATE.jobApplications[aatmikaSlug]) {
    STATE.jobApplications[aatmikaSlug] = [
      {
        id: "sap_abap_developer_order_to_cash",
        company: "Charlotte Manufacturing Client",
        role: "SAP ABAP Developer (Order to Cash & PP)",
        jdText: `# SAP ABAP Developer (Order to Cash & PP)

## Position Details

Title: SAP ABAP Developer (Order to Cash & PP)

Location: Remote position. Prefer candidates local to NC. Candidates in all US locations may be considered; however, candidates must be willing to support EST hours.

Duration: 7 Months with possibility of extension based on demand

Schedule: Standard work week, Monday - Friday, 40 hours. Some OT may be anticipated.

Travel: Up to 5% - onsite travel to Charlotte, NC for project meetings, typically 2-3 days at a time. At least 3 weeks' advance notice would be provided. Travel expenses would be reimbursable.

Only W2 candidates are eligible for this position. Third-party or C2C candidates will not be considered.

## Description

- Interact with management and end client's business process team and business users to determine system requirements.
- Analyze software requirements to determine design feasibility.
- Evaluate the interface between hardware and software and performance requirements of the overall system.
- Design SAP RICEF objects, including Reports, Interfaces, Conversions, Enhancements, and Forms, in SAP systems using design and development platforms and tools.
- Develop software systems, including programming, documentation, and testing procedures.
- Coordinate with SAP Basis team on transports related to development through the corresponding transport landscape.
- Provide support and advice in all technical aspects during implementation.
- Develop and realize the SAP cutover plan before go-live.
- Advise concerning maintenance of the system post go-live.
- Coordinate implementation of technical objects in SAP NetWeaver Platform.
- Advise on SAP-provided enhancements, bug fixes, OSS notes, support packages, and system upgrades of installed software components.

## Work Experience

- 10+ years of experience as an ABAP Developer.
- Strong functional background in production planning.
- Manufacturing industry experience desired or preferred, but not required.
- Strong development experience in Production Planning and Supply Chain solutions.
- Experience in discrete manufacturing, particularly cable, is a plus.
- Good experience in form development: Adobe, Smart Forms, and scripts.
- S/4HANA migration experience.
- Ability to design and develop architectural plans for third-party systems integration using APIs, IDoc, and other protocols.
- Proficient in object-oriented programming and able to provide scalable solutions.
- Good knowledge of SAP best practices, industry standards, and Agile development methodologies.

## Experience In At Least Two Of The Following Areas

- SAP APO
- SAP WF
- SAP BTP
- Integration to third-party planning solutions
- SAP GTS/FTZ
- Integration to SAP Commerce Cloud, formerly Hybris

## Education

- Minimum: Bachelor's degree

## Interview Process

- One round
- Video panel interview`,
        sourceResumeId: "aatmika_master",
        highlights: "S/4HANA migration, SPAU/SPDD remediation, Order to Cash custom objects, ABAP OO.",
        avoids: "Custom BTP CPI flow architectures designed independently from scratch.",
        maxPageCount: 2,
        currentStep: 1,
        completed: false,
        tailoredResume: STATE.profiles.aatmika_natarajan.resumeMarkdown || `## AATMIKA NATARAJAN\n\n### SAP Technical Consultant`,
        coverLetter: STATE.profiles.aatmika_natarajan.coverLetter || `Dear Hiring Team,\n\nI am thrilled...`,
        outreach: STATE.profiles.aatmika_natarajan.outreach || `Hi,\n\nI noticed...`,
        pendingClaims: JSON.parse(JSON.stringify(STATE.profiles.aatmika_natarajan.pendingClaims || [])),
        claimDecisions: {},
        scores: {
          atsScore: 86,
          hmScore: 84,
          recruiterScore: 86,
          defensibilityScore: 80
        },
        simReports: {
          recruiter: `
            <p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Overall Impression: Excellent SAP ABAP Developer Profile</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>Shortlist Confidence</strong>: High (86%). Strong match for hands-on ABAP/CPI developer requirements.</li>
            </ul>
          `,
          hm: `
            <p style="color: var(--color-warning); font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Integration Architecture Claims Checked</p>
            <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <li><strong>BTP CPI Warning</strong>: Custom CPI flow architecture stretch claims create minor technical screen risks. <em>Recommendation: Position as collaborative template integration.</em></li>
            </ul>
          `
        },
        defensibilityQA: [
          {
            question: "Q1: What was the most challenging ABAP object you remediated during the SPAU/SPDD phase of the S/4HANA conversion, and how did you resolve conflicts?",
            whyTheyAsk: "Checking hands-on technical depth in standard SAP migration routines.",
            defenseStrategy: "Discuss the remediation of custom user exit codes in Order to Cash. Walk through checking SAP standard modification notes, isolating custom routines, and testing gateways."
          }
        ]
      }
    ];
  }

  // Ensure active application ID is loaded
  const currentProfile = STATE.activeProfile;
  if (!STATE.activeApplicationId && STATE.jobApplications[currentProfile] && STATE.jobApplications[currentProfile].length > 0) {
    STATE.activeApplicationId = STATE.jobApplications[currentProfile][0].id;
  }
}

function renderApplicationsList() {
  const currentProfile = STATE.activeProfile;
  DOM.applicationDropdown.innerHTML = '';
  
  if (!STATE.jobApplications[currentProfile] || STATE.jobApplications[currentProfile].length === 0) {
    const opt = document.createElement('option');
    opt.value = "";
    opt.textContent = "No Applications (Create one)";
    DOM.applicationDropdown.appendChild(opt);
    return;
  }
  
  STATE.jobApplications[currentProfile].forEach(app => {
    const opt = document.createElement('option');
    opt.value = app.id;
    opt.textContent = `${app.company} - ${app.role} (${app.completed ? 'Finalized' : 'Step ' + app.currentStep})`;
    if (app.id === STATE.activeApplicationId) {
      opt.selected = true;
    }
    DOM.applicationDropdown.appendChild(opt);
  });
}

function getActiveApplication() {
  const currentProfile = STATE.activeProfile;
  if (!STATE.jobApplications[currentProfile]) return null;
  return STATE.jobApplications[currentProfile].find(app => app.id === STATE.activeApplicationId) || null;
}

function bindWizardEvents() {
  // Application Dropdown Selector switch
  DOM.applicationDropdown.addEventListener('change', (e) => {
    if (e.target.value) {
      STATE.activeApplicationId = e.target.value;
      loadActiveApplicationData();
      updateWizardUI();
    }
  });

  // Modal new application buttons
  DOM.btnNewApplication.addEventListener('click', () => openModal(DOM.newApplicationModal));
  DOM.btnCloseApplicationModal.addEventListener('click', () => closeModal(DOM.newApplicationModal));
  DOM.btnCancelApplication.addEventListener('click', () => closeModal(DOM.newApplicationModal));
  DOM.btnSaveApplication.addEventListener('click', saveNewApplication);

  // Wizard slider update
  DOM.pageCountSlider.addEventListener('input', (e) => {
    DOM.pageCountValue.textContent = `Maximum: ${e.target.value} Page${e.target.value > 1 ? 's' : ''}`;
    const app = getActiveApplication();
    if (app) {
      app.maxPageCount = parseInt(e.target.value);
    }
  });

  // Wizard Next/Back flow
  DOM.btnWizardNext.addEventListener('click', () => {
    const app = getActiveApplication();
    if (!app) {
      alert("Please create or select an active job application first!");
      return;
    }
    
    if (app.currentStep === 1) {
      // Validate step 1 inputs
      const comp = DOM.wizardCompany.value.trim();
      const role = DOM.wizardRole.value.trim();
      const jd = DOM.jdInput.value.trim();
      if (!comp || !role || !jd) {
        alert("Please fill out Company Name, Role Title, and Paste the Job Description!");
        return;
      }
      // Save changes
      app.company = comp;
      app.role = role;
      app.jdText = jd;
      
      // Update selector dropdown label
      renderApplicationsList();
    }
    
    if (app.currentStep === 2) {
      // Step 2 validation: Select base resume
      app.sourceResumeId = DOM.wizardResumeSelect.value;
    }
    
    if (app.currentStep === 3) {
      // Validate directives
      app.highlights = DOM.wizardHighlights.value.trim();
      app.avoids = DOM.wizardAvoids.value.trim();
    }

    if (app.currentStep < 5) {
      app.currentStep++;
      updateWizardUI();
    }
  });

  DOM.btnWizardBack.addEventListener('click', () => {
    const app = getActiveApplication();
    if (app && app.currentStep > 1) {
      app.currentStep--;
      updateWizardUI();
    }
  });



  // Step 2: Upload new resume to User Profile
  DOM.btnUploadResume.addEventListener('click', () => {
    const currentProfile = STATE.activeProfile;
    const name = DOM.newResumeName.value.trim();
    const text = DOM.newResumeText.value.trim();
    
    if (!name || !text) {
      alert("Please enter both a resume label/name and paste the resume content!");
      return;
    }
    
    const prof = STATE.profiles[currentProfile];
    if (!prof.sourceResumes) prof.sourceResumes = [];
    
    const newId = `res_${Date.now()}`;
    const newRes = { id: newId, name: name, content: text };
    prof.sourceResumes.push(newRes);
    
    // Also save to Firestore under '/users/{user_slug}/source_resumes/{newId}'
    if (window.db) {
      const { setDoc, doc } = window.firebaseHelpers;
      setDoc(doc(window.db, "users", currentProfile, "source_resumes", newId), {
        name: name,
        content: text,
        timestamp: new Date().toISOString()
      }).then(() => {
        console.log("New source resume saved successfully to cloud.");
      }).catch(err => {
        console.error("Cloud source resume write failed:", err);
      });
    }

    // Populate resume dropdown select list
    loadSourceResumesSelect();
    
    // Clear inputs
    DOM.newResumeName.value = '';
    DOM.newResumeText.value = '';
    
    alert(`Resume "${name}" successfully uploaded and registered to your profile!`);
  });

  // Blank resume from scratch
  DOM.btnCreateScratchResume.addEventListener('click', (e) => {
    e.preventDefault();
    const currentProfile = STATE.activeProfile;
    const prof = STATE.profiles[currentProfile];
    if (!prof.sourceResumes) prof.sourceResumes = [];
    
    const newId = `res_${Date.now()}`;
    const name = "Blank Resume from Scratch.md";
    const text = `## ${prof.name.toUpperCase()}\n${prof.email}\n\n### PROFESSIONAL SUMMARY\n[Write summary here]\n\n### PROFESSIONAL EXPERIENCE\n**Role Title** | Company Name | Year - Year\n* [Write accomplishment bullet here]`;
    
    prof.sourceResumes.push({ id: newId, name: name, content: text });
    
    if (window.db) {
      const { setDoc, doc } = window.firebaseHelpers;
      setDoc(doc(window.db, "users", currentProfile, "source_resumes", newId), {
        name: name,
        content: text,
        timestamp: new Date().toISOString()
      });
    }
    
    loadSourceResumesSelect();
    DOM.wizardResumeSelect.value = newId;
    alert("Created a blank base resume. You can tailor it directly in Step 3/5.");
  });

  // Execute Tailoring button (Step 3)
  DOM.btnWizardExecute.addEventListener('click', async () => {
    const app = getActiveApplication();
    if (!app) return;
    
    STATE.pipelineRunning = true;
    DOM.btnWizardExecute.disabled = true;
    DOM.btnWizardBack.disabled = true;
    
    // Show nodes active
    document.querySelectorAll('.pipeline-node').forEach(node => {
      node.classList.remove('active', 'completed');
    });
    
    DOM.pipelineStatus.textContent = "Status: Initializing multi-agent pipeline nodes...";
    
    // Run console step animations
    const steps = [
      { node: 'profile', label: '1. Profile Manager checking isolation barriers...', ms: 700 },
      { node: 'jd', label: '2. JD Analyst scanning filters and outcomes...', ms: 900 },
      { node: 'positioning', label: '3. Positioning Strategist weaving narrative spine...', ms: 800 },
      { node: 'architecture', label: '4. Resume Architect reframing bullet outlines...', ms: 1000 }
    ];
    
    runWizardAnimation(0);
    
    function runWizardAnimation(i) {
      if (i >= steps.length) {
        DOM.pipelineStatus.textContent = "Status: Truth Auditor: Contacting Google Gemini...";
        document.querySelector('.pipeline-node[data-node="truth"]').classList.add('active');
        
        // Execute Tailoring via Gemini or Fallback
        triggerWizardTailoringRun();
        return;
      }
      
      const s = steps[i];
      DOM.pipelineStatus.textContent = `Status: ${s.label}`;
      const nodeEl = document.querySelector(`.pipeline-node[data-node="${s.node}"]`);
      if (nodeEl) nodeEl.classList.add('active');
      
      setTimeout(() => {
        if (nodeEl) {
          nodeEl.classList.remove('active');
          nodeEl.classList.add('completed');
        }
        runWizardAnimation(i + 1);
      }, s.ms);
    }
  });

  // Finalize application outputs & save to Firestore (Step 4)
  DOM.btnWizardFinalize.addEventListener('click', async () => {
    const app = getActiveApplication();
    if (!app) return;
    
    DOM.btnWizardFinalize.disabled = true;
    DOM.btnWizardFinalize.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Finalizing Packages...`;
    
    // Write approved claims to Firestore
    try {
      const currentProfile = STATE.activeProfile;
      const compSlug = app.company.toLowerCase().replace(/ /g, '_');
      const dateStr = new Date().toISOString().split('T')[0];
      const packageFolder = `${compSlug}_${app.role.toLowerCase().replace(/ /g, '_')}_${dateStr}`;
      
      console.log(`Writing finalized package to cloud under: /users/${currentProfile}/outputs/${packageFolder}/`);
      
      // Seed audit trail markdown
      let auditMarkdown = `# Claims Approval Audit Trail\n\n- **Date**: ${new Date().toLocaleDateString()}\n- **Profile**: ${STATE.profiles[currentProfile].name}\n- **Target Application**: ${app.company} - ${app.role}\n\n## Claims Audited:\n\n`;
      
      app.pendingClaims.forEach(claim => {
        const decision = app.claimDecisions[claim.id] || 'pending';
        auditMarkdown += `### Claim ID: ${claim.id}\n- **Proposed**: "${claim.proposed}"\n- **Safer Wording**: "${claim.safer}"\n- **Risk Level**: ${claim.risk}\n- **User Decision**: **${decision.toUpperCase()}**\n\n`;
      });
      
      if (window.db) {
        const { setDoc, doc } = window.firebaseHelpers;
        // 1. Save tailored resume
        await setDoc(doc(window.db, "users", currentProfile, "outputs", packageFolder, "resume", "final"), {
          content: app.tailoredResume,
          timestamp: new Date().toISOString()
        });
        
        // 2. Save cover letter
        await setDoc(doc(window.db, "users", currentProfile, "outputs", packageFolder, "cover_letter", "final"), {
          content: app.coverLetter,
          timestamp: new Date().toISOString()
        });
        
        // 3. Save outreach message
        await setDoc(doc(window.db, "users", currentProfile, "outputs", packageFolder, "recruiter_messages", "final"), {
          content: app.outreach,
          timestamp: new Date().toISOString()
        });
        
        // 4. Save Defensibility Q&As
        await setDoc(doc(window.db, "users", currentProfile, "outputs", packageFolder, "interview_prep", "qas"), {
          data: app.defensibilityQA,
          timestamp: new Date().toISOString()
        });
        
        // 5. Save audit trail
        await setDoc(doc(window.db, "users", currentProfile, "outputs", packageFolder, "assessment", "approval_audit_trail"), {
          markdown: auditMarkdown,
          decisions: app.claimDecisions,
          timestamp: new Date().toISOString()
        });
        
        console.log("Firestore write operations complete!");
      }
      
      // Update local state
      app.completed = true;
      app.currentStep = 5;
      
      // Re-render selectors
      renderApplicationsList();
      
      // Go to step 5
      updateWizardUI();
      
    } catch (err) {
      console.error("Failed to write final outputs to cloud:", err);
      alert("Finalization completed locally, but failed to write to Firestore due to permission or connection issues.");
      
      app.completed = true;
      app.currentStep = 5;
      renderApplicationsList();
      updateWizardUI();
    } finally {
      DOM.btnWizardFinalize.disabled = false;
      DOM.btnWizardFinalize.innerHTML = `<i class="fa-solid fa-box-archive"></i> Finalize Application`;
    }
  });

  // Unlock editor (Step 5)
  DOM.btnUnlockEditor.addEventListener('click', () => {
    switchPage('editor', DOM.navEditor);
    updateEditorContent();
  });
}

async function triggerWizardTailoringRun() {
  const app = getActiveApplication();
  if (!app) return;
  
  const apiKey = window.firebaseConfig?.geminiApiKey || localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    console.log("No API Key detected. Executing fallback simulation wizard pipeline...");
    // Fallback animation
    setTimeout(() => {
      completeWizardPipeline(null);
    }, 1500);
    return;
  }
  
  try {
    const prof = STATE.profiles[STATE.activeProfile];
    const baseResume = prof.sourceResumes.find(r => r.id === app.sourceResumeId) || prof.sourceResumes[0];
    
    // Weave Step 3's highlights, avoids and page constraint into the prompt payload
    const systemPrompt = `You are a team of 19 specialized recruitment, copywriting, and technical auditing agents. Your task is to analyze the target Job Description (JD) and the candidate's core profile, and produce a fully tailored resume package.
You must return your entire output as a single, valid JSON document matching this exact schema:
{
  "atsScore": number (0 to 100),
  "hmScore": number (0 to 100),
  "recruiterScore": number (0 to 100),
  "defensibilityScore": number (0 to 100),
  "tailoredResume": "String (Markdown formatted tailored resume, placing [PENDING_CLAIM_1] and [PENDING_CLAIM_2] in specific bullet locations for any unapproved high-risk claims that need user confirmation)",
  "coverLetter": "String (Markdown cover letter)",
  "outreachNote": "String (Outreach message text)",
  "simRecruiterReport": "String (HTML styled report explaining recruiter 30s impression, checklist, concerns, and overall shortlist probability)",
  "simHMReport": "String (HTML styled report explaining hiring manager credibility checks, domain alignment, and risk calibration)",
  "pendingClaims": [
    {
      "id": "claim_1",
      "proposed": "String (The high-impact rephrase or stretch bullet containing PyTorch, personalization, or similar unconfirmed skills)",
      "safer": "String (The safer, confirmed core reframe that has 100% truth basis)",
      "risk": "String ('Moderate' or 'Very High')",
      "reason": "String (Explanation of why this stretch claim is flagged by the Truth Auditor)",
      "question": "String (A direct, targeted question asking candidate if they can defend this exact claim)"
    }
  ],
  "defensibilityQA": [
    {
      "question": "String (Tough, technical interview question testing the tailored resume claims)",
      "whyTheyAsk": "String (Why the interviewer is asking this question)",
      "defenseStrategy": "String (Strategic advice for the candidate to answer truthfully and defensively)"
    }
  ]
}

Candidate Context:
Name: ${prof.name}
Role Archetype: ${prof.targetRoles[0]}
Location: ${prof.location}
Phone: ${prof.phone}
Email: ${prof.email}
LinkedIn: ${prof.linkedin}

Factual Evidence Bank:
${JSON.stringify(prof.evidence, null, 2)}

Approved Metrics:
${JSON.stringify(prof.metrics, null, 2)}

Approved Extrapolations:
${JSON.stringify(prof.extrapolations, null, 2)}

Base Resume Selected:
${baseResume ? baseResume.content : 'No base resume selected'}

Target Job Description:
${app.jdText}

Strict Constraints to Enforce:
1. MAX PAGE COUNT CONSTRAINT: DO NOT let the tailored resume exceed ${app.maxPageCount} page${app.maxPageCount > 1 ? 's' : ''} in letter layout (ensure word count fits).
2. STRENGTHS TO HIGHLIGHT: Focus heavy emphasis on: "${app.highlights || 'none specified'}"
3. TOPICS TO AVOID: Completely avoid or downplay: "${app.avoids || 'none specified'}"

Follow all core guidelines:
1. Optimize for Hiring Manager credibility and Recruiter screen shortlist.
2. Anti-Overfitting: Avoid direct keyword stuffing. Keep phrasing natural and human.
3. Identify 1 or 2 strategic stretches that would help matching but present interview risk, place them in pendingClaims, and inject the placeholder [PENDING_CLAIM_1] or [PENDING_CLAIM_2] in the tailored resume where they belong.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: systemPrompt
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates[0].content.parts[0].text;
    const parsedData = JSON.parse(text.trim());
    
    completeWizardPipeline(parsedData);
    
  } catch (err) {
    console.error("Live AI pipeline tailoring failed:", err);
    alert(`Live AI tailoring failed: ${err.message}\nFalling back to simulated pipeline preview.`);
    completeWizardPipeline(null);
  }
}

function completeWizardPipeline(parsedData) {
  const app = getActiveApplication();
  if (!app) return;
  
  document.querySelector('.pipeline-node[data-node="truth"]').classList.remove('active');
  document.querySelector('.pipeline-node[data-node="truth"]').classList.add('completed');
  
  // Fast complete standard visual track
  const rest = ['credibility', 'simulator', 'packages'];
  rest.forEach(node => {
    const nodeEl = document.querySelector(`.pipeline-node[data-node="${node}"]`);
    if (nodeEl) nodeEl.classList.add('completed');
  });
  
  STATE.pipelineRunning = false;
  DOM.pipelineStatus.textContent = "Status: Live AI Tailoring Complete. Audits Loaded.";
  
  if (parsedData) {
    // Save live tailored data to application object
    app.scores = {
      atsScore: parsedData.atsScore || 90,
      hmScore: parsedData.hmScore || 85,
      recruiterScore: parsedData.recruiterScore || 88,
      defensibilityScore: parsedData.defensibilityScore || 75
    };
    app.tailoredResume = parsedData.tailoredResume;
    app.coverLetter = parsedData.coverLetter;
    app.outreach = parsedData.outreachNote;
    app.pendingClaims = parsedData.pendingClaims || [];
    
    app.simReports = {
      recruiter: parsedData.simRecruiterReport,
      hm: parsedData.simHMReport
    };
    app.defensibilityQA = parsedData.defensibilityQA;
  } else {
    // Fallback: Populate simulation outputs based on profile slug
    const currentProfile = STATE.activeProfile;
    if (currentProfile === 'raghav_dharani') {
      app.scores = { atsScore: 92, hmScore: 82, recruiterScore: 88, defensibilityScore: 70 };
      app.simReports = {
        recruiter: `
          <p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Overall Impression: Strong Senior Product Leader Alignment</p>
          <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><strong>First 30s Read</strong>: Summary is crisp, immediately highlights 10+ years enterprise SaaS.</li>
            <li><strong>Shortlist Confidence</strong>: Very High (88%).</li>
          </ul>
        `,
        hm: `
          <p style="color: var(--color-warning); font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Critical Risks: AI & ML Extrapolations Need Calibration</p>
          <ul style="margin-left: 1.5rem; margin-top: 0.5rem; display: flex; flex-direction: column; gap: 0.5rem;">
            <li><strong>Domain Overclaim Warning</strong>: PyTorch ML architecture bullet is a massive red flag.</li>
          </ul>
        `
      };
    } else {
      app.scores = { atsScore: 86, hmScore: 84, recruiterScore: 86, defensibilityScore: 80 };
      app.simReports = {
        recruiter: `<p style="color: var(--color-success); font-weight: bold;"><i class="fa-solid fa-circle-check"></i> Overall Impression: Excellent SAP ABAP Developer Profile</p>`,
        hm: `<p style="color: var(--color-warning); font-weight: bold;"><i class="fa-solid fa-triangle-exclamation"></i> Integration Architecture Claims Checked</p>`
      };
    }
  }

  // Populate dynamic gauges in scoreboard
  DOM.scoreboardSection.style.display = 'block';
  animateGauge(DOM.gaugeRecruiter, app.scores.recruiterScore, 'hsl(250, 89%, 65%)');
  animateGauge(DOM.gaugeHM, app.scores.hmScore, 'hsl(190, 90%, 50%)');
  animateGauge(DOM.gaugeDefensibility, app.scores.defensibilityScore, 'hsl(150, 86%, 43%)');
  animateGauge(DOM.gaugeATS, app.scores.atsScore, 'hsl(32, 95%, 55%)');
  
  DOM.simRecruiterText.innerHTML = app.simReports.recruiter;
  DOM.simHMText.innerHTML = app.simReports.hm;
  
  // Lock results into profile cache too
  const prof = STATE.profiles[STATE.activeProfile];
  prof.resumeMarkdown = app.tailoredResume;
  prof.coverLetter = app.coverLetter;
  prof.outreach = app.outreach;
  
  // Advance to Step 4
  app.currentStep = 4;
  updateWizardUI();
  
  alert("AI Multi-Agent pipeline tailoring runs executed successfully!\n\nExtrapolations needing verification are loaded in Step 4/5.");
}

function loadActiveApplicationData() {
  const app = getActiveApplication();
  if (!app) return;
  
  DOM.wizardCompany.value = app.company || "";
  DOM.wizardRole.value = app.role || "";
  DOM.jdInput.value = app.jdText || "";
  DOM.wizardHighlights.value = app.highlights || "";
  DOM.wizardAvoids.value = app.avoids || "";
  DOM.pageCountSlider.value = app.maxPageCount || 2;
  DOM.pageCountValue.textContent = `Maximum: ${app.maxPageCount || 2} Page${(app.maxPageCount || 2) > 1 ? 's' : ''}`;
  
  // Load resumes select
  loadSourceResumesSelect();
  if (app.sourceResumeId) {
    DOM.wizardResumeSelect.value = app.sourceResumeId;
  }
}

function loadSourceResumesSelect() {
  const currentProfile = STATE.activeProfile;
  const prof = STATE.profiles[currentProfile];
  DOM.wizardResumeSelect.innerHTML = '';
  
  if (!prof.sourceResumes || prof.sourceResumes.length === 0) {
    // Seed default resume
    prof.sourceResumes = [
      {
        id: `${currentProfile}_master`,
        name: `${prof.name} Master Resume.md`,
        content: prof.resumeMarkdown || ""
      }
    ];
  }
  
  prof.sourceResumes.forEach(res => {
    const opt = document.createElement('option');
    opt.value = res.id;
    opt.textContent = res.name;
    DOM.wizardResumeSelect.appendChild(opt);
  });
}

function updateWizardUI() {
  const app = getActiveApplication();
  if (!app) {
    // Hide wizard buttons, disable them
    DOM.btnWizardNext.disabled = true;
    DOM.btnWizardBack.disabled = true;
    return;
  }
  
  const step = app.currentStep;
  
  // Update step indicators
  document.querySelectorAll('.wizard-step-node').forEach(node => {
    const nodeStep = parseInt(node.dataset.step);
    node.classList.remove('active', 'completed');
    if (nodeStep === step) {
      node.classList.add('active');
    } else if (nodeStep < step) {
      node.classList.add('completed');
    }
  });

  // Update step pane visibility
  for (let i = 1; i <= 5; i++) {
    const pane = document.getElementById(`wizardPane${i}`);
    if (pane) {
      pane.style.display = (i === step) ? 'block' : 'none';
      if (i === step) pane.classList.add('active');
      else pane.classList.remove('active');
    }
  }

  // Update header title
  const stepTitles = [
    "Step 1 of 5: Target JD Details",
    "Step 2 of 5: Base Source Resume",
    "Step 3 of 5: Highlight Directives & Page Counts",
    "Step 4 of 5: Verify Extrapolations",
    "Step 5 of 5: Audit Scorecard Completed"
  ];
  document.getElementById('wizardStepIndicator').textContent = stepTitles[step - 1];

  // Update back button
  DOM.btnWizardBack.disabled = (step === 1 || STATE.pipelineRunning);

  // Toggle footer action buttons
  DOM.btnWizardNext.style.display = (step < 3) ? 'block' : 'none';
  DOM.btnWizardExecute.style.display = (step === 3) ? 'block' : 'none';
  DOM.btnWizardFinalize.style.display = (step === 4) ? 'block' : 'none';
  
  // Disable next/execute buttons if pipeline is running
  DOM.btnWizardNext.disabled = STATE.pipelineRunning;
  DOM.btnWizardExecute.disabled = STATE.pipelineRunning;

  if (step === 4) {
    renderWizardClaims();
  }

  if (step === 5) {
    document.getElementById('completedRecruiterScore').textContent = `${app.scores.recruiterScore}%`;
    document.getElementById('completedHMScore').textContent = `${app.scores.hmScore}%`;
    document.getElementById('completedATSScore').textContent = `${app.scores.atsScore}%`;
  }
}

function renderWizardClaims() {
  const app = getActiveApplication();
  if (!app) return;
  
  DOM.wizardClaimsContainer.innerHTML = '';
  
  if (!app.pendingClaims || app.pendingClaims.length === 0) {
    DOM.wizardClaimsContainer.innerHTML = `
      <div style="text-align: center; padding: 1.5rem; color: var(--text-muted); font-size: 0.85rem;">
        <i class="fa-solid fa-check-double" style="color: var(--color-success); font-size: 1.5rem; margin-bottom: 0.5rem; display: block;"></i>
        No unapproved stretch claims found. All wording is 100% verified and true.
      </div>
    `;
    return;
  }
  
  app.pendingClaims.forEach(claim => {
    const card = document.createElement('div');
    card.className = 'claim-card';
    card.style.padding = '0.75rem';
    card.style.gap = '0.5rem';
    card.style.marginBottom = '0.5rem';
    card.style.border = '1px solid var(--border-glass)';
    card.style.borderRadius = 'var(--radius-sm)';
    card.style.background = 'rgba(255,255,255,0.01)';
    
    const decision = app.claimDecisions[claim.id] || 'pending';
    
    let decisionBadge = '';
    if (decision === 'approved') {
      decisionBadge = `<span class="claim-badge approved" style="background-color: var(--color-success-glow); color: var(--color-success); font-size: 0.65rem; border: 1px solid var(--color-success);"><i class="fa-solid fa-circle-check"></i> Approved</span>`;
    } else if (decision === 'rejected') {
      decisionBadge = `<span class="claim-badge rejected" style="background-color: var(--color-danger-glow); color: var(--color-danger); font-size: 0.65rem; border: 1px solid var(--color-danger);"><i class="fa-solid fa-circle-xmark"></i> Rejected (Reverted to Safe)</span>`;
    } else {
      decisionBadge = `<span class="claim-badge extrapolation">${claim.risk} Risk Stretch</span>`;
    }
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong style="font-size: 0.8rem; color: var(--text-primary);">${claim.id.replace(/_/g, ' ').toUpperCase()}</strong>
        ${decisionBadge}
      </div>
      
      <div style="font-size: 0.75rem; color: var(--text-secondary); border-left: 2px solid var(--accent-indigo); padding-left: 0.5rem; margin: 0.25rem 0;">
        <span style="color: var(--color-warning); font-weight: bold;">Auditor Concern:</span> ${claim.reason}
      </div>
      
      <div class="claim-comparison" style="grid-gap: 0.5rem; margin-top: 0.25rem;">
        <div class="wording-panel" style="padding: 0.4rem; font-size: 0.75rem;">
          <div class="wording-panel-title" style="font-size: 0.65rem;">Stretch Proposed Wording</div>
          <div class="wording-text">${claim.proposed}</div>
        </div>
        
        <div class="wording-panel" style="padding: 0.4rem; font-size: 0.75rem;">
          <div class="wording-panel-title" style="font-size: 0.65rem;">Safe Defensible Alternative</div>
          <div class="wording-text">${claim.safer}</div>
        </div>
      </div>
      
      <div style="font-size: 0.75rem; color: var(--text-primary); margin-top: 0.25rem; background: rgba(0,0,0,0.2); padding: 0.35rem 0.5rem; border-radius: 4px;">
        <strong>Question:</strong> ${claim.question}
      </div>
      
      <div class="claim-actions" style="margin-top: 0.5rem; gap: 0.5rem;">
        <button class="btn-approve btn-approve-claim" data-claim-id="${claim.id}" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;"><i class="fa-solid fa-thumbs-up"></i> Approve Wording</button>
        <button class="btn-reject btn-reject-claim" data-claim-id="${claim.id}" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;"><i class="fa-solid fa-thumbs-down"></i> Use Safer Option</button>
      </div>
    `;
    
    DOM.wizardClaimsContainer.appendChild(card);
  });
  
  // Bind click buttons inside claims
  document.querySelectorAll('.btn-approve-claim').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const claimId = e.target.closest('button').dataset.claimId;
      const claim = app.pendingClaims.find(c => c.id === claimId);
      if (claim) {
        app.claimDecisions[claimId] = 'approved';
        
        // Rewrite tailoredResume replacing placeholder [PENDING_CLAIM_...] or equivalent with proposed
        const claimIndex = app.pendingClaims.indexOf(claim) + 1;
        const placeholder = `[PENDING_CLAIM_${claimIndex}]`;
        app.tailoredResume = app.tailoredResume.replace(placeholder, claim.proposed);
        
        // Push decision to audit trail in Firestore
        pushDecisionToCloud(STATE.activeProfile, claim, 'approved');
        
        renderWizardClaims();
      }
    });
  });
  
  document.querySelectorAll('.btn-reject-claim').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const claimId = e.target.closest('button').dataset.claimId;
      const claim = app.pendingClaims.find(c => c.id === claimId);
      if (claim) {
        app.claimDecisions[claimId] = 'rejected';
        
        // Rewrite tailoredResume replacing placeholder with safer
        const claimIndex = app.pendingClaims.indexOf(claim) + 1;
        const placeholder = `[PENDING_CLAIM_${claimIndex}]`;
        app.tailoredResume = app.tailoredResume.replace(placeholder, claim.safer);
        
        // Push decision to audit trail in Firestore
        pushDecisionToCloud(STATE.activeProfile, claim, 'rejected');
        
        renderWizardClaims();
      }
    });
  });
}

function saveNewApplication() {
  const currentProfile = STATE.activeProfile;
  const company = DOM.appCompanyInput.value.trim();
  const role = DOM.appRoleInput.value.trim();
  
  if (!company || !role) {
    alert("Please enter both Company Name and Job Role Title!");
    return;
  }
  
  const compSlug = company.toLowerCase().replace(/ /g, '_');
  const roleSlug = role.toLowerCase().replace(/ /g, '_');
  const dateStr = new Date().toISOString().split('T')[0];
  const newId = `${compSlug}_${roleSlug}_${dateStr}`;
  
  if (!STATE.jobApplications[currentProfile]) {
    STATE.jobApplications[currentProfile] = [];
  }
  
  const newApp = {
    id: newId,
    company: company,
    role: role,
    jdText: "",
    sourceResumeId: `${currentProfile}_master`,
    highlights: "",
    avoids: "",
    maxPageCount: 2,
    currentStep: 1,
    completed: false,
    tailoredResume: STATE.profiles[currentProfile].resumeMarkdown || "",
    coverLetter: STATE.profiles[currentProfile].coverLetter || "",
    outreach: STATE.profiles[currentProfile].outreach || "",
    pendingClaims: JSON.parse(JSON.stringify(STATE.profiles[currentProfile].pendingClaims || [])),
    claimDecisions: {},
    scores: { atsScore: 0, hmScore: 0, recruiterScore: 0, defensibilityScore: 0 },
    simReports: { recruiter: "Pending analysis", hm: "Pending analysis" },
    defensibilityQA: []
  };
  
  STATE.jobApplications[currentProfile].push(newApp);
  STATE.activeApplicationId = newId;
  
  // Reset form & close modal
  DOM.appCompanyInput.value = '';
  DOM.appRoleInput.value = '';
  closeModal(DOM.newApplicationModal);
  
  // Re-render
  renderApplicationsList();
  loadActiveApplicationData();
  updateWizardUI();
  
  // Save application structure to Firestore under `/users/{user_slug}/outputs/{newId}`
  if (window.db) {
    const { setDoc, doc } = window.firebaseHelpers;
    setDoc(doc(window.db, "users", currentProfile, "outputs", newId), {
      company: company,
      role: role,
      maxPageCount: 2,
      currentStep: 1,
      completed: false,
      timestamp: new Date().toISOString()
    });
  }
  
  alert(`Target Job Application for "${company} - ${role}" successfully created!`);
}

// Ensure profiles change propagates back to active applications
const originalChangeProfile = DOM.profileDropdown.onchange || DOM.profileDropdown.addEventListener;
DOM.profileDropdown.addEventListener('change', (e) => {
  if (e.target.value !== 'new_profile') {
    // Reset/load applications list
    preseedDefaultApplications();
    renderApplicationsList();
    loadActiveApplicationData();
    updateWizardUI();
  }
});
