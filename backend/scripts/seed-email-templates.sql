-- Seed email templates for the mail service (cs_mail database).
-- Idempotent: re-running updates existing rows by slug.
-- Variables use {{name}} syntax, replaced by TemplateService.
-- Layout: table-based, inline styles, 600px card — safe for Gmail/Outlook/Apple Mail.

CREATE TEMP TABLE _tpl (slug varchar(100), subject varchar(255), html_body text, text_body text, variables text);

CREATE TEMP TABLE _wrap (head text, foot text);
INSERT INTO _wrap VALUES (
'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef1f6;padding:36px 12px;font-family:-apple-system,BlinkMacSystemFont,''Segoe UI'',Roboto,Helvetica,Arial,sans-serif;"><tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;"><tr><td style="background:#101a33;border-radius:14px 14px 0 0;padding:24px 36px;"><span style="font-size:20px;font-weight:700;color:#ffffff;letter-spacing:.4px;">Client<span style="color:#d9b64a;">Signal</span></span></td></tr><tr><td style="background:#ffffff;padding:38px 36px 34px;border-radius:0 0 14px 14px;color:#2a3142;font-size:15px;line-height:1.7;">',
'</td></tr><tr><td style="padding:22px 24px;text-align:center;color:#8a91a3;font-size:12px;line-height:1.7;">ClientSignal &middot; Connecting people with vetted attorneys<br>You are receiving this email because you have an account on ClientSignal.</td></tr></table></td></tr></table>'
);

-- helper fragments used below (kept as comments for reference):
-- eyebrow: <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">...</p>
-- h1:      <h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">...</h1>
-- button:  <a href="..." style="background:#101a33;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;display:inline-block;">...</a>
-- panel:   <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;border-radius:10px;margin:22px 0;"><tr><td style="padding:18px 22px;">...</td></tr></table>

