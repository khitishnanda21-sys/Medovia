export function getRelevantSymptoms(complaintText) {
  const text = complaintText.toLowerCase();

  if (text.includes('chest pain') || text.includes('heart') || text.includes('palpitation')) {
    return ['Shortness of breath', 'Sweating', 'Nausea', 'Pain radiating to arm/jaw', 'Dizziness'];
  }
  if (text.includes('headache') || text.includes('migraine')) {
    return ['Vision changes', 'Sensitivity to light', 'Nausea/vomiting', 'Neck stiffness', 'Numbness/weakness'];
  }
  if (text.includes('stomach') || text.includes('abdominal') || text.includes('belly')) {
    return ['Vomiting', 'Fever', 'Blood in stool', 'Loss of appetite', 'Bloating'];
  }
  if (text.includes('fever') || text.includes('cold') || text.includes('cough')) {
    return ['Sore throat', 'Body ache', 'Chills', 'Difficulty breathing', 'Loss of taste/smell'];
  }
  return ['Fatigue', 'Fever', 'Loss of appetite', 'Sleep disturbance'];
}

// Rules-based red-flag detection — this is a keyword safety net, not a diagnosis.
export function checkRedFlags(complaint, symptoms) {
  const text = complaint.toLowerCase();
  const flags = [];

  const emergencyPhrases = ["can't breathe", 'cannot breathe', 'unconscious', 'severe bleeding', 'suicidal', 'crushing pain', 'stroke'];
  if (emergencyPhrases.some((p) => text.includes(p))) {
    flags.push('Potentially urgent symptoms were mentioned in your description.');
  }
  if (text.includes('chest pain') && (symptoms.includes('Shortness of breath') || symptoms.includes('Sweating') || symptoms.includes('Pain radiating to arm/jaw'))) {
    flags.push('Chest pain combined with breathlessness, sweating, or radiating pain warrants urgent evaluation.');
  }
  if (text.includes('headache') && symptoms.includes('Neck stiffness')) {
    flags.push('Headache with neck stiffness warrants urgent evaluation.');
  }

  return flags;
}