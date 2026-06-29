# Google Business Profile Setup Checklist

Use this after the live domain is ready.

## Profile

- Business name: SKY SFX
- Primary category: Event management company
- Secondary categories: Wedding service, Entertainment agency, Event planner
- Website: `https://yourdomain.com`
- Appointment/contact page: `https://yourdomain.com/contact`
- Reviews page: `https://yourdomain.com/reviews`

## Services to Add

- SFX Fire Show
- Cold Pyro Entry
- Wedding Entry Planning
- Bride Entry
- Groom Entry
- Couple Entry
- Sangeet Choreography
- Corporate Event SFX
- Event Planning

## Photos and Videos

Upload real photos/videos from:

- Fire show events
- Cold pyro entries
- Bride/groom/couple entries
- Sangeet choreography
- Corporate stage effects
- Team setup and safety preparation

## Environment Variables

Add these after Google Business Profile is live:

```env
NEXT_PUBLIC_BUSINESS_PHONE=+91 99999 99999
NEXT_PUBLIC_BUSINESS_PHONE_E164=+919999999999
NEXT_PUBLIC_WHATSAPP_NUMBER=919999999999
NEXT_PUBLIC_BUSINESS_EMAIL=bookings@skysfx.in
NEXT_PUBLIC_BUSINESS_CITY=Jaipur
NEXT_PUBLIC_BUSINESS_REGION=Rajasthan
NEXT_PUBLIC_GOOGLE_PROFILE_URL=https://g.page/r/your-profile-id
NEXT_PUBLIC_GOOGLE_REVIEW_URL=https://g.page/r/your-profile-id/review
GOOGLE_REVIEW_URL=https://g.page/r/your-profile-id/review
```

## After Setup

- Submit `/sitemap.xml` in Google Search Console.
- Add weekly Google Business Profile posts with service photos.
- Ask every booked client for a Google review using `/reviews`.
- Keep phone, address/service area, website, and services consistent everywhere.