INSERT INTO _tpl
SELECT 'welcome-client',
 'Welcome to ClientSignal, {{name}}',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Your ClientSignal account is ready — verify your email to get started.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Welcome aboard</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{name}}, your account is ready</h1>' ||
 '<p style="margin:0 0 10px;">Thanks for joining ClientSignal. Tell us about your legal matter and we will match you with vetted attorneys who fit your case, your area, and your timeline.</p>' ||
 '<p style="margin:0 0 26px;">First, confirm this email address so we can keep your account secure:</p>' ||
 '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 26px;"><tr><td align="center"><a href="{{verifyUrl}}" style="background:#101a33;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;display:inline-block;">Verify my email</a></td></tr></table>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;border-radius:10px;"><tr><td style="padding:16px 22px;font-size:13px;color:#5b6272;">Button not working? Paste this link into your browser:<br><a href="{{verifyUrl}}" style="color:#2456c8;word-break:break-all;">{{verifyUrl}}</a></td></tr></table>' ||
 w.foot,
 'Hi {{name}}, welcome to ClientSignal! Verify your email to get started: {{verifyUrl}}',
 '["name","email","role","verifyUrl"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'welcome-attorney',
 'Welcome to ClientSignal, {{name}}',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Your attorney account is ready — verify your email, then complete bar verification.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Welcome, counsel</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{name}}, your attorney account is ready</h1>' ||
 '<p style="margin:0 0 10px;">Thanks for joining ClientSignal. Once your profile and bar verification are complete, you will start receiving leads matched to your practice areas and location.</p>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;border-radius:10px;margin:18px 0 26px;"><tr><td style="padding:18px 22px;font-size:14px;color:#2a3142;"><strong style="color:#101a33;">Next steps</strong><br>1. Verify your email below<br>2. Complete your profile and specialties<br>3. Submit your bar details for verification</td></tr></table>' ||
 '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 26px;"><tr><td align="center"><a href="{{verifyUrl}}" style="background:#101a33;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;display:inline-block;">Verify my email</a></td></tr></table>' ||
 '<p style="margin:0;font-size:13px;color:#5b6272;">Button not working? Paste this link: <a href="{{verifyUrl}}" style="color:#2456c8;word-break:break-all;">{{verifyUrl}}</a></p>' ||
 w.foot,
 'Hi {{name}}, welcome to ClientSignal! Verify your email ({{verifyUrl}}), then complete your profile and bar verification to start receiving leads.',
 '["name","email","role","verifyUrl"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'password-reset',
 'Reset your ClientSignal password',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Use the link inside to set a new password. It expires soon.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Security</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Reset your password</h1>' ||
 '<p style="margin:0 0 26px;">Hi {{name}}, we received a request to reset the password on your account. Click below to choose a new one:</p>' ||
 '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 26px;"><tr><td align="center"><a href="{{resetUrl}}" style="background:#101a33;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;display:inline-block;">Set new password</a></td></tr></table>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6e3;border-left:4px solid #d9b64a;border-radius:6px;margin:0 0 18px;"><tr><td style="padding:14px 18px;font-size:13px;color:#6b5b1e;">This link expires at <strong>{{expiresAt}}</strong>. If you did not request a reset, you can safely ignore this email — your password will not change.</td></tr></table>' ||
 '<p style="margin:0;font-size:13px;color:#5b6272;">Button not working? Paste this link: <a href="{{resetUrl}}" style="color:#2456c8;word-break:break-all;">{{resetUrl}}</a></p>' ||
 w.foot,
 'Hi {{name}}, reset your ClientSignal password here: {{resetUrl}} — the link expires at {{expiresAt}}. If you did not request this, ignore this email.',
 '["name","resetUrl","resetToken","expiresAt"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'attorney-approved',
 'You are approved on ClientSignal 🎉',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Your profile passed verification — you can now receive and claim leads.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#1b7a43;text-transform:uppercase;">Verification passed</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Congratulations, {{name}} — you are approved</h1>' ||
 '<p style="margin:0 0 10px;">Your attorney profile has passed verification. Your listing is now live and you can receive and claim leads matched to your practice areas.</p>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef8f1;border-radius:10px;margin:22px 0 26px;"><tr><td style="padding:18px 22px;font-size:14px;color:#1e5c39;"><strong>Tips for your first leads</strong><br>Respond quickly — fast replies win clients. Keep your specialties and location up to date so matching stays sharp.</td></tr></table>' ||
 w.foot,
 'Congratulations {{name}}! Your attorney profile has been approved on ClientSignal. You can now receive and claim matched leads.',
 '["name","attorneyId"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'attorney-rejected',
 'Update on your ClientSignal application',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">We could not approve your application this time — details inside.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Application update</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{name}}, we could not approve your application</h1>' ||
 '<p style="margin:0 0 10px;">After reviewing your profile, we were unable to approve it at this time.</p>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf1f0;border-left:4px solid #c0453a;border-radius:6px;margin:18px 0 22px;"><tr><td style="padding:14px 18px;font-size:14px;color:#7a2d26;"><strong>Reason</strong><br>{{reason}}</td></tr></table>' ||
 '<p style="margin:0;">You are welcome to update your profile and documentation and reapply. If you believe this is a mistake, just reply to this email.</p>' ||
 w.foot,
 'Hi {{name}}, we could not approve your ClientSignal application. Reason: {{reason}}. You may update your profile and reapply.',
 '["name","reason"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'case-update',
 'Your case moved forward — stage {{newStage}}',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Your case progressed from stage {{previousStage}} to stage {{newStage}}.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Case update</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{clientName}}, your case moved forward</h1>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;border-radius:10px;margin:18px 0 22px;"><tr><td style="padding:18px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#2a3142;"><tr><td style="padding:4px 0;color:#8a91a3;width:130px;">Stage</td><td style="padding:4px 0;"><strong>{{previousStage}} &rarr; {{newStage}}</strong></td></tr><tr><td style="padding:4px 0;color:#8a91a3;">Status</td><td style="padding:4px 0;"><strong style="text-transform:capitalize;">{{status}}</strong></td></tr><tr><td style="padding:4px 0;color:#8a91a3;">Case ID</td><td style="padding:4px 0;font-family:monospace;font-size:13px;">{{caseId}}</td></tr></table></td></tr></table>' ||
 '<p style="margin:0;">Log in to your dashboard to see the full timeline and any messages from your attorney.</p>' ||
 w.foot,
 'Hi {{clientName}}, your case moved from stage {{previousStage}} to {{newStage}}. Status: {{status}}. Case ID: {{caseId}}.',
 '["clientName","caseId","previousStage","newStage","status"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'document-request',
 '{{attorneyName}} needs a document from you',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">{{attorneyName}} requested {{documentName}} for your case.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Action needed</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{clientName}}, a document is needed</h1>' ||
 '<p style="margin:0 0 10px;">{{attorneyName}} has requested the following document to keep your case moving:</p>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;border-radius:10px;margin:18px 0 22px;"><tr><td style="padding:18px 22px;font-size:15px;color:#101a33;">&#128196; <strong>{{documentName}}</strong><br><span style="font-size:12px;color:#8a91a3;font-family:monospace;">Case {{caseId}}</span></td></tr></table>' ||
 '<p style="margin:0;">Log in to your ClientSignal dashboard and upload it under your case documents. The sooner it is in, the faster things move.</p>' ||
 w.foot,
 'Hi {{clientName}}, {{attorneyName}} requested: {{documentName}}. Please upload it in your ClientSignal dashboard. Case ID: {{caseId}}.',
 '["clientName","attorneyName","documentName","caseId"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'lead-new-attorney',
 'New {{practiceArea}} lead in {{city}} — quality {{qualityScore}}',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">A new lead matches your profile: {{practiceArea}} in {{city}}.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">New matched lead</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{attorneyName}}, a lead matches your profile</h1>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;border-radius:10px;margin:18px 0 6px;"><tr><td style="padding:18px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#2a3142;"><tr><td style="padding:4px 0;color:#8a91a3;width:130px;">Practice area</td><td style="padding:4px 0;text-transform:capitalize;"><strong>{{practiceArea}}</strong></td></tr><tr><td style="padding:4px 0;color:#8a91a3;">Location</td><td style="padding:4px 0;"><strong>{{city}}</strong></td></tr><tr><td style="padding:4px 0;color:#8a91a3;">Quality score</td><td style="padding:4px 0;"><strong style="color:#1b7a43;">{{qualityScore}}</strong></td></tr></table></td></tr></table>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-left:4px solid #d9b64a;background:#fdf9ee;border-radius:6px;margin:0 0 24px;"><tr><td style="padding:14px 18px;font-size:14px;color:#4a4632;font-style:italic;">&ldquo;{{summary}}&rdquo;</td></tr></table>' ||
 '<p style="margin:0 0 4px;">Leads are first come, first served — open your dashboard to review and claim it.</p>' ||
 '<p style="margin:0;font-size:12px;color:#8a91a3;font-family:monospace;">Lead {{leadId}}</p>' ||
 w.foot,
 'Hi {{attorneyName}}, new {{practiceArea}} lead in {{city}} (quality {{qualityScore}}): {{summary}} — Lead ID: {{leadId}}. Log in to claim it.',
 '["attorneyName","practiceArea","city","qualityScore","summary","leadId"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'lead-claimed-client',
 'Good news — an attorney is on your case',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">{{attorneyName}} has taken on your {{practiceArea}} inquiry.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#1b7a43;text-transform:uppercase;">Attorney matched</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Good news, {{clientName}}!</h1>' ||
 '<p style="margin:0 0 10px;"><strong>{{attorneyName}}</strong> has reviewed your <span style="text-transform:capitalize;">{{practiceArea}}</span> inquiry and taken on your matter. They will reach out to you shortly through ClientSignal.</p>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef8f1;border-radius:10px;margin:22px 0 24px;"><tr><td style="padding:18px 22px;font-size:14px;color:#1e5c39;"><strong>What happens next</strong><br>Watch your dashboard for messages, and have any relevant documents handy — your attorney may request them to get started.</td></tr></table>' ||
 '<p style="margin:0;font-size:12px;color:#8a91a3;font-family:monospace;">Reference {{leadId}}</p>' ||
 w.foot,
 'Good news {{clientName}}! {{attorneyName}} has taken on your {{practiceArea}} inquiry and will reach out shortly. Reference: {{leadId}}.',
 '["clientName","attorneyName","practiceArea","leadId"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'invoice-ready',
 'Your ClientSignal invoice for {{amount}} is ready',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Invoice {{invoiceId}} for {{amount}} is ready to view.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Billing</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{attorneyName}}, your invoice is ready</h1>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fa;border-radius:10px;margin:18px 0 26px;"><tr><td style="padding:18px 22px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;color:#2a3142;"><tr><td style="padding:4px 0;color:#8a91a3;width:130px;">Amount</td><td style="padding:4px 0;font-size:18px;"><strong>{{amount}}</strong></td></tr><tr><td style="padding:4px 0;color:#8a91a3;">Invoice ID</td><td style="padding:4px 0;font-family:monospace;font-size:13px;">{{invoiceId}}</td></tr></table></td></tr></table>' ||
 '<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;"><tr><td align="center"><a href="{{pdfUrl}}" style="background:#101a33;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 32px;border-radius:8px;display:inline-block;">View invoice</a></td></tr></table>' ||
 w.foot,
 'Hi {{attorneyName}}, your ClientSignal invoice for {{amount}} is ready: {{pdfUrl}} (Invoice ID: {{invoiceId}}).',
 '["attorneyName","invoiceId","amount","pdfUrl"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'payment-failed',
 'Action needed — payment of {{amount}} failed',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Your payment of {{amount}} could not be processed.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#c0453a;text-transform:uppercase;">Payment issue</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{attorneyName}}, your payment did not go through</h1>' ||
 '<p style="margin:0 0 10px;">We tried to process your payment of <strong>{{amount}}</strong> but it failed.</p>' ||
 '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#fdf1f0;border-left:4px solid #c0453a;border-radius:6px;margin:18px 0 22px;"><tr><td style="padding:14px 18px;font-size:14px;color:#7a2d26;"><strong>Reason</strong><br>{{reason}}</td></tr></table>' ||
 '<p style="margin:0;">Please update your payment method in your billing settings to avoid any interruption to your leads.</p>' ||
 w.foot,
 'Hi {{attorneyName}}, your payment of {{amount}} failed. Reason: {{reason}}. Please update your payment method to avoid interruption.',
 '["attorneyName","amount","reason"]'
