import jsPDF from "jspdf";

export function generateAdoptionFormPDF(): void {
  // Check if official PDF is present in public/
  try {
    const link = document.createElement("a");
    link.href = "/adoption-form.pdf";
    link.download = "AuraParrot_Adoption_Application_Form.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  } catch (err) {
    console.warn("Direct file download fell back to dynamic PDF generation", err);
  }

  // Dynamic jsPDF generation fallback
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 16;

  // Header Banner
  doc.setFillColor(27, 67, 50); // Forest Green #1B4332
  doc.rect(0, 0, pageWidth, 28, "F");

  doc.setTextColor(253, 251, 247); // Cream #FDFBF7
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("AURAPARROT ADOPTION & RESCUE SANCTUARY", 14, 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Dedicated to the lifelong protection, rehabilitation & ethical adoption of companion parrots", 14, 18);
  doc.text("Website: auraparrot.org  |  Email: adoptions@auraparrot.org", 14, 23);

  y = 36;

  // Title
  doc.setTextColor(27, 67, 50);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("OFFICIAL PARROT ADOPTION APPLICATION FORM", 14, y);

  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(80, 80, 80);
  doc.text(
    "Instructions: Please fill out all sections legibly. Once completed, scan or photograph this form and submit it through our website.",
    14,
    y
  );

  y += 7;

  // Helper function to draw section header
  const drawSection = (title: string) => {
    doc.setFillColor(238, 247, 241); // Light forest tint
    doc.rect(14, y, pageWidth - 28, 6.5, "F");
    doc.setTextColor(27, 67, 50);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text(title, 17, y + 4.5);
    y += 9;
  };

  // Helper for field rows
  const drawFieldLine = (label: string, valueLine: string = "__________________________________________________") => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(40, 40, 40);
    doc.text(label, 14, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(140, 140, 140);
    doc.text(valueLine, 55, y);
    y += 6.5;
  };

  // 1. Applicant Details
  drawSection("1. APPLICANT INFORMATION");
  drawFieldLine("Full Legal Name:", "____________________________________________________________________");
  drawFieldLine("Current Address:", "____________________________________________________________________");
  drawFieldLine("City / State / Zip:", "_____________________________________  Phone: _________________________");
  drawFieldLine("Email Address:", "_____________________________________  Age: ___________________________");
  drawFieldLine("Parrot of Interest:", "_____________________________________  (or species preference)");

  y += 2;

  // 2. Living Environment
  drawSection("2. LIVING ENVIRONMENT & HOUSEHOLD");
  drawFieldLine("Residence Type:", "[  ] Single Family House   [  ] Apartment   [  ] Condo   [  ] Other");
  drawFieldLine("Ownership Status:", "[  ] Own   [  ] Rent (Landlord allows companion birds? Yes / No)");
  drawFieldLine("Household Members:", "Adults: ________  Children (ages): ____________________________________");
  drawFieldLine("Current Pets:", "Species & counts (Dogs, Cats, Ferrets, other birds): ______________________");
  drawFieldLine("Smoking / Vaping:", "[  ] No smoker in home   [  ] Smoker (Parrots have delicate respiratory systems)");

  y += 2;

  // 3. Avian Knowledge & Experience
  drawSection("3. AVIAN EXPERIENCE & VETERINARY CARE");
  drawFieldLine("Parrot Experience:", "[  ] First time   [  ] 1-5 Years   [  ] 5+ Years experienced aviculturist");
  drawFieldLine("Species Kept Prior:", "____________________________________________________________________");
  drawFieldLine("Primary Avian Vet:", "Clinic Name / Vet: ___________________________  Phone: __________________");
  drawFieldLine("Emergency Budget:", "Are you prepared for $1,000+ specialized avian emergency care? [  ] Yes  [  ] No");

  y += 2;

  // 4. Daily Care & Housing Plan
  drawSection("4. HOUSING & CARE COMMITMENT");
  drawFieldLine("Cage Dimensions:", "Intended Cage / Aviary Size (W x D x H): _________________________________");
  drawFieldLine("Out-of-Cage Time:", "Estimated daily interactive hours with family: ______________________________");
  drawFieldLine("Diet Plan:", "[  ] Pelleted Diet (Harrison's, Roudybush, etc.) + Fresh Vegetables/Sprouts");
  drawFieldLine("Hazard Awareness:", "[  ] I understand Teflon/PTFE non-stick pans, scented candles & aerosols are lethal to parrots.");

  y += 2;

  // 5. Terms & Signature
  drawSection("5. ADOPTION AGREEMENT & SIGNATURE");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(60, 60, 60);
  const terms =
    "By signing below, I certify that all information provided is accurate. I understand that parrots require multi-decade commitments, mental stimulation, and specialized nutrition. If for any reason I can no longer care for the adopted bird, I agree to contact AuraParrot Sanctuary for return assistance and never surrender the bird to a general shelter or pet store.";
  const splitTerms = doc.splitTextToSize(terms, pageWidth - 28);
  doc.text(splitTerms, 14, y);
  y += splitTerms.length * 3.5 + 4;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(20, 20, 20);
  doc.text("Applicant Signature: _____________________________________   Date: ________________________", 14, y);

  // Footer
  doc.setFillColor(247, 243, 232); // Cream 100
  doc.rect(0, 282, pageWidth, 15, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(27, 67, 50);
  doc.text("AuraParrot Rescue Sanctuary  |  Non-profit Avian Rehabilitation  |  Form Rev 2026", 14, 289);
  doc.text("Submit this completed form at: /#submit-form", pageWidth - 78, 289);

  // Trigger download
  doc.save("AuraParrot_Adoption_Application_Form.pdf");
}
