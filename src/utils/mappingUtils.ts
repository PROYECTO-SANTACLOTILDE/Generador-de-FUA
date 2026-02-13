import { map } from "zod";

/**
 * Function to get value using path
 * 
 */
function getValueByPath(obj : any, path: string) {
  return path.split('.').reduce((current, key) => 
    current && current[key] !== undefined ? current[key] : null, obj);
}

/**
 * Import a visit payload, get the target and save it into the same oject in the field value
 * 
 */
export function importPayloadToMapping(payload: string, mapping: any): void {
    const parsedPayload = JSON.parse(payload);
    
    // Iterate Pages
    mapping.pages.forEach( (page: any) => {
        // Iterate Section
        page.sections.forEach( (section: any) => {
            // Iterates Fields
            section.fields.forEach( (field: any) => {
                processFieldMappings(field, parsedPayload);               
            });
            
        });
    
    });
    
}

export function processFieldMappings(field: any, parsedPayload: any) : void {
    // Check if its a Field Type
    if(field.fieldType === "Field"){
        field.fields.forEach( (auxField: any) => {
            processFieldMappings(auxField, parsedPayload);
        } );
        
    }else{
        // Iterate mappings
        field.mappings.forEach( (mapping: any) => {
            // Check if target is needed
            if(mapping.target === null){
                mapping.valueToPut = mapping.value ?? '';
                return;
            }
            // Use targets and find value
            const aimTarget = getValueByPath(parsedPayload,mapping.target);
            if(aimTarget !== undefined){                 
                if(mapping.extraProcessing !== undefined){
                    mapping.valueToPut = mapping.extraProcessing(aimTarget);
                }else{
                    mapping.valueToPut = aimTarget;
                } 

            }else mapping.valueToPut = null;
        });
    }
    
    
};