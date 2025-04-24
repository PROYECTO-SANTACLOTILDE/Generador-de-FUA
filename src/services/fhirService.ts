// src/fhirService.ts
import Client from 'fhir-kit-client';


const client = new Client({
    baseUrl: 'http://hii1sc-dev.inf.pucp.edu.pe/openmrs/ws/fhir2/R4',
    customHeaders: {
      Authorization: 'Basic ' + Buffer.from('admin:Admin123').toString('base64'),
    },
  });

const isPatient = (resource: fhir4.Resource): resource is fhir4.Patient => {
  return resource.resourceType === 'Patient';
}

export const getPatient = async (patientId: string) => {
  try {
    const res = await client.read({ resourceType: 'Patient', id: patientId });
    
    if (isPatient(res)) {
      console.dir(res.name, { depth: 4 });
      return res;
    }
  } catch (error) {
    console.error('Error fetching patient:', error);
  }
}
