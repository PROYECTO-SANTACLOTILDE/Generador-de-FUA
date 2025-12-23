export default {
    pages: [
        {
            pageNumber: 1,
            // Sections Mapping
            sections: [
                {
                    codeName: "IPRESS Data",
                    // Fields Mapping
                    fields: [                
                        {
                            // Visit Date
                            codeName: "Visit Date",
                            fieldType: "Table",
                            mappings: [
                                {
                                    // DIA
                                    target: "payload.startDatetime",
                                    column: 1,
                                    row: 2,
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => ( value?.substring(8, 10) || '' )                             
                                },
                                {
                                    // MES
                                    target: "payload.startDatetime",
                                    column: 2,
                                    row: 2,
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => ( value?.substring(5, 7) || '' )                             
                                },
                                {
                                    target: "payload.startDatetime",
                                    // AÑO
                                    column: 3,
                                    row: 2,
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => ( value?.substring(0, 4) || '' )                             
                                },
                            ]
                        },
                        {
                            // Visit Time
                            codeName: "Visit Time",
                            fieldType: "Box",
                            mappings: [
                                {
                                    // Hora
                                    target: "payload.startDatetime",
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => (value?.substring(11, 16) || '')
                                }
                            ]
                        },
                        {
                            // IPRESS Info
                            codeName: "IPRESS provider",
                            fieldType: "Table",
                            mappings: [
                                {
                                    // RENAES CODE
                                    target: null,
                                    column: 1,
                                    row: 2,
                                    valueType: "String",
                                    value: "00000066"       
                                },
                                {
                                    // MES
                                    target: null,
                                    column: 2,
                                    row: 2,
                                    valueType: "String",
                                    value: "HOSPITAL II-1 SANTA CLOTILDE",
                                    extraProcessing: (value) => ( value?.substring(5, 7) || '' )                             
                                }
                            ]
                        },
                        {
                            // Provider Type
                            codeName: "Provider Type",
                            fieldType: "Field",
                            fields: [
                                {
                                    // Provider Type
                                    codeName: "Provider Type",
                                    fieldType: "Table",
                                    mappings: [
                                        {
                                            target: null,
                                            column: 2,
                                            row: 1,
                                            valueType: "String",
                                            value: "X"
                                        }
                                    ]             
                                },
                                {
                                    // CODIGO DE LA OFERTA FLEXIBLE
                                    codeName: "Oferta Flexible Code",
                                    fieldType: "Box",
                                    mappings: [
                                        {
                                            target: null,
                                            valueType: "String",
                                            value: "###"
                                        }
                                    ]             
                                }
                            ]
                        },
                        {
                            // TODO: cambiar con la locacion dinamica de location type
                            // Visit Location Type
                            codeName: "Visit Location Type",
                            fieldType: "Table",
                            mappings: [
                                {
                                    // INTRAMURAL
                                    target: null,
                                    valueType: "String",
                                    value: ["startDatetime"],
                                    extraProcessing: (value) => (value?.substring(11, 16) || '')
                                },
                                {

                                }
                            ]
                        }                        
                    ]
                }
            ]
        }
    ]
};

