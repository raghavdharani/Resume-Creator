# Maple Leaf Foods Manufacturing Evidence

Context captured from user-provided notes for Aatmika Natarajan.

Do not generate resume outputs from this note until the user explicitly starts the workflow.

## Related JD

- SAP ABAP Developer (Order to Cash & PP)
- Manufacturing domain experience is important.
- Production Planning, Supply Chain, discrete manufacturing, BOM, routing, goods movement, and SAP technical development are relevant.

## Source Resume Reference

The user indicated that source resumes are in:

- `users/aatmika_natarajan/source_resumes/sap_technical/`

The file `Aatmika_Natarajan_updated` is expected to contain relevant manufacturing experience, including discrete manufacturing process evidence.

## Maple Leaf Foods Experience Notes To Preserve

The user stated that Aatmika has extensive manufacturing background, including:

- Manufacturing experience.
- Discrete manufacturing process exposure.
- Siemens experience involving `COR1` / `COR2` transaction codes.
- BOM explosion program experience.
- Routing experience.
- Al-Ghanim project experience.
- Change records approval process experience.

## Goods Movement Cockpit Detail From User

The user shared the following detail as information that should be included under Aatmika's Maple Leaf Foods experience:

- Designing a goods movement cockpit.
- When a process order is entered, the screen displays BOM details.
- The cockpit supports:
  - GI, goods issue.
  - GI reversal.
  - GR, goods receipt.
  - GR reversal.
  - Printing HU labels.
- BOM means bill of materials.
- GR uses movement type `101`.
- GI uses movement type `201`.

Additional wording provided by the user for the current cockpit design:

> Upon scanning the process order number from the printed process order document, the cockpit retrieves and displays all relevant details for that specific process order. The cockpit provides full functionality including process order details, goods issue, goods issue reversal, goods receipt, goods receipt reversal, and process logs.

User-provided mapping:

- Use the cockpit wording under current Maple Leaf Foods experience.
- Against process order details, include BOM details / BOM explosion.
- Discrete manufacturing experience applies to Siemens.
- Routing experience applies to Siemens and Al-Ghanim.

## Draftable Evidence Themes

Use only after source resume validation and user approval:

- SAP ABAP development for manufacturing operations.
- Production order and process order support.
- BOM visibility and BOM detail display.
- Goods movement processing.
- Goods issue and goods receipt workflows.
- Reversal handling for GI and GR.
- Handling Unit label printing.
- Production Planning and shop-floor process support.
- Manufacturing execution and supply chain workflow support.

## Caution

This is a user-provided note, not yet fully audited against the uploaded resume source. Treat claims as requiring source validation or user approval before final resume use.

## Additional Evidence Captured From User-Provided Resume Screenshots

The following details were provided through screenshots and user guidance. Yellow-highlighted content is manufacturing-specific and should be given importance for the SAP ABAP Developer (Order to Cash & PP) JD.

### Tata Consultancy Services / J2S Project - Siemens

Relevant role context:

- SAP ABAP Consultant.
- J2S Project - Siemens.
- Engineering / manufacturing industry context.
- Approximate timeline shown in screenshots: Jun 2018 - Nov 2020, with J2S Project noted around Jun 2018 - Mar 2019.

Manufacturing and PP-relevant evidence:

- Developed mass data tools using `BAPI` / `BDC` for parent-child change number tracking, DIR uploads, and ALV-based reporting.
- Created mass upload and update programs for parent and child change numbers using interactive ALV and dialog programming.
- Built DIR upload tools using `BAPI_DOCUMENT_CHANGE2` and `BAPI_DOCUMENT_CREATE2`.
- Developed BOM change log reporting.
- Built BOM change log reporting using the parallel cursor method, including `SPBT_INITIALIZE`, start new task, and end of task.
- Enhanced SAP functionality for production orders, BOM, and confirmations using BADIs, user exits, and performance tuning.
- Enhanced `CC01` / `CC02` and `XCCA` to accommodate project definitions, vehicle numbers, equipment numbers, and related data.
- Modified function group `MC29CFF1_FIELDSELECTION`.
- Enhanced `CO02`, production order, disabling components from fields `ES_SAPLCOMF` to `CO_MF_MOD_SPEC`.
- Enhanced `COOIS` and `COHV` header, operations, and confirmations views to display BOM, `PERNR`, and material details using BADI `CL_EX_WORKORDER_INFOSYSTEM`.
- Automated workflows for `ECM` / `ECR`, pricing routines for order confirmations, and custom SAP Script for production orders.
- Developed workflow-forward reporting tool for custom workflow `ECM/ECR (CC01/02)` process for order-to-manufacturing engineering activity.
- Added form changes for new fields on custom SAPScript banner page for production order banner.
- Enhanced `ME23N` to populate terms and conditions in long text using `ME_PROCESS_PO_CUST`.
- Modified quotation `VA23` and inbound delivery `VL33N` Smart Forms to populate additional line item data, terms and conditions dynamically based on sales organization and purchase organization responsibility.

Order-to-cash, sales order, IDoc, and integration evidence:

- Enhanced sales order `SAPMV45A` to add market-facing number and vendor number fields in item overview and additional data tabs.
- Updated `VBAP` structures and implemented BADI `MV45AFZZ` to ensure accurate data flow and storage.
- Added market-facing number to sales order screen modifications `8459`, `4908`, `4902`, `SAPMV45A`.
- Appended `VBAP`, `VBAPKOZ`, `VBAPKOZX`, `BAPE_VBAP` structures with new fields including `MFN2`, product number, and `MLFB`.
- Created customized tools for rebate claim processing and bank search strategy, updating sales order line-item details with market-facing number and MLFB details along with specific IMALL interface.
- Modified IMALL / Compass interface objects to append new fields to the `VBAP` structure using `BAPI_SALESORDERCRTFRMDAT2`.
- Created an interactive ALV to display sales orders requiring status changes to blocked and corresponding production order component status changes.
- Enabled users to pick and choose sales order line items and dynamically update production order and sales order status using `STATUS_CHANGE_EXTERN`, while blocking production order components by marking them withdrawn using `MD_RESET_KZEAR_RESB`.
- Designed custom tool `ZIOMRESOLVE` to process IDocs dynamically.
- Automated error resolution for failed IDocs with invalid materials, unit mismatch, pricing errors, and reprocessed them using `BDC (VA01)` or `BAPI_SALESORDER_CHANGE`.
- Created log reports to track error corrections and IDoc reprocessing through ALV.
- Used `IDOC_INPUT_ORDERS` to create sales orders through IDoc from third parties.
- Developed customized function group to check failed IDoc data, reprocess through BDC session after correction, and reduce manual effort.
- Read IDoc data from `EDIDC`, converted it to BDC format, checked invalid material, unit mismatch, minimum quantity, pricing, and material-mapping errors, and created or changed sales orders using `BDC (VA01)` / `BAPI_SALESORDER_CHANGE`.
- Built interactive ALV report to manage sales and production order user status changes.

Finance / forms / support evidence:

- Debugged and changed customer statement forms using `RFKORD11`.
- Created customer invoices using Smart Forms and payment print notice.
- Created programs for general ledger mass data upload for `FB01` / `FB02`.
- Created journal entry data upload programs.
- Created VOFM pricing routine for ZMLC condition type based on sales office and order type.
- Played a key role in the Re-Org 2020 project for Siemens, enhancing financial programs to support changes in profit center and division structures.
- During upgrade, used `SPDD` / `SPAU` transaction codes for SAINT methodology upgrade.

### Mindtree / Tata Global Beverages / Al-Ghanim / Unilever

Relevant role context:

- Module Lead.
- Mindtree Ltd, Bangalore.
- Approximate timeline shown in screenshots: Aug 2011 - Jan 2014.
- Production Planning, Quality Management, Materials Management, Sales and Distribution, Finance, CRM, and IS-Retail exposure appears in source screenshots.

Tata Global Beverages manufacturing evidence:

- Maintenance project for Tata Global Beverages.
- Production Planning RICEF estimations, change requests, and incident resolution.
- Facilitated L2 meetings with UK business leaders to support project alignment, transparency, and delivery.
- Modules shown: PP, QM, MM, SD.
- Developed complex forecast reports for Production Planning using ALV and classical reporting.
- Performance tuned old reports.
- Developed customized screens for tea blending production and quality-check activity using module pool programming.

Al-Ghanim manufacturing / implementation evidence:

- SAP implementation for Al-Ghanim, onsite Middle East.
- Modules shown: PP, QM, MM, SD, FI, CRM, IS-Retail.
- Migrated live data into production systems using `BDC` and `BAPI`.
- Migrated Material Master, service orders, and business partner updates as data migration expert.
- Data migration included Material Master creation and changes using `MM01` and `MM02`, with extension of plant and storage location.
- Supported service order creation, JV upload, `IW32`, and BP upload.
- Built custom enhancements including BP code, business partner screen exits, functional location equipment assignment using BADI, service order exits, and delivery creation exits to check stock quantity and throw appropriate error messages.
- Developed Purchase Order print, delivery print, and credit/debit memo forms using Smart Forms.
- Participated in techno-functional testing, UAT, regression testing, data migration, cutover, go-live, and four weeks of post-go-live hypercare.

Unilever IS-Retail / stock evidence:

- SAP implementation pilot for Unilever.
- Developed data conversion upload reports using `BAPI` for customer master creation `XD01`, salesman master creation `PA30`, contract `VA42`, service master change `AC02`, and initial stock creation `MB1C`.
- Built custom update reports for primary and secondary sales for distributor weekly progress reporting.
- Enhanced customer master screen `XD01` with custom tabs and custom fields using BADI.
- Enhanced salesman master `PA30` screen to add retail salesman detail using `PM30` infotype maintenance.
- Created implicit enhancements to check stock quantity for hard and soft materials while delivering.

### Henkel Consumer Goods / Managed Service Owner

Relevant role context:

- Maintenance and support project for UK client.
- Client: Henkel Consumer Goods.
- Approximate timeline shown in screenshots: Feb 2014 - Apr 2017.
- Managed Service Owner / SME / SPOC for three SAP applications: PP, QM, and WM.

Manufacturing support evidence:

- Accountable for complete end-to-end business services for PP, QM, and WM applications globally across EMEA, APAC, and NA regions.
- Escalation SPOC for business continuity crisis, SLA/KPI misses, project takeover challenges, and rollout hypercare support issues.
- Managed escalation calls for live production system issues across global landscapes.
- Worked with third parties, business IT teams, plant managers, SMEs, and business stakeholders.
- Conducted weekly SLA review meetings with client business heads for assigned applications.
- As enhancement lead, estimated RICEF objects, change request deliveries, and quality checks using Remedy and the change request tool.
- Led MSO 2.0 initiative across project teams covering 27 MSOs and a project size of 400, focused on process improvements.
- Implemented three new solutions that saved 140 man-days of effort.
- Led a team of 17 to 20 people over three years, including team and direct report development and performance appraisal responsibility.

### Hitachi Metals / US Client Manufacturing Implementation

Relevant role context:

- Implementation project for US client.
- Client: Hitachi Metals.
- Manufacturing / automotive industry.
- Modules shown: All.
- Role shown: Associate Software Engineer / Application Developer.
- Approximate timeline shown in screenshot: Mar 2007 - Dec 2008.

Manufacturing and SAP technical evidence:

- Developed invoice memo and credit/debit memo using SAP Scripts.
- Developed scheduling agreement and purchase order forms using Smart Forms.
- Developed interactive reports for purchasing data.

## Resume Use Guidance From User

- Give manufacturing-specific highlighted items high importance.
- For this JD, emphasize SAP ABAP, PP, production orders, BOM, confirmations, manufacturing, discrete manufacturing, RICEF, BAPI/BDC, IDoc, Smart Forms, SAPScript, ALV, S/4HANA migration, and integration experience.
- Do not start the agent workflow or create resume outputs until the user explicitly says to start.