FROM _wrap w;

INSERT INTO _tpl
SELECT 'subscription-cancelled',
 'Your {{planName}} subscription has been cancelled',
 w.head ||
 '<div style="display:none;max-height:0;overflow:hidden;">Your {{planName}} subscription is cancelled — access continues until the end of the billing period.</div>' ||
 '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.6px;color:#b9962e;text-transform:uppercase;">Subscription</p>' ||
 '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.3;color:#101a33;">Hi {{attorneyName}}, your subscription is cancelled</h1>' ||
 '<p style="margin:0 0 10px;">Your <strong>{{planName}}</strong> subscription has been cancelled. You will keep full access until the end of your current billing period, after which lead matching will pause.</p>' ||
 '<p style="margin:0 0 22px;">Changed your mind? You can resubscribe anytime from your billing settings and pick up right where you left off.</p>' ||
 '<p style="margin:0;font-size:12px;color:#8a91a3;font-family:monospace;">Subscription {{subscriptionId}}</p>' ||
 w.foot,
 'Hi {{attorneyName}}, your {{planName}} subscription has been cancelled. You keep access until the end of the billing period. ID: {{subscriptionId}}.',
 '["attorneyName","planName","subscriptionId"]'
FROM _wrap w;

INSERT INTO email_templates (slug, subject, html_body, text_body, variables, active)
SELECT slug, subject, html_body, text_body, variables, true FROM _tpl
ON CONFLICT (slug) DO UPDATE SET
  subject = EXCLUDED.subject,
  html_body = EXCLUDED.html_body,
  text_body = EXCLUDED.text_body,
  variables = EXCLUDED.variables,
  active = true,
  updated_at = now();

DROP TABLE _tpl;
DROP TABLE _wrap;
