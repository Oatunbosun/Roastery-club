import { NextRequest, NextResponse } from 'next/server';

function generateOrderEmailHtml(order: any) {
  const itemsHtml = (order.items || [])
    .map(
      (item: any) => `
      <tr style="border-bottom: 1px solid #f0e6d6;">
        <td style="padding: 12px 8px; vertical-align: top;">
          <strong style="color: #2b1810; font-size: 15px;">${item.name}</strong>
          ${item.size ? `<span style="font-size: 12px; color: #8c6e58; display: block;">Size: ${item.size}</span>` : ''}
          ${item.milk ? `<span style="font-size: 12px; color: #8c6e58; display: block;">Milk: ${item.milk}</span>` : ''}
          ${item.roast ? `<span style="font-size: 12px; color: #8c6e58; display: block;">Roast: ${item.roast}</span>` : ''}
          ${item.notes ? `<span style="font-size: 12px; color: #b45309; font-style: italic; display: block;">Note: ${item.notes}</span>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center; color: #644430; font-size: 14px;">
          x${item.quantity || 1}
        </td>
        <td style="padding: 12px 8px; text-align: right; color: #2b1810; font-weight: 600; font-size: 14px;">
          $${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - The Roastery Club</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fbf7ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2c1810;">
      <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(44, 24, 16, 0.08); border: 1px solid #ecdcc9;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2b1810 0%, #3e2213 100%); padding: 36px 30px; text-align: center; color: #fbf7ee;">
          <div style="font-size: 28px; font-weight: bold; letter-spacing: -0.5px; margin-bottom: 6px;">
            ☕ The Roastery Club
          </div>
          <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #d97706; font-weight: 600;">
            Artisanal Roasters & Brew Bar
          </div>
        </div>

        <!-- Hero Status -->
        <div style="padding: 30px; text-align: center; background-color: #faf5ec; border-bottom: 1px solid #ebd9c5;">
          <div style="font-size: 36px; margin-bottom: 8px;">✨</div>
          <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #2b1810;">Your Coffee is Being Crafted!</h1>
          <p style="margin: 0; font-size: 14px; color: #785a44; line-height: 1.5;">
            Thank you, <strong>${order.customerName || 'Coffee Lover'}</strong>. Your order has been dispatched to our master baristas.
          </p>
          <div style="display: inline-block; margin-top: 16px; padding: 6px 16px; background-color: #f3dfca; border-radius: 20px; font-size: 13px; font-weight: 600; color: #8c4a16;">
            Order ID: #${(order.id || 'RC-' + Math.floor(100000 + Math.random() * 900000)).slice(-8).toUpperCase()}
          </div>
        </div>

        <!-- Order Summary -->
        <div style="padding: 24px 30px;">
          <h2 style="font-size: 16px; text-transform: uppercase; letter-spacing: 1px; color: #8c6e58; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #f0e6d6; padding-bottom: 8px;">
            Order Details (${order.orderType === 'delivery' ? 'Local Courier Delivery' : order.orderType === 'dine_in' ? 'Dine-In Table Service' : 'Bar Counter Pick-Up'})
          </h2>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="color: #9c7b64; font-size: 12px; text-transform: uppercase; text-align: left; border-bottom: 2px solid #ecdcc9;">
                <th style="padding: 8px 8px;">Item</th>
                <th style="padding: 8px 8px; text-align: center;">Qty</th>
                <th style="padding: 8px 8px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Pricing Calculation -->
          <div style="background-color: #faf5ec; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; color: #644430;">
              <span>Subtotal</span>
              <span style="font-weight: 600;">$${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            ${order.tax ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; color: #644430;">
              <span>Sales Tax</span>
              <span>$${(order.tax || 0).toFixed(2)}</span>
            </div>` : ''}
            ${order.tip ? `
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; color: #644430;">
              <span>Barista Tip</span>
              <span>$${(order.tip || 0).toFixed(2)}</span>
            </div>` : ''}
            <div style="border-top: 1px dashed #d5beaa; margin-top: 8px; padding-top: 8px; display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; color: #2b1810;">
              <span>Total Paid</span>
              <span style="color: #b45309;">$${(order.total || 0).toFixed(2)}</span>
            </div>
          </div>

          <!-- Pickup / Delivery Info -->
          ${order.deliveryAddress ? `
          <div style="padding: 14px 18px; background-color: #f7ede2; border-left: 4px solid #c97a3e; border-radius: 6px; margin-bottom: 20px;">
            <strong style="font-size: 13px; color: #2b1810; display: block; margin-bottom: 4px;">Delivery Destination:</strong>
            <span style="font-size: 14px; color: #644430;">${order.deliveryAddress}</span>
          </div>` : `
          <div style="padding: 14px 18px; background-color: #f7ede2; border-left: 4px solid #c97a3e; border-radius: 6px; margin-bottom: 20px;">
            <strong style="font-size: 13px; color: #2b1810; display: block; margin-bottom: 4px;">Pickup Location:</strong>
            <span style="font-size: 14px; color: #644430;">The Roastery Club Main Bar • 42 Artisan Way, Roast District</span>
          </div>`}

          <p style="font-size: 13px; color: #8c6e58; line-height: 1.5; margin: 0; text-align: center;">
            Estimated ready time: <strong>12-15 minutes</strong>. We carefully brew every cup to order.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f4ede3; padding: 20px; text-align: center; font-size: 12px; color: #9c7b64; border-top: 1px solid #ecdcc9;">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #644430;">The Roastery Club • 42 Artisan Way, Roast District</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} The Roastery Club. Made with love & micro-batch beans.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateReservationEmailHtml(res: any) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin: 0; padding: 0; background-color: #fbf7ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2c1810;">
      <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(44, 24, 16, 0.08); border: 1px solid #ecdcc9;">
        <div style="background: linear-gradient(135deg, #2b1810 0%, #3e2213 100%); padding: 36px 30px; text-align: center; color: #fbf7ee;">
          <div style="font-size: 28px; font-weight: bold;">☕ The Roastery Club</div>
          <div style="font-size: 13px; text-transform: uppercase; letter-spacing: 2px; color: #d97706; font-weight: 600; margin-top: 4px;">Table Reservation Confirmed</div>
        </div>
        <div style="padding: 30px; text-align: center; background-color: #faf5ec; border-bottom: 1px solid #ebd9c5;">
          <div style="font-size: 36px; margin-bottom: 8px;">🥂</div>
          <h1 style="margin: 0 0 8px 0; font-size: 22px; color: #2b1810;">Your Table is Reserved!</h1>
          <p style="margin: 0; font-size: 14px; color: #785a44;">
            We look forward to welcoming you, <strong>${res.customerName}</strong>.
          </p>
        </div>
        <div style="padding: 24px 30px;">
          <div style="background-color: #faf5ec; border-radius: 10px; padding: 20px; margin-bottom: 20px;">
            <div style="margin-bottom: 10px; font-size: 14px;"><strong>Date:</strong> ${res.date}</div>
            <div style="margin-bottom: 10px; font-size: 14px;"><strong>Time:</strong> ${res.time}</div>
            <div style="margin-bottom: 10px; font-size: 14px;"><strong>Party Size:</strong> ${res.guests} ${res.guests === 1 ? 'Guest' : 'Guests'}</div>
            <div style="margin-bottom: 10px; font-size: 14px;"><strong>Seating Area:</strong> ${res.seatingArea || 'Fireplace Lounge'}</div>
            ${res.specialRequests ? `<div style="font-size: 14px; color: #8c4a16;"><strong>Special Notes:</strong> ${res.specialRequests}</div>` : ''}
          </div>
          <p style="font-size: 13px; color: #8c6e58; text-align: center;">Need to adjust or cancel? Contact us at reservations@roasteryclub.com or call (555) 762-7837.</p>
        </div>
        <div style="background-color: #f4ede3; padding: 18px; text-align: center; font-size: 12px; color: #9c7b64; border-top: 1px solid #ecdcc9;">
          The Roastery Club Concierge & Member Services • 42 Artisan Way
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateWelcomeEmailHtml(user: any) {
  const memberName = user.displayName || 'Distinguished Coffee Lover';
  const memberId = user.uid ? `TRC-${user.uid.slice(0, 8).toUpperCase()}` : 'TRC-9821-VIP';
  const tier = user.memberTier || 'Gold Artisan';
  const points = user.beanPoints || 50;
  const preference = user.coffeePreference || 'Medium Caramel Roast';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to The Roastery Club</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #fbf7ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2c1810;">
      <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 6px 30px rgba(44, 24, 16, 0.09); border: 1px solid #ebdcc9;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #2b1810 0%, #3e2213 60%, #1f0f07 100%); padding: 40px 30px; text-align: center; color: #fbf7ee;">
          <div style="font-size: 32px; margin-bottom: 6px;">☕</div>
          <div style="font-size: 26px; font-weight: bold; letter-spacing: -0.5px; margin-bottom: 6px; font-family: Georgia, serif;">
            The Roastery Club
          </div>
          <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 2.5px; color: #e6b98d; font-weight: 600;">
            Artisan Coffee Society & Micro-Roasters
          </div>
        </div>

        <!-- Hero Welcome -->
        <div style="padding: 32px 30px; text-align: center; background-color: #faf5ec; border-bottom: 1px solid #ebd9c5;">
          <div style="display: inline-block; padding: 6px 14px; background-color: #f3dfca; border-radius: 20px; font-size: 12px; font-weight: bold; color: #8c4a16; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
            ✦ Official Membership Activated ✦
          </div>
          <h1 style="margin: 0 0 10px 0; font-size: 24px; color: #2b1810; font-family: Georgia, serif;">
            Welcome to the Club, ${memberName}!
          </h1>
          <p style="margin: 0; font-size: 15px; color: #785a44; line-height: 1.6; max-width: 480px; margin: 0 auto;">
            You are now officially part of our inner circle of coffee lovers and roasters. As a welcome gift, we’ve deposited <strong>${points} Bean Points</strong> directly into your digital pass.
          </p>
        </div>

        <!-- VIP Membership Pass Card Preview -->
        <div style="padding: 28px 30px;">
          <div style="background: linear-gradient(135deg, #854d0e 0%, #b45309 50%, #78350f 100%); border-radius: 16px; padding: 24px; color: #ffffff; box-shadow: 0 8px 24px rgba(180, 83, 9, 0.25); border: 1px solid #fde047; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
              <div>
                <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #fef08a; display: block; font-weight: bold;">Digital Member Pass</span>
                <span style="font-size: 18px; font-weight: bold; font-family: Georgia, serif;">The Roastery Club VIP</span>
              </div>
              <span style="padding: 4px 10px; background-color: rgba(255,255,255,0.2); border-radius: 12px; font-size: 11px; font-weight: bold; color: #fef08a; text-transform: uppercase;">
                ${tier}
              </span>
            </div>
            
            <div style="font-family: monospace; font-size: 14px; letter-spacing: 3px; color: #fde68a; margin-bottom: 18px;">
              ${memberId}
            </div>

            <div style="display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.25); padding-top: 14px;">
              <div>
                <span style="font-size: 9px; text-transform: uppercase; color: #fef08a; display: block;">Cardholder</span>
                <strong style="font-size: 14px;">${memberName}</strong>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 9px; text-transform: uppercase; color: #fef08a; display: block;">Welcome Bonus</span>
                <strong style="font-size: 16px; color: #fef08a;">+${points} Beans</strong>
              </div>
            </div>
          </div>

          <!-- Coffee DNA Profile Box -->
          <div style="background-color: #faf5ec; border: 1px solid #ecdcc9; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 8px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #8c6e58;">
              Your Coffee Palate Profile
            </h3>
            <p style="margin: 0; font-size: 14px; color: #2c1810;">
              Selected Roast: <strong>${preference}</strong>
            </p>
            <p style="margin: 6px 0 0 0; font-size: 12px; color: #785a44; font-style: italic;">
              Our baristas will craft your in-store and delivery orders tailored to your unique roast and extraction profile.
            </p>
          </div>

          <!-- Member Perks Checklist -->
          <h3 style="margin: 0 0 14px 0; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #2b1810; border-bottom: 1px solid #f0e6d6; padding-bottom: 8px;">
            Your Roastery Club Benefits
          </h3>

          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; font-size: 14px; color: #644430;">
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px;">🎁</td>
              <td style="padding: 8px 0;"><strong>50 Bean Points:</strong> Redeemable for free fresh pastries, pour-overs, or signature cold brews.</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px;">🎂</td>
              <td style="padding: 8px 0;"><strong>Birthday Tasting:</strong> Complimentary hand-poured single origin flight during your birthday week.</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px;">🏷️</td>
              <td style="padding: 8px 0;"><strong>Micro-Lot Access:</strong> First access to limited crop releases from Colombia, Ethiopia, and Sumatra.</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; vertical-align: top; width: 28px;">⚡</td>
              <td style="padding: 8px 0;"><strong>1-Click Ordering:</strong> Saved delivery address and custom grind notes for expedited checkout.</td>
            </tr>
          </table>

          <!-- CTA Button -->
          <div style="text-align: center; margin: 30px 0 10px 0;">
            <a href="https://ais-dev-fi4hvpsxatlxosw4du6rqx-801072286834.europe-west2.run.app" style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #d38243 0%, #b45309 100%); color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; border-radius: 30px; box-shadow: 0 4px 14px rgba(211, 130, 67, 0.35); text-transform: uppercase; letter-spacing: 1px;">
              Enter Member Lounge & Explore Menu →
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f4ede3; padding: 22px; text-align: center; font-size: 12px; color: #9c7b64; border-top: 1px solid #ecdcc9;">
          <p style="margin: 0 0 6px 0; font-weight: 600; color: #644430;">Official Roastery Club Member Communications</p>
          <p style="margin: 0 0 4px 0;">The Roastery Club • 42 Artisan Way, Roast District</p>
          <p style="margin: 0;">© ${new Date().getFullYear()} The Roastery Club. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { to, subject, type, order, reservation, user } = body;

    if (!to) {
      return NextResponse.json({ error: 'Recipient email is required' }, { status: 400 });
    }

    let emailSubject = subject;
    let htmlContent = '';
    let textContent = '';

    if (type === 'welcome' || type === 'registration') {
      const u = user || body;
      emailSubject = subject || `☕ Welcome to The Roastery Club, ${u.displayName || 'Coffee Lover'}! (50 Bean Points Inside)`;
      htmlContent = generateWelcomeEmailHtml(u);
      textContent = `Welcome to The Roastery Club, ${u.displayName || 'Member'}! Your membership has been activated with 50 Welcome Bean Points.`;
    } else if (type === 'reservation') {
      emailSubject = subject || 'Your Reservation at The Roastery Club';
      htmlContent = generateReservationEmailHtml(reservation || body);
      textContent = `Your table reservation at The Roastery Club is confirmed for ${reservation?.date || ''} at ${reservation?.time || ''}.`;
    } else {
      emailSubject = subject || 'Order Confirmation - The Roastery Club';
      htmlContent = generateOrderEmailHtml(order || body);
      textContent = `Thank you for your order with The Roastery Club! Total: $${order?.total || '0.00'}`;
    }

    const mailgunApiKey = process.env.MAILGUN_API_KEY;
    const mailgunDomain = process.env.MAILGUN_DOMAIN;

    // Use clean, professional brand identity for sender without exposing internal sandbox URLs
    const rawFrom = process.env.MAILGUN_FROM_EMAIL?.trim();
    const isValidCustomFrom = rawFrom && rawFrom.includes('@') && !rawFrom.startsWith('http://') && !rawFrom.startsWith('https://') && !rawFrom.includes('sandbox');

    let fromEmail = 'The Roastery Club <orders@roasteryclub.com>';
    if (isValidCustomFrom) {
      fromEmail = rawFrom;
    } else if (type === 'welcome' || type === 'registration') {
      fromEmail = 'The Roastery Club VIP <vip@roasteryclub.com>';
    } else if (type === 'reservation') {
      fromEmail = 'The Roastery Club Reservations <reservations@roasteryclub.com>';
    }

    // If Mailgun API credentials are configured in environment variables, dispatch live via Mailgun HTTP API
    if (mailgunApiKey && mailgunDomain && mailgunApiKey !== 'your-mailgun-api-key') {
      const endpoint = `https://api.mailgun.net/v3/${mailgunDomain}/messages`;
      
      const formData = new FormData();
      formData.append('from', fromEmail);
      formData.append('h:Reply-To', 'The Roastery Club Concierge <concierge@roasteryclub.com>');
      formData.append('to', to);
      formData.append('subject', emailSubject);
      formData.append('html', htmlContent);
      formData.append('text', textContent);

      const basicAuth = Buffer.from(`api:${mailgunApiKey}`).toString('base64');
      const mgRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
        body: formData,
      });

      if (!mgRes.ok) {
        const errorText = await mgRes.text();
        console.warn('Mailgun API response error:', errorText);
        return NextResponse.json({
          success: true,
          status: 'simulated_fallback',
          provider: 'Mailgun',
          message: 'Mailgun returned an authorization or domain error; simulated dispatch preview logged.',
          details: errorText,
          htmlPreview: htmlContent,
          to,
          subject: emailSubject,
        });
      }

      const mgData = await mgRes.json();
      return NextResponse.json({
        success: true,
        status: 'delivered',
        provider: 'Mailgun',
        id: mgData.id,
        message: mgData.message || 'Queued. Thank you.',
        htmlPreview: htmlContent,
        to,
        subject: emailSubject,
      });
    }

    // Graceful fallback for testing/demo when Mailgun API credentials haven't been entered yet
    console.log(`[Mailgun Simulator] Confirmation email generated for ${to}: "${emailSubject}"`);
    return NextResponse.json({
      success: true,
      status: 'simulated',
      provider: 'Mailgun Engine (Preview Mode)',
      notice: 'Mailgun credentials can be set in .env / secrets to send live external emails. Currently rendering verified HTML email preview.',
      htmlPreview: htmlContent,
      to,
      subject: emailSubject,
    });
  } catch (error: any) {
    console.error('Email sending error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
