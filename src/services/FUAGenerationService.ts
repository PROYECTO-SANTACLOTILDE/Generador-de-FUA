import {z} from "zod";

import { isValidUUIDv4 } from "../utils/utils";

// Schemas
const newFUAFromVisitSchema = z.object({
    // FUA Data, checksum not needed
    payload: z.string(), 
    schemaType: z.string(),    
    // Audit Data
    createdBy: z.string(),
});


class FUAGenerationService {

    // Generation of FUA previzualitation
    // Receives a payload and a FUA Format, then fills the html format return a html string
    async generationPrev(data: {
        visitPayload: any,
        auxFUAFormat: any
    }): Promise<string> {
        
        // Fills the fields using codename

        // Fills visit information
        
        
        return '';
    };

    
};

export default new FUAGenerationService();
