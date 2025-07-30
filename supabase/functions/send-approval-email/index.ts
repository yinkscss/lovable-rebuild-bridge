import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ApprovalEmailRequest {
  email: string;
  firstName: string;
  lastName: string;
  applicationId: string;
}

const createApprovalEmailHTML = (firstName: string) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Application Approved - National Debt Relief</title>
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
        .highlight-box {
          background-color: #f0f9ff;
          border-left: 4px solid #2563eb;
          padding: 20px;
          margin: 25px 0;
          border-radius: 4px;
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
        .benefits {
          background-color: #f9fafb;
          padding: 20px;
          border-radius: 6px;
          margin: 25px 0;
        }
        .benefits ul {
          margin: 0;
          padding-left: 20px;
        }
        .benefits li {
          margin-bottom: 8px;
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
          <h1>🎉 Congratulations, ${firstName}!</h1>
          <p>Your debt relief application has been approved</p>
        </div>
        
        <div class="content">
          <h2>Welcome to Your Debt-Free Journey!</h2>
          
          <p>We're excited to inform you that your debt relief application has been <strong>approved</strong>! This is the first step toward taking control of your financial future and achieving the debt relief you deserve.</p>
          
          <div class="highlight-box">
            <p><strong>What happens next?</strong></p>
            <p>Our debt relief specialists will be contacting you shortly to discuss your personalized debt settlement plan and answer any questions you may have about the process.</p>
          </div>
          
          <div class="benefits">
            <h3 style="margin-top: 0; color: #2563eb;">Your Benefits Include:</h3>
            <ul>
              <li>Potential savings of up to 40% on your total debt</li>
              <li>One affordable monthly payment</li>
              <li>Professional negotiation with your creditors</li>
              <li>Dedicated debt specialist support</li>
              <li>No upfront fees - you only pay when we settle your debts</li>
            </ul>
          </div>
          
          <div class="phone-number">
            📞 Call Now: 800-210-5340
          </div>
          
          <p>Don't wait - the sooner you start, the sooner you can become debt-free! Our certified debt specialists are standing by to help you take the next step.</p>
          
          <center>
            <a href="tel:800-210-5340" class="cta-button">Call Now to Get Started</a>
          </center>
          
          <p><strong>Questions?</strong> Our team is here to help Monday through Friday, 8 AM to 10 PM EST, and Saturday 8 AM to 5 PM EST.</p>
        </div>
        
        <div class="footer">
          <p><strong>National Debt Relief</strong></p>
          <p>Your Trusted Partner in Debt Freedom</p>
          <p>This email was sent regarding your debt relief application. If you have any questions, please call 800-210-5340.</p>
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
    const { email, firstName, lastName, applicationId }: ApprovalEmailRequest = await req.json();

    console.log(`Sending approval email to: ${email} for application: ${applicationId}`);

    const emailResponse = await resend.emails.send({
      from: "National Debt Relief <info@nationaldebtsrelief.org>",
      to: [email],
      subject: `🎉 Congratulations ${firstName}! Your Debt Relief Application is Approved`,
      html: createApprovalEmailHTML(firstName),
    });

    console.log("Approval email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailResponse,
      message: `Approval email sent to ${firstName} ${lastName}` 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
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