export const doctors = [
  { id: 1, name: 'Dr. Riya Mehta', dept: 'Oncology', rating: 4.8, fee: 500, timing: '10:00 AM - 2:00 PM', mode: 'Online & Offline', avgConsultMinutes: 15, patientsAhead: 2, address: '12 MG Road, Bhubaneswar' },
  { id: 2, name: 'Dr. Aman Verma', dept: 'Cardiology', rating: 4.6, fee: 700, timing: '11:00 AM - 4:00 PM', mode: 'Online', avgConsultMinutes: 20, patientsAhead: 3, address: '45 Park Street, Bhubaneswar' },
  { id: 3, name: 'Dr. Sara Khan', dept: 'Oncology', rating: 4.9, fee: 600, timing: '9:00 AM - 1:00 PM', mode: 'Offline', avgConsultMinutes: 10, patientsAhead: 1, address: '9 Lake View, Bhubaneswar' },
  { id: 4, name: 'Dr. Vikram Rao', dept: 'Pediatrics', rating: 4.5, fee: 400, timing: '2:00 PM - 6:00 PM', mode: 'Online & Offline', avgConsultMinutes: 12, patientsAhead: 4, address: '3 Civil Lines, Bhubaneswar' },
  { id: 5, name: 'Dr. Neha Iyer', dept: 'Neurology', rating: 4.7, fee: 800, timing: '10:00 AM - 3:00 PM', mode: 'Offline', avgConsultMinutes: 25, patientsAhead: 2, address: '78 Ring Road, Bhubaneswar' },
  { id: 6, name: 'Dr. Karan Singh', dept: 'Cardiology', rating: 4.4, fee: 650, timing: '1:00 PM - 5:00 PM', mode: 'Online', avgConsultMinutes: 18, patientsAhead: 1, address: '21 Nehru Nagar, Bhubaneswar' },
];

export function getWaitMinutes(doctor) {
  return doctor.avgConsultMinutes * doctor.patientsAhead;
}