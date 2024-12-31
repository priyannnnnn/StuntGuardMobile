import axios from 'axios';
import {Platform} from 'react-native';

export type OpenMapArgs = {
  lat: string | number;
  lng: string | number;
  label: string;
};

/**
 * Generates a platform-specific map URL scheme based on the provided latitude, longitude, and label.
 *
 * @param {OpenMapArgs} args - An object containing the latitude, longitude, and label for the location.
 * @param {string | number} args.lat - The latitude of the location.
 * @param {string | number} args.lng - The longitude of the location.
 * @param {string} args.label - A label for the location, used in the query.
 * @returns {string | undefined} The URL scheme for opening the map application with the specified location, or undefined if the platform is not supported.
 */
export const openMap = ({lat, lng, label}: OpenMapArgs) => {
  const scheme = Platform.select({
    ios: `maps://?q=${label}&ll=${lat},${lng}`,
    android: `geo:${lat},${lng}?q=${lat},${lng}(${label})`,
  });

  return scheme;
};

const context = `
    Hospital Inquiry Content
      Hospital Inquiry:
        Hospital Name: XYZ Multispecialty Hospital
        Address: 5th Floor, 501, Binori Bsquare2, Ambli - Bopal Rd, nr. Double Tree By Hilton, Vikram Nagar, Ahmedabad, Gujarat 380058
        Contact Number (Reception): +123-456-7890
        Location Map Link: ${openMap({
          lat: 23.02839,
          lng: 72.4968785,
          label: 'XYZ Multispecialty Hospital',
        })}
      Hospital Timings
        Weekdays: 8:00 AM – 8:00 PM
        Weekends: 9:00 AM – 5:00 PM
        Emergency Services: Available 24/7
        Uncertain Hours: If specific timing is not listed, contact the reception at +123-456-7890 for clarification.
      Doctor Details
        1. Dr. Alice Johnson
          Specialization: Surgeon (MD)
          Availability:
          Monday to Friday: 10:00 AM – 2:00 PM
          Saturday: 12:00 PM – 3:00 PM
          Emergency Contact: +123-987-6543
          "If no suitable timing is available, please contact the reception desk at +123-456-7890 for alternative options."
        2. Dr. Bob Smith
          Specialization: BHMS
          Availability:
          Monday to Thursday: 2:00 PM – 5:00 PM
          Friday: 9:00 AM – 12:00 PM
          Emergency Contact: +123-654-3210
          "For specific concerns or if timings are unclear, reach out to the doctor's office directly."
        3. Dr. Carol Lee
          Specialization: Pediatrician
          Availability:
          Monday, Wednesday, Friday: 10:00 AM – 1:00 PM
          Emergency Contact: +123-321-9870
      How to Book an Appointment
        1. Online:
          Visit "hospitalwebsite.com/appointments".
          Select your doctor and preferred time slot.
          Provide your contact details and confirm.
      "If you face any issues, contact the reception desk at +123-456-7890."
        2. Phone Booking:
          Call the reception desk at +123-456-7890 and provide your details.
      How to Cancel an Appointment
        1. Online:
          Go to "hospitalwebsite.com/cancel".
          Enter your booking ID and phone number.
        2. Phone Cancellation:
          Contact the reception desk at +123-456-7890.
      "If you do not have your booking ID or face technical difficulties, call the reception desk for further assistance."
      List of Services Provided by XYZ Multispecialty Hospital:
        1. General Consultation: 
          Our experienced doctors provide general consultations for various health concerns, including routine check-ups, advice, and diagnosis.
        2. Surgical Services: 
          We offer a wide range of surgical services, from minor procedures to major surgeries, with state-of-the-art equipment and expert surgeons.
        3. Emergency Care: 
          Available 24/7, our emergency care unit is equipped to handle all types of medical emergencies with quick and efficient treatment.
        4. Pediatrics: 
          Our pediatricians offer care for children, including immunizations, routine check-ups, and treatment for childhood diseases.
        5. Radiology & Imaging: 
          Advanced diagnostic imaging services, including X-rays, MRIs, CT scans, and ultrasounds.
        6. Physiotherapy: 
            Rehabilitation services for recovery from surgery, injury, and chronic conditions, with expert physiotherapists.
      Missing or Unclear Information
        If you cannot find the required details or have additional questions:
          Contact the reception desk: +123-456-7890
          Email inquiries: support@xyzmultispecialty.com
      "We are here to assist you with all your queries. If the required information is unavailable in the above sections, please reach out to the provided contact numbers or email for further assistance."
`;

const GEMINI_AI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyDdblvpMbQpvuuTZXpmLtF9dCzAYIAYc7U'; // Replace with your GEMINI_API_KEY.

const predefinedInstruction = `
    You are a helpful assistant. 
    Answer questions based on the following context and make sure you modify the answer grammarly make it easier to understand and reply in very polite way with a friendly tone for example Yes, Sure! Here is the details of the answer or Yah! Sure, You can find the details of the answer. 
    Also, please provide in proper formatted and manage spaces of text if require next line then put \n. do not take from the context and respond only the text related to answer no additional text like "based on the provided text or while the text doesn't elaborate more etc." etc. this type of text, response only the text related to answer. 
    if the question is not related to the context, please respond with "I'm sorry, I don't have an answer to that question." but also give answer related to greetings and goodbyes. Following context:
  `;

export const askQuestionToGemini = async (
  question: string,
): Promise<string> => {
  try {
    const response = await axios.post(
      `${GEMINI_AI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        system_instruction: {
          parts: {
            text: predefinedInstruction + context,
          },
        },
        contents: {
          parts: {
            text: question,
          },
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return removeTrailingNewline(
      response?.data?.candidates[0]?.content?.parts[0]?.text,
    );
  } catch (error: any) {
    console.log(error, 'error');
    throw new Error('Unable to get a response from OpenAI.');
  }
};

export function removeTrailingNewline(str: string): string {
  return str.endsWith('\n') ? str.slice(0, -1) : str;
}