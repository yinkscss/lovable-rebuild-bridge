import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DebtAccountEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  applicationId: string;
  debtAccountDetails: {
    originalCreditor: string;
    accountType: string;
    currentBalance: number;
  };
}

const createDebtAccountEmailHTML = (firstName: string, debtAccountDetails: any) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Debt Account Created - National Debt Relief</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 0;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          margin: 20px auto;
          padding: 0;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: bold;
        }
        .header p {
          margin: 10px 0 0 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .content {
          padding: 40px 30px;
        }
        .content h2 {
          color: #2563eb;
          font-size: 24px;
          margin-bottom: 20px;
        }
        .content p {
          margin-bottom: 16px;
          font-size: 16px;
          line-height: 1.6;
        }
        .account-details {
          background-color: #f0f9ff;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
        }
        .account-details h3 {
          margin-top: 0;
          color: #2563eb;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e0e7ff;
        }
        .detail-row:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }
        .detail-label {
          font-weight: bold;
          color: #374151;
        }
        .detail-value {
          color: #1f2937;
        }
        .cta-button {
          display: inline-block;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          font-size: 16px;
          margin: 20px 0;
          text-align: center;
        }
        .phone-number {
          background-color: #dc2626;
          color: white;
          padding: 15px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin: 25px 0;
          border-radius: 6px;
        }
        .footer {
          background-color: #374151;
          color: #d1d5db;
          padding: 30px;
          text-align: center;
          font-size: 14px;
        }
        .footer p {
          margin: 5px 0;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: white;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">National Debt Relief</div>
          <h1>📋 Debt Account Created</h1>
          <p>Your debt account has been successfully set up</p>
        </div>
        
        <div class="content">
          <h2>Hello ${firstName}!</h2>
          
          <p>We're pleased to inform you that a new debt account has been successfully created and added to your debt relief program. Our team is now ready to begin working on your behalf to negotiate with your creditors.</p>
          
          <div class="account-details">
            <h3>Account Details</h3>
            <div class="detail-row">
              <span class="detail-label">Original Creditor:</span>
              <span class="detail-value">${debtAccountDetails.originalCreditor}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Account Type:</span>
              <span class="detail-value">${debtAccountDetails.accountType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Current Balance:</span>
              <span class="detail-value">$${debtAccountDetails.currentBalance.toLocaleString()}</span>
            </div>
          </div>
          
          <p><strong>What happens next?</strong></p>
          <p>Our experienced debt specialists will now begin the negotiation process with your creditor. We'll work diligently to achieve the best possible settlement on your behalf.</p>
          
          <div class="phone-number">
            📞 Questions? Call: 800-210-5340
          </div>
          
          <p>Our team is available Monday through Friday, 8 AM to 10 PM EST, and Saturday 8 AM to 5 PM EST to answer any questions about your debt relief program.</p>
          
          <center>
            <a href="tel:800-210-5340" class="cta-button">Call Now for Support</a>
          </center>
          
          <p><strong>Thank you for choosing National Debt Relief.</strong> We're committed to helping you achieve financial freedom.</p>
        </div>
        
        <div class="footer">
          <p><strong>National Debt Relief</strong></p>
          <p>Your Trusted Partner in Debt Freedom</p>
          <p>This email was sent regarding your debt relief program. If you have any questions, please call 800-210-5340.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, firstName, lastName, applicationId, debtAccountDetails }: DebtAccountEmailRequest = await req.json();

    console.log(`Sending debt account creation email to: ${email} for application: ${applicationId}`);

    const emailResponse = await resend.emails.send({
      from: "National Debt Relief <info@nationaldebtsrelief.org>",
      to: [email],
      subject: `📋 New Debt Account Created - ${debtAccountDetails.originalCreditor}`,
      html: createDebtAccountEmailHTML(firstName, debtAccountDetails),
    });

    console.log("Debt account email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResponse,
      message: `Debt account creation email sent to ${firstName} ${lastName}` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-debt-account-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);