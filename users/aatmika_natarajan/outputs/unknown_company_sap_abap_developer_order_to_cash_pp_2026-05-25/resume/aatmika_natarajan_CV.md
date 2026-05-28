# Aatmika Natarajan

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

- Deliver SAP ABAP solutions across SD, MM, FI/CO, WM, EWM, TM, and PP-adjacent manufacturing processes, combining traditional RICEF development with modern S/4HANA, RAP/Fiori, CDS, and Clean Core practices.
- Design a goods movement cockpit for process-order execution: upon scanning a process order number from the printed process order document, the cockpit retrieves relevant process order details, BOM explosion details, goods issue, goods issue reversal, goods receipt, goods receipt reversal, and process logs.
- Built RF Gun ABAP programs for the Bradford plant to support Order to Cash warehouse execution flows, including goods receipt, goods receipt reversal, goods issue, goods issue reversal, and shipping activities.
- Created custom warehouse monitoring capabilities in `/SCWM/MON` and improved inventory visibility through HU summary and live inventory details.
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
- Rewrote legacy ABAP archival programs from PBS to ILM structures for `SD_VBAK`, `SD_VBRK`, `FI_DOCUMENT`, and `MM_MATBEL`, coordinating with SD, FI, PP, MM, Basis, and functional leadership to protect data integrity.
- Engineered reusable ABAP OO utilities, including an automated MB52-style inventory tool and a job-submission utility that exports custom report outputs in XLSX and CSV formats to presentation and application servers.

### SAP ABAP Consultant | Siemens / Tata Consultancy Services, Oakville | 2018 - 2019

- Delivered ABAP development for Siemens engineering and manufacturing processes across PP, QM, MM, PS, SD, FI/CO, and HR, with emphasis on production orders, BOMs, engineering change workflows, order confirmations, and Order to Cash integration.
- Created mass upload and update tools using BAPI, BDC, interactive ALV, and dialog programming for parent-child change number tracking, DIR uploads, and engineering change management.
- Built BOM change log reporting using ALV and parallel cursor techniques, including `SPBT_INITIALIZE`, start-new-task processing, and end-of-task handling for improved reporting performance.
- Enhanced production and engineering transactions including `CC01`, `CC02`, `CO02`, `COOIS`, `COHV`, and Siemens-provided production-order workflows, including support for production-order and discrete manufacturing scenarios.
- Enhanced `COOIS` and `COHV` header, operations, and confirmations views to display BOM, personnel, and material details using BADI `CL_EX_WORKORDER_INFOSYSTEM`.
- Configured and enhanced engineering-change and production-order process support around Siemens manufacturing workflows, including BOM explosion visibility, routing context, and user-provided `COR1` / `COR2` process exposure.
- Supported production-order and engineering-change workflows involving ECM/ECR processes, production-order banners, order confirmations, and SAPscript changes for manufacturing documentation.
- Automated order-to-manufacturing workflow-forward reporting for custom ECM/ECR processes, allowing workflow to move to the next available user and display processing logs.
- Enhanced sales order screen `SAPMV45A` with market-facing number, vendor number, product number, and product print number fields, updating `VBAP`, append structures, flow logic, and BADI `MV45AFZZ`.
- Modified IMALL / Compass interface objects using `BAPI_SALESORDERCRTFRMDAT2` to handle new sales-order fields and support Order to Cash interface changes.
- Built interactive ALV reports to update sales order and production order user status dynamically, including component blocking and withdrawn status handling through `STATUS_CHANGE_EXTERN` and `MD_RESET_KZEAR_RESB`.
- Designed custom IDoc resolution tool `ZIOMRESOLVE` to read failed order IDocs, identify invalid material, unit mismatch, minimum quantity, pricing, and material-mapping issues, and reprocess sales orders using BDC `VA01` or `BAPI_SALESORDER_CHANGE`.
- Created VOFM pricing routines for ZMLC condition type and enhanced quotation `VA23` and inbound delivery `VL33N` Smart Forms to populate additional line-item data and terms based on sales and purchase organizations.
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
- Migrated live data into production systems using BDC and BAPI for Material Master, service orders, and business partner updates, including `MM01`, `MM02`, service order creation, `IW32`, and BP uploads.
- Implemented enhancements for business partner screens, functional location equipment assignment, service order exits, delivery creation checks, stock quantity validation, and routing-related manufacturing processes.
- Participated in techno-functional testing, UAT, regression testing, cutover, go-live, and four weeks of post-go-live hypercare for implementation work.
- Created Purchase Order print, delivery print, and credit/debit memo forms using Smart Forms.
- Supported Unilever SAP IS-Retail implementation pilot by building BAPI-based conversion upload reports for customer master, salesman master, contract, service master, and initial stock creation using `XD01`, `PA30`, `VA42`, `AC02`, and `MB1C`.

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

SAP S/4 ABAP on HANA | SAP BTP Cockpit | RESTful ABAP Programming | Fiori Bootcamp | SAP Cloud CL400
