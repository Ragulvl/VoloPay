// ============================================================
// PRE-GENERATED CURATED ANALYSIS
// Written for revision 1 (initial batch), keyed by source_type:source_id
// 18 usable conversations: 10 calls (C01-C10) + 8 meetings (M01-M04, M06-M07, M09-M10)
//
// WHAT IS PRE-GENERATED vs COMPUTED:
// - Pre-generated: evidenceTags, routes, confidence, reason, quotes,
//   unknowns, nextAction, owner, flags - all written by human review
//   of the actual transcript text.
// - Computed by app: intake_state, metrics, staleness detection,
//   tag-to-route mapping, coverage counts, dashboard aggregations.
//
// Every quote is an EXACT substring of the source text.
// Meeting evidence cites source_id + 1-based turn number.
// Call evidence cites a short exact quote with record_ref/source_id.
// ============================================================

import type { CuratedAnalysis, Route } from '../types';

// Record identity -> CuratedAnalysis
// Key format: "call:<source_id>" or "meeting:<source_id>"
export const CURATED_ANALYSES: Record<string, CuratedAnalysis> = {

  // ================================================================
  // C01 - Arun / Pranav / Harborlight Advisory
  // Source ID: 2ec4404c-beee-5377-a63c-aab701da08ed
  // ================================================================
  'call:2ec4404c-beee-5377-a63c-aab701da08ed': {
    sourceId: '2ec4404c-beee-5377-a63c-aab701da08ed',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'insufficient',
    reason:
      'Contact did not request a follow-up, send information, or agree to next steps. He rejected the approach and ended the call. No actionable commitment exists.',
    evidenceTags: [
      {
        tag: 'rejected_outreach',
        quote: "I didn't ask for this call, and I'm not interested.",
        sourceId: '2ec4404c-beee-5377-a63c-aab701da08ed',
        recordRef: 'C01',
      },
      {
        tag: 'existing_automation',
        quote: 'Our processes are already very automated. We have a fairly advanced setup',
        sourceId: '2ec4404c-beee-5377-a63c-aab701da08ed',
        recordRef: 'C01',
      },
    ],
    routes: ['Needs review'] as Route[],
    quotes: [
      "I didn't ask for this call, and I'm not interested.",
      'Our processes are already very automated. We have a fairly advanced setup',
    ],
    unknowns: [
      'No confirmed interest or contact preference.',
      'Nature and scale of their automation is not established.',
    ],
    nextAction:
      'No follow-up warranted based on this call. Review if outreach programme criteria need adjustment.',
    flags: [
      'Contact expressed unhappiness about being called; note for outreach compliance.',
    ],
    freshness: 'current',
  },

  // ================================================================
  // C02 - Arun / Kavya receptionist / Fernhaven Group
  // Source ID: 4b870624-8aad-5315-a60e-0db95981cf99
  // is_conversation stored as true — text shows receptionist + voicemail only
  // ================================================================
  'call:4b870624-8aad-5315-a60e-0db95981cf99': {
    sourceId: '4b870624-8aad-5315-a60e-0db95981cf99',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'insufficient',
    reason:
      'Call reached a receptionist, who transferred to voicemail. No substantive conversation occurred. The stored label is_conversation=true does not align with the transcript content.',
    evidenceTags: [
      {
        tag: 'receptionist_voicemail',
        quote: "It looks as though she isn't in the office today. Would you like to leave a message with me, or would you prefer her voicemail?",
        sourceId: '4b870624-8aad-5315-a60e-0db95981cf99',
        recordRef: 'C02',
      },
      {
        tag: 'label_conflict',
        quote: "Her voicemail would be fine, thank you. Certainly, I'll put you through to the mailbox now.",
        sourceId: '4b870624-8aad-5315-a60e-0db95981cf99',
        recordRef: 'C02',
      },
    ],
    routes: ['Needs review'] as Route[],
    quotes: [
      "It looks as though she isn't in the office today. Would you like to leave a message with me, or would you prefer her voicemail?",
      "Her voicemail would be fine, thank you. Certainly, I'll put you through to the mailbox now.",
    ],
    unknowns: [
      'No message content is available — only the routing was captured.',
      'Whether the voicemail was received or acted upon is unknown.',
    ],
    nextAction:
      'Retry reaching the intended contact. Note: "Leela" mentioned as the contact target in this call is a contact name, not rep Leela.',
    flags: [
      'LABEL CONFLICT: stored is_conversation=true but transcript shows only receptionist and voicemail transfer — no substantive conversation.',
      'The contact name "Leela" in this call refers to a prospect/contact, not rep Leela (leela@example.com).',
    ],
    freshness: 'current',
  },

  // ================================================================
  // C03 - Kiran / Milan / API developer access
  // Source ID: 20d509ba-d589-5334-9aef-ea4ce6105b1a
  // ================================================================
  'call:20d509ba-d589-5334-9aef-ea4ce6105b1a': {
    sourceId: '20d509ba-d589-5334-9aef-ea4ce6105b1a',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'Both parties agreed on a concrete next step: email follow-up with subject line confirmed, and a Monday/Tuesday callback arranged. This is a mutual, explicit commitment.',
    evidenceTags: [
      {
        tag: 'email_followup_agreed',
        quote: "I can email you. Would you be able to respond there? I'll also try you on Monday.",
        sourceId: '20d509ba-d589-5334-9aef-ea4ce6105b1a',
        recordRef: 'C03',
      },
      {
        tag: 'subject_confirmed',
        quote: 'Something like "Developer access and event notifications — follow-up".',
        sourceId: '20d509ba-d589-5334-9aef-ea4ce6105b1a',
        recordRef: 'C03',
      },
      {
        tag: 'callback_agreed',
        quote: 'Send the email and we can speak Monday or Tuesday.',
        sourceId: '20d509ba-d589-5334-9aef-ea4ce6105b1a',
        recordRef: 'C03',
      },
      {
        tag: 'price_concern',
        quote: 'When we last spoke, price was a concern.',
        sourceId: '20d509ba-d589-5334-9aef-ea4ce6105b1a',
        recordRef: 'C03',
      },
    ],
    routes: ['Sales follow-up'] as Route[],
    quotes: [
      "I can email you. Would you be able to respond there? I'll also try you on Monday.",
      'Something like "Developer access and event notifications — follow-up".',
      'Send the email and we can speak Monday or Tuesday.',
      'When we last spoke, price was a concern.',
    ],
    unknowns: [
      'Whether Milan discussed budget internally is unknown.',
      'API pricing range that would satisfy them is unconfirmed.',
    ],
    nextAction:
      'Send email with subject "Developer access and event notifications — follow-up". Call back Monday or Tuesday as agreed.',
    freshness: 'current',
  },

  // ================================================================
  // C04 - Arun / Ritesh (voicemail) / Lanternpath Media
  // Source ID: bcdcbf56-d338-5c78-9a97-42c2fc1c9931
  // ================================================================
  'call:bcdcbf56-d338-5c78-9a97-42c2fc1c9931': {
    sourceId: 'bcdcbf56-d338-5c78-9a97-42c2fc1c9931',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'tentative',
    reason:
      'Arun left a voicemail referencing a previous email exchange; no response or next step was confirmed by the contact.',
    evidenceTags: [
      {
        tag: 'voicemail_followup',
        quote: "I'm following up on your consideration of our expense platform for Lanternpath Media.",
        sourceId: 'bcdcbf56-d338-5c78-9a97-42c2fc1c9931',
        recordRef: 'C04',
      },
      {
        tag: 'email_issue',
        quote: 'My understanding is that our information first went to the wrong email address.',
        sourceId: 'bcdcbf56-d338-5c78-9a97-42c2fc1c9931',
        recordRef: 'C04',
      },
    ],
    routes: ['Sales follow-up'] as Route[],
    quotes: [
      "I'm following up on your consideration of our expense platform for Lanternpath Media.",
      'My understanding is that our information first went to the wrong email address.',
    ],
    unknowns: [
      'Whether Ritesh received or reviewed the corrected email is unknown.',
      'No response was captured.',
    ],
    nextAction:
      'Await callback from Ritesh. If no response within agreed timeframe, re-attempt contact.',
    freshness: 'current',
  },

  // ================================================================
  // C05 - Meera / Multi-store contact / Expense software intro
  // Source ID: 75a6b94f-7717-5cfb-9e41-0acc94415e17
  // Stored outcome: follow_up — but text shows highly conditional
  // ================================================================
  'call:75a6b94f-7717-5cfb-9e41-0acc94415e17': {
    sourceId: '75a6b94f-7717-5cfb-9e41-0acc94415e17',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'tentative',
    reason:
      'Contact agreed to receive a presentation but framed follow-up as conditional on a future provider change. No active evaluation is taking place. Stored outcome is follow_up, but the stated condition weakens this.',
    evidenceTags: [
      {
        tag: 'conditional_interest',
        quote: "If we ever decide to change the providers we already have, we could consider it then.",
        sourceId: '75a6b94f-7717-5cfb-9e41-0acc94415e17',
        recordRef: 'C05',
      },
      {
        tag: 'existing_providers',
        quote: 'We already have that. Understood. Does your current system also execute the vendor payments? Yes, it does.',
        sourceId: '75a6b94f-7717-5cfb-9e41-0acc94415e17',
        recordRef: 'C05',
      },
      {
        tag: 'email_confirmed',
        quote: 'I have an email address noted down; may I confirm contact05@example.com? Yes, that is right.',
        sourceId: '75a6b94f-7717-5cfb-9e41-0acc94415e17',
        recordRef: 'C05',
      },
    ],
    routes: ['Sales follow-up'] as Route[],
    quotes: [
      "If we ever decide to change the providers we already have, we could consider it then.",
      'We already have that. Understood. Does your current system also execute the vendor payments? Yes, it does.',
      'I have an email address noted down; may I confirm contact05@example.com? Yes, that is right.',
    ],
    unknowns: [
      'No active evaluation timeline confirmed.',
      'Which specific providers they use beyond StoreHarbor is unspecified.',
    ],
    nextAction:
      'Send presentation to contact05@example.com. Do not follow up further without a signal of active interest. Low-priority nurture only.',
    flags: [
      'Stored outcome label "follow_up" is technically accurate (presentation send agreed) but commitment level is very low — "if we ever decide to change".',
    ],
    freshness: 'current',
  },

  // ================================================================
  // C06 - Ravi / Nikhil / Retail chain (120+ stores)
  // Source ID: 12216d5c-e254-52c6-b344-47de4c6e1ae5
  // ================================================================
  'call:12216d5c-e254-52c6-b344-47de4c6e1ae5': {
    sourceId: '12216d5c-e254-52c6-b344-47de4c6e1ae5',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'insufficient',
    reason:
      'Contact stated existing automation covers their needs and offered to reach out if requirements change. No next step or information request was agreed.',
    evidenceTags: [
      {
        tag: 'existing_automation',
        quote: "We already have many of those things in place. If there is something we need from you in future, we can contact you.",
        sourceId: '12216d5c-e254-52c6-b344-47de4c6e1ae5',
        recordRef: 'C06',
      },
      {
        tag: 'full_visibility_claimed',
        quote: 'Head office manages it, and we have full visibility.',
        sourceId: '12216d5c-e254-52c6-b344-47de4c6e1ae5',
        recordRef: 'C06',
      },
    ],
    routes: ['Needs review'] as Route[],
    quotes: [
      "We already have many of those things in place. If there is something we need from you in future, we can contact you.",
      'Head office manages it, and we have full visibility.',
    ],
    unknowns: [
      'Actual systems used are not named.',
      'No indication of a future trigger or evaluation date.',
    ],
    nextAction:
      'No immediate follow-up. Consider inbound-only list — contact offered to reach out if needed.',
    freshness: 'current',
  },

  // ================================================================
  // C07 - Dev / Aditya / Willowbank Advisory - PARTNERSHIP
  // Source ID: 428817fa-7e9e-5418-a7d4-bb396d28dfbf
  // Agreed: send proposal on chat app + Monday call
  // ================================================================
  'call:428817fa-7e9e-5418-a7d4-bb396d28dfbf': {
    sourceId: '428817fa-7e9e-5418-a7d4-bb396d28dfbf',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'Contact agreed to receive the proposal on the chat app and confirmed a Monday follow-up call. This is a referral-partner discussion (advisory firm referring clients for virtual accounts), not a sales deal. Route: Partner/channel follow-up.',
    evidenceTags: [
      {
        tag: 'proposal_request',
        quote: "could you message me on our chat app and send whatever proposal you have?",
        sourceId: '428817fa-7e9e-5418-a7d4-bb396d28dfbf',
        recordRef: 'C07',
      },
      {
        tag: 'monday_call_agreed',
        quote: "Once you've received them, could I call on Monday to see whether you'd like to discuss it further? Yes, that's fine.",
        sourceId: '428817fa-7e9e-5418-a7d4-bb396d28dfbf',
        recordRef: 'C07',
      },
      {
        tag: 'referral_pattern',
        quote: "Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.",
        sourceId: '428817fa-7e9e-5418-a7d4-bb396d28dfbf',
        recordRef: 'C07',
      },
    ],
    routes: ['Partner/channel follow-up'] as Route[],
    quotes: [
      "could you message me on our chat app and send whatever proposal you have?",
      "Once you've received them, could I call on Monday to see whether you'd like to discuss it further? Yes, that's fine.",
      "Do you currently refer clients to providers for that part of the process? Yes, that is something we normally do.",
    ],
    unknowns: [
      'Chat app platform is not specified.',
      'Commission/referral arrangement not yet discussed.',
      'Volume of clients needing virtual accounts is unknown.',
    ],
    nextAction:
      'Send partner proposal via chat app (same number used for messages). Call Monday to discuss further. This is a partner relationship, not a direct sales deal.',
    freshness: 'current',
  },

  // ================================================================
  // C08 - Meera / Raghav / Referral to colleague
  // Source ID: 129497b2-8e1d-5e01-919c-e8a852b5ff68
  // ================================================================
  'call:129497b2-8e1d-5e01-919c-e8a852b5ff68': {
    sourceId: '129497b2-8e1d-5e01-919c-e8a852b5ff68',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'Contact provided a colleague email for proposal and indicated some existing discussions about a solution. This is a warm referral with an explicit email address confirmed.',
    evidenceTags: [
      {
        tag: 'referral_email',
        quote: "Let me give you an email address. Could you send a proposal there?",
        sourceId: '129497b2-8e1d-5e01-919c-e8a852b5ff68',
        recordRef: 'C08',
      },
      {
        tag: 'colleague_intro',
        quote: "The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution",
        sourceId: '129497b2-8e1d-5e01-919c-e8a852b5ff68',
        recordRef: 'C08',
      },
      {
        tag: 'email_confirmed',
        quote: "Let me read it back to make sure I have the right address: contact08@example.com? Yes, that's correct.",
        sourceId: '129497b2-8e1d-5e01-919c-e8a852b5ff68',
        recordRef: 'C08',
      },
    ],
    routes: ['Sales follow-up'] as Route[],
    quotes: [
      "Let me give you an email address. Could you send a proposal there?",
      "The colleague handling our people operations also deals with frontline processes and the locations. I think we may have been looking at a solution",
      "Let me read it back to make sure I have the right address: contact08@example.com? Yes, that's correct.",
    ],
    unknowns: [
      'Colleague name not provided.',
      'Whether existing discussions led to any shortlist is unknown.',
      'Raghav will not be the decision-maker — referral only.',
    ],
    nextAction:
      'Send proposal to contact08@example.com mentioning the conversation with Raghav. Follow up with the referred colleague.',
    freshness: 'current',
  },

  // ================================================================
  // C09 - Meera / Vedant / Referral to business head (no-name constraint)
  // Source ID: 4a1de681-f884-55e8-b1ad-de22d17cd959
  // ================================================================
  'call:4a1de681-f884-55e8-b1ad-de22d17cd959': {
    sourceId: '4a1de681-f884-55e8-b1ad-de22d17cd959',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'tentative',
    reason:
      'Contact directed rep toward business head Mr Rishabh on a professional networking site but explicitly asked not to be named. Whether the business head will engage is unconfirmed.',
    evidenceTags: [
      {
        tag: 'referral_no_name',
        quote: "you can find our business head, Mr Rishabh, on a professional networking site. He would be able to explain our requirements",
        sourceId: '4a1de681-f884-55e8-b1ad-de22d17cd959',
        recordRef: 'C09',
      },
      {
        tag: 'no_name_constraint',
        quote: "Would it be all right if I mentioned your name when contacting him? No, please don't use my name.",
        sourceId: '4a1de681-f884-55e8-b1ad-de22d17cd959',
        recordRef: 'C09',
      },
      {
        tag: 'internal_system',
        quote: "We have developed our own software internally, so at present we aren't looking for anything outside the organisation.",
        sourceId: '4a1de681-f884-55e8-b1ad-de22d17cd959',
        recordRef: 'C09',
      },
    ],
    routes: ['Sales follow-up'] as Route[],
    quotes: [
      "you can find our business head, Mr Rishabh, on a professional networking site. He would be able to explain our requirements",
      "Would it be all right if I mentioned your name when contacting him? No, please don't use my name.",
      "We have developed our own software internally, so at present we aren't looking for anything outside the organisation.",
    ],
    unknowns: [
      'Whether internal gaps exist that SpendNest could fill.',
      'Mr Rishabh may not be receptive without a name to reference.',
    ],
    nextAction:
      'Find Mr Rishabh on professional networking site. DO NOT mention Vedant\'s name. Approach cold — this referral carries a strict no-name constraint.',
    flags: [
      'CONSTRAINT: Do not use Vedant\'s name when contacting Mr Rishabh. Violation would breach explicit contact request.',
    ],
    freshness: 'current',
  },

  // ================================================================
  // C10 - Meera / Aniket / Refused follow-up call
  // Source ID: b747f592-810e-583c-9b81-8db5ab035806
  // Stored outcome: follow_up — but contact refused follow-up call
  // ================================================================
  'call:b747f592-810e-583c-9b81-8db5ab035806': {
    sourceId: 'b747f592-810e-583c-9b81-8db5ab035806',
    sourceType: 'call',
    writtenForRevision: 1,
    confidence: 'tentative',
    reason:
      'Contact agreed to receive a brief via messaging app but explicitly refused a follow-up call, stating he will contact SpendNest if interested. The stored outcome label "follow_up" is technically consistent with sending information but conflicts with the contact\'s clear rejection of proactive follow-up.',
    evidenceTags: [
      {
        tag: 'call_refused',
        quote: "Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss.",
        sourceId: 'b747f592-810e-583c-9b81-8db5ab035806',
        recordRef: 'C10',
      },
      {
        tag: 'brief_requested',
        quote: "why don't you just send me a brief on the messaging app?",
        sourceId: 'b747f592-810e-583c-9b81-8db5ab035806',
        recordRef: 'C10',
      },
      {
        tag: 'changed_company',
        quote: "Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore.",
        sourceId: 'b747f592-810e-583c-9b81-8db5ab035806',
        recordRef: 'C10',
      },
    ],
    routes: ['Sales follow-up'] as Route[],
    quotes: [
      "Would a follow-up call on Monday or Tuesday next week be okay, in case you have any questions? No. I said I will contact you if there is anything to discuss.",
      "why don't you just send me a brief on the messaging app?",
      "Are you calling about Meadowbrick? Yes, that's right. I don't work there anymore.",
    ],
    unknowns: [
      'Which messaging app to use is not specified.',
      'What AP/supplier focus would be relevant to his new manufacturing role is unclear.',
      'Whether Meadowbrick records should be updated.',
    ],
    nextAction:
      'Send brief via messaging app only. Do NOT schedule or attempt a follow-up call — contact was explicit. Await inbound contact.',
    flags: [
      'LABEL CONFLICT: stored outcome "follow_up" conflicts with contact\'s explicit refusal of a follow-up call ("No. I said I will contact you"). Stored label is NOT auto-corrected per rules.',
      'Target company has changed from Meadowbrick to a manufacturing company. CRM record may need updating.',
    ],
    freshness: 'current',
  },

  // ================================================================
  // M01 - Harborpath Advisory / SpendNest - Partner onboarding
  // Source ID: cb5cecac-e68d-52b7-b10b-b0c748efc467
  // ================================================================
  'meeting:cb5cecac-e68d-52b7-b10b-b0c748efc467': {
    sourceId: 'cb5cecac-e68d-52b7-b10b-b0c748efc467',
    sourceType: 'meeting',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'Partner A explicitly requested to start the onboarding process (turn 12) and agreed to await documents and a referral link (turn 24). Team member A committed to sending documents (turn 25). This is a partner/channel relationship, not a direct sales deal.',
    evidenceTags: [
      {
        tag: 'partner_onboarding_requested',
        quote: 'No, let us get the partner onboarding started.',
        sourceId: 'cb5cecac-e68d-52b7-b10b-b0c748efc467',
        recordRef: 'M01',
        turnNumber: 12,
      },
      {
        tag: 'referral_link_agreed',
        quote: 'Then let us use the unique link.',
        sourceId: 'cb5cecac-e68d-52b7-b10b-b0c748efc467',
        recordRef: 'M01',
        turnNumber: 21,
      },
      {
        tag: 'documents_committed',
        quote: 'I will send the documents and the information discussed here.',
        sourceId: 'cb5cecac-e68d-52b7-b10b-b0c748efc467',
        recordRef: 'M01',
        turnNumber: 25,
      },
      {
        tag: 'commission_discussed',
        quote: 'The activation payment is USD 260 when a referred company gets its account approved',
        sourceId: 'cb5cecac-e68d-52b7-b10b-b0c748efc467',
        recordRef: 'M01',
        turnNumber: 9,
      },
    ],
    routes: ['Partner/channel follow-up'] as Route[],
    quotes: [
      'No, let us get the partner onboarding started.',
      'Then let us use the unique link.',
      'I will send the documents and the information discussed here.',
      'The activation payment is USD 260 when a referred company gets its account approved',
    ],
    unknowns: [
      'Memorandum for partner has not been sent yet.',
      'Volume of clients Partner A expects to refer is not confirmed.',
      'Podcast collaboration is exploratory only.',
    ],
    nextAction:
      'Send partner memorandum, referral link, commission terms and compliance requirements to Partner A. Also connect with marketing about podcast opportunity.',
    freshness: 'current',
  },

  // ================================================================
  // M02 - LedgerBridge / SpendNest - INTERNAL: SpendNest is the buyer
  // Source ID: 1a21c409-c050-5787-90af-2667e057e1b6
  // ================================================================
  'meeting:1a21c409-c050-5787-90af-2667e057e1b6': {
    sourceId: '1a21c409-c050-5787-90af-2667e057e1b6',
    sourceType: 'meeting',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'SpendNest is evaluating LedgerBridge as a vendor for electronic invoicing. Team members are buyers, not sellers. Target: Q4, starting with Singapore and Australia then India.',
    evidenceTags: [
      {
        tag: 'spendnest_as_buyer',
        quote: 'And the commercial relationship is between SpendNest and LedgerBridge? We are providing this to our customers through our product, rather than asking them to buy from you separately.',
        sourceId: '1a21c409-c050-5787-90af-2667e057e1b6',
        recordRef: 'M02',
        turnNumber: 30,
      },
      {
        tag: 'q4_target',
        quote: 'We are aiming for the fourth quarter. We would start with Singapore and Australia, then India.',
        sourceId: '1a21c409-c050-5787-90af-2667e057e1b6',
        recordRef: 'M02',
        turnNumber: 13,
      },
      {
        tag: 'volume_template_requested',
        quote: 'I will send a volume template: countries, small versus larger customers, invoices issued and invoices received.',
        sourceId: '1a21c409-c050-5787-90af-2667e057e1b6',
        recordRef: 'M02',
        turnNumber: 17,
      },
      {
        tag: 'setup_cost_mentioned',
        quote: 'The basic setup begins at EUR 2,600; a more supported implementation starts at EUR 6,500',
        sourceId: '1a21c409-c050-5787-90af-2667e057e1b6',
        recordRef: 'M02',
        turnNumber: 31,
      },
    ],
    routes: ['Internal/vendor operations'] as Route[],
    quotes: [
      'And the commercial relationship is between SpendNest and LedgerBridge? We are providing this to our customers through our product, rather than asking them to buy from you separately.',
      'We are aiming for the fourth quarter. We would start with Singapore and Australia, then India.',
      'I will send a volume template: countries, small versus larger customers, invoices issued and invoices received.',
      'The basic setup begins at EUR 2,600; a more supported implementation starts at EUR 6,500',
    ],
    unknowns: [
      'Which customers require mandatory e-invoicing not confirmed (turn 5).',
      'Q4 date is flexible — early next year also possible (turn 15).',
      'Issued invoice volumes are estimates only since receivables product is still being built.',
      'US 1099 reporting use case is out of LedgerBridge\'s standard scope (turn 7).',
    ],
    nextAction:
      'Complete volume template (AP usage for received volumes; estimates for issued volumes). Arrange commercial call with LedgerBridge. Brief management before call.',
    freshness: 'current',
  },

  // ================================================================
  // M03 - Asterloom Systems / SpendNest - PROSPECT
  // Source ID: 398672e7-62dd-5afd-846d-0237d49792fb
  // Key issue: prepaid vs credit expectation at turns 6-7
  // Coaching: price confusion at turns 23-24
  // ================================================================
  'meeting:398672e7-62dd-5afd-846d-0237d49792fb': {
    sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
    sourceType: 'meeting',
    writtenForRevision: 1,
    confidence: 'tentative',
    reason:
      'Prospect (inferred) showed genuine product interest but identified the prepaid/credit mismatch as a concern. CFO approval required before a decision. No follow-up call scheduled — Customer B explicitly deferred scheduling.',
    evidenceTags: [
      {
        tag: 'prepaid_credit_gap',
        quote: 'Wait, these are prepaid? I had thought about a corporate credit card. So we put money in before anyone spends, and there is no credit facility on these domestic cards?',
        sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
        recordRef: 'M03',
        turnNumber: 6,
      },
      {
        tag: 'prepaid_confirmed',
        quote: 'That is right for this option. The money is in the company wallet and the card transactions draw against it.',
        sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
        recordRef: 'M03',
        turnNumber: 7,
      },
      {
        tag: 'price_confusion',
        quote: 'But you previously told me INR 26,000. Why has that become INR 39,000?',
        sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
        recordRef: 'M03',
        turnNumber: 23,
      },
      {
        tag: 'price_explanation',
        quote: 'I included the integration setup in that number. To separate it: INR 26,000 plus tax is the recurring annual subscription, and INR 13,000 is the one-time accounting integration setup.',
        sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
        recordRef: 'M03',
        turnNumber: 24,
      },
      {
        tag: 'cfo_needed',
        quote: 'Our CFO approves the larger payments. We need to explain the proposal to them; that part is still ahead of us.',
        sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
        recordRef: 'M03',
        turnNumber: 28,
      },
      {
        tag: 'deferred_scheduling',
        quote: 'Send the details first. We need time with the CFO and will tell you if another call is needed.',
        sourceId: '398672e7-62dd-5afd-846d-0237d49792fb',
        recordRef: 'M03',
        turnNumber: 36,
      },
    ],
    routes: ['Sales follow-up', 'Sales coaching'] as Route[],
    quotes: [
      'Wait, these are prepaid? I had thought about a corporate credit card. So we put money in before anyone spends, and there is no credit facility on these domestic cards?',
      'That is right for this option. The money is in the company wallet and the card transactions draw against it.',
      'But you previously told me INR 26,000. Why has that become INR 39,000?',
      'I included the integration setup in that number. To separate it: INR 26,000 plus tax is the recurring annual subscription, and INR 13,000 is the one-time accounting integration setup.',
      'Our CFO approves the larger payments. We need to explain the proposal to them; that part is still ahead of us.',
      'Send the details first. We need time with the CFO and will tell you if another call is needed.',
    ],
    unknowns: [
      'Whether CFO will approve the prepaid arrangement or insist on credit.',
      'Vendor payment volume mentioned (INR 26-39 lakh/month) — potential future module but not in scope for this deal.',
      'Automatic accounting sync was shown as manual-only; whether this is a blocker is unknown.',
    ],
    nextAction:
      'Send cards proposal and module information. Await CFO discussion — do not push for a call. Coaching: (1) clarify prepaid vs credit upfront; (2) separate recurring and one-time costs clearly in written proposal.',
    flags: [
      'COACHING: Price confusion at turns 23-24 — rep quoted INR 26,000 previously without separating the INR 13,000 setup cost. Proposal must clearly distinguish INR 26,000 annual subscription + INR 13,000 one-time setup.',
      'COACHING: Prospect at turn 6 expected credit, not prepaid — product-fit gap. Establish prepaid/credit expectation before demo.',
      'Customer status: inferred prospect (evaluation stage, no existing spend referenced).',
    ],
    freshness: 'current',
  },

  // ================================================================
  // M04 - Cedarwave Distribution / SpendNest - EXISTING CUSTOMER AT RISK
  // Source ID: b0f79b3d-37ba-52f9-b2bc-58b159dd6d91
  // Key: prepaid→credit gap (turns 9-11), migration issue (turns 2-6),
  //      bank-card-feed opportunity UNCONFIRMED (turns 13, 22-25),
  //      department/user issue (turns 30-32), owner: Team member A (turns 23, 28)
  // ================================================================
  'meeting:b0f79b3d-37ba-52f9-b2bc-58b159dd6d91': {
    sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
    sourceType: 'meeting',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'Existing customer (inferred) faces forced card migration and has a core prepaid-to-credit unresolved issue. Multiple open items: eligibility check, accounting integration feasibility, department migration. Team member A has explicit ownership of eligibility and accounting checks.',
    evidenceTags: [
      {
        tag: 'migration_forced',
        quote: 'The plan is to close the old programme in the coming weeks, so we need to organise the transition.',
        sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
        recordRef: 'M04',
        turnNumber: 4,
      },
      {
        tag: 'credit_demand',
        quote: 'moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that.',
        sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
        recordRef: 'M04',
        turnNumber: 11,
      },
      {
        tag: 'bank_card_eligibility_unconfirmed',
        quote: 'I will check whether your already-issued cards can join the transaction-feed programme. If that is possible, the next steps are the agreement, network approval and linking the cards to users. I cannot confirm the existing-card eligibility on this call.',
        sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
        recordRef: 'M04',
        turnNumber: 23,
      },
      {
        tag: 'accounting_feasibility_unconfirmed',
        quote: 'I need the team to confirm feasibility for your bank-card transactions rather than say the existing prepaid integration automatically covers it.',
        sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
        recordRef: 'M04',
        turnNumber: 21,
      },
      {
        tag: 'product_feedback_credit_gap',
        quote: 'The replacement I described is still prepaid. I do not want to promise that this becomes a credit card in the near term.',
        sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
        recordRef: 'M04',
        turnNumber: 10,
      },
      {
        tag: 'department_issue',
        quote: 'There is also the earlier issue with moving users between departments. The current department setup has become confusing and needs correcting.',
        sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
        recordRef: 'M04',
        turnNumber: 30,
      },
      {
        tag: 'owner_team_member_a',
        quote: 'I will check whether your already-issued cards can join the transaction-feed programme.',
        sourceId: 'b0f79b3d-37ba-52f9-b2bc-58b159dd6d91',
        recordRef: 'M04',
        turnNumber: 23,
      },
    ],
    routes: ['Account risk', 'Product feedback'] as Route[],
    quotes: [
      'The plan is to close the old programme in the coming weeks, so we need to organise the transition.',
      'moving from prepaid to credit is the main issue for us. At some stage we will have to consider another option for that.',
      'I will check whether your already-issued cards can join the transaction-feed programme. If that is possible, the next steps are the agreement, network approval and linking the cards to users. I cannot confirm the existing-card eligibility on this call.',
      'I need the team to confirm feasibility for your bank-card transactions rather than say the existing prepaid integration automatically covers it.',
      'The replacement I described is still prepaid. I do not want to promise that this becomes a credit card in the near term.',
      'There is also the earlier issue with moving users between departments. The current department setup has become confusing and needs correcting.',
    ],
    unknowns: [
      'Whether existing bank-issued cards are eligible for the transaction-feed programme (pending Team member A check).',
      'Whether bank-card accounting integration is feasible (pending team confirmation).',
      'Available credit limit visibility is NOT possible in proposed setup (turn 25).',
      'Bank-card-feed opportunity — UNCONFIRMED — customer expressed interest but eligibility not established.',
    ],
    nextAction:
      'URGENT: Check bank-card eligibility for transaction-feed programme. Confirm accounting integration feasibility with team. Plan department/user correction session. Decide migration timeline before current programme closes.',
    owner: 'Team member A',
    flags: [
      'PRODUCT FEEDBACK: Existing customer cannot get credit cards through SpendNest directly — only prepaid or bank-partnership route. This is a product limitation that may cause churn.',
      'UNCONFIRMED OPPORTUNITY: Bank-card feed integration — do not report as pipeline until eligibility confirmed.',
      'Customer status: inferred existing customer (active card programme, migration being discussed).',
    ],
    freshness: 'current',
  },

  // ================================================================
  // M06 - Mapletrail Services / SpendNest - Receivables automation discovery
  // Source ID: 657b9e9d-9472-5b01-a127-a648ad7e8cf7
  // ================================================================
  'meeting:657b9e9d-9472-5b01-a127-a648ad7e8cf7': {
    sourceId: '657b9e9d-9472-5b01-a127-a648ad7e8cf7',
    sourceType: 'meeting',
    writtenForRevision: 1,
    confidence: 'tentative',
    reason:
      'Contact showed genuine interest in AR automation and expense tooling, and agreed to receive material and stay in touch. However, the central team handles most processes and scale of local operation is small. No explicit next step or timeline established.',
    evidenceTags: [
      {
        tag: 'ar_automation_interest',
        quote: 'Automation could save time, especially when we have to wait for one contact and then follow up through another.',
        sourceId: '657b9e9d-9472-5b01-a127-a648ad7e8cf7',
        recordRef: 'M06',
        turnNumber: 25,
      },
      {
        tag: 'followup_agreed',
        quote: 'Please send the information and we can stay in touch.',
        sourceId: '657b9e9d-9472-5b01-a127-a648ad7e8cf7',
        recordRef: 'M06',
        turnNumber: 33,
      },
      {
        tag: 'security_concern',
        quote: 'Confidentiality is important. Payment information is sensitive. How is that protected, and is there a risk of somebody interfering with it?',
        sourceId: '657b9e9d-9472-5b01-a127-a648ad7e8cf7',
        recordRef: 'M06',
        turnNumber: 31,
      },
      {
        tag: 'central_team_handles_most',
        quote: 'the dedicated central team handles much of this today.',
        sourceId: '657b9e9d-9472-5b01-a127-a648ad7e8cf7',
        recordRef: 'M06',
        turnNumber: 25,
      },
    ],
    routes: ['Sales follow-up'] as Route[],
    quotes: [
      'Automation could save time, especially when we have to wait for one contact and then follow up through another.',
      'Please send the information and we can stay in touch.',
      'Confidentiality is important. Payment information is sensitive. How is that protected, and is there a risk of somebody interfering with it?',
      'the dedicated central team handles much of this today.',
    ],
    unknowns: [
      'Whether the central team would be the real decision-maker.',
      'Invoice volumes and currency mix are rough estimates only.',
      'Customer status: inferred prospect (evaluation/discovery stage).',
    ],
    nextAction:
      'Send receivables automation material + security/compliance information. Include expense module overview. Follow up to understand if the central team should be involved.',
    freshness: 'current',
  },

  // ================================================================
  // M07 - Willowfield Trust / SpendNest - SUPPORT (despite sales title)
  // Source ID: 4f304fff-fd40-5cfc-a366-0a134c445c2a
  // Initially: awaiting_transcript (has_transcript=true, turns=[])
  // After update (revision 2): 27 turns — full support walkthrough
  // Analysis written for revision 2 (the update)
  // Commitments at turns 7, 19, 25
  // ================================================================
  'meeting:4f304fff-fd40-5cfc-a366-0a134c445c2a': {
    sourceId: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
    sourceType: 'meeting',
    writtenForRevision: 2,
    confidence: 'supported',
    reason:
      'Despite the meeting title suggesting a sales discussion, the transcript is entirely a support walkthrough: three distinct product bugs with workarounds and team escalations committed. Route based on transcript evidence, not title.',
    evidenceTags: [
      {
        tag: 'description_bug_commit',
        quote: 'I have captured screenshots of that behaviour. I will get it checked today. I do not have an explanation for it yet.',
        sourceId: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
        recordRef: 'M07',
        turnNumber: 7,
      },
      {
        tag: 'reimbursement_stuck_commit',
        quote: 'The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two, and I will inform you when they confirm.',
        sourceId: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
        recordRef: 'M07',
        turnNumber: 19,
      },
      {
        tag: 'mark_as_paid_bug_commit',
        quote: 'I will report that separately as well, with the steps you showed, and ask the team to investigate the refresh behaviour.',
        sourceId: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
        recordRef: 'M07',
        turnNumber: 25,
      },
      {
        tag: 'workaround_provided',
        quote: 'the workaround is to save the changes, return to the invoice inbox, open Review and upload the document there.',
        sourceId: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
        recordRef: 'M07',
        turnNumber: 13,
      },
      {
        tag: 'title_misleads',
        quote: 'I wanted to go through the issues you sent yesterday. If you share your screen, we can look at what is happening and I can take the details back to the team.',
        sourceId: '4f304fff-fd40-5cfc-a366-0a134c445c2a',
        recordRef: 'M07',
        turnNumber: 1,
      },
    ],
    routes: ['Support/issue log', 'Product feedback'] as Route[],
    quotes: [
      'I have captured screenshots of that behaviour. I will get it checked today. I do not have an explanation for it yet.',
      'The payments appear to have been released but are stuck showing Processing. I have asked the team to look at these. I expect an update or resolution in an hour or two, and I will inform you when they confirm.',
      'I will report that separately as well, with the steps you showed, and ask the team to investigate the refresh behaviour.',
      'the workaround is to save the changes, return to the invoice inbox, open Review and upload the document there.',
      'I wanted to go through the issues you sent yesterday. If you share your screen, we can look at what is happening and I can take the details back to the team.',
    ],
    unknowns: [
      'Whether the description-edit bug is consistent across all users.',
      'Root cause of the stuck reimbursement payments.',
      'Whether the Mark-as-paid refresh bug is browser-specific.',
    ],
    nextAction:
      'Verify: (1) description-edit fix status, (2) reimbursement Processing state resolved, (3) Mark-as-paid refresh fix. Follow up with customer on all three open items. Log product bugs with engineering.',
    flags: [
      'TITLE MISLEADS: Meeting titled "Willowfield Trust / SpendNest discussion" suggests sales, but entire content is a support bug walkthrough. Evidence-based routing to Support/issue log is correct.',
      'This analysis was written for revision 2 (update batch). Before the update, transcript was empty (awaiting_transcript).',
    ],
    freshness: 'current',
  },

  // ================================================================
  // M09 - Brookmint Holdings / Northkite Equipment - Account setup
  // Source ID: 4b5b9192-f3fc-505a-8e77-4d2ffaa54594
  // ================================================================
  'meeting:4b5b9192-f3fc-505a-8e77-4d2ffaa54594': {
    sourceId: '4b5b9192-f3fc-505a-8e77-4d2ffaa54594',
    sourceType: 'meeting',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'Customer has two company accounts with separate setup needs. A broken invitation link and an expiring reset token are blocking Brookmint Holdings access. Team member A committed to investigating and updating by end of day or Monday.',
    evidenceTags: [
      {
        tag: 'login_blocked',
        quote: 'It says the token has expired. This is the fresh message we just received.',
        sourceId: '4b5b9192-f3fc-505a-8e77-4d2ffaa54594',
        recordRef: 'M09',
        turnNumber: 21,
      },
      {
        tag: 'team_commit',
        quote: 'I need to check that with the team. I hope to update you today, or by Monday at the latest. We have not got the Brookmint Holdings login working yet.',
        sourceId: '4b5b9192-f3fc-505a-8e77-4d2ffaa54594',
        recordRef: 'M09',
        turnNumber: 22,
      },
      {
        tag: 'access_concern',
        quote: 'I do not want this to depend on trusting someone not to use access that is available. That does not solve the permission problem.',
        sourceId: '4b5b9192-f3fc-505a-8e77-4d2ffaa54594',
        recordRef: 'M09',
        turnNumber: 17,
      },
    ],
    routes: ['Support/issue log'] as Route[],
    quotes: [
      'It says the token has expired. This is the fresh message we just received.',
      'I need to check that with the team. I hope to update you today, or by Monday at the latest. We have not got the Brookmint Holdings login working yet.',
      'I do not want this to depend on trusting someone not to use access that is available. That does not solve the permission problem.',
    ],
    unknowns: [
      'Root cause of invitation token expiry not identified.',
      'Permission model for shared mailbox vs separate admin is not yet resolved.',
      'Whether IT team will implement separate email identities.',
    ],
    nextAction:
      'Investigate Brookmint Holdings reset token failure with team. Provide fix or new approach by end of day or Monday. Document permission options for customer.',
    freshness: 'current',
  },

  // ================================================================
  // M10 - Billing workflow walkthrough - Internal training
  // Source ID: 337f297d-9385-5b82-9e54-5019c1ed912c
  // ================================================================
  'meeting:337f297d-9385-5b82-9e54-5019c1ed912c': {
    sourceId: '337f297d-9385-5b82-9e54-5019c1ed912c',
    sourceType: 'meeting',
    writtenForRevision: 1,
    confidence: 'supported',
    reason:
      'Internal SpendNest billing training session. Team member B received a walkthrough of invoice generation, billing cycles, and account freeze procedures. Back-office access not yet granted — follow-up needed.',
    evidenceTags: [
      {
        tag: 'no_backoffice_access',
        quote: 'I have access to a demo account as an administrator, but I do not have the back-office super-admin access you mentioned.',
        sourceId: '337f297d-9385-5b82-9e54-5019c1ed912c',
        recordRef: 'M10',
        turnNumber: 4,
      },
      {
        tag: 'backoffice_access_planned',
        quote: 'I will request the back-office access separately for the next training session.',
        sourceId: '337f297d-9385-5b82-9e54-5019c1ed912c',
        recordRef: 'M10',
        turnNumber: 20,
      },
      {
        tag: 'billing_nuances',
        quote: 'Simply topping up a frozen account does not complete the whole recovery flow in this process.',
        sourceId: '337f297d-9385-5b82-9e54-5019c1ed912c',
        recordRef: 'M10',
        turnNumber: 17,
      },
    ],
    routes: ['Internal/vendor operations'] as Route[],
    quotes: [
      'I have access to a demo account as an administrator, but I do not have the back-office super-admin access you mentioned.',
      'I will request the back-office access separately for the next training session.',
      'Simply topping up a frozen account does not complete the whole recovery flow in this process.',
    ],
    unknowns: [
      'When back-office access will be provisioned.',
      'Which team B is joining is not stated explicitly.',
    ],
    nextAction:
      'Request back-office super-admin access for Team member B. Schedule next training session. Send billing examples for self-review.',
    freshness: 'current',
  },
};

// ---- Quote verification helper ----
// Every quote must be an exact substring of the source transcript.
// This is used by the automated test (npm run replay quote-check).
export function verifyQuote(
  quote: string,
  transcriptText: string
): { verified: boolean; reason?: string } {
  if (!transcriptText) {
    return { verified: false, reason: 'No transcript text available' };
  }
  const found = transcriptText.includes(quote);
  return {
    verified: found,
    reason: found ? undefined : `Quote not found in transcript`,
  };
}
