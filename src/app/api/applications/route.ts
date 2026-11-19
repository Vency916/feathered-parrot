import { NextResponse } from "next/server";
import { getApplications, submitApplication } from "@/lib/dataStore";

export async function GET() {
  const applications = await getApplications();
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.applicantName || !body.email || !body.phone) {
      return NextResponse.json(
        { error: "Applicant name, email, and phone number are required" },
        { status: 400 }
      );
    }

    const application = await submitApplication({
      applicantName: body.applicantName,
      email: body.email,
      phone: body.phone,
      parrotId: body.parrotId,
      parrotName: body.parrotName,
      address: body.address,
      experienceLevel: body.experienceLevel || "Beginner",
      housingType: body.housingType || "House",
      hasOtherPets: Boolean(body.hasOtherPets),
      petDetails: body.petDetails,
      notes: body.notes,
      submittedFormFileName: body.submittedFormFileName || "Completed_Application.pdf",
      submittedFormDataUrl: body.submittedFormDataUrl,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your adoption application and completed form have been received!",
        application,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Failed to submit adoption application" }, { status: 500 });
  }
}
